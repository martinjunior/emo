(function() {
    'use strict';

    var regexs = require('../utils/regexs');

    var Janitor = function(mess) {
        if (!mess) {
            return;
        }

        this.components = [];
        this.mess = mess[0].match(regexs.sections);
        this.keys = [];
        this.values = [];

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

            if (!(keys && keys.forEach) || !(values && values.forEach)) {
                return;
            }

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
                key.replace(regexs.extra_chars, '').toLowerCase()
            );
        }.bind(this));
    };

    proto.addValues = function(values) {
        values.forEach(function(value) {
            this.values.push(
                value
                    .replace(':', '')
                    .replace(regexs.comments, '')
                    .trim()
                    .slice(0, -1)
                );
        }.bind(this));
    };

    module.exports = Janitor;

} ());