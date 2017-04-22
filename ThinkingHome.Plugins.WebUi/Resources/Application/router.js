var lib = require('lib');

var router = lib.backbone.Router.extend({

    routes: {
        '*path': '_processRoute'
    },

    start: function () {
        lib.backbone.history.start();
    },

    setPath: function (route, args) {
        var path = route + this._formatQueryString(args);
        lib.backbone.history.navigate(path);
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
    },

    _formatQueryString: function (args) {

        if (lib._.isArray(args) && args.length) {
            return '?' + args.map(encodeURIComponent).join('/');
        }

        return '';
    }
});

module.exports = router;
