'use strict';

const Promise = require('bluebird');
const pixBase = require('../airtable-bases').pix;

module.exports = {
    findTutorialsWithSkill() {
        return new Promise((resolve, reject) => {
            let fetchedRecords = [];
            pixBase('Tutoriels').select({
                filterByFormula : `{Solution à}`
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

    findAdditionalTutorialsWithSkills() {
        return new Promise((resolve, reject) => {
            let fetchedRecords = [];
            pixBase('Tutoriels').select({
                filterByFormula : `{En Savoir plus}`
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
    }
};
