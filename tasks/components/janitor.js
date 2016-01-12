(function() {
    'use strict';

    var regexs = require('../utils/regexs');
    var yaml = require('js-yaml');

    var janitor = {};

    janitor.clean = function(mess) {
        var data;

        if (!mess) {
            return [];
        }

        data = yaml.safeLoad(
            mess.replace(regexs.delimiter.open, '')
                .replace(regexs.delimiter.close, '')
        );

        return [data];
    };

    module.exports = janitor;

} ());