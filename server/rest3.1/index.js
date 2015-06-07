// Module dependencies.
var application_root = __dirname,
    express  = require( 'express'  ),    //Web framework
    path     = require( 'path'     ),       //Utilities for dealing with file paths
    mongoose = require( 'mongoose' );   //Used for accessing a MongoDB database

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

//Router
//Get a list of all books
app.get( '/api/books', function( request, response ) {
    return BookModel.find(function( err, books ) {
        if( !err ) {
            return response.send( books );
        } else {
            console.log( err );
            return response.send('ERROR');
        }
    });
});
//Insert a new book
app.post( '/api/books', function( request, response ) {
    var book = new BookModel({
        title: request.body.title,
        author: request.body.author,
        releaseDate: request.body.releaseDate
    });
    console.log(request.body.title);
    book.save( function( err ) {
        if( !err ) {
            console.log( 'created' );
            return response.send( book );
        } else {
            console.log( err );
            return response.send('ERROR');
        }
    });
});
//Get a single book by id
app.get( '/api/books/:id', function( request, response ) {
    return BookModel.findById( request.params.id, function( err, book ) {
        if( !err ) {
            return response.send( book );
        } else {
            console.log( err );
            return response.send('ERROR');
        }
    });
});
//Update a book
app.put( '/api/books/:id', function( request, response ) {
    return BookModel.findById( request.params.id, function( err, book ) {
        book.title = request.body.title;
        book.author = request.body.author;
        book.releaseDate = request.body.releaseDate;

        return book.save( function( err ) {
            if( !err ) {
                console.log( 'book updated' );
                return response.send( book );
            } else {
                console.log( err );
                return response.send('ERROR');
            }
        });
    });
});
//Delete a book
app.delete( '/api/books/:id', function( request, response ) {
    BookModel.findById( request.params.id, function( err, book ) {
        return book.remove( function( err ) {
            if( !err ) {
                console.log( 'Book removed' );
                return response.send( '' );
            } else {
                console.log( err );
                return response.send('ERROR');
            }
        });
    });
});

//Start server
var port = 4711;
app.listen( port, function() {
    console.log( 'Express server listening on port %d in %s mode', port, app.settings.env );
});