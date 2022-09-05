const fs = require('fs');

const args = process.argv.splice(2);
walkDir(args[0], args[1]);

function walkDir(path, headerTemplate) {
    let isDir = fs.lstatSync(path).isDirectory();

    // Check to see if one file is being operated on, or a directory.
    if (isDir) {
        let files = fs.readdirSync(path);

        for (let file of files) {
            if (fs.lstatSync(path + '/' + file).isDirectory()) {
                walkDir(path + '/' + file, headerTemplate);
            } else {
                applyHeader(file, headerTemplate);
            }
        }
    } else {
        applyHeader(file, headerTemplate);
    }
}

function applyHeader(file, headerTemplate) {
    console.log(`Operating on file: ${file}`);
    console.log(`Header Template: ${headerTemplate}`);
}

function loadHeaderTemplate(file) {
    if (fs.existsSync(file)) {
        let header = fs.readFileSync(file);
        return header;
    } else {
        throw new Error(`Header template ${file} does not exist.`);
    }
}