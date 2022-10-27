export function WoodcuttingModifiers(modifiers) {
  return {
    $template: '#woodcutting-modifiers',
    modifiers,
    updateModifiers(newModifiers) {
      this.modifiers = { ...this.modifiers, ...newModifiers }
    }
  }
}

export const getWoodcuttingHost = () => {
  // main fishing container
  const container = document.getElementById('woodcutting-container');
  // 2nd child of fishing container
  const area = document.getElementById('woodcutting-tree-container');
  if (container && area) {
    const myDiv = document.createElement('div');
    myDiv.classList.add('row', 'row-deck');
    // inject after top bar
    return container.insertBefore(myDiv, area);
  }
  return null;
}

export const getWoodcuttingModifiers = () => {
  const skill = game.woodcutting;
  // Common
  const signet = skill.rareDrops.find(drop => drop.item.id === 'melvorD:Gold_Topaz_Ring');
  const circlet = skill.rareDrops.find(drop => drop.item.id === 'melvorD:Circlet_of_Rhaelyx');
  const stone = skill.rareDrops.find(drop => drop.item.id === 'melvorD:Mysterious_Stone');
  const level = skill.isActive ? skill.actionLevel : 0;
  const extraResource = game.modifiers.getSkillModifierValue('increasedChanceAdditionalSkillResource', skill)
    - game.modifiers.getSkillModifierValue('decreasedChanceAdditionalSkillResource', skill);

  const shaftChance = game.modifiers.increasedChanceForArrowShaftsWoodcutting
    - game.modifiers.decreasedChanceForArrowShaftsWoodcutting;

  const doublingChances = [];
  if (skill.isActive) {
    skill.activeTrees.forEach(tree => {
      doublingChances.push({ chance: skill.getDoublingChance(tree), name: tree.name});
    });
  }
  return {
    birdNestBase: skill.getBirdNestChance(),
    birdNestChance: (skill.getBirdNestChance() * (1 + game.modifiers.increasedOffItemChance / 100)).toFixed(2),
    birdNestQuantity: skill.getBirdNestQuantity(),
    ravenNestBase: skill.getRavenNestChance(),
    ravenNestChance: (skill.getRavenNestChance() * (1 + game.modifiers.increasedOffItemChance / 100)).toFixed(2),
    stardustChance: skill.stardustChance,
    ashChance: skill.ashChance,
    shaftChance,
    gemChance: game.modifiers.increasedWoodcuttingGemChance,
    jewelryChance: game.modifiers.increasedWoodcuttingJewelryChance,
    doublingChances,
    doubleLogs: game.modifiers.doubleLogProduction > 0 ? 'Yes' : 'No',
    extraResource,
    masteryModifier: skill.getMasteryXPModifier(),
    xPModifier: skill.getXPModifier(),
    circletChance: skill.isActive && circlet ? skill.getRareDropChance(level, circlet.chance) : 0,
    stoneChance: skill.isActive && stone ? skill.getRareDropChance(level, stone.chance) : 0,
    signetChance: skill.isActive && signet && game.modifiers.allowSignetDrops ? skill.getRareDropChance(level, signet.chance).toFixed(5) : 0,
  }
}





