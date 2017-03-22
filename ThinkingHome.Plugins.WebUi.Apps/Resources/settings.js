var appsSection = require('/webapp/apps.js');

module.exports = appsSection.extend({
    title: 'System settings',
    url: '/api/webui/apps/system'
});
