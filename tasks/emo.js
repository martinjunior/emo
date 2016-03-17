/*
 * grunt-emo
 * https://github.com/martinjunior/emo
 *
 * Copyright (c) 2015 Martin Duran
 * Licensed under the MIT license.
 */

'use strict';

var StyleGuide = require('emo-gen');
var expandGruntFilesArray = require('./utils/expandGruntFilesArray');
var mapGruntFilesObjectToSrcDestMapping = require('./utils/mapGruntFilesObjectToSrcDestMapping');

module.exports = function(grunt) {

    grunt.registerMultiTask('emo', 'A style-guide generator.', function() {
        var done = this.async();
        var options = this.options();
        var filesToScrape = options.components;
        var styleGuide = new StyleGuide(filesToScrape, options);

        styleGuide.place().then(function() {
            var expandedFiles = expandGruntFilesArray(grunt, this.data.files);
            var filesToCopy = mapGruntFilesObjectToSrcDestMapping(expandedFiles);

            return styleGuide.copyFiles(filesToCopy);
        }).then(function() {
            return styleGuide.build();
        }).then(function() {
            done();
        });
    });

};