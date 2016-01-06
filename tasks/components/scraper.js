(function() {
    'use strict';

    var fs = require('fs');
    var path = require('path');
    var marked = require('marked');
    var regex = require('../utils/regexs');
    var Janitor = require('./Janitor');
    var fileExists = require('../utils/fileExists');
    var merge = require('../utils/merge');

    var Scraper = function(files) {
        this.files = files;

        this.components = [];

        this.init();
    };

    Scraper.OPTIONS = {
        encoding: 'utf8'
    };

    var proto = Scraper.prototype;

    proto.init = function() {
        var components = this.files.map(this.scrape.bind(this));

        components.forEach(function(componentList) {
            if (componentList.length === 0) {
                return;
            }

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
        var content = fs.readFileSync(src, Scraper.OPTIONS);
        var components = new Janitor(content.match(regex.docs)).get();

        return components.map(function(component) {
            var filename = component.name.toLowerCase().replace(/[ \/]/g, '-').trim();

            return merge(component, {
                _basepath: basepath,
                _basename: filename + '.html'
            });
        });
    };

    proto.process = function(component) {
        var description = component.description;
        var isFile = description.match(regex.markdown_file);
        var basepath = component._basepath;

        component.description = marked(
            isFile
            ? fs.readFileSync(basepath + description, Scraper.OPTIONS)
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