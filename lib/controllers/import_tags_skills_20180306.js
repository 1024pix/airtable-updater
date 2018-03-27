'use strict';

const tagRepository = require('../repositories/tag-repository');
const skillRepository = require('../repositories/skill-repository');

const context = {
    tagsWithSkill: null,
    tagsClassifiedBySkills: {},
    erronousTagsClassifiedBySkills: {}
};

async function _fetchTags() {
    try {
        console.log('Fetching tags...');
        context.tagsWithSkill = await tagRepository.findTagsWithSkill();
        console.log(`${context.tagsWithSkill.length} tags fetched`);
    } catch (err) {
        console.log(`An error occurred when fetching skills from Pix base.\n Il a cassé avec l'erreur : ${err}`);
    }

    console.log(`Finished Fetching tags`);
    console.log();
}

async function _classifyTagsBySkills() {
    console.log(`Classify tags by skills...`);

    context.tagsWithSkill.forEach(async (tag) => {
        const skillsToUpdate = tag.get('Acquix').split(',');

        await skillsToUpdate.forEach((skillNameToUpdate) => {
            if (!context.tagsClassifiedBySkills[skillNameToUpdate]) {
                context.tagsClassifiedBySkills[skillNameToUpdate] = [];
            }

            context.tagsClassifiedBySkills[skillNameToUpdate].push(tag.getId());
        });
    });

    console.log(`Finished classifing tags by skills`);
    console.log();
}

async function _updateTags() {
    console.log(`Started Update tags...`);
    await Promise.all(
        Object.keys(context.tagsClassifiedBySkills).map((skillName) => {
            const tagRecordIds = context.tagsClassifiedBySkills[skillName];
            return _addTagRecordIdsToSkill(skillName, tagRecordIds);
        })
    );
    console.log(`Finished updating tags`);
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
        .catch((err) => {
            context.erronousTagsClassifiedBySkills[skillName] = tagRecordIds;
        });
}

function _logErrors() {
    console.log();
    console.log(`Error Log`);
    console.log();
    console.log("The following skills failed with the assicated tags ids");
    Object.entries(context.erronousTagsClassifiedBySkills).forEach(([skillName, tagRecordIds]) => {
        console.log(`  > ${skillName} => ${tagRecordIds}`);
    });
}

async function run() {
    await _fetchTags();
    await _classifyTagsBySkills();
    await _updateTags();
    _logErrors();

    console.log();
    console.log(`END OF SCRIPT`);
}

module.exports = run;
