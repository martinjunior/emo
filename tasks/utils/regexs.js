(function() {
    'use strict';

    /**
     * Regular expessions used by
     * the emo task
     * 
     * @type {Object}
     */
    module.exports = {
        docs: /\{%[\s\S]+%}/g,
        component: /\{%([^\{%]+|[^\%}]+)%}/g,
        comments: /\/\/ ?/g,
        commentTagOpen: /\{%/,
        commentTagClose: /\%}/,
        sections: /[:](?:[ \n]+)/,
        markdownFile: /.md$/g,
        styleguideSrcPath: /[A-Za-z\/\-_]+\/styleguide\//,
        spacesAndSlashes: /[ \/]/g
    };

} ());