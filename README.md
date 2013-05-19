# grunt-cortex-validate

> Validate important properties of package.json

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-cortex-validate --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-cortex-validate');
```

## The "cortex_validate" task

### Overview
In your project's Gruntfile, add a section named `cortex_validate` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  cortex_validate: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
})
```

### Options

#### options.pkg
Type: `String`

Default value: `'package.json'`

The file path of the package.json to be checked

#### options.npmServer
Type: `String`

Default value: `'http://registery.npmjs.org'`

Npm server location. It will be usefull if you use your self-built npm server.

#### options.exportFile
Type: `String`

Default value: `undefined`

"Cortex_validate" will save the current exact version of each dependency to `options.exportFile`


### Usage Examples

```js
grunt.initConfig({
  cortex_validate: {
    options: {
      pkg: 'package.json',
      npmServer: 'http://registery.yourdomain.com',
      exportFile: 'exactDependencies.json'
    }
  },
})
```