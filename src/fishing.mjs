export function FishingModifiers(modifiers) {
  return {
    $template: '#fishing-modifiers',
    modifiers,
    updateModifiers(newModifiers) {
      this.modifiers = { ...this.modifiers, ...newModifiers }
    }
  }
}

export const getFishingHost = () => {
  // main fishing container
  const container = document.getElementById('fishing-container');
  // 2nd child of fishing container
  const area = document.getElementById('fishing-area-menu-container');
  if (container && area) {
    const myDiv = document.createElement('div');
    myDiv.classList.add('row', 'row-deck');
    // inject after top bar
    return container.insertBefore(myDiv, area);
  }
  return null;
}

export const getFishingModifiers = () => {
  let stoneChance = 0;
  let circletChance = 0;
  let signetChance = 0;
  const signet = game.fishing.rareDrops.find(drop => drop.item.id === 'melvorD:Gold_Topaz_Ring');
  const circlet = game.fishing.rareDrops.find(drop => drop.item.id === 'melvorD:Circlet_of_Rhaelyx');
  const stone = game.fishing.rareDrops.find(drop => drop.item.id === 'melvorD:Mysterious_Stone');
  const level = game.fishing.isActive ? game.fishing.actionLevel : 0;
  const chanceForExtraFish = convert(game.fishing.chanceForOneExtraFish);
  const extraResource = convert(game.modifiers.getSkillModifierValue('increasedChanceAdditionalSkillResource', game.fishing)
    - game.modifiers.getSkillModifierValue('decreasedChanceAdditionalSkillResource', game.fishing));
  const doublingChance = convert(game.fishing.getDoublingChance());
  const doubleRewards = game.modifiers.getSkillModifierValue('doubleItemsSkill', game.fishing);
  // Mastery 99 doubles base reward. Below 99 is 40% of mastery level
  const base2Fish = convert(game.fishing.isActive ? (game.fishing.masteryLevel >= 99 ? 1 : game.fishing.masteryLevel * 0.4) : 0);
  const maxReward = (base2Fish > 0 ? 2 : 1) * (doublingChance > 0 ? 2 : 1) * Math.pow(2, doubleRewards) + (extraResource > 0 ? 1 : 0) + (chanceForExtraFish > 0 ? 1 : 0);
  if (game.fishing.isActive) {
    stoneChance = convert(stone && game.checkRequirements(stone.requirements) ? game.fishing.getRareDropChance(level, stone.chance) : 0);
    circletChance = convert(circlet ? game.fishing.getRareDropChance(level, circlet.chance) : 0);
    signetChance = convert(signet && game.modifiers.allowSignetDrops ? game.fishing.getRareDropChance(level, signet.chance) : 0);
  }

  return {
    base2Fish,
    doublingChance,
    doubleRewards: doubleRewards ? 'Yes' : 'No',
    extraResource,
    chanceForExtraFish,
    maxReward,
    fishingMasteryModifier: convert(game.fishing.getMasteryXPModifier()),
    fishingXPModifier: convert(game.fishing.getXPModifier()),
    circletChance,
    stoneChance,
    signetChance,
    chanceForLostChest: convert(game.fishing.chanceForLostChest)
  }
}

const convert = (number) => +number.toFixed(5)