var lib = require('lib');
var layoutTemplate = require('static/scripts/web-ui/subscriptions.tpl');
var itemTemplate = '<td>{{eventAlias}}</td><td>{{scriptName}}</td>' +
    '<td><a href="#" class="js-detach-link">detach</a></td>';

var SubscriptionView = lib.marionette.View.extend({
    template: lib.handlebars.compile(itemTemplate),
    tagName: 'tr',
    triggers: {
        'click .js-detach-link': 'detach'
    }
});

var SubscriptionListView = lib.marionette.CollectionView.extend({
    childView: SubscriptionView,
    tagName: 'tbody'
});

var LayoutView = lib.marionette.View.extend({
    template: lib.handlebars.compile(layoutTemplate),
    ui: {
        eventAlias: '.js-event-alias',
        scriptList: '.js-script-list'
    },
    regions: {
        subscriptions: {
            el: '.js-table-subscriptions tbody',
            replaceElement: true
        }
    },
    triggers: { 
        'click .js-btn-add-subscription': 'subscriptions:add' 
    },
    onRender: function() {

        // script list
        lib.form.setOptions(this.ui.scriptList, this.getOption('scripts'));

        // subscriptions table
        var subscriptionList = new SubscriptionListView({
            collection: this.getOption('subscriptions')
        });

        this.showChildView('subscriptions', subscriptionList);
    }
});


var Section = lib.common.AppSection.extend({
    start: function() {
        return Promise.all([
                lib.ajax.loadModel('/api/scripts/web-api/subscription/list', lib.backbone.Collection),
                lib.ajax.loadModel('/api/scripts/web-api/list', lib.backbone.Collection)])
            .then(this.bind('displayPage'));
    },

    displayPage: function(args) {
        var view = new LayoutView({
            subscriptions: args[0],
            scripts: args[1]
        });

        this.listenTo(view, 'subscriptions:add', this.bind('addSubscription', view));

        this.application.setContentView(view);
    },

    addSubscription: function(view) {
        var scriptId = view.ui.scriptList.val();
        var eventAlias = view.ui.eventAlias.val();

        scriptId && eventAlias && lib.ajax
            .postJSON('/api/scripts/web-api/subscription/add', { scriptId: scriptId, eventAlias: eventAlias })
            .then(this.bind('updateList'), alert);
    },

    updateList: function() {
        alert('Subscriptions has been added.');
    }
});

module.exports = Section;
