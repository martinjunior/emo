(function() {
    'use strict';

    var fs = require('fs');
    var path = require('path');
    var marked = require('marked');
    var regex = require('../utils/regexs');
    var janitor = require('./janitor');
    var fileExists = require('../utils/fileExists');
    var merge = require('../utils/merge');

    var Scraper = function(files, options) {
        this.files = files;

        this.components = [];

        this.options = merge(Scraper.OPTIONS, options);

        this.init();
    };

    Scraper.OPTIONS = {
        readFileSync: {
            encoding: 'utf8'
        },
        delimiters: ['{{', '}}']
    };

    var proto = Scraper.prototype;

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

    proto.get = function() {
        return this.components;
    };

    proto.scrape = function(src) {
        var basename = path.basename(src);
        var basepath = src.replace(basename, '');
        var content = fs.readFileSync(src, this.options.readFileSync);
        var mess = content.match(regex.docs);
        var components = janitor.clean(mess ? mess[0] : null);

        return components.map(function(component) {
            var filename = component.name.toLowerCase().replace(regex.spacesAndSlashes, '-').trim();

            return merge(component, {
                _basepath: basepath,
                file: filename + '.html'
            });
        });
    };

    proto.process = function(component) {
        var description = component.description;
        var isFile = description.match(regex.markdownFile);
        var basepath = component._basepath;

        component.description = marked(
            isFile
            ? fs.readFileSync(basepath + description, this.options.readFileSync)
            : description
        );

        return component;
    }

    proto.add = function(component) {
        if (this.exists(component)) {
            this.merge(component);

            return;
        }

        this.components.push(component);
    };

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

    proto.isValid = function(component) {
        return component && component.category && component.name && component.description;
    };

    proto.exists = function(component) {
        var name = component.name;
        var exists = false;

        this.components.some(function(component) {
            exists = component.name === name;

            return exists;
        });

        return exists;
    };

    module.exports = Scraper;

} ());