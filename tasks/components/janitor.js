(function() {
    'use strict';

    var regexs = require('../utils/regexs');

    var Janitor = function(mess) {
        this.components = [];

        if (!mess) {
            return;
        }

        this.keys = [];

        this.values = [];

        this.mess = mess[0].match(regexs.sections).map(function(item) {
            return item.replace(regexs.comment_tag_open, '')
                       .replace(regexs.comment_tag_close, '')
                       .trim();
        });

        this.sweep(this.mess);
    };

    var proto = Janitor.prototype;

    proto.get = function() {
        return this.components;
    };

    proto.sweep = function(mess) {
        var count = 0;

        mess.forEach(function(section, i) {
            var keys = section.match(regexs.keys);
            var values = section.match(regexs.values);

            this.components[count] = {};

            if (!keys || !(values && values.length === 2)) {
                return;
            }

            values.shift();

            this.addKeys(keys);
            this.addValues(values);
        }.bind(this));

        this.keys.forEach(function(key, i) {
            if (this.components[count].hasOwnProperty(key)) {
                count++;

                this.components[count] = {};
            }

            this.components[count][key] = this.values[i];
        }.bind(this));
    };

    proto.addKeys = function(keys) {
        keys.forEach(function(key) {
            this.keys.push(
                key.replace(regexs.extra_chars, '')
                   .replace(':', '')
                   .toLowerCase()
            );
        }.bind(this));
    };

    proto.addValues = function(values) {
        values.forEach(function(value) {
            this.values.push(
                value
                    .replace(regexs.extra_chars, '')
                    .replace(regexs.comments, '')
                    .trim()
                );
        }.bind(this));
    };

    module.exports = Janitor;

} ());