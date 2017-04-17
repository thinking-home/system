var appsSection = require('/static/webui/apps.js');

module.exports = appsSection.extend({
    title: 'System settings',
    url: '/api/webui/apps/system'
});
