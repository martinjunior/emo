(function() {
    'use strict';

    var regexs = require('../utils/regexs');

    var janitor = {
        delimiters: ['{{', '}}']
    };

    janitor.clean = function(mess) {
        return janitor.mop(janitor.sweep(mess));
    };

    janitor.sweep = function(mess) {
        if (!mess) {
            return;
        }

        return mess.match(regexs.component(janitor.delimiters[0], janitor.delimiters[1])).map(function(item) {
            return item.replace(regexs.delimiter(janitor.delimiters[0]), '')
                       .replace(regexs.delimiter(janitor.delimiters[1]), '')
                       .trim();
        })
    };

    janitor.mop = function(mess) {
        var count = 0;
        var keys = [];
        var values = [];
        var components = [];

        if (!mess) {
            return components;
        }

        mess.forEach(function(section, i) {
            var sections = section.split(regexs.sections);
            var key = sections[0];
            var value = sections[1];

            components[count] = {};

            if (!key || !value) {
                return;
            }

            keys.push(key.toLowerCase());
            values.push(value);
        }.bind(this));

        keys.forEach(function(key, i) {
            if (components[count].hasOwnProperty(key)) {
                count++;

                components[count] = {};
            }

            components[count][key] = values[i];
        }.bind(this));

        return components;
    };

    module.exports = janitor;

} ());