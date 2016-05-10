var path = require('path');
var debug = require('debug')('brick-asset:fs');
var BPromise = require("bluebird");
var fs = BPromise.promisifyAll(require("fs"));
var fs = require('fs');
var path = require('path');
var FindFiles = require("node-find-files");

function subdirs(dir) {
    return fs
        .readdirAsync(dir)
        .filter(fileName =>
            fs.statAsync(path.resolve(dir, fileName))
            .then(stat => stat.isDirectory()));
}

function each(dir, cb, done, deep) {
    fs.readdir(dir, function(err, list) {
        if (err) return done(err);
        var pending = list.length;
        if (!pending) return done();
        list.forEach(function(file) {
            var filepath = path.resolve(dir, file);
            fs.stat(filepath, function(err, stat) {
                if (err || !stat) return done(err);
                if (stat.isDirectory()) {
                    if (deep) {
                        each(filepath, cb, function(err, res) {
                            if (!--pending) done();
                        }, deep);
                    } 
                    else if (!--pending) done();
                } else {
                    cb(path.resolve(dir, file));
                    if (!--pending) done();
                }
            });
        });
    });
}

function eachAsync(dir, cb, deep){
    return new BPromise((resolve, reject) => {
        each(dir, cb, e => e ? reject(e) : resolve(), deep);
    });
}

function subdirsSync(dir) {
    return fs
        .readdirSync(dir)
        .filter(fileName =>
            fs.statSync(path.resolve(dir, fileName)).isDirectory());
}

function fileExist(p) {
    return fs.statAsync(p).then(stats => {
        if (stats.isFile()) return stats;
        throw 'not file';
    });
}

function dirExist(p) {
    return fs.statAsync(p).then(stats => {
        if (stats.isDirectory()) return stats;
        throw 'not directory';
    });
}

module.exports = {
    read: path => fs.readFileAsync(path, 'utf8'),
    write: fs.writeFileAsync.bind(fs),
    readSync: path => fs.readFileSync(path, 'utf8'),
    stat: fs.statAsync.bind(fs),
    subdirs,
    subdirsSync,
    fileExist,
    dirExist,
    each: (dirs, cb) => {
        if (!(dirs instanceof Array)) dirs = [dirs];
        var ps = dirs.map(dir => eachAsync(dir, cb));
        return BPromise.all(ps);
    },
    eachDeep: (dirs, cb) => {
        if (!(dirs instanceof Array)) dirs = [dirs];
        var ps = dirs.map(dir => eachAsync(dir, cb, true));
        return BPromise.all(ps);
    }
};
