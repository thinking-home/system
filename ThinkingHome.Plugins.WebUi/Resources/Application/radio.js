var lib = require('lib');

var Radio = lib.common.ApplicationBlock.extend({
    initialize: function () {
        this.route = '/' + this.getOption('route');
        this.clientMethod = this.getOption('clientMethod');
        this.serverMethod = this.getOption('serverMethod');
        this.reconnectionTimeout = this.getOption('reconnectionTimeout');
    },

    start: function () {
        this.openConnection();
    },

    onBeforeDestroy: function () {
        var connection = this.connection;
        delete this.connection;

        connection && connection.stop();
    },

    openConnection: function () {
        var connection = this.connection = new lib.signalrClient.HubConnection(this.route);

        connection.on(this.clientMethod, this.bind('onMessage'));
        connection.onClosed = this.bind('onDisconnect');

        connection.start().catch(this.bind('onDisconnect'));
    },

    onDisconnect: function () {
        if (this.connection) {
            setTimeout(this.bind("openConnection"), this.reconnectionTimeout);
        }
    },

    onMessage: function (message) {
        console.log(message);
        this.trigger(message.channel, message);
    },

    sendMessage: function (channel, data) {
        this.connection && this.connection.invoke(this.serverMethod, channel, data);
    }
});

module.exports = Radio;
