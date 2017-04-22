// configure loaders
SystemJS.config({
    meta: {
        '*.json': { loader: '/vendor/js/system-json.js' },
        '*.tpl': { loader: '/vendor/js/system-text.js' }
    }
});

// configure modules & start application
SystemJS.import('/webapp/config.json')
    .then(function(config) {
        SystemJS.config(config.systemjs);
        SystemJS.import('static/web-ui/application.js')
            .then(function(application) {
                window.app = new application(config.app);
                window.app.start();
            });
    });
