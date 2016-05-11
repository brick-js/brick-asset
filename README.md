# Asset Generator for Brick.JS

[![NPM version](https://img.shields.io/npm/v/brick-asset.svg?style=flat)](https://www.npmjs.org/package/brick-asset)
[![Build Status](https://travis-ci.org/brick-js/brick-asset.svg?branch=master)](https://travis-ci.org/brick-js/brick-asset)
[![Coverage Status](https://coveralls.io/repos/github/brick-js/brick-asset/badge.svg?branch=master)](https://coveralls.io/github/brick-js/brick-asset?branch=master)
[![Dependency manager](https://david-dm.org/brick-js/brick-asset.png)](https://david-dm.org/brick-js/brick-asset)

This article explains how to use `brick-asset` as a command line tool
(and as a NPM package).
For information about CSS Processors called by `brick-asset`, see:

* [brick-js/brick-less][brick-less]: LESS pre-processor for brick.js.
* brick-sass? All kind of contributions are wellcomed.

## Command Line Tool

### Install

```bash
npm install -g brick-asset
```

### Usage

Generate `"./public/site.js"` and `"./public/site.css"`:

```bash
brick-asset all
```

Only generate `./public/site.css`:

```bash
brick-asset css
```

Specify Brick.JS Module Root (default to `./bricks/`):

```bash
brick-asset all --root ./my-brick-modules
```

Specify output location:

```bash
# ./static/site.js, ./static/site.css
brick-asset all --output ./static

# ./static/js/main.js
brick-asset js --output ./static/js/main.js
```

For more details, see:

```bash
brick-asset --help
```

## Use as Dependency

### Usage

```javascript
var asset = require('brick-asset');
var promise = asset.src('./bricks');
promise
  .then(function(){
    asset.js().then(src => console.log(src));
    asset.css().then(src => console.log(src));
  });
```

### .src()

`.src()` load *bricks* in the specified directory. 

Returns a promise which will be resolved as brick Array.

### .js()

`.js()` generates the JS for all the *bricks* with a CommonJS loader.

Returns a promise which will be resolved as a String of JavaScript source.

### .css()

`.css()` generates the modularized CSS for all the *bricks*.

Returns a promise which will be resolved as a String of CSS source.

## Gulp Task

```javascript
var fs = require('bluebird').promisifyAll(require("fs"));
var asset = require('brick-asset');

gulp.task('asset', function() {
    return asset.src('./bricks').then(function(){
        return BPromise.all([
            asset.css().then(src => fs.writeFileAsync('./public/site.css', src)),
            asset.js().then(src => fs.writeFileAsync('./public/site.js', src))
        ]);
    });
});
```

[brick-less]: https://github.com/brick-js/brick-less

