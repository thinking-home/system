var lib = require('lib');

var layoutTemplate = require('static/uniui/settings/web-ui/dashboard.tpl');
var itemTemplate = require('static/uniui/settings/web-ui/dashboard-item.tpl');

//# region models

var PanelModel = lib.backbone.Model.extend();

var PanelCollection = lib.backbone.Collection.extend({
    model: PanelModel
});

var DashboardlModel = lib.backbone.Model.extend({
    initialize: function () {
        var panels = this.get('panels');
        if (panels) {
            this.set('panels', new PanelCollection(panels));
        }
    },
    parse: function (response) {

        if (response.panels)

        if (lib._.has(response, "panels")) {
            this.panels = new PanelCollection(
                response.panels,
                {parse: true});

            delete response.panels;
        }
        return response;
    },
    toJSON: function () {
        var json = lib._.clone(this.attributes);
        json.panels = this.panels.toJSON();
        return json;
    }
});

//#endregion

//#region views

var ItemView = lib.marionette.View.extend({
    template: lib.handlebars.compile(itemTemplate),
    //templateContext: { lang: lang },
    triggers: {}
});

var ListView = lib.marionette.CollectionView.extend({
    childView: ItemView
});

var LayoutView = lib.marionette.View.extend({
    template: lib.handlebars.compile(layoutTemplate),
    // templateContext: { lang: lang },
    regions: {
        list: '.js-list'
    },
    triggers: {}
});

//#endregion

var Section = lib.common.AppSection.extend({
    start: function (dashboardId) {
        this.view = new LayoutView();
        this.application.setContentView(this.view);

        return this.loadPanelList(dashboardId);
    },

    loadPanelList: function (dashboardId) {
        return lib.ajax
            .loadModel('/api/uniui/settings/web-api/panel/list', {id: dashboardId}, DashboardlModel)
            .then(this.bind('displayList'));
    },

    displayList: function (model) {
        var listView = new ListView({
            collection: model.get('panels')
        });

        this.view.showChildView('list', listView);
    }
});

module.exports = Section;