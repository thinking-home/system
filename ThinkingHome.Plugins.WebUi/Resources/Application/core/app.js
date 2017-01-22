define(
    ['lib'],
    function(lib) {

        var homeApplication = lib.marionette.Application.extend({
            initialize: function(options) {
                console.log('init');
            },
            onStart: function() {
                console.log('start');
            },
            onBeforeDestroy: function() {
                console.log('destroy');
            }
        });

        return homeApplication;
    });
