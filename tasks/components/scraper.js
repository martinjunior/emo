(function() {
    'use strict';

    var fs = require('fs');
    var path = require('path');
    var regex = require('../utils/regexs');
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
    var Scraper = function(options) {
        this.options = merge(Scraper.OPTIONS, options);

        /**
         * An eventual list of data
         * collected from source files
         * 
         * @property scraper.data
         * @type {Array}
         * @default []
         */
        this.data = [];
    };

    /**
     * @property Scraper.OPTIONS
     * @static
     * @final
     */
    Scraper.OPTIONS = {
        delimiters: ['{%', '%}'],
        readFileSync: {
            encoding: 'utf8'
        }
    };

    var proto = Scraper.prototype;

    proto.scrape = function(files) {
        if (!files) {
            return;
        }

        files.filter(function(src) {
            return fs.lstatSync(src).isFile();
        }).map(
            this._scrapeSrcFile.bind(this)
        ).forEach(function(dataList) {
            if (!dataList) {
                return;
            }

            dataList.forEach(function(item) {
                if (!this.isValid(item)) {
                    return;
                }

                this.add(item);
            }.bind(this));
        }.bind(this));

        return this;
    };

    /**
     * Return data
     * 
     * @method scraper.getData
     */
    proto.getData = function() {
        return this.data;
    };

    /**
     * Scrape the given source file
     * for component documentation
     * 
     * @method scraper._scrapeSrcFile
     * @param {String} src path to soure file
     * @return {Array} a list of data
     */
    proto._scrapeSrcFile = function(src) {
        var basename = path.basename(src);
        var basepath = src.replace(basename, '');
        var content = fs.readFileSync(src, this.options.readFileSync);
        var pattern = regex.docs(this.options.delimiters[0], this.options.delimiters[1]);
        var data = this.serialize(content.match(pattern));

        return data.map(function(item) {
            return merge(item, {
                _basename: basename,
                _basepath: basepath
            });
        });
    };

    /**
     * Convert content into valid JSON,
     * which will respresent component models
     * 
     * @method scraper.serialize
     * @param {String} content
     * @return {Array} a list of component data
     */
    proto.serialize = function(content) {
        var data = [];

        if (!content) {
            return data;
        }

        data = content.map(function(text) {
            return yaml.safeLoad(
                text
                    .replace(regex.delimiter.open(this.options.delimiters[0]), '')
                    .replace(regex.delimiter.close(this.options.delimiters[1]), '')
            );
        }.bind(this));

        return data;
    };

    /**
     * Add the provided item to the
     * list of items, or merge it into
     * an existing item if it already exists
     * 
     * @method scraper.add
     * @param {Object} item
     */
    proto.add = function(item) {
        if (this.exists(item)) {
            this.merge(item);

            return;
        }

        this.data.push(item);
    };

    /**
     * Merge the provided item into a
     * item in the item list whos name
     * matches that of the provided item
     * 
     * @method scraper.merge
     * @param {Object} item
     */
    proto.merge = function(item) {
        var name = item.name;

        this.data.some(function(target, i) {
            if (name !== target.name) {
                return false;
            }

            this.data[i] = merge(target, item);

            return true;
        }.bind(this));
    };

    /**
     * Determine if the provided item is valid
     * 
     * @method scraper.isValid
     * @param {Object} item
     */
    proto.isValid = function(item) {
        return item && item.name && item.category;
    };

    /**
     * Determine if the provided item exists
     * 
     * @method scraper.exists
     * @param {Object} item
     * @return {Boolean}
     */
    proto.exists = function(item) {
        var exists;
        var name = item.name;

        this.data.some(function(item) {
            exists = item.name === name;

            return exists;
        });

        return exists;
    };

    module.exports = Scraper;

} ());