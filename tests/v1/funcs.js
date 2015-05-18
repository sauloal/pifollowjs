var fs = require('fs');

function createFolder(folder) {
    fs.mkdirSync(folder);
}

//https://millermedeiros.github.io/mdoc/examples/node_api/doc/fs.html#fs.lstat
function deleteFile(file) {
    fs.unlinkSync(file);
}

function rename(src, dst) {
    fs.renameSync(src, dst);   
}

exports.createFolder = createFolder;
exports.deleteFile   = deleteFile;
exports.rename       = rename;