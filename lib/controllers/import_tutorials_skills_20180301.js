'use strict';

const tutorialRepository = require('../repositories/tutorial-repository');
const skillRepository = require('../repositories/skill-repository');

const context = {
    tutorialsWithSkills: null,
    tutorialsClassifiedBySkills: {}
};

async function _fetchTutorials() {
    try {
        console.log('Fetch tutorials');
        context.tutorialsWithSkills = await tutorialRepository.findTutorialsWithSkill();
        console.log();
        console.log(`${context.tutorialsWithSkills.length} tutorials fetched`);
        console.log();
    } catch (err) {
        console.log(`An error occurred when fetching tutorials from Pix base`);
    }
}

async function _addTutorialToSkill(skillNameToUpdate, tutorials) {
    try {
        const skillToUpdate = await skillRepository.getByName(skillNameToUpdate);
        const skillRecordId = skillToUpdate[0].getId();

        return skillRepository.addTutorial(skillRecordId, tutorials)

    } catch (err) {
        console.log(`Le skill ${skillNameToUpdate} n'a pas pu être mise à jour car il n'est pas dans la base Pix destinataire.`)
    }
}

async function classifyTutorialsBySkills() {
    context.tutorialsWithSkills.forEach(async (tutorial) => {
        const skillsToUpdate = tutorial.get('Solution à').split(',');

        await skillsToUpdate.forEach((skillNameToUpdate) => {

            if (!context.tutorialsClassifiedBySkills[skillNameToUpdate]) {
                context.tutorialsClassifiedBySkills[skillNameToUpdate] = [];
            }

            context.tutorialsClassifiedBySkills[skillNameToUpdate].push(tutorial.getId())
        });
    });
}

function updateTutorials() {
    Object.keys(context.tutorialsClassifiedBySkills).forEach((skill) => {
        const tutorialsRecordId = context.tutorialsClassifiedBySkills[skill];
        _addTutorialToSkill(skill, tutorialsRecordId)
    });
}

async function run() {
    await _fetchTutorials();

    await classifyTutorialsBySkills();

    updateTutorials();
}

module.exports = run;
