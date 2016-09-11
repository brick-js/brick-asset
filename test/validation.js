const Path = require('path');
const fs = require('../fs');
const valid = require('../validation.js');
const chai = require("chai");
const should = chai.should();

describe('validation', function() {
    it('should validate css files', function() {
        valid.validateCSS('pkg/style.less').should.equal(true);
        valid.validateCSS('pkg/style.css').should.equal(true);
        valid.validateCSS('pkg/style/foo.less').should.equal(false);
        valid.validateCSS('pkg/style.llss').should.equal(false);
    });

    it('should validate css files for windows', function() {
        valid.validateCSS('pkg\\style.less').should.equal(true);
        valid.validateCSS('pkg\\style\\index.css').should.equal(true);
        valid.validateCSS('pkg\\style\\foo\\bar.css').should.equal(false);
        valid.validateCSS('pkg\\style.llss').should.equal(false);
    });

    it('should validate js files', function() {
        valid.validateJS('pkg/client.js').should.equal(true);
        valid.validateJS('pkg/client/foo.js').should.equal(true);
        valid.validateJS('pkg/client/foo/bar.js').should.equal(true);
        valid.validateJS('pkg/client.llss').should.equal(false);
    });

    it('should validate js files for windows', function() {
        valid.validateJS('pkg\\client\\foo.js').should.equal(true);
        valid.validateJS('pkg\\client\\foo.llss').should.equal(false);
    });

    it('should normalize css files', function() {
        valid.normalizeCSS('pkg/style.less').should.equal('pkg');
        valid.normalizeCSS('pkg/style.css').should.equal('pkg');
        valid.normalizeCSS('pkg/style/index.css').should.equal('pkg');
    });

    it('should normalize css files for windows', function() {
        valid.normalizeCSS('pkg\\style.less').should.equal('pkg');
        valid.normalizeCSS('pkg\\style\\index.less').should.equal('pkg');
    });

    it('should normalize js files', function() {
        valid.normalizeJS('pkg/client.js').should.equal('pkg');
        valid.normalizeJS('pkg/client/index.js').should.equal('pkg');
        valid.normalizeJS('pkg/client/foo.js').should.equal('pkg/foo');
        valid.normalizeJS('pkg/client/foo/bar.js').should.equal('pkg/foo/bar');
        valid.normalizeJS('pkg/client/foo/bar/index.js').should.equal('pkg/foo/bar');
    });

    it('should normalize js files for windows', function() {
        valid.normalizeJS('pkg\\client\\foo.js').should.equal('pkg/foo');
        valid.normalizeJS('pkg\\client\\foo\\index.js').should.equal('pkg/foo');
    });

});
