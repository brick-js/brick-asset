const Path = require('path');
const fs = require('../fs');
const loader = fs.readSync(Path.resolve(__dirname, '../common.js'));
const asset = require('..');
const chai = require("chai");
const should = chai.should();

describe('js', function() {
    var js;

    before(function(done) {
        asset.src('test/cases')
            .then(x => asset.js())
            .then(function(src) {
                js = src.substr(loader.length).replace(/\s/g, '');
                done();
            });
    });

    it('should handle single JS file', function() {
        var result = 'window.brick.register("file",' +
            'function(require,exports,module){a});';
        return js.should.contain(result);
    });

    it('should handle index.js of client', function() {
        var index = 'window.brick.register("folder",' +
            'function(require,exports,module){a});';
        return js.should.contain(index);
    });

    it('should handle other JS of client', function() {
        var foo = 'window.brick.register("folder/foo",' +
            'function(require,exports,module){foo});';
        return js.should.contain(foo);
    });

    it('should handle index.js of client subdir', function() {
        var bar = 'window.brick.register("folder/bar",' +
            'function(require,exports,module){b});';
        return js.should.contain(bar);
    });

    it('should handle other JS of client subdir', function() {
        var foo = 'window.brick.register("folder/bar/foo",' +
            'function(require,exports,module){foo});';
        return js.should.contain(foo);
    });
});

