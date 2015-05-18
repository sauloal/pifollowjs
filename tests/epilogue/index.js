var Sequelize = require('sequelize'),
    restify   = require('restify'  ),
    epilogue  = require('epilogue' );


// Define your models
var database = new Sequelize('database', 'root', 'password', { dialect: 'sqlite', storage: 'database.sqlite'});

var User     = database.define('User', {
  username: Sequelize.STRING,
  birthday: Sequelize.DATE
});

var Ips = database.define('Ips', {
  pi_name    : { type: Sequelize.STRING, allowNull: false, validate: { isAscii: true, isAlphanumeric: true, isByteLength: 2 } }, 
  external_ip: { type: Sequelize.STRING, allowNull: false, validate: { isAscii: true, isIPv4: true } },
  internal_ip: { type: Sequelize.STRING, allowNull: false, validate: { isAscii: true, isIPv4: true }, defaultValue: '0.0.0.0' }
});

var Data = database.define('Data', {
  pi_name    : { type: Sequelize.STRING , allowNull: false, unique: 'compositeIndex', validate: { isAscii: true, isAlphanumeric: true, isByteLength: 2 } },
  filename   : { type: Sequelize.STRING , allowNull: false, unique: 'compositeIndex', validate: { isAscii: true } },
  filesize   : { type: Sequelize.INTEGER, allowNull: false, validate: { isInt: true } },
  filepath   : { type: Sequelize.STRING , allowNull: false }
});


var DataMiddleware = {
  create: {
    fetch: function(req, res, context) {
      // manipulate the fetch call
      return context.continue;
    }
  },
  list: {
    write: {
      before: function(req, res, context) {
        // modify data before writing list data
        return context.continue;
      },
      action: function(req, res, context) {
        // change behavior of actually writing the data
        return context.continue;
      },
      after: function(req, res, context) {
        // set some sort of flag after writing list data
        return context.continue;
      }
    }
  }
};

Data.use( DataMiddleware );

// Initialize server
var server = restify.createServer();
server.use(restify.queryParser());
server.use(restify.bodyParser());

// Initialize epilogue
epilogue.initialize({
  app      : server,
  sequelize: database
});

// Create REST resource
var userResource = epilogue.resource({
  model    : User,
  endpoints: ['/users', '/users/:id']
});

// Create database and listen

var host = process.env.IP   || '127.0.0.1',
    port = process.env.PORT || '3000';

database
  .sync()
  //.sync({ force: true })
  .then(function() {
    server.listen(port, host, function() {
      console.log('%s listening at %s', server.name, server.url);
    });
  });