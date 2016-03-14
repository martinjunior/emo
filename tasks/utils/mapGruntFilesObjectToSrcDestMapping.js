(function() {
    'use strict';

    var mapGruntFilesObjectToSrcDestMapping = function(gruntFilesObject) {
        var srcDestMapping = [];

        if (!gruntFilesObject) {
            return srcDestMapping;
        }

        gruntFilesObject.forEach(function(gruntFilesObject) {
            var dest = gruntFilesObject.dest;

            gruntFilesObject.src.forEach(function(src) {
                srcDestMapping.push({
                    src: src,
                    dest: dest
                });
            });
        });

        return srcDestMapping;
    };

    module.exports = mapGruntFilesObjectToSrcDestMapping;

} ());