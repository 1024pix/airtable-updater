'use strict';

const Promise = require('bluebird');
const competenceRepository = require('../lib/competence-repository');
const challengeRepository = require('../lib/challenge-repository');
const skillRepository = require('../lib/skill-repository');

const context = {
    skills: null,
    competences: null
};

async function _fetchSkills() {
    try {
        console.log('Fetch all skills...');
        context.skills = await skillRepository.find();
        console.log(`${context.skills.length} skills fetched`);
        console.log();
    } catch (err) {
        console.log(`An error occurred when fetching skills`);
    }
}

async function _fetchChallenges() {
    try {
        console.log('Fetch all challenges...');
        context.challenges = await challengeRepository.find();
        console.log(`${context.challenges.length} challenges fetched`);
        console.log();
    } catch(err) {
        console.log(`An error occurred when fetching skills`);
    }
}

async function _updateChallengesSkillsColumn() {
    try {
        console.log('Update challenges by setting new Skill link');
        const patches = context.challenges.reduce((accu, challenge) => {
            let linkedSkills = challenge.get('acquis');

            // remove duplicates
            linkedSkills = Array.from(new Set(linkedSkills));

            if (linkedSkills && linkedSkills.length > 0) {
                const skillIds = linkedSkills.map((skillName) => {
                    const skill = context.skills.find((skill) => skill.get('Nom') === skillName);
                    return skill.getId();
                });
                const patch = {
                    recordId: challenge.getId(),
                    changes: {'Acquix': skillIds}
                };
                accu.push(patch);
            }
            return accu;
        }, []);
        const requests = patches.map(patch => {
            return challengeRepository.update(patch.recordId, patch.changes);
        });
        await Promise.all(requests);
        console.log('Challenges updated');
        console.log();
    } catch (err) {
        console.error('An error occurred when updating challenges "Acquix" column');
    }
}

/* --- */

async function run(options) {

    if (!options.dryRun) {
        console.warn('You are going to write / replace data on Airtable ; use Ctrl-C to stop at any time');
        console.log();
    }

    await _fetchSkills();
    await _fetchChallenges();

    if (options.dryRun) {
        console.log('Treatment finished without writing anything because of --dry-run option enabled');
        console.log();
        process.exit();
    }

    await _updateChallengesSkillsColumn();
    process.exit();
}

/* Main program */
let args = process.argv;
args.splice(0, 2);
let options = {};
args.forEach((val, index, array) => {
    if (val === '--dry-run') {
        options.dryRun = true;
    }
});
run(options);
