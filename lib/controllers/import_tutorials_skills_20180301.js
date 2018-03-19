'use strict';

const tutorialRepository = require('../repositories/tutorial-repository');
const skillRepository = require('../repositories/skill-repository');

const context = {
    tutorialsWithSkills: null,
    tutorialsClassifiedBySkills: {},
    erronousTutorialsClassifiedBySkills: {}
};

async function _fetchTutorials() {
    try {
        console.log('Fetching tutorials');
        context.tutorialsWithSkills = await tutorialRepository.findTutorialsWithSkill();
        console.log();
        console.log(`${context.tutorialsWithSkills.length} tutorials fetched`);
        console.log();
    } catch (err) {
        console.log(`An error occurred when fetching tutorials from Pix base`);
    }

    console.log(`Finished Fetching tutorials`);
    console.log();
}

async function classifyTutorialsBySkills() {
    console.log(`Classify tutorials by skills...`);

    context.tutorialsWithSkills.forEach(async (tutorial) => {
        const skillsToUpdate = tutorial.get('Solution à').split(',');

        await skillsToUpdate.forEach((skillNameToUpdate) => {

            if (!context.tutorialsClassifiedBySkills[skillNameToUpdate]) {
                context.tutorialsClassifiedBySkills[skillNameToUpdate] = [];
            }

            context.tutorialsClassifiedBySkills[skillNameToUpdate].push(tutorial.getId());
        });
    });

    console.log(`Finished classifying tags by skills`);
    console.log();
}

async function _addTutorialToSkill(skillNameToUpdate, tutorialRecordIds) {
    return skillRepository.getByName(skillNameToUpdate)
        .then((skillToUpdate) => {
            return skillToUpdate[0].getId();
        })
        .then((skillRecordId) => {
            return skillRepository.addTutorial(skillRecordId, tutorialRecordIds);
        })
        .catch((err) => {
            context.erronousTutorialsClassifiedBySkills[skillNameToUpdate] = tutorialRecordIds;
        });
}

async function _updateTutorials() {
    await Promise.all(
        Object.keys(context.tutorialsClassifiedBySkills).map((skill) => {
            const tutorialsRecordId = context.tutorialsClassifiedBySkills[skill];
            return _addTutorialToSkill(skill, tutorialsRecordId);
        })
    );
}

function _logErrors() {
    console.log();
    console.log(`Error Log`);
    console.log();
    console.log("The following skills failed with the assicated tutorials ids");
    Object.entries(context.erronousTutorialsClassifiedBySkills).forEach(([skillName, tutorialsRecordIds]) => {
        console.log(`  > ${skillName} => ${tutorialsRecordIds}`);
    });
}

async function run() {
    await _fetchTutorials();
    await classifyTutorialsBySkills();
    await _updateTutorials();

    _logErrors();

    console.log();
    console.log(`END OF SCRIPT`);
}

module.exports = run;
