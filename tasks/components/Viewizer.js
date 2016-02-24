(function() {
    'use strict';

    var fs = require('fs');
    var path = require('path');
    var regex = require('../utils/regexs');
    var Scraper = require('./Scraper');
    var Componentizer = require('./Componentizer');

    var Viewizer = function(files, delimiters) {
        Componentizer.call(this, files, delimiters);
    };

    Viewizer.prototype = Object.create(Componentizer.prototype);
    Viewizer.prototype.constructor = Componentizer;

    var proto = Viewizer.prototype;

    proto.init = function() {
        var srcFiles = [];

        this.files.forEach(function(fileMapping) {
            fileMapping.forEach(function(filePair) {
                filePair.src.forEach(function(src) {
                    srcFiles.push(src);
                }.bind(this));
            });
        }.bind(this));

        return this.scrape(srcFiles);
    };

    proto.process = function(view) {
        this.files.some(function(fileMapping) {
            var match = false;

            fileMapping.some(function(filePair) {
                filePair.src.some(function(src) {
                    var isFile = fs.lstatSync(src).isFile();

                    match = (src === view._basepath + view._src) && isFile;

                    if (match) {
                        view.path = path.join('./', filePair.dest);
                    }

                    return match;
                });

                return match;
            });

            return match;
        });

        return view;
    };

    module.exports = Viewizer;

} ());