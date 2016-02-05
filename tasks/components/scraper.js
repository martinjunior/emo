(function() {
    'use strict';

    var fs = require('fs');
    var path = require('path');
    var marked = require('marked');
    var regex = require('../utils/regexs');
    var fileExists = require('../utils/fileExists');
    var merge = require('../utils/merge');
    var yaml = require('js-yaml');

    /**
     * A tool to scrape doc blocks
     * from a set of source files
     *
     * @class Scraper
     * @param {Array} files a list of files to "scrape"
     * @param {Array} delimiters open and close delimiters
     * @constructor
     */
    var Scraper = function(files, delimiters) {
        /**
         * Files to scrape for doc blocks
         * 
         * @property scraper.files
         * @type {Array}
         */
        this.files = files;

        /**
         * Open and close delimiters
         * 
         * @property scraper.delimiters
         * @type {Array}
         */
        this.delimiters = delimiters;

        /**
         * An eventual list a components
         * collected from source files
         * 
         * @property scraper.components
         * @type {Array}
         * @default []
         */
        this.components = [];

        this.init();
    };

    /**
     * @property Scraper.OPTIONS
     * @static
     * @final
     */
    Scraper.OPTIONS = {
        readFileSync: {
            encoding: 'utf8'
        }
    };

    /**
     * Convert a string into a
     * suitable filename (e.g., some-component.html)
     * 
     * @method Scraper.stringToFileName
     * @param {String} string
     * @return {String} file name
     * @static
     */
    Scraper.stringToFileName = function(string) {
        return string.toLowerCase()
                     .replace(regex.spacesAndSlashes, '-')
                     .trim();
    };

    var proto = Scraper.prototype;

    /**
     * Collect document data by
     * scraping it from source files
     * 
     * @method scraper.init
     * @return Scraper
     */
    proto.init = function() {
        var components = this.files.map(this.scrape.bind(this));

        components.forEach(function(componentList) {
            componentList.forEach(function(component) {
                if (!this.isValid(component)) {
                    return;
                }

                this.add(this.process(component));
            }.bind(this));
        }.bind(this));

        return this;
    };

    /**
     * Return components
     * 
     * @method scraper.get
     */
    proto.get = function() {
        return this.components;
    };

    /**
     * Scrape the given source file
     * for component documentation
     * 
     * @method scraper.scrape
     * @param {String} src path to soure file
     * @return {Array} a list of components
     */
    proto.scrape = function(src) {
        var basename = path.basename(src);
        var basepath = src.replace(basename, '');
        var content = fs.readFileSync(src, Scraper.OPTIONS.readFileSync);
        var pattern = regex.docs(this.delimiters[0], this.delimiters[1]);
        var content = content.match(pattern);
        var components = this.componentize(content);

        return components.map(function(component) {
            var filename = Scraper.stringToFileName(component.name);

            return merge(component, {
                _basepath: basepath,
                file: filename + '.html'
            });
        });
    };

    /**
     * Convert content into valid JSON,
     * which will respresent component models
     * 
     * @method scraper.componentize
     * @param {String} content
     * @return {Array} a list of component data
     */
    proto.componentize = function(content) {
        var data = [];

        if (!content) {
            return data;
        }

        data = content.map(function(text) {
            return yaml.safeLoad(
                text
                    .replace(regex.delimiter.open(this.delimiters[0]), '')
                    .replace(regex.delimiter.close(this.delimiters[1]), '')
            );
        }.bind(this));

        return data;
    };

    /**
     * Process the description property value
     * of the provided component as markdown
     * 
     * @method scraper.process
     * @param {Object} component
     * @return {Object} processed component
     */
    proto.process = function(component) {
        var description = component.description;
        var isFile = description.match(regex.markdownFile);
        var basepath = component._basepath;

        var description = isFile
                        ? fs.readFileSync(basepath + description, Scraper.OPTIONS.readFileSync)
                        : description;

        component.description = marked(
            description.replace(/^\uFEFF/, '')
        );

        return component;
    }

    /**
     * Add the provided component to the
     * list of components, or merge it into
     * an existing component if it already exists
     * 
     * @method scraper.add
     * @param {Object} component
     */
    proto.add = function(component) {
        if (this.exists(component)) {
            this.merge(component);

            return;
        }

        this.components.push(component);
    };

    /**
     * Merge the provided component into a
     * component in the component list whos name
     * matches that of the provided component
     * 
     * @method scraper.merge
     * @param {Object} component
     */
    proto.merge = function(component) {
        var name = component.name;

        this.components.some(function(target, i) {
            if (name !== target.name) {
                return false;
            }

            this.components[i] = merge(target, component);

            return true;
        }.bind(this));
    };

    /**
     * Determine if the provided component is valid
     * 
     * @method scraper.isValid
     * @param {Object} component
     */
    proto.isValid = function(component) {
        return component && component.category && component.name && component.description;
    };

    /**
     * Determine if the provided component exists
     * 
     * @method scraper.exists
     * @param {Object} component
     * @return {Boolean}
     */
    proto.exists = function(component) {
        var exists;
        var name = component.name;

        this.components.some(function(component) {
            exists = component.name === name;

            return exists;
        });

        return exists;
    };

    module.exports = Scraper;

} ());