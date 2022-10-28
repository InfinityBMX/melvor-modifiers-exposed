// setup.mjs
export async function setup(ctx) {
  // import modules
  const combat = await ctx.loadModule('src/combat.mjs');
  const fishing = await ctx.loadModule('src/fishing.mjs');
  const woodcutting = await ctx.loadModule('src/woodcutting.mjs');
  const firemaking  = await ctx.loadModule('src/firemaking.mjs');
  const mining = await ctx.loadModule('src/mining.mjs');

  // load styles
  ctx.loadStylesheet('src/templates/styles.css');

  const { CombatModifiers, getCombatHost, getCombatModifiers } = combat;
  const { FishingModifiers, getFishingHost, getFishingModifiers } = fishing;
  const { WoodcuttingModifiers, getWoodcuttingHost, getWoodcuttingModifiers } = woodcutting;
  const { FiremakingModifiers, getFiremakingHost, getFiremakingModifiers } = firemaking;
  const { MiningModifiers, getMiningHost, getMiningModifiers } = mining;

  // app handles
  let combatModifiers,
    fishingModifiers,
    woodcuttingModifiers,
    firemakingModifiers,
    miningModifiers;
  // app flags
  let combatMounted = false;
  let fishingMounted = false;
  let woodcuttingMounted = false;
  let firemakingMounted = false;
  let miningMounted = false;

  const refresh = () => {
    if (combatMounted)
      combatModifiers.updateModifiers(getCombatModifiers());
    if (fishingMounted)
      fishingModifiers.updateModifiers(getFishingModifiers());
    if (woodcuttingMounted)
      woodcuttingModifiers.updateModifiers(getWoodcuttingModifiers());
    if (firemakingMounted)
      firemakingModifiers.updateModifiers(getFiremakingModifiers());
    if (miningMounted)
      miningModifiers.updateModifiers(getMiningModifiers());
  }

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

    // firemaking
    firemakingModifiers = FiremakingModifiers(getFiremakingModifiers());
    try {
      let firemakingHost = getFiremakingHost();
      ui.create(firemakingModifiers, firemakingHost);
      firemakingMounted = true;
    } catch (e) {
      console.error(e);
    }

    // mining
    miningModifiers = MiningModifiers(getMiningModifiers());
    try {
      let miningHost = getMiningHost();
      ui.create(miningModifiers, miningHost);
      miningMounted = true;
    } catch (e) {
      console.error(e);
    }

    // Update values when modifiers recalculated
    ctx.patch(Player, 'computeModifiers').after(refresh);
    // Any gathering skill starts or stops
    ctx.patch(GatheringSkill, 'start').after(refresh);
    ctx.patch(GatheringSkill, 'stop').after(refresh);
    // Any crafting skill starts or stops
    ctx.patch(CraftingSkill, 'start').after(refresh);
    ctx.patch(CraftingSkill, 'stop').after(refresh);
    // Any mastery pool bonus changes
    ctx.patch(SkillWithMastery, 'onMasteryPoolBonusChange').after(refresh);
  });
}