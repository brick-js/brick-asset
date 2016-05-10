const Path = require('path');
const fs = require('../fs');
const asset = require('..');
var chai = require("chai");
var should = chai.should();

describe('css', function() {
    var css;
    before(function(done) {
        asset.src('test/cases')
            .then(x => asset.css())
            .then(function(src) {
                css = src
                    .replace(/[\n\t]/g, '')
                    .replace(/:\s*/g, ':')
                    .replace(/\s*{\s*/g, '{');
                done();
            });
    });

    it('should handle style.css', function() {
        var result = '.brk-file{color:red;}';
        return css.should.contain(result);
    });

    it('should handle index.css of style/', function() {
        var result = '.brk-folder{color:red;}';
        return css.should.contain(result);
    });

    it('should handle other CSS in style/', function() {
        var result = '.brk-folder .foo{color:red;}';
        return css.should.contain(result);
    });

    it('should handle index.css of style/bar/', function() {
        var result = '.brk-folder .bar{color:red;}';
        return css.should.contain(result);
    });

    it('should handle other CSS in style/bar/', function() {
        var result = '.brk-folder .bar .foo{color:red;}';
        return css.should.contain(result);
    });
});
