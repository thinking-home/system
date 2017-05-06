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
            el: '.js-subscriptions-list',
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
        var view = new LayoutView({
            subscriptions: new lib.backbone.Collection([
                {
                    "id":"b308f0e7-7f0c-4599-ba89-65cff22ae043",
                    "scriptId":"a634a269-d250-40bc-a9ca-0e76b19d84b5",
                    "scriptName":"debug-tool",
                    "eventAlias":"mimi"
                },
                {
                    "id":"7db0be77-be8b-44e8-8212-0b882e886ecb",
                    "scriptId":"a634a269-d250-40bc-a9ca-0e76b19d84b5",
                    "scriptName":"debug-tool",
                    "eventAlias":"skdjsdhvsdvb"
                }
            ])
        });

        this.application.setContentView(view);
    }
});

module.exports = Section;
