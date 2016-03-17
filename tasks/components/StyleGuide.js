(function() {
    'use strict';

    var StyleGuideGenerator = require('emo-gen');
    var objectAssign = require('object-assign');

    var StyleGuide = function(grunt, gruntFilesArray, gruntOptions) {
        this.grunt = grunt;

        this.gruntOptions = gruntOptions;

        this.filesToCopy = this.expandGruntFilesArray(gruntFilesArray);

        this.generator = new StyleGuideGenerator(
            this.gruntOptions.components,
            this.gruntOptions
        );
    };

    StyleGuide.createGruntFileMappingOptions = function(gruntFilesObject) {
        var gruntFileMappingOptions = objectAssign({}, gruntFilesObject);

        // delete those properties we don't need
        delete gruntFileMappingOptions.src;
        delete gruntFileMappingOptions.dest;

        return gruntFileMappingOptions;
    };

    var proto = StyleGuide.prototype;

    proto.build = function() {
        return this.generator.place().then(function() {
            return this.generator.copyFiles(this.filesToCopy);
        }.bind(this)).then(function() {
            return this.generator.build();
        }.bind(this));
    };

    proto.expandGruntFilesArray = function(gruntFilesArray) {
        var gruntFilesMappingList = [];

        if (!gruntFilesArray) {
            return gruntFilesMappingList;
        }

        gruntFilesArray.forEach(function(gruntFilesObject) {
            this.grunt.file.expandMapping(
                gruntFilesObject.src,
                gruntFilesObject.dest,
                StyleGuide.createGruntFileMappingOptions(gruntFilesObject)
            ).forEach(function(srcDestFileMapping) {
                var flattenedArray = [];
                var dest = srcDestFileMapping.dest;

                srcDestFileMapping.src.forEach(function(src) {
                    flattenedArray.push({
                        src: src,
                        dest: dest
                    });
                });

                gruntFilesMappingList = gruntFilesMappingList.concat(flattenedArray);
            });
        }.bind(this));

        return gruntFilesMappingList;
    };

    module.exports = StyleGuide;

} ());