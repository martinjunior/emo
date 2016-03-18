/*
 * grunt-emo
 * https://github.com/martinjunior/emo
 *
 * Copyright (c) 2015 Martin Duran
 * Licensed under the MIT license.
 */

'use strict';

var StyleGuideGenerator = require('./components/StyleGuideGenerator');

module.exports = function(grunt) {

    grunt.registerMultiTask('emo', 'A style-guide generator.', function() {
        var done = this.async();
        var styleGuideGenerator = new StyleGuideGenerator(grunt, this.data.files, this.options());

        styleGuideGenerator.build().then(function() {
            done();
        });
    });

};