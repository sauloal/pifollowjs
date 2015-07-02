var fs = require('fs');

function createFolder(folder, clbk) {
    //fs.mkdirSync(folder);
    fs.mkdir(folder, clbk);
}

//https://millermedeiros.github.io/mdoc/examples/node_api/doc/fs.html#fs.lstat
function deleteFile(file, clbk) {
    //fs.unlinkSync(file);
    fs.unlink(file, clbk);
}

function empty(){}

function rename(src, dst, clbk) {
    //fs.renameSync(src, dst);   
    var source = fs.createReadStream(  src);
    var dest   = fs.createWriteStream( dst);

    source.pipe(dest);
    source.on('end'  , function()    { console.log("copied %s to %s"       , src, dst); deleteFile(src, clbk ); /* copied */ });
    source.on('error', function(err) { console.log("error copying %s to %s", src, dst); deleteFile(src, empty); throw new Error('error renaming file'); /* error  */ });
}

exports.createFolder = createFolder;
exports.deleteFile   = deleteFile;
exports.rename       = rename;
