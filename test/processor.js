const asset = require('..');
const chai = require("chai");
const should = chai.should();
const Path = require('path');
const stubs = require('./stubs');
const processor = require('../processor');
const assert = require('assert');

describe('processor', function() {
    it('should not accept a string', function() {
        (function() {
            processor.register('stylus', 'not valid');
        }).should.throw();
    });
    it('should accept a function', function() {
        (function() {
            processor.register('stylus', stubs.stylus);
        }).should.not.throw();
    });
});
