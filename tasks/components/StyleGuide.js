(function() {
    'use strict';

    var fs = require('fs');
    var path = require('path');
    var merge = require('../utils/merge');
    var fileExists = require('../utils/fileExists');
    var regex = require('../utils/regexs');
    var Componentizer = require('./Componentizer');
    var Viewizer = require('./Viewizer');
    var swig = require('swig');

    /**
     * Style-guide generator
     * 
     * @param {Object} grunt
     * @param {Object} files files to copy
     * @param {Object} options
     */
    var StyleGuide = function(grunt, files, options) {

        /**
         * Grunt (http://gruntjs.com/api/grunt)
         *
         * @property styleGuide.grunt
         * @type {Object}
         */
        this.grunt = grunt;

        /**
         * A list of files to copy
         * over to the styleguide dest
         *
         * @property styleGuide.filesToCopy
         * @type {Object}
         */
        this.filesToCopy = files;

        /**
         * @property styleGuide.options
         * @type {Object}
         */
        this.options = merge(StyleGuide.OPTIONS, options);

        // ensure paths end with a '/'
        this.options.path.src = path.join(this.options.path.src, '/');
        this.options.path.dest = path.join(this.options.path.dest, '/');

        /**
         * Files to scrape for component data
         *
         * @property styleGuide.componentsToScrape
         * @type {Array}
         * @default []
         */
        this.componentsToScrape = this.grunt.file.expand(this.options.scrape);

        /**
         * Files to scrape for view data
         *
         * @property styleGuide.viewsToScrape
         * @type {Array}
         * @default []
         */
        this.viewsToScrape = this.expandFileMapping(this.options.views);

        /**
         * A list of components that will
         * be used to render the style-guide
         *
         * @property styleGuide.components
         * @type {Object}
         */
        this.components = new Componentizer(
            this.componentsToScrape, this.options.delimiters
        ).get();

        /**
         * A list of views that will
         * be parsed by Swig.js
         *
         * @property styleGuide.views
         * @type {Object}
         */
        this.views = new Viewizer(
            this.viewsToScrape, this.options.delimiters
        ).get();

        this.init();
    };

    var proto = StyleGuide.prototype;

    /**
     * @property StyleGuide.OPTIONS
     * @type {Object}
     * @static
     * @final
     */
    StyleGuide.OPTIONS = {
        path: {
            _src: __dirname + '/../../styleguide/',
            src: '_styleguide/',
            dest: 'docs/styleguide/'
        },
        scrape: [],
        delimiters: ['{%', '%}'],
        views: {}
    };

    StyleGuide.getRelativePath = function(from, to) {
        return path.relative(
            from, to
        ).replace('../', '').replace(to, '');
    };

    /**
     * @method styleGuide.init
     */
    proto.init = function() {
        swig.setDefaults({
            loader: swig.loaders.fs(this.options.path.src)
        });

        if (!fileExists(this.options.path.src + 'index.html')) {
            this.place();
        }

        this.copy();
        this.build();
    };

    /**
     * Place the style-guide
     * src in its home
     * 
     * @method styleGuide.place
     */
    proto.place = function() {
        // Style-guide source files
        var files = this.grunt.file.expand(this.options.path._src + '**');

        files.forEach(function(file) {
            var filepath;
            var content;
            var extension = path.extname(file);

            if (!extension) {
                return;
            }

            content = this.grunt.file.read(file);
            filepath = this.options.path.src + file.replace(regex.styleguideSrcPath, '');

            this.grunt.file.write(filepath, content);
        }.bind(this));
    };

    /**
     * Copy specified assets
     * to their destination path
     * 
     * @method styleGuide.copy
     */
    proto.copy = function() {
        this.filesToCopy.forEach(function(file) {
            var dest = file.dest;

            file.src.forEach(function(src) {
                var isFile = this.grunt.file.isFile(src);

                if (!isFile) {
                    return;
                }

                this.grunt.file.copy(src, dest);
            }.bind(this));
        }.bind(this));
    };

    /**
     * Build the style-guide
     * 
     * @method styleGuide.build
     */
    proto.build = function() {
        this.buildIndex();
        this.buildComponents();
        this.buildViews();
    };

    /**
     * Build the style-guide's index.html
     * 
     * @method styleGuide.buildIndex
     */
    proto.buildIndex = function() {
        var data = {
            views: this.views,
            components: this.components,
            pathToRoot: ''
        };

        this.grunt.file.write(
            this.options.path.dest + 'index.html',
            swig.compileFile('index.html')(data)
        );
    };

    /**
     * Build the style-guide's
     * component pages
     * 
     * @method styleGuide.buildComponents
     */
    proto.buildComponents = function() {
        var basepath = this.options.path.dest;
        var componentCategories = Object.keys(this.components);

        componentCategories.forEach(function(componentCategory) {
            this.components[componentCategory].forEach(function(component) {
                var template = component.template || 'component.html';

                // the data we're passing to Swig
                var data = {
                    views: this.views,
                    components: this.components,
                    component: component,
                    pathToRoot: StyleGuide.getRelativePath(component.path, component._basename)
                };

                this.grunt.file.write(
                    basepath + component.path,
                    swig.compileFile('templates/' + template)(data)
                );
            }.bind(this));
        }.bind(this));

        this.grunt.log.writeln('Documented ' + this.components.length + ' component(s)');
    };

    proto.buildViews = function() {
        var viewCategories = Object.keys(this.views);

        viewCategories.forEach(function(viewCategory) {
            this.views[viewCategory].forEach(function(view) {
                var basepath = view._basepath.replace(this.options.path.src, '');

                var data = {
                    views: this.views,
                    components: this.components,
                    pathToRoot: StyleGuide.getRelativePath(view.path, view._basename)
                };

                this.grunt.file.write(
                    this.options.path.dest + view.path,
                    swig.compileFile(basepath + view._basename)(data)
                );
            }.bind(this));
        }.bind(this));
    };

    /**
     * Return Grunt file map object
     * 
     * @method styleGuide.expandFileMapping
     * @param {Object} fmo Grunt file mapping object
     * @param {Object} fmo.src
     * @param {Object} fmo.dest
     * @param {Object} [fmo.cwd]
     * @return {Array} file map
     */
    proto.expandFileMapping = function(fmo) {
        var src;
        var dest;
        var options = {
            cwd: null
        };

        if (!fmo || !fmo.src || !fmo.dest) {
            return [];
        }

        src = fmo.src;
        dest = path.join(fmo.dest, '/');
        options.cwd = path.join(this.options.path.src, fmo.cwd || '');

        return this.grunt.file.expandMapping(src, dest, options);
    };

    module.exports = StyleGuide;

} ());