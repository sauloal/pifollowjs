// Module dependencies.
var application_root = __dirname,
    express  = require( 'express'  ),   //Web framework
    path     = require( 'path'     ),   //Utilities for dealing with file paths
    mongoose = require( 'mongoose' ),   //Used for accessing a MongoDB database
    register = require( './router' );

//Connect to database
mongoose.connect( 'mongodb://localhost/library_database' );

//Schema
var BookSchema = new mongoose.Schema({
    title: String,
    author: String,
    releaseDate: Date
});
//Model
var BookModel = mongoose.model( 'Book', BookSchema );



//Create server
var app = express();

// Configure server
app.configure( function() {
    //parses request body and populates request.body
    app.use( express.bodyParser() );

    //checks request.body for HTTP method overrides
    app.use( express.methodOverride() );

    //perform route lookup based on url and HTTP method
    app.use( app.router );

    //Show all errors in development
    app.use( express.errorHandler({ dumpExceptions: true, showStack: true }));
});


register.registerRoutes(app, mongoose);

//Start server
var port = 4711;
app.listen( port, function() {
    console.log( 'Express server listening on port %d in %s mode', port, app.settings.env );
});