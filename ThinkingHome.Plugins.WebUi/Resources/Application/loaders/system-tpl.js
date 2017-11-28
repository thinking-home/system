var lib = require('lib');

exports.translate = function (load) {
    var precompiled = lib.handlebars.precompile(load.source);

    load.metadata.format = "amd";

    return 'define([\'lib\'], function (lib) {\n    return lib.handlebars.template(' + precompiled + ');\n});';
};
