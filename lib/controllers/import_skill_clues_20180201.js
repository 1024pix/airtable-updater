'use strict';

const skillRepository = require('../repositories/skill-repository');

const context = {
  skillsPix: null,
  skillsTuto: null,
  filteredSkillsTuto: null
};

async function _fetchSkillsPix() {
  try {
    console.log('Fetch skills from PIX Prod…');
    context.skillsPix = await skillRepository.find();
    console.log(`${context.skillsPix.length} skills fetched`);
    console.log();
  } catch (err) {
    console.log(`An error occurred when fetching skills from Pix base`);
  }
}

async function _fetchSkillsTuto() {
  try {
    console.log('Fetch skills from Tuto…');
    context.skillsTuto = await skillRepository.findFromTutos();
    console.log(`${context.skillsTuto.length} skills fetched`);
    console.log();
  } catch (err) {
    console.log(`An error occurred when fetching skills from Tutorials base`);
  }
}

function _filterSkillsTuto() {
  console.log('Filter skills from Tuto…');
  context.filteredSkillsTuto = context.skillsTuto.filter(skillTuto => {
    return context.skillsPix.find(skillPix => {
      return skillPix.get('Nom') === skillTuto.get('Acquix');
    });
  });
  console.log(context.filteredSkillsTuto.length + ' skills matched…');
  context.filteredSkillsTuto.forEach(skillTuto => console.log(`${skillTuto.get('Acquix')}`));
  console.log();
}

function _printIgnoredSkillsTuto() {
  const ignoreSkillsTuto = context.skillsTuto.filter(skillTuto => {
    const matchedSkill = context.filteredSkillsTuto.find(filteredSkill => {
      return filteredSkill.get('Acquix') === skillTuto.get('Acquix');
    });
    return !matchedSkill;
  });
  console.log(ignoreSkillsTuto.length + ' skills were ignored:');
  ignoreSkillsTuto.map(skillTuto => console.log(`  ${skillTuto.get('Acquix')}`));
  console.log();
}

async function _updateSkillsPix() {
  try {
    console.log('Update skills in PIX Prod…');
    const patches = context.filteredSkillsTuto.map(skillTuto => {
      const skillPix = context.skillsPix.find(skillPix => skillPix.get('Nom') === skillTuto.get('Acquix'));
      return {
        recordId: skillPix.getId(),
        changes: { 'Indice': skillTuto.get('indice') }
      };
    });

    const requests = patches.map(patch => {
      return skillRepository.update(patch.recordId, patch.changes);
    });

    await Promise.all(requests);
    console.log('Skills updated');
    console.log();
  } catch (err) {
    console.log(`An error occurred when updating skills on Pix base`);
  }
}

async function run() {

  await _fetchSkillsPix();
  await _fetchSkillsTuto();
  _filterSkillsTuto();
  _printIgnoredSkillsTuto();
  await _updateSkillsPix();

}

module.exports = run;
