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

        this.data = {};

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

    var proto = Componentizer.prototype;

    proto.init = function() {
        return this.scrape(this.files);
    };

    proto.scrape = function(files) {
        var data = {};

        this.scraper.scrape(files);

        this.scraper.getData()
            .map(this.process.bind(this))
            .sort(this.sort.bind(this))
            .forEach(function(component) {
                var category = component.category;

                if (!data[category]) {
                    data[category] = [];
                }

                data[category].push(component);
            }.bind(this));

        this.data = data;
    };

    proto.get = function() {
        return this.data;
    };

    proto.sort = function(a, b) {
        return a.category > b.category;
    };

    proto.process = function(component) {
        Object.keys(component).forEach(function(key) {
            var filePath = component._basepath + component[key];

            if (Componentizer.OPTIONS.propsToProcess.indexOf(key) === -1 || !component[key]) {
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

    module.exports = Componentizer;

} ());