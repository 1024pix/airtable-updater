'use strict';

const tutorialRepository = require('../repositories/tutorial-repository');
const skillRepository = require('../repositories/skill-repository');

const context = {
    tutorialsWithSkills: null
};

async function _fetchTutorials() {
    try {
        console.log('Fetch tutorials');
        context.tutorialsWithSkill = await tutorialRepository.findTutorialsWithSkill();
        console.log();
        console.log(`${context.tutorialsWithSkill.length} tutorials fetched`);
        console.log();
    } catch (err) {
        console.log(`An error occurred when fetching skills from Pix base`);
    }
}

async function _addTutorialToSkill(skillNameToUpdate, tutorial) {
    try {
        const skillToUpdate = await skillRepository.getByName(skillNameToUpdate);
        const skillRecordId = skillToUpdate[0].id;

        return skillRepository.addTutorial(skillRecordId, tutorial)
            .catch((err) => {});

    } catch (err) {
        console.log(`Le skill ${skillNameToUpdate} n'a pas pu être mise à jour car il n'est pas dans la base Pix destinataire.`)
    }
}

function _tutorialHasMultipleSkills(tutorial) {
    return tutorial.get('Solution à').includes(',');
}

async function run() {
    await _fetchTutorials();

    await context.tutorialsWithSkill.forEach((tutorial) => {

        if (_tutorialHasMultipleSkills(tutorial)) {
            const skillsToUpdate = tutorial.get('Solution à').split(',');

            skillsToUpdate.forEach((skillNameToUpdate) => {
                _addTutorialToSkill(skillNameToUpdate, tutorial)
            });

        } else {
            const skillNameToUpdate = tutorial.get('Solution à');
            _addTutorialToSkill(skillNameToUpdate, tutorial)
        }

    });
}

module.exports = run;

