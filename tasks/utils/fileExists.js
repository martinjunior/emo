(function() {
    'use strict';

    var fs = require('fs');

    /**
     * Determine whether or not
     * a given file exists
     *
     * @param {String} pathToFile
     * @return {Boolean}
     */
    var fileExists = function(pathToFile) {
        var fileExists;

        try {
            fs.statSync(pathToFile);

            fileExists = true;
        } catch(ex) {
            fileExists = false;
        }

        return fileExists;
    };

    module.exports = fileExists;

} ());