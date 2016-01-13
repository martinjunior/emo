(function() {
    'use strict';

    var fs = require('fs');
    var path = require('path');
    var merge = require('../utils/merge');
    var fileExists = require('../utils/fileExists');
    var regex = require('../utils/regexs');
    var Scraper = require('./scraper');
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

        /**
         * Files to scrape for component data
         *
         * @property styleGuide.filesToScrape
         * @type {Array}
         * @default []
         */
        this.filesToScrape = this.grunt.file.expand(this.options.scrape);

        /**
         * A list of components that will
         * be used to render the style-guide
         *
         * @property styleGuide.components
         * @type {Object}
         */
        this.components = new Scraper(
            this.filesToScrape, this.options.delimiters
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
        categories: ['elements', 'molecules', 'organisms'],
        scrape: [],
        delimiters: ['{%', '%}']
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
        this.filesToCopy.filter(function(file) {
            var src = file.src[0];
            var isFile = fs.lstatSync(src).isFile();

            return isFile;
        }).forEach(function(file) {
            var src = file.src[0];
            var dest = file.dest;

            this.grunt.file.write(
                file.dest,
                this.grunt.file.read(src)
            );
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
    };

    /**
     * Build the style-guide's index.html
     * 
     * @method styleGuide.buildIndex
     */
    proto.buildIndex = function() {
        var data = {
            components: this.components,
            pathToRoot: '',
            categories: this.options.categories
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

        this.components.forEach(function(component) {
            // where, within the basepath, are we putting this file?
            var directory = component.category.toLowerCase() + '/';
            var template = component.template || 'component.html';

            // the data we're passing to Swig
            var data = {
                components: this.components,
                component: component,
                categories: this.options.categories,
                pathToRoot: '../'
            };

            this.grunt.file.write(
                basepath + directory + component.file,
                swig.compileFile(template)(data)
            );
        }.bind(this));

        this.grunt.log.writeln('Documented ' + this.components.length + ' component(s)');
    };

    module.exports = StyleGuide;

} ());