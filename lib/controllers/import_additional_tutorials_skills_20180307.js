'use strict';

const tutorialRepository = require('../repositories/tutorial-repository');
const skillRepository = require('../repositories/skill-repository');

const context = {
    additionalTutorialsWithSkills: null,
    additionnalsTutorialsClassifiedBySkills: {},
    erronousAdditionalTutorialsClassifiedBySkills: {}
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

async function _classifyTutorielsBySkills() {
    context.additionalTutorialsWithSkills.forEach(async (tutorial) => {
        const skillsToUpdate = tutorial.get('En savoir plus').split(',');

        await skillsToUpdate.forEach((skillNameToUpdate) => {

            if (!context.additionnalsTutorialsClassifiedBySkills[skillNameToUpdate]) {
                context.additionnalsTutorialsClassifiedBySkills[skillNameToUpdate] = [];
            }

            context.additionnalsTutorialsClassifiedBySkills[skillNameToUpdate].push(tutorial.getId());
        });
    });
}

async function _addAdditionalsTutorialsToSkill(skillNameToUpdate, tutorialRecordIds) {
    return skillRepository.getByName(skillNameToUpdate)
        .then((skillToUpdate) => {
            return skillToUpdate[0].getId();
        })
        .then((skillRecordId) => {
            return skillRepository.addAdditionalTutorial(skillRecordId, tutorialRecordIds);
        })
        .catch(() => {
            context.erronousAdditionalTutorialsClassifiedBySkills[skillNameToUpdate] = tutorialRecordIds;
        });
}

async function _updateAdditionalsTutorials() {
    await Promise.all(
        Object.keys(context.additionnalsTutorialsClassifiedBySkills).map((acquis) => {
            const tutorialsRecordId = context.additionnalsTutorialsClassifiedBySkills[acquis];
            return _addAdditionalsTutorialsToSkill(acquis, tutorialsRecordId);
        })
    );
}

function _logErrors() {
    console.log();
    console.log(`Error Log`);
    console.log();
    console.log("The following skills failed with the assiocated additional tutorials ids");
    Object.entries(context.erronousAdditionalTutorialsClassifiedBySkills).forEach(([skillName, additionalTutorialsRecordIds]) => {
        console.log(`  > ${skillName} => ${additionalTutorialsRecordIds}`);
    });
}

async function run() {
    await _fetchAdditionalTutorials();
    await _classifyTutorielsBySkills();
    await _updateAdditionalsTutorials();

    _logErrors();

    console.log();
    console.log(`END OF SCRIPT`);
}

module.exports = run;
