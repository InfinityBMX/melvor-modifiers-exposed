// setup.mjs
export async function setup(ctx) {
  // import modules
  const combat = await ctx.loadModule('src/combat.mjs');
  const fishing = await ctx.loadModule('src/fishing.mjs');
  const woodcutting = await ctx.loadModule('src/woodcutting.mjs');

  // load styles
  ctx.loadStylesheet('src/templates/styles.css');

  const { CombatModifiers, getCombatHost, getCombatModifiers } = combat;
  const { FishingModifiers, getFishingHost, getFishingModifiers } = fishing;
  const { WoodcuttingModifiers, getWoodcuttingHost, getWoodcuttingModifiers } = woodcutting;

  // app handles
  let combatModifiers,
    fishingModifiers,
    woodcuttingModifiers;
  // app flags
  let combatMounted = false;
  let fishingMounted = false;
  let woodcuttingMounted = false;

  ctx.onInterfaceReady(ctx => {
    // combat
    combatModifiers = CombatModifiers(getCombatModifiers());
    try {
      let combatHost = getCombatHost();
      ui.create(combatModifiers, combatHost);
      combatMounted = true;
    } catch (e) {
      console.error(e);
    }

    // fishing
    fishingModifiers = FishingModifiers(getFishingModifiers());
    try {
      let fishingHost = getFishingHost();
      ui.create(fishingModifiers, fishingHost);
      fishingMounted = true;
    } catch (e) {
      console.error(e);
    }

    // woodcutting
    woodcuttingModifiers = WoodcuttingModifiers(getWoodcuttingModifiers());
    try {
      let woodcuttingHost = getWoodcuttingHost();
      ui.create(woodcuttingModifiers, woodcuttingHost);
      woodcuttingMounted = true;
    } catch (e) {
      console.error(e);
    }

    // Update values when modifiers recalculated
    ctx.patch(Player, 'computeModifiers').after(() => {
      if (combatMounted)
        combatModifiers.updateModifiers(getCombatModifiers());
      if (fishingMounted)
        fishingModifiers.updateModifiers(getFishingModifiers());
      if (woodcuttingMounted)
        woodcuttingModifiers.updateModifiers(getWoodcuttingModifiers());
    });

    // Update woodcutting when switching trees
    ctx.patch(Woodcutting, 'selectTree').after(() => {
      if (woodcuttingMounted)
        woodcuttingModifiers.updateModifiers(getWoodcuttingModifiers());
    })
    // Update woodcutting if Pool Bonus goes up or down
    ctx.patch(Woodcutting, 'onMasteryPoolBonusChange').after(() => {
      if (woodcuttingMounted)
        woodcuttingModifiers.updateModifiers(getWoodcuttingModifiers());
    })
  })
}