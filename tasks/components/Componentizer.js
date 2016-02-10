(function() {
    'use strict';

    var fs = require('fs');
    var path = require('path');
    var marked = require('marked');
    var merge = require('../utils/merge');
    var regex = require('../utils/regexs');
    var fileExists = require('../utils/fileExists');
    var Scraper = require('./Scraper');

    var Componentizer = function(files, delimiters) {
        this.files = files;

        this.scraper = new Scraper({
            delimiters: delimiters
        });

        this.components = {};

        this.init();
    };

    Componentizer.OPTIONS = {
        propsToProcess: ['description']
    };

    Componentizer.readFile = function(filePath) {
        return fs.readFileSync(
            filePath,
            Scraper.OPTIONS.readFileSync
        ).replace(/^\uFEFF/, '')
    };

    Componentizer.processComponent = function(component) {
        Object.keys(component).forEach(function(key) {
            var filePath = component._basepath + component[key];

            if (Componentizer.OPTIONS.propsToProcess.indexOf(key) === -1) {
                return;
            }

            component[key] = marked(
                fileExists(filePath)
                ? Componentizer.readFile(filePath)
                : component[key]
            );
        });

        return merge(component, {
            path: path.join(component.category, component.filename || component.name + '.html')
        });
    };

    var proto = Componentizer.prototype;

    proto.init = function() {
        this.scraper.scrape(this.files);

        this.scraper.getData()
            .map(Componentizer.processComponent)
            .forEach(function(component) {
                var category = component.category;

                if (!this.components[category]) {
                    this.components[category] = [];
                }

                this.components[category].push(component);
            }.bind(this));
    };

    proto.get = function() {
        return this.components;
    };

    module.exports = Componentizer;

} ());