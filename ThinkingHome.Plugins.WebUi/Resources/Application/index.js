// configure loaders
SystemJS.config({
    meta: {
        '*.json': { loader: '/vendor/js/system-json.js' }
    }
});

// configure modules & start application
SystemJS.import('/webapp/config.json')
    .then(function(config) {
        SystemJS.config(config.systemjs);
        SystemJS.import('webapp/core/app.js')
            .then(function(application) {
                window.app = new application(config.app);
                window.app.start();
            });
    });
