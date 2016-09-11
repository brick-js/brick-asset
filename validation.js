const debug = require('debug')('brick-asset:validation');

function validateCSS(file) {
    //console.log('[validateCSS]', file);
    var s = isUnix(file) ? '\\/' : '\\\\';
    var pattern = `(^|${s})style(${s}index)?\.(css|less)$`;
    return RegExp(pattern).test(file);
}

function validateJS(file) {
    var s = isUnix(file) ? '\\/' : '\\\\';
    var pattern = `(^|${s})client((\.(js))|(${s}.+\.(js)))$`;
    return RegExp(pattern).test(file);
}

/*
 * @param {String} file CSS file path
 * @return {String} '/' separated id:
 * For example:
 * home/style.less       => 'home'
 * home/style/index.less => 'home'
 * style/index.less      => ''
 * style.less            => ''
 */
function normalizeCSS(file) {
    var id = file
        .replace(/\\/g, '/')        // normalize windowx
        .replace(/(\/)?style(\/index)?\.(less|css)$/, '');// remove suffix
    return id;
}

/*
 * @param {String} file JS file path
 * @return {String} '/' separated id:
 * For example:
 * home/client.js           => 'home'
 * home/client/index.js     => 'home'
 * home/client/foo.js       => 'home/foo'
 * home/client/foo/index.js => 'home/foo'
 * client/index.js          => ''
 * client/foo.js            => 'foo'
 * client.js                => ''
 */
function normalizeJS(file) {
    var id = file
        .replace(/\\/g, '/')            // normalize windowx
        .replace(/.js$/, '')            // remove suffix
        .replace('/index', '')          // remove /index
        .replace(/\/client\//, '/')     // remove style prefix
        .replace(/\/client$/, '')       // remove style prefix
        .replace(/^client(\/)?/, '');   // remove style prefix
    return id;
}

function isUnix(filepath) {
    return filepath.indexOf('/') > -1;
}

exports.validateCSS = validateCSS;
exports.normalizeCSS = normalizeCSS;
exports.validateJS = validateJS;
exports.normalizeJS = normalizeJS;
