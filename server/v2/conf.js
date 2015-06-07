function loadConf(app) {
    app.conf = {};
    app.conf.API_VERSION      = '2';
    app.conf.host             = process.env.IP       || '127.0.0.1';
    app.conf.port             = process.env.PORT     || '3000';
    app.conf.dbfile           = process.env.DBFILE   || 'database.sqlite';
    app.conf.dataPath         = process.env.DATAPATH || './data';
    app.conf.tempPath         = process.env.TEMPPATH || './Temp';
    
    var RNG = process.env.RNG      || getRng() || 'dc97d7355965f2d9f81130ba555510e0';
    
    
    var RNG_URL = '';
    if ( RNG ) {
        RNG_URL = '/' + RNG;
    }
    
    app.conf.RNG     = RNG;
    app.conf.RNG_URL = RNG_URL;
}

exports.loadConf = loadConf;

function getRng() {
    try {
        var data = require('fs').readFileSync('rng.cfg', 'utf8');
        console.log('read cfg. returning data', data.trim());
        if ( data.split('\n').length > 1 ) {
            console.log('more than one line in config');
            return false;
        }
        return data.trim();
    } catch (e) {
        return false;
    }
}
