var lib = require('lib');
var tplLayout = require('webapp/core/layout.tpl');

var Layout = function() {
    console.log('l-new');

    this.render = function() { console.log(tplLayout); };
    this.destroy = function() { console.log('l-destroy'); };
};

module.exports = Layout;