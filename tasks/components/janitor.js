(function() {
    'use strict';

    var regexs = require('../utils/regexs');

    var Janitor = function(mess) {
        if (!mess) {
            return;
        }

        this.components = [];
        this.keys = [];
        this.values = [];

        this.mess = mess[0].match(regexs.sections).map(function(item) {
            return item.replace(regexs.comment_tag_open, '')
                       .replace(regexs.comment_tag_close, '')
                       .trim();
        });

        return this.sweep();
    };

    var proto = Janitor.prototype;

    proto.sweep = function() {
        var keys;
        var values;
        var count = 0;

        this.mess.forEach(function(section, i) {
            this.components[count] = {};

            keys = section.match(regexs.keys);
            values = section.match(regexs.values);

            if (!(keys && keys.forEach) || !(values && values.forEach && values.length === 2)) {
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

        return this.components;
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