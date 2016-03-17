# grunt-emo (Beta)

> A style-guide generator

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
                components: [
                    'src/assets/scss/**/*.scss'
                ]
            },
            files: [
                {
                    expand: true,
                    cwd: 'stylesguide/src/assets/',
                    src: ['**'],
                    dest: 'styleguide/dest/assets/'
                }
            ]
        }
    }
});
```

### The `files` property

The `files` property is reserved for those files that should be copied to the style-guide destination path. Treat this as you would the `files` property of a `grunt-contrib-copy` task.

### Options

#### options.path
Type: `Object`
Default value: `{ src: 'styleguide/src/', dest: 'styleguide/dest/' }`

Paths used by the style-guide generator.

#### options.path.src
Type: `String`
Default value: `styleguide/src/`

The location the styleguide source code is to be placed.

#### options.path.dest
Type: `String`
Default value: `styleguide/dest/`

The location the styleguide will build to.

#### options.components
Type: `Array`
Default value: `[]`

A list of files that should be scraped for documentation. See [documentation syntax](#documentation-syntax) for more details.

#### options.delimiters
Type: `Array`
Default value: `['{#', '#}']`

Delimiters, within which, component documentation is expected to be written. See [documentation syntax](#documentation-syntax) for more details.

### Usage Examples

#### Default Options

```js
grunt.initConfig({
    emo: {
        main: {
            options: {
                components: [
                    'src/assets/scss/**/*.scss'
                ]
            },
            files: [
                {
                    expand: true,
                    cwd: '_styleguide/assets/',
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
                components: [
                    'src/assets/scss/**/*.scss'
                ]
            },
            files: [
                {
                    expand: true,
                    cwd: '_styleguide/assets/',
                    src: ['**'],
                    dest: 'styleguide/assets/'
                }
            ]
        }
    }
});
```

## Documentation Syntax

Emo can scrape documentation from any type of file. Documentation syntax is expected to take the following form and be written within the delimiters specified within `options.delimiters` (e.g., `{#` and '#}' by default).

```scss
/*

{#

name: Btn

category: elements

description: Button descpription

#}

*/

.btn { ... }
```

Three property/value combinations are required: name, category and description. Property/value combinations can be added at will.

```scss
/*

{#

name: Btn

category: elements

description: Button descpription

author: Some Person

version: 1.0.0

#}

*/

.btn { ... }
```

Emo expects that contents of documentation blocks to be written in YAML. See the [YAML reference card](http://www.yaml.org/refcard.html) for more information.

## Loading External Documentation

As inline documentation is not always preferred, emo makes it possible to load external markdown files. External file paths should be written relatively. Know that emo parses all property values as markdown.

```scss
/*

{#

name: Btn

category: elements

description: relative/path/to/btn_docs.md

#}

*/

.btn { ... }
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
