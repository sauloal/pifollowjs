function registerRoutes(app, mongoose) {
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
}

exports.registerRoutes = registerRoutes();