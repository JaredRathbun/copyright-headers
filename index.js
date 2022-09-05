const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');

try {
    // Get the JSON webhook payload for the event that triggered the workflow
    const payload = JSON.stringify(github.context.payload, undefined, 2)
    console.log(`The event payload: ${payload}`);

    const path = core.getInput('path');
    const headerTemplate = loadHeaderTemplate(core.getInput('template'));

    walkDir(path, headerTemplate);
} catch (error) {
    core.setFailed(error.message);
}

function walkDir(path, headerTemplate) {
    let isDir = fs.lstatSync(path).isDirectory();

    // Check to see if one file is being operated on, or a directory.
    if (isDir) {
        let files = fs.readdirSync(path);

        for (let file of files) {
            if (fs.lstatSync(file).isDirectory()) {
                walkDir(file, headerTemplate);
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