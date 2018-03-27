'use strict';

const Promise = require('bluebird');
const pixBase = require('../airtable-bases').pix;

module.exports = {

    findTagsWithSkill() {
        return new Promise((resolve, reject) => {
            let fetchedRecords = [];
            pixBase('Tags').select({
                filterByFormula : `{Acquix}`
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


