var lib = require('lib');

var Layout = function() {
    console.log('l-new');

    this.render = function() { console.log('l-render'); };
    this.destroy = function() { console.log('l-destroy'); };
};

module.exports = Layout;