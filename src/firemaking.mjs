export function FiremakingModifiers(modifiers) {
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

export const getFiremakingHost = () => {
  // main firemaking container
  const container = document.getElementById('firemaking-container');
  // 2nd child of firemaking container
  const area = container.children[1];
  if (container && area) {
    const myDiv = document.createElement('div');
    myDiv.classList.add('row', 'row-deck');
    // inject after top bar
    return container.insertBefore(myDiv, area);
  }
  return null;
}

export const getFiremakingModifiers = () => {
  const fireMods = [];
  const skill = game.firemaking;
  // Common
  const masteryModifier = skill.getMasteryXPModifier();
  const xPModifier = skill.getXPModifier();
  const signet = skill.rareDrops.find(drop => drop.item.id === 'melvorD:Gold_Topaz_Ring');
  const jewel = skill.rareDrops.find(drop => drop.item.id === 'melvorD:Jewel_of_Rhaelyx');
  const circlet = skill.rareDrops.find(drop => drop.item.id === 'melvorD:Circlet_of_Rhaelyx');
  const stone = skill.rareDrops.find(drop => drop.item.id === 'melvorD:Mysterious_Stone');

  const gpMultiplier = skill.getFiremakingGPMultiplier();
  const {
    ashChance,
    coalChance,
    diamondChance,
    ashQty,
    generousFireSpiritChance,
    charcoalChance
  } = skill;
  let gpPerBurn = 0;
  let doublingChance = 0;
  let stardustChance = 0;
  let circletChance = 0;
  let jewelChance = 0;
  let signetChance = 0;
  let stoneChance = 0;
  let preservationChance = 0;
  if (skill.isActive) {
    const baseSalePrice = skill.activeRecipe.log.sellsFor;
    gpPerBurn = (baseSalePrice * game.modifiers.increasedFiremakingLogGP) / 100;
    if (skill.isPoolTierActive(2)) {
      gpPerBurn += baseSalePrice * 0.25;
    }
    gpPerBurn = applyModifier(gpPerBurn, skill.getFiremakingGPMultiplier());

    doublingChance = skill.getDoublingChance(skill.activeRecipe);

    stardustChance = skill.getStardustChance(skill.activeRecipe);

    circletChance = circlet ? skill.getRareDropChance(skill.actionLevel, circlet.chance) : 0;
    jewelChance = jewel ? skill.getRareDropChance(skill.actionLevel, jewel.chance) : 0;
    stoneChance = stone ? skill.getRareDropChance(skill.actionLevel, stone.chance) : 0;
    signetChance = signet && game.modifiers.allowSignetDrops ? skill.getRareDropChance(skill.actionLevel, signet.chance) : 0;
    preservationChance = skill.actionPreservationChance;
  }

  fireMods.push({
    id: 'masteryModifier',
    label: 'Mastery Bonus',
    show: true,
    value: `${convert(masteryModifier)}%`
  });

  fireMods.push({
    id: 'xPModifier',
    label: 'XP Bonus',
    show: true,
    value: `${convert(xPModifier)}%`
  });

  fireMods.push({
    id: 'preservationChance',
    label: 'Preservation Chance',
    show: skill.isActive,
    value: `${convert(preservationChance)}%`
  });

  fireMods.push({
    id: 'doublingChance',
    label: 'Chance to Double',
    show: skill.isActive,
    value: `${convert(doublingChance)}%`
  });

  fireMods.push({
    id: 'gpModifier',
    label: 'GP Multiplier',
    show: gpMultiplier > 0,
    value: `${convert(gpMultiplier)}%`
  });

  fireMods.push({
    id: 'gpPerBurn',
    label: 'GP Per Log',
    show: gpPerBurn > 0,
    value: `${convert(gpPerBurn)}GP`
  });

  fireMods.push({
    id: 'ashChance',
    label: 'Ash Chance',
    show: ashChance > 0,
    value: `${convert(ashChance)}%`
  });

  fireMods.push({
    id: 'ashQty',
    label: 'Base Ash',
    show: ashQty > 0,
    value: `${convert(ashQty)}`
  });

  fireMods.push({
    id: 'coalChance',
    label: 'Coal Chance',
    show: coalChance > 0,
    value: `${convert(coalChance)}%`
  });

  fireMods.push({
    id: 'diamondChance',
    label: 'Diamond Chance',
    show: diamondChance > 0,
    value: `${convert(diamondChance)}%`
  });

  fireMods.push({
    id: 'stardustChance',
    label: 'Stardust Chance',
    show: stardustChance > 0,
    value: `${convert(stardustChance)}%`
  });

  fireMods.push({
    id: 'fireSpiritChance',
    label: 'Fire Spirit Chance',
    show: generousFireSpiritChance > 0,
    value: `${convert(generousFireSpiritChance)}%`
  });

  fireMods.push({
    id: 'charcoalChance',
    label: 'Charcoal Chance',
    show: charcoalChance > 0,
    value: `${convert(charcoalChance)}%`
  });

  fireMods.push({
    id: 'circletChance',
    label: 'Circlet of Rhaelex Chance',
    show: circletChance > 0,
    value: `${convert(circletChance)}%`
  });

  fireMods.push({
    id: 'jewelChance',
    label: 'Jewel of Rhaelyx Chance',
    show: jewelChance > 0,
    value: `${convert(jewelChance)}%`
  });

  fireMods.push({
    id: 'stoneChance',
    label: 'Mysterious Stone Chance',
    show: stoneChance > 0,
    value: `${convert(stoneChance)}%`
  });

  fireMods.push({
    id: 'signetChance',
    label: 'Signet Half A Chance',
    show: signetChance > 0,
    value: `${convert(signetChance)}%`
  });

  return fireMods;
}

const convert = (number) => +number.toFixed(5)