const fs = require('./fs');
const _ = require('lodash');
const debug = require('debug')('brick-asset:asset');
const path = require('path');
const loader = fs.readSync(path.resolve(__dirname, 'common.js'));
const validation = require('./validation.js');
const Processor = require('./processor');
const assert = require('assert');
const BPromise = require('bluebird');

var asset = {
    src: function(dir) {
        this.root = path.resolve(dir);
        return fs.subdirs(this.root)
            .map(dirname => this.parse(dirname));
    },
    parse: function(dirname) {
        //console.log('[asset.parse()]', dirname);
        var dirpath = path.resolve(this.root, dirname);
        var paths = [dirpath],
            css = [],
            js = [];
        //console.log('[asset.parse()] paths', paths);
        return fs.eachDeep(paths, p => {
                if (/.+\.(css|less)$/.test(p) && (p = this.parseCSS(p))) {
                    //console.log('[asset.parse()] pushing css', p);
                    css.push(p);
                } else if (/.+\.(js)$/.test(p) && (p = this.parseJS(p))) {
                    //console.log('pushing js', p);
                    js.push(p);
                }
            })
            .then(x => {
                this.cache[dirname] = {
                    css, js
                };
            });
    },
    parseCSS: function(file) {
        var slug = file.substr(this.root.length + 1);
        //console.log('[parseCSS]', file, slug);
        return validation.validateCSS(slug) && {
            id: validation.normalizeCSS(slug),
            ext: path.extname(slug),
            path: file
        };
    },
    parseJS: function(file) {
        var slug = file.substr(this.root.length + 1);
        return validation.validateJS(slug) && {
            id: validation.normalizeJS(slug),
            ext: path.extname(slug),
            path: file
        };
    },
    css: function() {
        var fileArrays = _.values(this.cache).map(obj => obj.css);
        var files = _.union.apply(_, fileArrays);

        //console.log('[asset.css()]', this.cache);
        //console.log('[asset.css()]', fileArrays);
        //console.log('[asset.css()]', files);

        return BPromise.resolve(files)
            .map(mod => {
                var p = Processor.get(mod.ext);
                assert(p, `processor for ${mod.ext} not found`);

                var prefix = mod.id ? '.brk-' + mod.id : '';
                //console.log('[asset.css().Array.map()]', mod.path, prefix, prefix.length);
                return p.render(mod.path, prefix);
            })
            .then(combine);
    },
    js: function() {
        var fileArrays = _.values(this.cache).map(obj => obj.js);
        var files = _.union.apply(_, fileArrays);

        return BPromise.resolve(files)
            // render
            .map(mod => {
                var p = Processor.get(mod.ext);
                assert(p, `processor for ${mod.ext} not found`);

                return p.render(mod.path, mod.id).then(src =>
                    _.set(mod, 'src', src));
            })
            // isolate
            .map(mod => mod.id ? 
                 `window.brick.register("${mod.id}", ` +
                `function(require, exports, module){\n${mod.src}});` :
                mod.src)
            .then(files => [loader].concat(files))
            .then(combine);
    }
};

function combine(files) {
    return files.length ?
        files.reduce((prev, next) => prev + '\n' + next) : '';
}

module.exports = config => {
    var obj = Object.create(asset);
    obj.cache = {};
    return obj;
};
