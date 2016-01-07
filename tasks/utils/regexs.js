(function() {
    'use strict';

    /**
     * Regular expessions used by
     * the emo task
     * 
     * @type {Object}
     */
    module.exports = {
        docs: function(open, close) {
            var pattern = open + '[\\s\\S]+' + close;

            return new RegExp(pattern ,'g');
        },

        delimiter: function(delimiter) {
            return new RegExp(delimiter);
        },

        component: function(open, close) {
            var pattern = open + '([^' + open + ']+|[^' + close + ']+)' + close;

            return new RegExp(pattern, 'g');
        },

        sections: /[:](?:[ \n]+)/,
        markdownFile: /.md$/g,
        styleguideSrcPath: /[A-Za-z\/\-_]+\/styleguide\//,
        spacesAndSlashes: /[ \/]/g
    };

} ());