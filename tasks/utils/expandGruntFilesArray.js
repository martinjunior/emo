(function() {
    'use strict';

    var objectAssign = require('object-assign');

    function expandGruntFilesArray(grunt, gruntFilesArray) {
        var gruntFilesMappingList = [];

        if (!gruntFilesArray) {
            return gruntFilesMappingList;
        }

        gruntFilesArray.forEach(function(gruntFilesObject) {
            grunt.file.expandMapping(
                gruntFilesObject.src,
                gruntFilesObject.dest,
                createGruntFileMappingOptions(gruntFilesObject)
            ).forEach(function(srcDestFileMapping) {
                gruntFilesMappingList.push(srcDestFileMapping);
            });
        });

        return gruntFilesMappingList;
    };

    function createGruntFileMappingOptions(gruntFilesObject) {
        var gruntFileMappingOptions = objectAssign({}, gruntFilesObject);

        // delete those properties we don't need
        delete gruntFileMappingOptions.src;
        delete gruntFileMappingOptions.dest;

        return gruntFileMappingOptions;
    }

    module.exports = expandGruntFilesArray;

} ());