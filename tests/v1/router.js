var funcs = require('./funcs');
var jade  = require('jade');


function registerRoutes(app) {
    //API
    ////Data
    //////Get a list of all data
    app.get(    '/api/data/all/:pi_name?' , function(req,res) { api_data_get(     app, req, res, {}) } );
    app.get(    '/api/data/last/:pi_name?', function(req,res) { api_data_get(     app, req, res, {group: ['pi_name']}) } );
    //////Add data
    app.put(    '/api/data'               , function(req,res) { api_data_put(   app, req, res) } );
    //////Delete data
    app.delete( '/api/data'               , function(req,res) { api_data_delete(app, req, res) } );
    ////Ips
    //////Get a list of all IPs
    //app.get(    '/api/ips/:pi_name?' , function(req,res) { data_get(   app, req, res) } );
    //////Add IP
    //app.put(    '/api/ips'           , function(req,res) { data_put(   app, req, res) } );
    


    //HTML View
    ////Data
    //////View data
    app.get(    '/data/all/:pi_name?' , function(req,res) { data_get(   app, req, res, {}) } );
    app.get(    '/data/last/:pi_name?', function(req,res) { data_get(   app, req, res, {group: ['pi_name']}) } );

    //View ip
    //app.get(    '/ips/all/:pi_name?' , function(req,res) { data_get(   app, req, res) } );
    //app.get(    '/ips/last/:pi_name?', function(req,res) { data_get(   app, req, res) } );
    
}

exports.registerRoutes = registerRoutes;


function  data_get(   app, request, response, filter) {
    var pi_name = request.params.pi_name;
    
    console.log('pi_name', pi_name);
    
    if ( pi_name ) {
        filter['where'] = { pi_name: pi_name };
    }
    
    app.databases['Data']
        .findAll( filter )
        .then(function( data ) {
            if ( data  ) {
                console.log( 'getting data', data );
                return response.render('data.jade', { 'data': data });
                //return response.send( res );

            } else {
                console.log( 'getting data error' );
                return response.send({error: true, reason: 'error getting data'});
                
            }
        })
        .catch(function(error) {
            // Ooops, do some error-handling
            console.log( 'crashed while reading data' );
            return response.send(error);
            
         });
}

function api_data_get( app, request, response, filter ) {
    var pi_name = request.params.pi_name;
    
    console.log('pi_name', pi_name);
    
    var filter  = {};
    
    if ( pi_name ) {
        filter['where'] = { pi_name: pi_name };
    }
    
    app.databases['Data']
        .findAll( filter )
        .then(function( data ) {
            if ( data  ) {
                //console.log( 'getting data', data );
                return response.send( data );

            } else {
                console.log( 'getting data error' );
                return response.send({error: true, reason: 'error getting data'});
                
            }
        })
        .catch(function(error) {
            // Ooops, do some error-handling
            console.log( 'crashed while reading data' );
            return response.send(error);
            
         });
}

//http://markdawson.tumblr.com/post/18359176420/asynchronous-file-uploading-using-express-and
function api_data_put( app, request, response ) {
    var serverData = app.dataPath;
    var pi_name    = request.body.pi_name;
    var foto_name  = request.files.foto.name;
    var foto_path  = request.files.foto.path;
    var foto_size  = request.files.foto.size;
    var serverBase = serverData + '/' + pi_name;
    var serverDir  = pi_name    + '/' + foto_name;
    var serverPath = serverBase + '/' + foto_name;
    
    console.log( 'API/DATA/PUT pi_name   ', pi_name    );
    console.log( 'API/DATA/PUT foto_name ', foto_name  );
    console.log( 'API/DATA/PUT foto_path ', foto_path  );
    console.log( 'API/DATA/PUT foto_size ', foto_size  );
    console.log( 'API/DATA/PUT serverBase', serverBase );
    console.log( 'API/DATA/PUT serverDir ', serverDir  );
    console.log( 'API/DATA/PUT serverPath', serverPath );
    
    if (!('foto' in request.files)) {
        return response.send({'error': true, 'reason': 'no foto attachment' });
    }
    
    if (!pi_name) {
        try {
            funcs.deleteFile(foto_path);
        } catch(e) {}

        return response.send({'error': true, 'reason': 'no pi name defined' });
    }
    
    
    if (!foto_name) {

        try {
            funcs.deleteFile(foto_path);
        } catch(e) {}


        return response.send({'error': true, 'reason': 'no foto name defined' });
    }
    
    if (!foto_path) {

        try {
            funcs.deleteFile(foto_path);
        } catch(e) {}

        return response.send({'error': true, 'reason': 'no foto path defined' });
    }
    
    if (foto_size == 0) {

        try {
            funcs.deleteFile(foto_path);
        } catch(e) {}

        return response.send({'error': true, 'reason': 'foto size is zero1' });
    }


    try {
        funcs.createFolder(serverBase);
    } catch(e) {}


    console.log('data add : server data %s base %s dir %s path %s temp photo %s', serverData, serverBase, serverDir, serverPath, foto_path);

    console.log('data add : pi name %s filename %s filesize %d filepath %s', pi_name, foto_name, foto_size, serverDir);

    
    var data = app.databases['Data'].build({
        pi_name    : pi_name,
        filename   : foto_name,
        filesize   : foto_size,
        filepath   : serverDir
    });
    
    data.save()
        .then( function( res ) {
            if( res ) {
                console.log( 'added data' );

                try {
                    funcs.rename(foto_path, serverPath);
        
                } catch(error) {
                    console.log( 'error renaming', error );
        
                    try {
                        funcs.deleteFile(foto_path);
                    } catch(e) {}
        
                    return response.send(error);
                }


                try {
                    funcs.deleteFile(foto_path);
                } catch(e) {}

                return response.send(res);
            } else {
                console.log( 'error adding data' );

                try {
                    funcs.deleteFile(foto_path);
                } catch(e) {}

                return response.send({'error': true});
            }
        })
        .catch(function(error) {
            // Ooops, do some error-handling
            console.log( 'crashed while adding data', error );

            try {
                funcs.deleteFile(foto_path);
            } catch(e) {}

            return response.send(error);
         });
}


