'use strict';

const Promise = require('bluebird');
const base = require('./airtable-base');

module.exports = {

    create(skill) {
        return new Promise((resolve, reject) => {
            base('Acquis').create({
                "Nom": skill.name,
                "Statut": "Validé",
                "Compétence": [skill.competence]
            }, function (err, record) {
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

    find() {
        return new Promise((resolve, reject) => {
            let fetchedRecords = [];
            base('Acquis').select()
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
    }

};
