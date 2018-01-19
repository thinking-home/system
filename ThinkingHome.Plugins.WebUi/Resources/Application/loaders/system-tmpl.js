var lib = require('lib');
var templates = require('/dynamic/web-ui/templates.json');
var templateCache = {};

Object.keys(templates).forEach(function (relativePath) {
    var absolutePath = SystemJS.resolveSync(relativePath);
    templateCache[absolutePath] = templates[relativePath];
});

exports.fetch = function (meta, fetch) {
    return templateCache[meta.address] || fetch(meta);
};

exports.instantiate = function (load) {
    return lib.handlebars.compile(load.source)
};
