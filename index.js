'use strict';

require('dotenv').config();

const environnements = {
    production: "--prod",
    integration: "--inte",
    aval: "--aval",
    maths: "--math",
};

const commandPaths = {
    'create-skills': './lib/controllers/create_skills_20180131',
    'update-challenges': './lib/controllers/update_challenges_20180131',
    'import-skill-clues': './lib/controllers/import_skill_clues_20180201',
    'import-tutorials-in-skills': './lib/controllers/import_tutorials_skills_20180301',
    'import-tags-in-skills': './lib/controllers/import_tags_skills_20180306',
    'import-additional-tutorials-in-skills': './lib/controllers/import_additional_tutorials_skills_20180307'
};

let scriptArguments = process.argv;
scriptArguments.splice(0, 2);

if (scriptArguments.length > 2) {
    console.error(`Too many scriptArguments specified. Expected 1 but got ${scriptArguments.length}.`);
    process.exit(1);
}

if (scriptArguments.length === 1) {
    console.error(`please specify the environnement variable.`);
    logEnvironnementPossibilities();
    process.exit(1);
}

const commandArg = scriptArguments[0];
const environnementArg = scriptArguments[1];

const commandPath = commandPaths[commandArg];

if (typeof commandPath === "undefined") {
    console.error('Command not found');
    logCommandPossibilities();
    process.exit(1);
}

switch (environnementArg) {
    case "--inte":
        process.env.AIRTABLE_BASE_PIX = process.env.AIRTABLE_BASE_PIX_INTEGRATION;
        break;
    case '--prod':
        process.env.AIRTABLE_BASE_PIX = process.env.AIRTABLE_BASE_PIX_PROD;
        break;
    case '--math':
        process.env.AIRTABLE_BASE_PIX = process.env.AIRTABLE_BASE_PIX_MATHS;
        break;
    case '--aval':
        process.env.AIRTABLE_BASE_PIX = process.env.AIRTABLE_BASE_PIX_AVAL;
        break;
    default:
        console.error(`Environnement "${environnementArg}" not found`);
        process.exit(1);
}

runCommand(commandPaths[commandArg]);

function runCommand(commandPath) {
    require(commandPath)();
}

function logCommandPossibilities() {
    console.log('Possible commands are: ');

    Object.keys(commandPaths).forEach((command) => {
        console.log(`  > "${command}"`);
    });
}

function logEnvironnementPossibilities() {
    console.log('Possible environnement variables are: ');

    Object.entries(environnements).forEach(([environnement, argString]) => {
        console.log(`  > for environnement ${environnement}, enter "${argString}"`);
    });
}
