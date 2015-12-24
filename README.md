# grunt-emo

> A style-guide generator that uses [Swig.js](http://paularmstrong.github.io/swig/)

Emo is a tool that scrapes documention from your source files which it then uses to generate a style-guide. Emo is capable of gathering documention from, essentially, any type of file, which allows you to easily document your JavaScript, HTML, or whatever other type of component that you'd like documented.

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
                path: { ... },
                copy: {
                    'assets/css/modern.css': 'web/assets/css/modern.css'
                }
            },
            files: [
                {
                    expand: true,
                    cwd: '',
                    src: [
                        'assets/scss/**/*.scss',
                        'assets/scss/**/*.less',
                        'assets/css/**/*.css'
                    ]
                }
            ]
        }
    }
});
```

### Options

#### options.path
Type: `Object`
Default value: `{ src: '_styleguide/', dest: 'docs/styleguide/' }`

Paths used by the style-guide generator

#### options.path.src
Type: `String`
Default value: `_styleguide/`

The location the styleguide source code is to be placed. Must include a trailing slash.

#### options.path.dest
Type: `String`
Default value: `docs/styleguide/`

The location the styleguide will be built to. Must include a trailing slash.

#### options.copy
Type: `Object`
Default value: `undefined`

An object containing assets that should be copied over to the style-guide destination folder.

Note the example below. The right hand assignment is the path to the asset that should be copied; the left hand assignment is the path to where the asset should be copied to within the style-guide destination folder.

```js
grunt.initConfig({
    emo: {
        main: {
            options: {
                copy: {
                    'assets/css/modern.css': 'web/assets/css/modern.css'
                }
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
                copy: {
                    'assets/css/modern.css': 'web/assets/css/modern.css'
                }
            },
            files: [
                {
                    expand: true,
                    cwd: '',
                    src: [
                        'assets/scss/**/*.scss'
                    ]
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
                    src: 'some/path/',
                    dest: 'styleguide/'
                },
                copy: {
                    'assets/css/modern.css': 'web/assets/css/modern.css'
                }
            },
            files: [
                {
                    expand: true,
                    cwd: '',
                    src: [
                        'assets/scss/**/*.scss'
                    ]
                }
            ]
        }
    }
});
```

## Documentation Syntax

Emo searches for name/value combinations within your source files. Note that the all values are parsed as markdown. Name/value combinations are expected to take the following format.

```scss

/*

    `Name: Btn`

    `Category: Btn`

    `Description: <button>I'm a button</button>`

*/

.btn {
    color: blue;
}

```

Specifically, each name/pair value is expected to be enclosed within `` markings. As components can be lengthy, it's not always ideal to inline HTML in your CSS/SCSS/LESS files. As such, emo allows you to load documentation from markdown files.

```scss

/*

    `Name: Btn`

    `Category: Btn`

    `Description: relative/path/to/markdown-file.md`

*/

.btn {
    color: blue;
}

```

As previously mentioned, emo can accept any number of name/value combinations, though it demands that name, category and description are used. Each name/value combinations is attached available within the generated Swig templates via the `component` global. Use name/value combinations as you wish.

```scss

/*

    `Name: Btn`

    `Category: Btn`

    `Version: 1.0.0`

    `Author: Michael Jordan`

    `Description: relative/path/to/markdown-file.md`

*/

.btn {
    color: blue;
}

```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
