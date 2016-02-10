(function() {
    'use strict';

    var fs = require('fs');
    var path = require('path');
    var regex = require('../utils/regexs');
    var Scraper = require('./Scraper');

    var Viewizer = function(files, delimiters) {
        this.files = files;

        this.scraper = new Scraper({
            delimiters: delimiters
        });

        this.views = {};

        this.init();
    };

    var proto = Viewizer.prototype;

    proto.init = function() {
        var srcFiles = [];

        this.files.forEach(function(filePair) {
            filePair.src.forEach(function(src) {
                srcFiles.push(src);
            }.bind(this));
        }.bind(this));

        this.scraper.scrape(srcFiles);

        this.scraper.getData()
            .map(this.processView.bind(this))
            .forEach(function(view) {
                var category = view.category;

                if (!this.views[category]) {
                    this.views[category] = [];
                }

                this.views[category].push(view);
            }.bind(this));
    };

    proto.get = function() {
        return this.views;
    };

    proto.processView = function(view) {
        this.files.some(function(filePair) {
            var match = false;

            filePair.src.some(function(src) {
                var isFile = fs.lstatSync(src).isFile();

                match = (src === view._basepath + view._basename) && isFile;

                if (match) {
                    view.path = filePair.dest
                }

                return match;
            });

            return match;
        });

        return view;
    };

    module.exports = Viewizer;

} ());