var application_root = __dirname,
    Sequelize        = require( 'sequelize'  ),
    express          = require( 'express'    ),   //Web framework
    path             = require( 'path'       ),   //Utilities for dealing with file paths
    //serveStatic      = require('serve-static'),
    register         = require( './router'   ),
    db               = require( './db'       ),
    conf             = require( './conf'     ),
    funcs            = require( './funcs'    );



try {
    funcs.createFolder(conf.dataPath);
} catch(e) {}

//Create server
var app = express();
app.Sequelize = Sequelize;
conf.loadConf(app);
console.log('loaded conf:', app.conf)


// Configure server
//parses request body and populates request.body
app.use( express.bodyParser({
    uploadDir: app.conf.tempPath
}) );

//checks request.body for HTTP method overrides
var methodOverride = require('method-override');
app.use(methodOverride('X-HTTP-Method-Override'));
//app.use( express.methodOverride() );

//perform route lookup based on url and HTTP method
app.use( app.router );

app.use( express.compress() );

//Show all errors in development
app.use( express.errorHandler({ dumpExceptions: true, showStack: true }));







app.set('view engine', 'jade');

db.createDb(app, app.conf.dbfile);

register.registerRoutes(app, express);


app.database
  .sync()
  //.sync({ force: true })
  .then(function() {

    if ( app.conf.useSSL ) {
      // http://stackoverflow.com/questions/7185074/heroku-nodejs-http-to-https-ssl-forced-redirect/23894573#23894573
      var https    = require('https')
      var forceSsl = function (req, res, next) {
        if (req.headers['x-forwarded-proto'] !== 'https') {
          return res.redirect(['https://', req.get('Host'), req.url].join(''));
        }
        return next();
      };
      app.use(forceSsl);


      https.createServer({
        key:  require('fs').readFileSync(app.conf.SSLkey ),
        cert: require('fs').readFileSync(app.conf.SSLcert)
        }, app).listen(
	  app.conf.port,
          app.conf.host,
          function() {
            console.log( 'Express server listening on %s:%s RNG %s', app.conf.host, app.conf.port, app.conf.RNG);
          }
        );
    } else {
      app.listen( app.conf.port, app.conf.host, function() {
          console.log( 'Express server listening on %s:%s RNG %s', app.conf.host, app.conf.port, app.conf.RNG);
      });
    }
  });
