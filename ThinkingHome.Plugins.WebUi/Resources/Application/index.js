// configure loaders
SystemJS.config({
    map: {
        'systemjs-babel-build': '/vendor/js/systemjs-babel-browser.js'
    },
    transpiler: '/vendor/js/system-babel.js',

    meta: {
        '*.json': { loader: '/vendor/js/system-json.js' },
        '*.tpl': { loader: '/vendor/js/system-text.js' },
        '*.jsx': {
            loader: '/vendor/js/system-babel.js',
            babelOptions: { react: true }
        }
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
