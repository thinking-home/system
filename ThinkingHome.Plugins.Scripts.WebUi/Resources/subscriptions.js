var lib = require('lib');
var lang = require('lang!static/scripts/web-ui/lang.json');
var layoutTemplate = require('static/scripts/web-ui/subscriptions.tpl');
var itemTemplate = '<td>{{eventAlias}}</td><td>{{scriptName}}</td>' +
    '<td><a href="#" class="js-delete-link">{{lang \'Delete\'}}</a></td>';

var SubscriptionView = lib.marionette.View.extend({
    template: lib.handlebars.compile(itemTemplate),
    templateContext: { lang: lang },
    tagName: 'tr',
    triggers: {
        'click .js-delete-link': 'subscription:delete'
    }
});

var SubscriptionListView = lib.marionette.CollectionView.extend({
    childView: SubscriptionView,
    tagName: 'tbody'
});

var LayoutView = lib.marionette.View.extend({
    template: lib.handlebars.compile(layoutTemplate),
    templateContext: { lang: lang },
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
        'click .js-btn-add-subscription': 'subscription:add'
    },
    onRender: function() {

        // script list
        lib.form.setOptions(this.ui.scriptList, this.getOption('scripts'));

        // subscriptions table
        var subscriptionList = new SubscriptionListView({
            collection: this.getOption('subscriptions'),
            onChildviewSubscriptionDelete: function(childView) {
                var id = childView.model.get('id');
                this.trigger('subscription:delete', id);
            }.bind(this)
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
        var view = this.view = new LayoutView({
            subscriptions: args[0],
            scripts: args[1]
        });

        this.listenTo(view, 'subscription:add', this.bind('addSubscription'));
        this.listenTo(view, 'subscription:delete', this.bind('deleteSubscription'));

        this.application.setContentView(view);
    },

    addSubscription: function() {
        var ui = this.view.ui;
        var scriptId = ui.scriptList.val();
        var eventAlias = ui.eventAlias.val();

        scriptId && eventAlias && lib.ajax
            .postJSON('/api/scripts/web-api/subscription/add', { scriptId: scriptId, eventAlias: eventAlias })
            .then(this.bind('updateList'))
            .catch(alert);
    },

    deleteSubscription: function(id) {
        confirm(lang.get('Subscription will be deleted. Continue?')) && lib.ajax
            .postJSON('/api/scripts/web-api/subscription/delete', { subscriptionId: id })
            .then(this.bind('updateList'))
            .catch(alert);
    },

    updateList: function() {
        var subscriptions = this.view.getOption('subscriptions');

        return lib.ajax.loadModel('/api/scripts/web-api/subscription/list', lib.backbone.Collection)
            .then(function(data) {
                subscriptions.reset(data.toJSON());
            });
    }
});

module.exports = Section;
