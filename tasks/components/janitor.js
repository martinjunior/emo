(function() {
    'use strict';

    var regexs = require('../utils/regexs');

    var Janitor = function(mess) {
        if (!mess) {
            return;
        }

        this.obj = {};
        this.mess = mess[0].match(regexs.sections);
        this.keys = [];
        this.values = [];

        return this.sweep();
    };

    var proto = Janitor.prototype;

    proto.sweep = function() {
        var keys;
        var values;

        this.mess.forEach(function(section) {
            keys = section.match(regexs.keys);
            values = section.match(regexs.values);

            if (!(keys && keys.forEach) || !(values && values.forEach)) {
                return;
            }

            this.addKeys(keys);
            this.addValues(values);

            this.keys.forEach(function(key, i) {
                this.obj[key] = this.values[i];
            }.bind(this));
        }.bind(this));

        return this.obj;
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