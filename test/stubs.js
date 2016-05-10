const path = require('path');
const BPromise = require('bluebird');
const _ = require('lodash');

exports.stylus = {
    render: function(path, rootClass){
        return BPromise.resolve(path + rootClass);
    }
};

var browser = {
    window: { },
    document: {
        addEventListener: function(name, cb) {
            this.events[name] = cb;
        },
        events: {},
        load: function(){
            this.readyState = 'complete';

            var cb = this.events.DOMContentLoaded;
            if(typeof cb === 'function') cb();

            cb = this.events.onreadystatechange;
            if(typeof cb === 'function') cb();
        },
        create: function(className){
            this.elements.push({ className });
        },
        elements: [],
        querySelectorAll: function(){
            return this.elements;
        }
    }
};
browser.window.document = browser.document;

exports.browser = browser;

var ie8 = _.cloneDeep(browser);
ie8.document.attachEvent = ie8.document.addEventListener;
delete ie8.document.addEventListener;

exports.ie8 = ie8;

