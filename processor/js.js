// built-in js processor
const fs = require('../fs');

var processor = {
    render: path => fs.read(path)
};

module.exports = processor;

