(function() {
    'use strict';

    var fs = require('fs');
    var path = require('path');
    var marked = require('marked');
    var regex = require('../utils/regexs');
    var Janitor = require('./janitor');
    var fileExists = require('../utils/fileExists');
    var merge = require('../utils/merge');

    var Scraper = function(files) {
        this.files = files;

        this.components = [];

        return this.scrape();
    };

    var proto = Scraper.prototype;

    proto.scrape = function() {
        this.files.forEach(this.addComponent.bind(this));

        return this;
    };

    proto.get = function() {
        return this.components;
    };

    proto.addComponent = function(item) {
        var src = item.src[0];
        var options = { encoding: 'utf8' };
        var basepath = src.replace(path.basename(src), '');
        var extname = path.extname(src).replace(/./, '');
        var content = fs.readFileSync(src, options);
        var data = new Janitor(content.match(regex.docs));
        var keys;

        if (!this.componentIsValid(data)) {
            return;
        }

        keys = Object.keys(data);

        keys.forEach(function(key) {
            if (key === 'name' || key === 'category') {
                return;
            }

            data[key] = data[key].match(regex.html_file)
                      ? fs.readFileSync(basepath + data[key], options)
                      : data[key].match(regex.markdown_file)
                      ? marked(fs.readFileSync(basepath + data[key], options))
                      : marked(data[key]);
        });

        if (this.componentExists(data)) {
            this.mergeComponent(data);

            return;
        }

        this.components.push(data);
    };

    proto.mergeComponent = function(componentToMerge) {
        var name = componentToMerge.name;

        this.components.some(function(component, i) {
            if (name !== component.name) {
                return false;
            }

            this.components[i] = merge(component, componentToMerge);

            return true;
        }.bind(this));
    };

    proto.componentIsValid = function(component) {
        return component && component.category && component.name && component.description;
    };

    proto.componentExists = function(providedComponent) {
        var componentExists = false;
        var name = providedComponent.name;

        this.components.some(function(component) {
            componentExists = component.name === name;

            return componentExists;
        });

        return componentExists;
    };

    module.exports = Scraper;

} ());