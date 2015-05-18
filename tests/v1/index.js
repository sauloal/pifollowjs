var application_root = __dirname,
    Sequelize        = require( 'sequelize'  ),
    express          = require( 'express'    ),   //Web framework
    path             = require( 'path'       ),   //Utilities for dealing with file paths
    serveStatic      = require('serve-static'),
    register         = require( './router'   ),
    db               = require( './db'       ),
    funcs            = require( './funcs'    );


var host             = process.env.IP       || '127.0.0.1',
    port             = process.env.PORT     || '3000',
    dbfile           = process.env.DBFILE   || 'database.sqlite',
    dataPath         = process.env.DATAPATH || './data';

try {
    funcs.createFolder(dataPath);
} catch(e) {}

//Create server
var app = express();
app.Sequelize = Sequelize;
app.dataPath  = dataPath;

// Configure server
//parses request body and populates request.body
app.use( express.bodyParser({
    uploadDir:'./Temp'
}) );

//checks request.body for HTTP method overrides
app.use( express.methodOverride() );

//perform route lookup based on url and HTTP method
app.use( app.router );

app.use(express.compress());

//Show all errors in development
app.use( express.errorHandler({ dumpExceptions: true, showStack: true }));

var static_folder = __dirname + '/data/';
console.log( 'static folder',static_folder);
app.use( '/api/data/file/', express.static( static_folder ) );

app.set('view engine', 'jade');

db.createDb(app, dbfile);

register.registerRoutes(app);


app.database
  .sync()
  //.sync({ force: true })
  .then(function() {
    app.listen( port, host, function() {
        console.log( 'Express server listening on %s:%s', host, port );
    });
  });