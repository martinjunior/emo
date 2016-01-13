# grunt-emo (Beta)

> A style-guide generator

Emo is a tool that generates a style-guide from documentation it collects from your source files. Emo expects documentation to be written in YAML and uses [Swig.js](http://paularmstrong.github.io/swig/) for templating.

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-emo --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-emo');
```

## The "emo" task

### Overview
In your project's Gruntfile, add a section named `emo` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
    emo: {
        main: {
            options: {
                scrape: [
                    'src/assets/scss/**/*.scss'
                ]
            },
            files: [
                {
                    expand: true,
                    cwd: '_styleguide/assets/',
                    src: ['**'],
                    dest: 'styleguide/assets/'
                },
                {
                    expand: true,
                    cwd: 'web/assets/',
                    src: ['**'],
                    dest: 'styleguide/assets/'
                }
            ]
        }
    }
});
```

### The `files` property

The `files` property is reserved for those files that should be copied to the style-guide destination path.

### Options

#### options.path
Type: `Object`
Default value: `{ src: '_styleguide/', dest: 'docs/styleguide/' }`

Paths used by the style-guide generator.

#### options.path.src
Type: `String`
Default value: `_styleguide/`

The location the styleguide source code is to be placed. Must include a trailing slash.

#### options.path.dest
Type: `String`
Default value: `docs/styleguide/`

The location the styleguide will build to. Must include a trailing slash.

#### options.scrape
Type: `Array`
Default value: `[]`

A list of files that should be scraped for documentation. See [documentation syntax](#documentation-syntax) for more details.

#### options.categories
Type: `Array`
Default value: `['elements', 'molecules', 'organisms']`

An array containing the categories under which components will appear. Understand that components must belong to a specified category in order to show up in the style-guide.

#### options.delimiters
Type: `Array`
Default value: `['{%', '%}']`

Delimiters, within which, component documentation is expected to be written. See [documentation syntax](#documentation-syntax) for more details.

### Usage Examples

#### Default Options

```js
grunt.initConfig({
    emo: {
        main: {
            options: {
                scrape: [
                    'src/assets/scss/**/*.scss'
                ]
            },
            files: [
                {
                    expand: true,
                    cwd: '_styleguide/assets/',
                    src: ['**'],
                    dest: 'styleguide/assets/'
                },
                {
                    expand: true,
                    cwd: 'web/assets/',
                    src: ['**'],
                    dest: 'styleguide/assets/'
                }
            ]
        }
    }
});
```

#### Custom Options
Below, emo is configured to output the style-guide as well as its source in a custom location.

```js
grunt.initConfig({
    emo: {
        main: {
            options: {
                path: {
                    src: 'custom/path/',
                    dest: 'path/to/styleguide/'
                },
                scrape: [
                    'src/assets/scss/**/*.scss'
                ]
            },
            files: [
                {
                    expand: true,
                    cwd: '_styleguide/assets/',
                    src: ['**'],
                    dest: 'styleguide/assets/'
                },
                {
                    expand: true,
                    cwd: 'web/assets/',
                    src: ['**'],
                    dest: 'styleguide/assets/'
                }
            ]
        }
    }
});
```

## Documentation Syntax

Emo can scrape documentation from any type of file. Documentation syntax is expected to take the following form and within the delimiters specified within `options.delimiters` (e.g., `{%` and '%}' by default).

```scss
/*

{%

name: Btn

category: elements

description: Button descpription

%}

*/

.btn { ... }
```

Three property/value combinations are required: name, category and description. Property/value combinations can be added at will.

```scss
/*

{%

name: Btn

category: elements

description: Button descpription

author: Some Person

version: 1.0.0

%}

*/

.btn { ... }
```

Emo expects that contents of documentation blocks to be written in YAML. See the [YAML reference card](http://www.yaml.org/refcard.html) for more information.

## Loading External Documentation

As inline documentation is not always preferred, emo makes it possible to load external markdown files. External file paths should be written relatively. Know that emo parses all property values as markdown.

```scss
/*

{%

name: Btn

category: elements

description: relative/path/to/btn_docs.md

%}

*/

.btn { ... }
```

## Categories

Emo was inspired by [pattern lab](http://patternlab.io/), which categorizes UI components as atoms, molecules, organisms, templates, and pages. By default, emo uses a similar set of categories: elements, molecules, and organisms. In order for a component to show up in the generated style-guide, it must be placed in one of these categories. Know that these categories can be replaced via the `categories` options.

### Elements

See [atoms](http://patternlab.io/about.html#atoms)

### Molecules

See [molecules](http://patternlab.io/about.html#molecules)

### Organisms

See [organisms](http://patternlab.io/about.html#organisms)

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
