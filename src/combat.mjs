export function CombatModifiers(modifiers) {
  return {
    $template: '#combat-modifiers',
    modifiers,
    updateModifiers(newModifiers) {
      this.modifiers = { ...this.modifiers, ...newModifiers }
    }
  }
}

export const getCombatHost = () => {
/*  const myDiv = document.createElement('div');
  myDiv.classList.add('block', 'block-rounded');
  return document.getElementById('combat-fight-container-player')
    .appendChild(myDiv);*/
  // main combat container
  const container = document.getElementById('combat-container');
  // 2nd child of combat container
  const area = document.getElementById('combat-area-selection');
  if (container && area) {
    const myDiv = document.createElement('div');
    myDiv.classList.add('row', 'row-deck', 'gutters-tiny');
    // inject after top bar
    return container.insertBefore(myDiv, area);
  }
}

export const getCombatModifiers = () => {
  const {
    getGPForDamageMultiplier // unbound method
  } = game.modifiers;
  const boundGPMulti = getGPForDamageMultiplier.bind(game.modifiers);

  return {
    meleeGPMulti: boundGPMulti('melee') / 10,
    rangedGPMulti: boundGPMulti('ranged') / 10,
    magicGPMulti: boundGPMulti('magic') / 10,
    ammoPreservationChance: game.modifiers.ammoPreservationChance,
    runePreservationChance: game.modifiers.runePreservationChance,
    combatLootDoubleChance: game.modifiers.combatLootDoubleChance,
    increasedCombatGP: game.modifiers.increasedCombatGP
  }
}