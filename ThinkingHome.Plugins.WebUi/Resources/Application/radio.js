var lib = require('lib');

var Radio = lib.common.ApplicationBlock.extend({
    msgEventName: 'serverMessage',
    reconnectionTimeout: 7000,

    initialize: function () {
        this.connection = new lib.signalrClient.HubConnection('/mq');

        this.connection.on(this.msgEventName, function (data) {
            console.log(data);
        });

        // this.connection = lib.$.hubConnection();
        // this.connection.disconnected(this.bind('onDisconnect'));
        //
        // this.hub = this.connection.createHubProxy(this.msgHubName);
        // this.hub.on(this.msgEventName, this.bind('onMessage'));
    },

    start: function () {
        this.connection.start();
    },
    // onBeforeDestroy: function () {
    //     var connection = this.connection;
    //     delete this.connection;
    //
    //     connection && connection.stop();
    // },
    // onDisconnect: function () {
    //     this.connection && setTimeout(this.bind(function () {
    //         var connection = this.connection;
    //         connection && connection.start();
    //     }), this.reconnectionTimeout);
    // },
    // onMessage: function (message) {
    //     this.trigger(message.channel, message);
    // },
    sendMessage: function (channel, data) {
        this.connection.invoke(this.msgEventName, channel, data);
    }
});

module.exports = Radio;