function api_data_delete( app, request, response ) {
    var serverData = app.dataPath;
    
    var pi_name    = request.body.pi_name;
    
    var foto_name  = request.body.foto;
    
    var foto_path  = '';

    var foto_size  = 0;
    
    var serverBase = serverData + '/' + pi_name;
    
    var serverDir  = pi_name    + '/' + foto_name;
    
    var serverPath = serverBase + '/' + foto_name;

    console.log( 'API/DATA/DEL pi_name   ', pi_name    );
    console.log( 'API/DATA/DEL foto_name ', foto_name  );
    console.log( 'API/DATA/DEL foto_path ', foto_path  );
    console.log( 'API/DATA/DEL foto_size ', foto_size  );
    console.log( 'API/DATA/DEL serverBase', serverBase );
    console.log( 'API/DATA/DEL serverDir ', serverDir  );
    console.log( 'API/DATA/DEL serverPath', serverPath );

    //return response.send({});
    
    if (!pi_name) {
        return response.send({'error': true, 'reason': 'no pi name defined' });
    }
    
    if (!foto_name) {
        return response.send({'error': true, 'reason': 'no foto name defined' });
    }


    try {
        funcs.createFolder(serverBase);
    } catch(e) {}

    console.log('data del : server data %s base %s dir %s path %s temp photo %s', serverData, serverBase, serverDir, serverPath, foto_path);

    console.log('data del : pi name %s filename %s filesize %d filepath %s', pi_name, foto_name, foto_size, serverDir);


    app.databases['Data']
        .destroy({
            where: {
                pi_name : pi_name,
                filename: foto_name
            },
            truncate: true /* this will ignore where and truncate the table instead */
        })
        .then(function(affectedRows) {
            console.log('affectedRows',affectedRows) // no programming, just reading :(
              
            if (affectedRows != 0) {
                
                if (affectedRows == 1) {
                    try {
                        funcs.deleteFile(serverPath);
                        
                        return response.send({'error': false, 'affectedRows': affectedRows});

                    } catch(e) {
                        return response.send({'error': true, 'reason': 'could not delete file', 'affectedRows': affectedRows });

                    }
                } else {
                    return response.send({'error': true, 'reason': 'more than one register', 'affectedRows': affectedRows });

                }
            } else {
                return response.send({'error': true, 'affectedRows': affectedRows});
                
            }
        })
        .catch(function(error) {
            // Ooops, do some error-handling
            console.log( 'crashed while deleting data', error );
            return response.send(error);
        });
}





//http://docs.sequelizejs.com/en/latest/docs/models-definition/ 
//   getterMethods   : {
//     fullName       : function()  { return this.firstname + ' ' + this.lastname }
//   },

//   setterMethods   : {
//     fullName       : function(value) { 
//         var names = value.split(' ');

//         this.setDataValue('firstname', names.slice(0, -1).join(' '));
//         this.setDataValue('lastname', names.slice(-1).join(' '));
//     },
//   }
    
//   classMethods: {
//     method1: function(){ return 'smth' }
//   },
//   instanceMethods: {
//     method2: function() { return 'foo' }
//   }


    
    // //Get a single book by id
    // app.get( '/api/books/:id', function( request, response ) {
    //     return app.databases.Data.findById( request.params.id, function( err, book ) {
    //         if( !err ) {
    //             return response.send( book );
    //         } else {
    //             console.log( err );
    //             return response.send('ERROR');
    //         }
    //     });
    // });
    // //Update a book
    // app.put( '/api/books/:id', function( request, response ) {
    //     return app.databases.Data.findById( request.params.id, function( err, book ) {
    //         book.title       = request.body.title;
    //         book.author      = request.body.author;
    //         book.releaseDate = request.body.releaseDate;
    
    //         return book.save( function( err ) {
    //             if( !err ) {
    //                 console.log( 'book updated' );
    //                 return response.send( book );
    //             } else {
    //                 console.log( err );
    //                 return response.send('ERROR');
    //             }
    //         });
    //     });
    // });
    // //Delete a book
    // app.delete( '/api/books/:id', function( request, response ) {
    //     app.databases.Data.findById( request.params.id, function( err, book ) {
    //         return book.remove( function( err ) {
    //             if( !err ) {
    //                 console.log( 'Book removed' );
    //                 return response.send( '' );
    //             } else {
    //                 console.log( err );
    //                 return response.send('ERROR');
    //             }
    //         });
    //     });
    // });