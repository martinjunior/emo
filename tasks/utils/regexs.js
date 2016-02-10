(function() {
    'use strict';

    /**
     * Regular expessions
     * used by the emo task
     * 
     * @type {Object}
     */
    module.exports = {
        docs: function(open, close) {
            var pattern = new RegExp(
                open + '((?!(' + open + '|' + close + '))[\\s\\S])+' + close, 'g'
            );

            return pattern;
        },
        delimiter: {
            open: function(delimiter) {
                var pattern = new RegExp('^' + delimiter);
                
                return pattern;
            },
            close: function(delimiter) {
                var pattern = new RegExp(delimiter + '$');
                
                return pattern;
            }
        },
        styleguideSrcPath: /[A-Za-z\/\-_ :]+\/styleguide\//
    };

} ());