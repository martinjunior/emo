# grunt-emo

> A style-guide generator

## A Node Style-guide Generator

`grunt-emo` is wrapper for `emo-gen`, a style-guide generator that runs on node. See [emo-gen](https://github.com/martinjunior/emo-gen) for more information.

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

Example:

```javascript
grunt.initConfig({
    emo: {
        main: {
            options: {
                components: [
                    'src/assets/scss/**/*.scss'
                ]
            }
        }
    }
});
```

#### options.views
Type: `String`
Default value: `undefined`

A relative path from the root of the style-guide source directory (`styleguide/src/` by default). emo-gen will treat all the `.html` files within the viewDir as static pages, building each one using Nunjucks api.

Example:

```javascript
grunt.initConfig({
    emo: {
        main: {
            options: {
                views: 'views'
            }
        }
    }
});
```

### Usage Examples

#### Default Options

```js
grunt.initConfig({
    emo: {
        main: {
            options: {
                components: [
                    'src/assets/scss/**/*.scss'
                ],
                views: 'views'
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

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
