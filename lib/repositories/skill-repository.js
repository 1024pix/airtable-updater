'use strict';

const Promise = require('bluebird');
const pixBase = require('../airtable-bases').pix;
const tutosBase = require('../airtable-bases').tutos;

function _getSkillByRecordId(recordId) {
    return pixBase('Acquis').find(recordId);
}

module.exports = {

    create(skill) {
        return new Promise((resolve, reject) => {
            pixBase('Acquis').create({
                "Nom": skill.name,
                "Statut": "Validé",
                "Compétence": [skill.competence]
            }, function(err, record) {
                if (err) {
                    console.log(`An error occurred when creating skill ${skill.name}`);
                    console.error(err);
                    return reject(err);
                }
                console.log(`Created record ${record.getId()}`);
                return resolve(record);
            });
        });
    },

    update(recordId, changes) {
        return new Promise((resolve, reject) => {
            pixBase('Acquis').update(recordId, changes, (err, record) => {
                if (err) {
                    console.log(`An error occurred when updating skill ${recordId}`);
                    console.error(err);
                    return reject(err);
                }
                console.log(`Updated record ${record.getId()}`);
                return resolve(record);
            });
        });
    },

    find() {
        return new Promise((resolve, reject) => {
            let fetchedRecords = [];
            pixBase('Acquis').select()
                .eachPage(function page(records, fetchNextPage) {
                    fetchedRecords = fetchedRecords.concat(records);
                    fetchNextPage();

                }, function done(err) {
                    if (err) {
                        console.error(err);
                        return reject(err);
                    }
                    return resolve(fetchedRecords);
                });

        });
    },

    findFromTutos() {
        return new Promise((resolve, reject) => {
            let fetchedRecords = [];
            tutosBase('Acquix_Indice').select()
                .eachPage(function page(records, fetchNextPage) {
                    fetchedRecords = fetchedRecords.concat(records);
                    fetchNextPage();

                }, function done(err) {
                    if (err) {
                        console.error(err);
                        return reject(err);
                    }
                    return resolve(fetchedRecords);
                });
        });

    },

    getByName(name) {
        return new Promise((resolve, reject) => {
            let fetchedRecords = [];
            pixBase('Acquis').select({
                filterByFormula: `{Nom} = "${name}"`
            })
                .eachPage(function page(records, fetchNextPage) {
                    fetchedRecords = fetchedRecords.concat(records);
                    fetchNextPage();

                }, function done(err) {
                    if (err) {
                        console.error(err);
                        return reject(err);
                    }
                    return resolve(fetchedRecords);
                });
        });
    },

    async addTutorial(recordId, tutorial) {
        const skillToUpdate = await _getSkillByRecordId(recordId);
        const tutorialId = tutorial.getId();

        const tutorials = skillToUpdate.get('Comprendre') || [];
        tutorials.push(tutorialId);

        // update
        return new Promise((resolve, reject) => {
            pixBase('Acquis').update(recordId,
                {
                    "Comprendre": tutorials
                },
                (err, record) => {
                    if (err) {
                        if (err.error === 'INVALID_VALUE_FOR_COLUMN') {
                            console.error(`Le tutoriel ${tutorialId} est déjà assigné au skill ${recordId}`);
                        } else {
                            console.log(`An error occurred when updating skill ${recordId}`);
                            console.error(err);
                        }
                        return reject(err);
                    }
                    console.log(`Updated record ${record.getId()}`);
                    return resolve(record);
                });
        });
    },

};
