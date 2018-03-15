'use strict';

const tutorialRepository = require('../repositories/tutorial-repository');
const skillRepository = require('../repositories/skill-repository');

const context = {
    additionalTutorialsWithSkills: null,
    additionnalsTutorialsClassifiedBySkills: {}
};

async function _fetchAdditionalTutorials() {
    try {
        console.log('Fetch tutorials');
        context.additionalTutorialsWithSkills = await tutorialRepository.findAdditionalTutorialsWithSkills();
        console.log();
        console.log(`${context.additionalTutorialsWithSkills.length} additional tutorials fetched`);
        console.log();
    } catch (err) {
        console.log(`An error occurred when fetching additionals tutorials from Pix base`);
    }
}

async function classifyTutorielsBySkills() {
    context.additionalTutorialsWithSkills.forEach(async (tutorial) => {
        const skillsToUpdate = tutorial.get('En savoir plus').split(',');

        await skillsToUpdate.forEach((skillNameToUpdate) => {

            if (!context.additionnalsTutorialsClassifiedBySkills[skillNameToUpdate]) {
                context.additionnalsTutorialsClassifiedBySkills[skillNameToUpdate] = [];
            }

            context.additionnalsTutorialsClassifiedBySkills[skillNameToUpdate].push(tutorial.getId())
        });
    });
}

async function _addAdditionalsTutorialsToSkill(skillNameToUpdate, tutorials) {
    try {
        const skillToUpdate = await skillRepository.getByName(skillNameToUpdate);
        const skillRecordId = skillToUpdate[0].getId();

        return skillRepository.addAdditionalTutorial(skillRecordId, tutorials)

    } catch (err) {
        console.log(`Le skill ${skillNameToUpdate} n'a pas pu être mise à jour.`)
    }
}

function updateAdditionalsTutorials() {
    Object.keys(context.additionnalsTutorialsClassifiedBySkills).forEach((acquis) => {
        const tutorialsRecordId = context.additionnalsTutorialsClassifiedBySkills[acquis];
        _addAdditionalsTutorialsToSkill(acquis, tutorialsRecordId)
    });
}


async function run() {
    await _fetchAdditionalTutorials();
    await classifyTutorielsBySkills();
    updateAdditionalsTutorials();
}

module.exports = run;
