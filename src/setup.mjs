// setup.mjs
export function setup(ctx) {
  // combat modifiers values and setters
  let combatModifiers;

  ctx.onInterfaceReady(ctx => {
    // static selector for Stats box on combat screen
    const statsTable = document.querySelector('#combat-fight-container-player > ' +
      'div > ' +
      'div.row.no-gutters > ' +
      'div:nth-child(3) > ' +
      'div > ' +
      'div:nth-child(1) > ' +
      'div');

    combatModifiers = Combat(getCurrentModifiers())
    ui.create(combatModifiers, statsTable);

    // Update values when modifiers recalculated
    ctx.patch(Player, 'computeModifiers').after(() => {
      combatModifiers.updateModifiers(getCurrentModifiers());
    });
  })
}

function Combat(modifiers) {
  return {
    $template: '#combat-modifiers',
    modifiers,
    updateModifiers(newModifiers) {
      this.modifiers = { ...this.modifiers, ...newModifiers }
    }
  }
}

function getCurrentModifiers() {
  const {
    runePreservationChance,
    combatLootDoubleChance,
    increasedCombatGP,
    ammoPreservationChance,
    getGPForDamageMultiplier // unbound method
  } = game.combat.player.modifiers;
  const boundGPMulti = getGPForDamageMultiplier.bind(game.combat.player.modifiers);

  const meleeGPMulti = boundGPMulti('melee');
  const rangedGPMulti = boundGPMulti('ranged');
  const magicGPMulti = boundGPMulti('magic');

  return {
    runePreservationChance,
    combatLootDoubleChance,
    increasedCombatGP,
    ammoPreservationChance,
    meleeGPMulti,
    rangedGPMulti,
    magicGPMulti
  }
}