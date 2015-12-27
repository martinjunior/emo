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
     * @param {Object} files files to scrape
     * @param {Object} options
     */
    var StyleGuide = function(grunt, files, options) {
        this.grunt = grunt;

        this.files = files;

        this.options = merge(OPTIONS, options);

        this.components = new Scraper(this.files).get().map(function(component) {
            var file = component.name.toLowerCase().replace(/[ \/]/g, '-').trim();

            component.file = file + '.html';

            return component;
        });

        this.init();
    };

    var proto = StyleGuide.prototype;

    var OPTIONS = {
        path: {
            _src: __dirname + '/../../styleguide/',
            src: '_styleguide/',
            dest: 'docs/styleguide/'
        }
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
            filepath = this.options.path.src + file.replace(regex.styleguide_src_path, '');

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
        // copy over styleguide.css
        this.grunt.file.write(
            this.options.path.dest + 'assets/css/styleguide.css',
            this.grunt.file.read(
                this.options.path.src + 'assets/css/styleguide.css'
            )
        );

        if (!this.options.copy) {
            return;
        }

        var keys = Object.keys(this.options.copy);

        // copy assets specified in options.copy
        keys.forEach(function(key) {
            var filepath = this.options.path.dest + key;
            var content = this.grunt.file.read(this.options.copy[key]);

            this.grunt.log.writeln('Creating ' + filepath);

            this.grunt.file.write(filepath, content);
        }.bind(this));

        this.grunt.log.writeln('-----------------------------------');
    };

    proto.build = function() {
        this.buildIndex();
        this.buildComponents();
    };

    proto.buildIndex = function() {
        var data = {
            components: this.components,
            pathToRoot: ''
        };

        this.grunt.file.write(
            this.options.path.dest + 'index.html',
            swig.compileFile('index.html')(data)
        );
    };

    proto.buildComponents = function() {
        var data; // the data we're passing to Swig
        var directory; // where, within the basePath, are we putting this file?
        var basePath = this.options.path.dest;

        this.components.forEach(function(component) {
            directory = component.category.toLowerCase() + '/';

            data = {
                components: this.components,
                component: component,
                pathToRoot: '../'
            };

            this.grunt.file.write(
                basePath + directory + component.file,
                swig.compileFile('component.html')(data)
            );
        }.bind(this));

        this.grunt.log.writeln('Documented ' + this.components.length + ' component(s)');
    };

    module.exports = StyleGuide;

} ());