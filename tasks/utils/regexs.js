(function() {
    'use strict';

    /**
     * Regular expessions used by
     * the emo task
     * 
     * @type {Object}
     */
    module.exports = {
        docs: /[-]{3}doc[\s\S]+[-]{3}/g,
        delimiter: {
            open: /^[-]{3}docs/,
            close: /[-]{3}$/
        },
        markdownFile: /.md$/g,
        styleguideSrcPath: /[A-Za-z\/\-_]+\/styleguide\//,
        spacesAndSlashes: /[ \/]/g
    };

} ());