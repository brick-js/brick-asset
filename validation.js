const debug = require('debug')('brick-asset:validation');

function validateCSS(file) {
    file = file.substr(file.indexOf('/') + 1);
    return /^style((\.(css|less))|(\/.+\.(css|less)))$/.test(file);
}

function normalizeCSS(slug) {
    var origin = slug;
    //Examples slugs:
    //  simple/style.css
    //  simple/style/index.css
    //  simple/style/foo.css
    //  simple/style/foo/index.css
    //  simple/style/foo/bar.css

    var name = slug.toLowerCase().slice(0, slug.indexOf('/'));  // simple
    slug = slug.slice(slug.indexOf('/') + 1, slug.lastIndexOf('.'));
    //  style
    //  style/index
    //  style/foo
    //  style/foo/index
    //  style/foo/bar

    slug = slug.replace(/^style(\/|$)/, '');
    // 
    //  index
    //  foo
    //  foo/index
    //  foo/bar

    slug = slug.replace(/(^|\/)index$/, '');
    //  
    // 
    //  foo
    //  foo
    //  foo/bar

    var id = slug ? name + '/' + slug : name;
    //  simple
    //  simple
    //  simple/foo
    //  simple/foo
    //  simple/foo/bar

    debug(`normalizing css: ${origin} => ${id}`);
    return id;
}

function validateJS(file) {
    file = file.substr(file.indexOf('/') + 1);
    return /^client((\.js)|(\/.+\.js))$/.test(file);
}

function normalizeJS(slug) {
    var origin = slug;
    //Examples slugs:
    //  simple/client.js
    //  simple/client/index.js
    //  simple/client/foo.js
    //  simple/client/foo/index.js
    //  simple/client/foo/bar.js
    
    var name = slug.toLowerCase().slice(0, slug.indexOf('/'));  // simple
    slug = slug.slice(slug.indexOf('/') + 1, -3);
    //  client
    //  client/index
    //  client/foo
    //  client/foo/index
    //  client/foo/bar

    slug = slug.replace(/^client(\/|$)/, '');
    // 
    //  index
    //  foo
    //  foo/index
    //  foo/bar

    slug = slug.replace(/(^|\/)index$/, '');
    //  
    // 
    //  foo
    //  foo
    //  foo/bar

    var id = slug ? name + '/' + slug : name;
    //  simple
    //  simple
    //  simple/foo
    //  simple/foo
    //  simple/foo/bar

    debug(`normalizing js: ${origin} => ${id}`);
    return id;
}

exports.validateCSS = validateCSS;
exports.normalizeCSS = normalizeCSS;
exports.validateJS = validateJS;
exports.normalizeJS = normalizeJS;
