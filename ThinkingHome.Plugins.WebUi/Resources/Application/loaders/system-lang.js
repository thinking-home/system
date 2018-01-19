var lib = require('lib');

exports.instantiate = function (load) {
    var data = JSON.parse(load.source);
    return new lib.common.StringLocalizer(data);
};
