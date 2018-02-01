'use strict';

const Promise = require('bluebird');
const base = require('../airtable-bases').pix;

module.exports = {

    find() {
        return new Promise((resolve, reject) => {
            let fetchedRecords = [];
            base('Epreuves').select({
                view: '1025-add-skills-table',
                fields: ['acquis']
            }).eachPage(function page(records, fetchNextPage) {
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

    findByCompetence(competenceRef) {
        return new Promise((resolve, reject) => {
            let fetchedRecords = [];
            base('Epreuves').select({
                view: '1025-add-skills-table',
                fields: ['acquis', 'competences'],
                filterByFormula: `{competences} = "${competenceRef}"`
            }).eachPage(function page(records, fetchNextPage) {
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

    update(recordId, changes) {
        return new Promise((resolve, reject) => {
            base('Epreuves').update(recordId, changes, (err, record) => {
                if (err) {
                    console.log(`An error occurred when updating challenge ${recordId}`);
                    console.error(err);
                    return reject(err);
                }
                console.log(`Updated record ${record.getId()}`);
                return resolve(record);
            });
        });
    }

};
