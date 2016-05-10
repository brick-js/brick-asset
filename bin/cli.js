#!/usr/bin/env node

const Asset = require('../asset');
const Processor = require('../processor');
const jsProcessor = require('../processor/js.js');
const cssProcessor = require('../processor/css.js');
const program = require('commander');
const pkg = require('../package.json');
const process = require('process');
const path = require('path');
const fs = require('../fs.js');

var validTargets = ['all', 'css', 'js'];
var target = null;
var root = null;

program
    .version(pkg.version)
    .usage(`(all|js|css) [options]`)
    .option('-o, --output [file/dir]', 'Write output to file')
    .option('-r, --root [dir]', 
        'Root directory for your bricks [./bricks]', './bricks')
    .arguments('[target]')
    .action(function(t) { target = t; })
    .parse(process.argv);


if (!target || validTargets.indexOf(target) == -1) program.help();

var asset = Asset();
var promise = src(program.root).catch(e => {
    console.error(e);
    process.exit(1);
});
var file = program.output;

if (target === 'css') {

    file = file || './public/site.css';
    file = path.resolve(file);

    promise.then(css).then(src => output(file, src));
} else if (target === 'js') {

    file = file || './public/site.js';
    file = path.resolve(file);

    promise.then(js).then(src => output(file, src));
}else{

    file = file || './public';
    var cssFile = path.resolve(file, 'site.css');
    var jsFile = path.resolve(file, 'site.js');

    promise.then(js).then(src => output(cssFile, src));
    promise.then(css).then(src => output(jsFile, src));
}

function output(file, src) {
    return fs.write(file, src)
        .then(x => console.log(`write output to ${file}`))
        .catch(console.error);
}

function src(root) {
    Processor.clear();
    Processor.register('.js', jsProcessor, root);
    Processor.register('.css', cssProcessor, root);

    return asset.src(root);
}

function css() {
    return asset.css();
}

function js() {
    return asset.js();
}
