(function() {
    'use strict';

    var EMOGen = require('emo-gen');
    var objectAssign = require('object-assign');

    /**
     * A grunt style guide generator
     * 
     * @param {Object} grunt
     * @param {Array} gruntFilesArray  an unexpanded grunt file array
     * @param {Object} gruntOptions  grunt task options
     */
    var StyleGuideGenerator = function(grunt, gruntFilesArray, gruntOptions) {
        /**
         * @property styleGuideGenerator.grunt
         * @type {Object}
         */
        this.grunt = grunt;

        /**
         * An unexpanded grunt file array
         * 
         * @property styleGuideGenerator.gruntFilesArray
         * @type {Array}
         */
        this.gruntFilesArray = gruntFilesArray;

        /**
         * Grunt task options
         * 
         * @property styleGuideGenerator.gruntOptions
         * @type {Array}
         */
        this.gruntOptions = gruntOptions;

        /**
         * An emo-gen instance
         * 
         * @property styleGuideGenerator.generator
         */
        this.generator = new EMOGen(
            this.gruntOptions.components,
            this.gruntOptions
        );
    };

    /**
     * Convert a grunt files object to a
     * grunt file mapping options object
     * (http://gruntjs.com/api/grunt.file#grunt.file.expandmapping)
     * 
     * @method StyleGuideGenerator.createGruntFileMappingOptions
     * @return {Object} gruntFileMappingOptions
     * @static
     */
    StyleGuideGenerator.createGruntFileMappingOptions = function(gruntFilesObject) {
        var gruntFileMappingOptions = objectAssign({}, gruntFilesObject);

        // delete those properties we don't need
        delete gruntFileMappingOptions.src;
        delete gruntFileMappingOptions.dest;

        return gruntFileMappingOptions;
    };

    var proto = StyleGuideGenerator.prototype;

    /**
     * Build the style guide
     * 
     * @method styleGuideGenerator.build
     * @return {Object} a promise
     */
    proto.build = function() {
        return this.generator.place().then(function() {
            var files = this.expandGruntFilesArray(this.gruntFilesArray);

            return this.generator.copy(files);
        }.bind(this)).then(function() {
            return this.generator.build();
        }.bind(this));
    };

    /**
     * Expand grunt files array
     * 
     * @method styleGuideGenerator.expandGruntFilesArray
     * @return {Object} gruntFilesMappingList
     */
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

    module.exports = StyleGuideGenerator;

} ());