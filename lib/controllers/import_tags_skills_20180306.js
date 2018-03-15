'use strict';

const tagRepository = require('../repositories/tag-repository');
const skillRepository = require('../repositories/skill-repository');

const context = {
    tagsWithSkill: null,
    tagsClassifiedBySkills: {}
};

async function _fetchTags() {
    try {
        console.log('Fetch tags');
        context.tagsWithSkill = await tagRepository.findTagsWithSkill();
        console.log();
        console.log(`${context.tagsWithSkill.length} tags fetched`);
        console.log();
    } catch (err) {
        console.log(`An error occurred when fetching skills from Pix base.\n Il a cassé avec l'erreur : ${err}`);
    }

    console.log(`Finished _fetchTags`);
    console.log(`***************************************************************************************************`);
    console.log();
}

async function _classifyTagsBySkills() {
    console.log(`Started _classifyTagsBySkills`);

    context.tagsWithSkill.forEach(async (tag) => {
        const skillsToUpdate = tag.get('Acquix').split(',');

        console.log(`Working on tag: ${tag.get('Nom')}`);
        console.log(` > skills of tag: ${skillsToUpdate}`);

        await skillsToUpdate.forEach((skillNameToUpdate) => {

            if (!context.tagsClassifiedBySkills[skillNameToUpdate]) {
                context.tagsClassifiedBySkills[skillNameToUpdate] = [];
            }

            context.tagsClassifiedBySkills[skillNameToUpdate].push(tag.getId());
        });
    });

    console.log(`Finished _classifyTagsBySkills`);
    console.log(`***************************************************************************************************`);
    console.log();
}

async function _updateTags() {
    await Promise.all(
        Object.keys(context.tagsClassifiedBySkills).map((skillName) => {
            const tagRecordIds = context.tagsClassifiedBySkills[skillName];
            return _addTagRecordIdsToSkill(skillName, tagRecordIds);
        })
    );
    console.log(`Finished _updateTags`);
    console.log(`***************************************************************************************************`);
    console.log();
}

async function _addTagRecordIdsToSkill(skillName, tagRecordIds) {
    await skillRepository.getByName(skillName)
        .then((toUpdateSkills) => {
            return toUpdateSkills[0].getId();
        })
        .then((skillRecordId) => {
            return skillRepository.addTag(skillRecordId, tagRecordIds);
        })
        .then(() => {
            console.log(`Le skill ${skillName} a été mis à jour`);
        })
        .catch((err) => {
            console.log(`Le skill ${skillName} n'a pas pu être mise à jour car il n'est pas dans la base Pix destinataire.`);
            console.log(` > Il a cassé avec l'erreur : ${err}`);
        });
}

async function run() {
    await _fetchTags();
    await _classifyTagsBySkills();
    await _updateTags();
    console.log(`END OF SCRIPT`);
    console.log(`***************************************************************************************************`);
    console.log();
}

module.exports = run;
