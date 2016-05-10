const _ = require('lodash');
const changeCase = require('change-case');
const debug = require('debug')('brick:module:processor');
const assert = require('assert');

var processors = {};

function register(ext, processor, root){
    assert(processor, `processor must not be null`);
    assert(typeof processor.render === 'function', 
        `processor.render for ${ext} must be a function`);
    processor.root = root;
    return processors[ext] = processor;
}

exports.register = register;
exports.clear = x => processors = {};
exports.get = ext => processors[ext];

