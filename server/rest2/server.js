// *******************************************************
// expressjs template
//
// assumes: npm install express
// defaults to jade engine, install others as needed
//
// assumes these subfolders:
//   public/
//   public/javascripts/
//   public/stylesheets/
//   views/
//
var express             = require('express');
var app                 = express();
var AccountHandler      = require('./handlers/AccountHandler');
var ShoppingListHandler = require('./handlers/ShoppingListHandler');
var routes              = require('./Routes');
var fs                  = require('fs');
 
var expressLogFile = fs.createWriteStream('./logs/express.log', {flags: 'a'});
// Configuration
app.configure(function(){
  app.use(express.logger({stream: expressLogFile}));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});
app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});
app.configure('production', function(){
  app.use(express.errorHandler());
});
 
var handlers = {
  account: new AccountHandler(),
  list   : new ShoppingListHandler() 
};
 
function start() {
  routes.setup(app, handlers);
  var host = process.env.IP   || '127.0.0.1';
  var port = process.env.PORT || '3000';
  app.listen(port, host);
  console.log("Express server listening on %s:%s in %s mode", host, port, app.settings.env);
}
// *******************************************************
exports.start = start;
exports.app   = app;