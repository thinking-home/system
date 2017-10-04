var lib = require('lib');

var Radio = lib.common.ApplicationBlock.extend({
    msgHubUrl: '/mq',
    msgEventName: 'serverMessage',
    reconnectionTimeout: 7000,

    // initialize: function () {
    // },

    start: function () {
        this.openConnection();
    },

    onBeforeDestroy: function () {
        var connection = this.connection;
        delete this.connection;

        connection && connection.stop();
    },

    openConnection: function () {
        var connection = this.connection = new lib.signalrClient.HubConnection(this.msgHubUrl);

        connection.on(this.msgEventName, this.bind('onMessage'));
        connection.onClosed = this.bind('onDisconnect');

        connection.start().catch(this.bind('onDisconnect'));
    },

    onDisconnect: function () {
        if (this.connection) {
            setTimeout(this.bind("openConnection"), this.reconnectionTimeout);
        }
    },

    onMessage: function (message) {
        this.trigger(message.channel, message);
    },

    sendMessage: function (channel, data) {
        this.connection && this.connection.invoke(this.msgEventName, channel, data);
    }
});

module.exports = Radio;
