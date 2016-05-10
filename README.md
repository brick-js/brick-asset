# Asset Generator for Brick.JS

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

```javascript
var asset = require('brick-asset');
var promise = asset.src('./bricks');
promise
  .then(function(){
    asset.js().then(src => console.log(src));
    asset.css().then(src => console.log(src));
  });
```

