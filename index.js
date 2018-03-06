'use strict';

require('dotenv').config();

const createSkills = require('./lib/controllers/create_skills_20180131');
const updateChallenges = require('./lib/controllers/update_challenges_20180131');
const importSkillsClues = require('./lib/controllers/import_skill_clues_20180201');
const importTutorialsSkills = require('./lib/controllers/import_tutorials_skills_20180301');

// node index.js < create-skills | update-challenges | import-skill-clues >
let commands = process.argv;
commands.splice(0, 2);

if (commands.length > 1) {
    console.error(`Too many commands specified. Expected 1 but got ${commands.length}.`);
    process.exit(1);
}

commands.forEach((command) => {
    switch (command) {
        case 'create-skills':
            return createSkills();
        case 'update-challenges':
            return updateChallenges();
        case 'import-skill-clues':
            return importSkillsClues();
        case 'import-tutorials-skills':
            return importTutorialsSkills();
        default:
            console.error('Command not found')
    }
});
