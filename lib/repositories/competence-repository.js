'use strict';

const Promise = require('bluebird');
const base = require('../airtable-bases').pix;

module.exports = {

    find() {
        return new Promise((resolve, reject) => {
            let fetchedRecords = [];
            base('Competences').select({
                fields: ['Référence']
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

};
