// setup.mjs
export async function setup(ctx) {
  // import modules
  const combat = await ctx.loadModule('src/combat.mjs');
  const fishing = await ctx.loadModule('src/fishing.mjs');

  // load styles
  ctx.loadStylesheet('src/templates/styles.css');

  //
  const { Combat, getCombatHost, getCombatModifiers } = combat;
  const { Fishing, getFishingHost, getFishingModifiers } = fishing;
  // combat modifiers values and setters
  let combatModifiers,
    fishingModifiers;
  let combatMounted = false;
  let fishingMounted = false;

  ctx.onInterfaceReady(ctx => {
    // combat
    combatModifiers = Combat(getCombatModifiers());
    try {
      let combatHost = getCombatHost();
      ui.create(combatModifiers, combatHost);
      combatMounted = true;
    } catch (e) {
      console.error(e);
    }

    // fishing
    fishingModifiers = Fishing(getFishingModifiers());
    try {
      let fishingHost = getFishingHost();
      ui.create(fishingModifiers, fishingHost);
      fishingMounted = true;
    } catch (e) {
      console.error(e);
    }

    // Update values when modifiers recalculated
    ctx.patch(Player, 'computeModifiers').after(() => {
      const modifiers = getCurrentModifiers();
      if (combatMounted)
        combatModifiers.updateModifiers(getCombatModifiers());
      if (fishingMounted)
        fishingModifiers.updateModifiers(getFishingModifiers());
    });
  })
}

function getCurrentModifiers() {
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
    increasedCombatGP: game.modifiers.increasedCombatGP,
    chanceForLostChest: game.fishing.chanceForLostChest,
    chanceForExtraFish: game.fishing.chanceForOneExtraFish,
    fishingMasteryModifier: game.fishing.getMasteryXPModifier(),
    fishingXPModifier: game.fishing.getXPModifier()
  }
}