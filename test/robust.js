const asset = require('..');
var chai = require("chai");
var should = chai.should();

describe('robust', function() {
    it('should src with out error', function() {
        (function(){
            asset.src('test/cases');
        }).should.not.throw();
    });
    it('should handle null JS', function() {
        (function(){
            asset.src('test/cases').then(x => asset.js(x=>x));
        }).should.not.throw();
    });
    it('should handle null CSS', function() {
        (function(){
            asset.src('test/cases').then(x => asset.css(x=>x));
        }).should.not.throw();
    });
    it('should accept null callback', function() {
        (function(){
            asset.src('test/cases').then(x => asset.css());
        }).should.not.throw();
    });
});
