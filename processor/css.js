// built-in css processor
const less = require('less');
const BPromise = require('bluebird');
const fs = require('../fs');
const debug = require('debug')('brick-asset:processor:css');

var processor = {
    render: (path, rootClass) => {
        //console.log(rootClass, rootClass.length);
        function compile(src) {
            return new BPromise((resolve, reject) => {
                less.render(src, (e, output) => {
                    //console.log('[processor/ss.render.compile()]', src, output, '\n');
                    return e ? reject(parseError(e)) : resolve(output.css);
                });
            });

            function parseError(e){
                return {
                    message: e.message,
                    stack: JSON.stringify(e, null, 4)
                };
            }
        }
        //console.log('[processor/css.render()]', rootClass, '\n');
        return fs.read(path)
            .then(src => rootClass ? `${rootClass}{\n${src}\n}` : src)
            .then(compile);
    }
};

module.exports = processor;
