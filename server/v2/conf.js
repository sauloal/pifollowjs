function loadConf(app) {
    app.conf = {};
    app.conf.API_VERSION      = '2';
    app.conf.host             = process.env.IP       || '127.0.0.1';
    app.conf.port             = process.env.PORT     || '3000';
    app.conf.dbfile           = process.env.DBFILE   || 'database.sqlite';
    app.conf.dataPath         = process.env.DATAPATH || './data';
    app.conf.tempPath         = process.env.TEMPPATH || './Temp';
    app.conf.SSLkey           = process.env.SSLkey   || null;
    app.conf.SSLcert          = process.env.SSLcert  || null;

    
    var RNG = process.env.RNG      || getRng() || 'dc97d7355965f2d9f81130ba555510e0';
    
    
    var RNG_URL = '';
    if ( RNG ) {
        RNG_URL = '/' + RNG;
    }
    
    app.conf.RNG     = RNG;
    app.conf.RNG_URL = RNG_URL;

    if ( app.conf.SSLkey && app.conf.SSLcert ) {
        console.log("has ssl");
        var fs = require('fs');
        try {
           stats = fs.lstatSync(app.conf.SSLkey );
           stats = fs.lstatSync(app.conf.SSLcert);
           app.conf.useSSL = true;
           console.log("has ssl files");
        } catch(e) {
          app.conf.useSSL  = false;
           console.log("ssl files does not exists");
        }
    } else {
	app.conf.useSSL = false;
        console.log("no ssl");
    }
}

exports.loadConf = loadConf;

function getRng() {
    try {
        var data = require('fs').readFileSync('rng.cfg', 'utf8').trim();
        console.log('read cfg. returning data', data.trim());
        if ( data.split('\n').length > 1 ) {
            console.log('more than one line in config "', data, '"');
            return false;
        }
        return data.trim();
    } catch (e) {
        return false;
    }
}
