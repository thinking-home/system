var lib = require('lib');

var router = lib.backbone.Router.extend({

    routes: {
        '*path': '_processRoute'
    },

    start: function () {
        lib.backbone.history.start();
    },

    _processRoute: function (route, queryString) {
        var args = this._parseQueryString(queryString);
        this.trigger('navigate', route, args);
    },

    _parseQueryString: function (queryString) {

        if (lib._.isString(queryString)) {
            return queryString.split('/').map(decodeURIComponent);
        }

        return [];
    }
});

module.exports = router;
