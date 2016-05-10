const Asset = require('./asset');
const Processor = require('./processor');
const jsProcessor = require('./processor/js.js');
const cssProcessor = require('./processor/css.js');
const less = require('brick-less');
const pkg = require('./package.json');
const process = require('process');
const path = require('path');
const fs = require('./fs.js');

var asset = Asset();

function src(root) {
    Processor.clear();
    Processor.register('.js', jsProcessor, root);
    Processor.register('.css', cssProcessor, root);
    Processor.register('.less', less(), root);

    return asset.src(root);
}

function css() {
    return asset.css();
}

function js() {
    return asset.js();
}

exports.src = src;
exports.css = css;
exports.js = js;
