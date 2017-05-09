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
    regions: {
        subscriptions: {
            el: '.js-table-subscriptions tbody',
            replaceElement: true
        }
    },

    onRender: function() {
        var subscriptionList = new SubscriptionListView({
            collection: this.getOption('subscriptions')
        });

        this.showChildView('subscriptions', subscriptionList);
    }
});


var Section = lib.common.AppSection.extend({
    start: function() {
        return lib.common
            .loadModel('/api/scripts/web-api/subscription/list', lib.backbone.Collection)
            .then(this.bind('displayPage'));
    },

    displayPage: function(subscriptions) {
        var view = new LayoutView({
            subscriptions: subscriptions
        });

        this.application.setContentView(view);
    }
});

module.exports = Section;
