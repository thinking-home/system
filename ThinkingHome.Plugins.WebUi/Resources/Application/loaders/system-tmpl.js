var lib = require('lib');

exports.instantiate = function (load) {
    return lib.handlebars.compile(load.source)
};
