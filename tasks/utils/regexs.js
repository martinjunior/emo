(function() {
    'use strict';

    /**
     * Regular expessions used by
     * the mt_style_guide task
     * 
     * @type {Object}
     */
    module.exports = {
        docs: /\{%.[\s\S]*%}/g,
        sections: /\{%([^\{%]+|[^\%}]+)%}/g,
        keys: /([A-Za-z -_]+:)/g,
        values: /:([\s\S]+)/g,
        comments: /[\/\/]{2} ?/g,
        comment_tag_open: /\{%/,
        comment_tag_close: /\%}/,
        extra_chars: /[:]/g,
        markdown_file: /.md$/g,
        html_file: /.html$/g,
        styleguide_src_path: /[A-Za-z\/\-_]+\/styleguide\//
    };

} ());