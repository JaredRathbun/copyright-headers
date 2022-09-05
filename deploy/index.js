const fs = require('fs');
const LANGUAGE_REGEXS = {
    'java': /\\*(.|[\r\n]|Copyright (c) 2022 Jared Rathbun and Katie O'Neil.)*?\*\//,
    'js': /\\*(.|[\r\n]|Copyright (c) 2022 Jared Rathbun and Katie O'Neil.)*?\*\//,
    'py': /#.*/,
    'css': /\\*(.|[\r\n]|Copyright (c) 2022 Jared Rathbun and Katie O'Neil.)*?\*\//,
    'html': /<!--(.|[\r\n]|Copyright (c) 2022 Jared Rathbun and Katie O'Neil.)*-->/
}
const args = process.argv.splice(2);

walkDir(args[0]);

function walkDir(path) {
    let isDir = fs.lstatSync(path).isDirectory();

    // Check to see if one file is being operated on, or a directory.
    if (isDir) {
        let files = fs.readdirSync(path);

        for (let file of files) {
            if (fs.lstatSync(path + '/' + file).isDirectory()) {
                walkDir(path + '/' + file);
            } else {
                applyHeader(path + '/' + file);
            }
        }
    } else {
        applyHeader(file);
    }
}

function applyHeader(file) {
    let fileType = file.split('.')[1];
    let regex = new RegExp(LANGUAGE_REGEXS[fileType]);
    let content = fs.readFileSync(file, {encoding: 'utf-8'});
    if (!regex.test(content)) {
        let header = readHeaderTemplate(fileType);
        let updatedString = header + '\n\n' + content;
        fs.writeFileSync(file, updatedString);
    }
}

function readHeaderTemplate(fileType) {
    if (['java', 'js', 'css', 'html', 'py'].includes(fileType)) {
        return fs.readFileSync(`templates/header.${fileType}`, 
            {encoding: 'utf-8'});
    }
}