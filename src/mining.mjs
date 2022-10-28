export function MiningModifiers(modifiers) {
  return {
    $template: '#modifiers-block',
    modifiers,
    showBlock: modifiers.some(mod => mod.show),
    updateModifiers(newModifiers) {
      newModifiers.forEach(modifier => {
        const modIndex = this.modifiers.findIndex(oldMod => oldMod.id === modifier.id);
        if (modIndex !== -1)
          this.modifiers[modIndex] = modifier;
        else
          this.modifiers.push(modifier);
      });
      this.showBlock = this.modifiers.some(mod => mod.show);
    }
  }
}

export const getMiningHost = () => {
  // main mining container
  const container = document.getElementById('mining-container');
  // ore container
  const area = document.getElementById('mining-ores-container');
  if (container && area) {
    const myDiv = document.createElement('div');
    myDiv.classList.add('row', 'row-deck');
    // inject after top bar
    return container.insertBefore(myDiv, area);
  }
  return null;
}

export const getMiningModifiers = () => {
  const miningMods = [];
  const skill = game.mining;
  // Common Modifiers
  const masteryModifier = skill.getMasteryXPModifier();
  const xPModifier = skill.getXPModifier();
  // Rare Items
  const signet = skill.rareDrops.find(drop => drop.item.id === 'melvorD:Gold_Topaz_Ring');
  const jewel = skill.rareDrops.find(drop => drop.item.id === 'melvorD:Jewel_of_Rhaelyx');
  const circlet = skill.rareDrops.find(drop => drop.item.id === 'melvorD:Circlet_of_Rhaelyx');
  const stone = skill.rareDrops.find(drop => drop.item.id === 'melvorD:Mysterious_Stone');

  // Static Modifiers
  const extraResource = game.modifiers.getSkillModifierValue('increasedChanceAdditionalSkillResource', skill)
      - game.modifiers.getSkillModifierValue('decreasedChanceAdditionalSkillResource', skill);
  const extraMeteorite = game.modifiers.increasedChanceExtraMeteoriteOre
      - game.modifiers.decreasedChanceExtraMeteoriteOre;
  const extraOre = game.modifiers.increasedChanceForOneExtraOre
      - game.modifiers.decreasedChanceForOneExtraOre;

  // Easy Modifiers
  const {
    doubleOresMining,
    doubleRuneEssenceMining,
    doubleSilverGoldMining,
    increasedMeteoriteOre,
    increasedBonusCoalMining,
    increasedMiningBarChance
  } = game.modifiers;
  const {
    rockHPPreserveChance,
    chanceToDoubleGems
  } = skill;

  // Initialize Active Only Modifiers
  let rockGemChance = 0;
  let rockSuperiorGemChance = 0;
  let doublingChance = 0;
  let circletChance = 0;
  let jewelChance = 0;
  let signetChance = 0;
  let stoneChance = 0;

  // Active Only Modifiers
  if (skill.isActive) {
    rockGemChance = skill.getRockGemChance(skill.activeRock);
    rockSuperiorGemChance = skill.getRockSuperiorGemChance(skill.activeRock);
    doublingChance = skill.getDoublingChance(skill.activeRock);
    // rare drops
    circletChance = circlet ? skill.getRareDropChance(skill.actionLevel, circlet.chance) : 0;
    jewelChance = jewel ? skill.getRareDropChance(skill.actionLevel, jewel.chance) : 0;
    stoneChance = stone ? skill.getRareDropChance(skill.actionLevel, stone.chance) : 0;
    signetChance = signet && game.modifiers.allowSignetDrops ? skill.getRareDropChance(skill.actionLevel, signet.chance) : 0;
  }

  miningMods.push({
    id: 'masteryModifier',
    label: 'Mastery Bonus',
    show: true,
    value: `${convert(masteryModifier)}%`
  });

  miningMods.push({
    id: 'xPModifier',
    label: 'XP Bonus',
    show: true,
    value: `${convert(xPModifier)}%`
  });

  miningMods.push({
    id: 'rockHPPreserveChance',
    label: 'Rock HP Preservation Chance',
    show: rockHPPreserveChance > 0,
    value: `${convert(rockHPPreserveChance)}%`
  });

  miningMods.push({
    id: 'doublingChance',
    label: 'Chance to Double Rewards',
    show: skill.isActive,
    value: `${convert(doublingChance)}%`
  });

  miningMods.push({
    id: 'doubleOresMining',
    label: 'Double Ores',
    show: true,
    value: `${doubleOresMining ? 'Yes' : 'No'}`
  });

  miningMods.push({
    id: 'doubleRuneEssence',
    label: 'Double Rune Essence',
    show: true,
    value: `${doubleRuneEssenceMining ? 'Yes' : 'No'}`
  });

  miningMods.push({
    id: 'doubleSilverGoldMining',
    label: 'Double Silver/Gold',
    show: true,
    value: `${doubleSilverGoldMining ? 'Yes' : 'No'}`
  });

  miningMods.push({
    id: 'increasedMeteoriteOre',
    label: 'Increased Meteorite Ore',
    show: true,
    value: `${convert(increasedMeteoriteOre)}`
  })

  miningMods.push({
    id: 'chanceToDoubleGems',
    label: 'Chance to Double Gems',
    show: chanceToDoubleGems > 0,
    value: `${convert(chanceToDoubleGems)}%`
  });

  miningMods.push({
    id: 'rockGemChance',
    label: 'Gem Chance',
    show: rockGemChance > 0,
    value: `${convert(rockGemChance)}%`
  });

  miningMods.push({
    id: 'rockSuperiorGemChance',
    label: 'Superior Gem Chance',
    show: rockSuperiorGemChance > 0,
    value: `${convert(rockSuperiorGemChance)}`
  });

  miningMods.push({
    id: 'extraResource',
    label: 'Extra Resource Chance',
    show: extraResource > 0,
    value: `${convert(extraResource)}%`
  });

  miningMods.push({
    id: 'extraMeteorite',
    label: 'Extra Meteorite Chance',
    show: extraMeteorite > 0,
    value: `${convert(extraMeteorite)}%`
  });

  miningMods.push({
    id: 'extraOre',
    label: 'Extra Ore Chance',
    show: extraOre > 0,
    value: `${convert(extraOre)}%`
  });

  miningMods.push({
    id: 'increasedBonusCoalMining',
    label: 'Bonus Coal',
    show: increasedBonusCoalMining > 0,
    value: `${convert(increasedBonusCoalMining)}`
  });

  miningMods.push({
    id: 'increasedMiningBarChance',
    label: 'Chance to Mine Bar',
    show: increasedMiningBarChance > 0,
    value: `${convert(increasedMiningBarChance)}`
  });

  miningMods.push({
    id: 'circletChance',
    label: 'Circlet of Rhaelex Chance',
    show: circletChance > 0,
    value: `${convert(circletChance)}%`
  });

  miningMods.push({
    id: 'jewelChance',
    label: 'Jewel of Rhaelyx Chance',
    show: jewelChance > 0,
    value: `${convert(jewelChance)}%`
  });

  miningMods.push({
    id: 'stoneChance',
    label: 'Mysterious Stone Chance',
    show: stoneChance > 0,
    value: `${convert(stoneChance)}%`
  });

  miningMods.push({
    id: 'signetChance',
    label: 'Signet Half A Chance',
    show: signetChance > 0,
    value: `${convert(signetChance)}%`
  });

  return miningMods;
}

const convert = (number) => +number.toFixed(5)