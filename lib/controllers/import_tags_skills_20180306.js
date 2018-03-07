'use strict';

const tagRepository = require('../repositories/tag-repository');
const skillRepository = require('../repositories/skill-repository');

const context = {
    tagsWithSkill: null,
    skillsNameToUpdateFetchedFromTags: [],
    skillsNameToUpdate : null
};

async function _fetchTags() {
    try {
        console.log('Fetch tags');
        context.tagsWithSkill = await tagRepository.findTagsWithSkill();
        console.log();
        console.log(`${context.tagsWithSkill.length} tags fetched`);
        console.log();
    } catch (err) {
        console.log(`An error occurred when fetching skills from Pix base`);
    }
}

async function _addTagToSkill(skillName, tag) {
    try {
        const skillToUpdate = await skillRepository.getByName(skillName);
        const skillRecordId = skillToUpdate[0].id;


        return skillRepository.addTag(skillRecordId, tag)
            .catch((err) => {});

    } catch (err) {
        console.log(`Le skill ${skillName} n'a pas pu être mise à jour car il n'est pas dans la base Pix destinataire.`)
    }
}

async function run() {
    await _fetchTags();

    // Parcourir les tags
    await context.tagsWithSkill.forEach((tag) => {
        // Récupérer les skills des tags
        if (tag.get('Acquix').includes(',')) {
            const skillsToUpdate = tag.get('Acquix').split(',');
            skillsToUpdate.forEach((skillName) => {
                return _addTagToSkill(skillName, tag);
            });
        } else {
            const skillName = tag.get('Acquix');
            return _addTagToSkill(skillName, tag)
        }

    });

}

module.exports = run;
