/*
 * grunt-emo
 * https://github.com/martinjunior/emo
 *
 * Copyright (c) 2015 Martin Duran
 * Licensed under the MIT license.
 */

'use strict';

var StyleGuide = require('./components/StyleGuide');

module.exports = function(grunt) {

    grunt.registerMultiTask('emo', 'The best Grunt plugin ever.', function() {
        var styleGuide = new StyleGuide(grunt, this.files, this.options());
    });

};