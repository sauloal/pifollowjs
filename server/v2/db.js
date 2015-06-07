function createDb(app, dbfile) {
    // Define your models
    var Sequelize = app.Sequelize;
    
    app.database  = new Sequelize('database', 'root', 'password', { dialect: 'sqlite', storage: dbfile});
    app.databases = {};

    var Ips = app.database.define('Ips', {
      pi_name    : { type: Sequelize.STRING, allowNull: false, validate: { isAscii: true } }, //, isAlphanumeric: true, isByteLength: 2
      external_ip: { type: Sequelize.STRING, allowNull: false, validate: { isAscii: true, isIPv4: true } },
      internal_ip: { type: Sequelize.STRING, allowNull: false, validate: { isAscii: true, isIPv4: true }, defaultValue: '0.0.0.0' }
    });
    app.databases.Ips  = Ips;
    
    var Data = app.database.define('Data', {
      pi_name    : { type: Sequelize.STRING , allowNull: false, unique: 'compositeIndex', validate: { isAscii: true } }, //, isAlphanumeric: true, isByteLength: 2
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
    
    //Data.use( DataMiddleware );

    app.databases['Data'] = Data;
}

exports.createDb = createDb;