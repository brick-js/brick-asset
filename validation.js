const debug = require('debug')('brick-asset:validation');

function validateCSS(file) {
    var s = isUnix(file) ? '\\/' : '\\\\';
    var pattern = `^([^/\\\\]+)${s}style((\.(css|less))|(${s}.+\.(css|less)))$`;
    return RegExp(pattern).test(file);
}

function validateJS(file) {
    var s = isUnix(file) ? '\\/' : '\\\\';
    var pattern = `^([^/\\\\]+)${s}client((\.(js))|(${s}.+\.(js)))$`;
    return RegExp(pattern).test(file);
}

function normalizeCSS(file) {
    var pattern, m, id;
    var s = isUnix(file) ? '\\/' : '\\\\';

    if ((m = file.match(
            RegExp(`^([^/\\\\]+)${s}style\.(css|less)`))) ||
        (m = file.match(
            RegExp(`^([^/\\\\]+)${s}style${s}index\.(css|less)`)))) {
        id = `${m[1]}`;
    } else if ((m = file.match(
            RegExp(`^([^/\\\\]+)${s}style${s}(.+)${s}index\.(css|less)`))) ||
        (m = file.match(
            RegExp(`^([^/\\\\]+)${s}style${s}(.+)\.(css|less)`)))) {
        id = m[1] + '/' + m[2].replace(RegExp(s, 'g'), '/');
    } else {
        throw (new Error(`filename ${file} not valid`));
    }

    debug(`normalizing css: ${file} => ${id}`);
    return id;
}

function normalizeJS(file) {
    var pattern, m, id;
    var s = isUnix(file) ? '\\/' : '\\\\';

    if ((m = file.match(
            RegExp(`^([^/\\\\]+)${s}client\.(js)`))) ||
        (m = file.match(
            RegExp(`^([^/\\\\]+)${s}client${s}index\.(js)`)))) {

        id = `${m[1]}`;
    } else if ((m = file.match(
            RegExp(`^([^/\\\\]+)${s}client${s}(.+)${s}index\.(js)`))) ||
        (m = file.match(
            RegExp(`^([^/\\\\]+)${s}client${s}(.+)\.(js)`)))) {
        id = m[1] + '/' + m[2].replace(RegExp(s, 'g'), '/');
    } else {
        throw (new Error(`filename ${file} not valid`));
    }

    debug(`normalizing js: ${file} => ${id}`);
    return id;
}

function isUnix(filepath) {
    return filepath.indexOf('/') > -1;
}

exports.validateCSS = validateCSS;
exports.normalizeCSS = normalizeCSS;
exports.validateJS = validateJS;
exports.normalizeJS = normalizeJS;
