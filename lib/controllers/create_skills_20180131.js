'use strict';

const Promise = require('bluebird');
const competenceRepository = require('../repositories/competence-repository');
const challengeRepository = require('../repositories/challenge-repository');
const skillRepository = require('../repositories/skill-repository');

const context = {
  competences: null,
  challenges: null,
  skills: null
};


/* INTERNALS */

async function _fetchCompetences() {
  try {
    console.log('Fetch all competences...');
    const competences = await competenceRepository.find();
    context.competences = competences.sort();
    console.log(`${context.competences.length} competences fetched: `);
    context.competences.forEach(competence => console.log(`  ${competence.get('Référence')}`));
    console.log();
  } catch (err) {
    console.log(`An error occurred when fetching competences`);
  }
}

async function _fetchChallenges() {
  try {
    console.log('Fetch all challenges (by competence)...');
    context.challengesByCompetence = {};
    context.competences.forEach((competence) => {
      context.challengesByCompetence[competence.get('Référence')] = challengeRepository.findByCompetence(competence.get('Référence'));
    });
    const challengesByCompetence = await Promise.props(context.challengesByCompetence);
    context.challenges = context.competences.reduce((accu, competence) => {
      return accu.concat(challengesByCompetence[competence.get('Référence')]);
    }, []);
    console.log(`${context.challenges.length} challenges fetched`);
    context.challenges.forEach(challenge => console.log(`  ${challenge.getId()}`));
    console.log();
  } catch (err) {
    console.log(`An error occurred when fetching challenges`);
  }
}

async function _extractSkillsWithtouDuplicates() {
  console.log('Extract skills from challenges');
  const skills = context.challenges.reduce((accu, challenge) => {
    challenge.get('acquis').forEach((skill) => {
      accu.push({
        name: skill,
        challenges: [challenge.getId()],
        competence: challenge.get('competences')[0]
      });
    });
    return accu;
  }, []);
  const alreadyAddedSkills = [];
  context.skillsToCreate = skills.reduce((accu, skill) => {
    const alreadyAddedSkill = alreadyAddedSkills.find((s) => s.name === skill.name);
    if (!alreadyAddedSkill) {
      alreadyAddedSkills.push(skill);
      accu.push(skill);
    } else {
      alreadyAddedSkill.challenges = alreadyAddedSkill.challenges.concat(skill.challenges);
    }
    return accu;
  }, []);
  console.log(`${context.skillsToCreate.length} skills found:`);
  context.skillsToCreate.forEach(skill => console.log(`  ${skill.name}: ${skill.challenges.toString()}`));
  console.log();
}

async function _populateSkillsTable() {
  try {
    console.log('Populate table "Acquis"');
    const promises = context.skillsToCreate.map((skill) => skillRepository.create(skill));
    await Promise.all(promises);
  } catch (err) {
    console.error('An error occurred when populating table "Acquis"');
  }
}

async function run() {

  await _fetchCompetences();
  await _fetchChallenges();
  await _extractSkillsWithtouDuplicates();
  await _populateSkillsTable();

}

module.exports = run;
