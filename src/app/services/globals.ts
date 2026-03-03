import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Globals {

    private _oreGeneration = [
    { value: 'ore_ancient_debris_large.json', label: 'Ancient debris (large)' },
    { value: 'ore_andesite_lower.json', label: 'Andesite (lower)' },
    { value: 'ore_andesite_upper.json', label: 'Andesite (upper)' },
    { value: 'ore_blackstone.json', label: 'Blackstone' },
    { value: 'ore_clay.json', label: 'Clay' },
    { value: 'ore_coal_lower.json', label: 'Coal ore (lower)' },
    { value: 'ore_coal_upper.json', label: 'Coal ore (upper)' },
    { value: 'ore_copper_large.json', label: 'Copper ore (large)' },
    { value: 'ore_copper.json', label: 'Copper ore' },
    { value: 'ore_debris_small.json', label: 'Ancient debris (small)' },
    { value: 'ore_diamond_buried.json', label: 'Diamond ore (buried)' },
    { value: 'ore_diamond_large.json', label: 'Diamond ore (large)' },
    { value: 'ore_diamond_medium.json', label: 'Diamond ore (medium)' },
    { value: 'ore_diamond.json', label: 'Diamond ore' },
    { value: 'ore_diorite_lower.json', label: 'Diorite (lower)' },
    { value: 'ore_diorite_upper.json', label: 'Diorite (upper)' },
    { value: 'ore_dirt.json', label: 'Dirt' },
    { value: 'ore_emerald.json', label: 'Emerald ore' },
    { value: 'ore_gold_deltas.json', label: 'Gold ore (basalt deltas)' },
    { value: 'ore_gold_extra.json', label: 'Gold ore (extra)' },
    { value: 'ore_gold_lower.json', label: 'Gold ore (lower)' },
    { value: 'ore_gold_nether.json', label: 'Nether gold ore' },
    { value: 'ore_gold.json', label: 'Gold ore' },
    { value: 'ore_granite_lower.json', label: 'Granite (lower)' },
    { value: 'ore_granite_upper.json', label: 'Granite (upper)' },
    { value: 'ore_gravel_nether.json', label: 'Nether gravel' },
    { value: 'ore_iron_middle.json', label: 'Iron ore (middle)' },
    { value: 'ore_iron_small.json', label: 'Iron ore (small)' },
    { value: 'ore_iron_upper.json', label: 'Iron ore (upper)' },
    { value: 'ore_lapis_buried.json', label: 'Lapis ore (buried)' },
    { value: 'ore_lapis.json', label: 'Lapis ore' },
    { value: 'ore_quartz_deltas.json', label: 'Nether quartz (basalt deltas)' },
    { value: 'ore_quartz_nether.json', label: 'Nether quartz' },
    { value: 'ore_redstone_lower.json', label: 'Redstone ore (lower)' },
    { value: 'ore_redstone.json', label: 'Redstone ore' },
    { value: 'ore_tuff.json', label: 'Tuff' },
  ];

    private _heightType = [
    { value: 'minecraft:uniform', label: 'Universal' },
    { value: 'minecraft:biased_to_bottom', label: 'Biased To Bottom' },
    { value: 'minecraft:trapezoid', label: 'Trapezoid' },
    {
      value: 'minecraft:very_biased_to_bottom',
      label: 'Very Biased To Bottom',
    },
  ];

  private _smeltingRecipes = [
    { value: "coal_from_smelting_deepslate_coal_ore.json", label: "Deepslate coal ore to coal" },
    { value: "coal_from_smelting_coal_ore.json", label: "Coal ore to coal" },
    { value: "charcoal.json", label: "Charcoal" },

    { value: "copper_ingot_from_smelting_deepslate_copper_ore.json", label: "Deepslate copper ore to copper ingot" },
    { value: "copper_ingot_from_smelting_copper_ore.json", label: "Copper ore to copper ingot" },
    { value: "copper_ingot_from_smelting_raw_copper.json", label: "Raw copper to copper ingot" },
    { value: "copper_ingot_from_smelting_deepslate_copper_ore.json", label: "Deepslate copper ore to copper ingot" }, // duplicate kept
    { value: "copper_nugget_from_smelting.json", label: "Smelting to copper nugget" },

    { value: "diamond_from_smelting_deepslate_diamond_ore.json", label: "Deepslate diamond ore to diamond" },
    { value: "diamond_from_smelting_diamond_ore.json", label: "Diamond ore to diamond" },

    { value: "emerald_from_smelting_deepslate_emerald_ore.json", label: "Deepslate emerald ore to emerald" },
    { value: "emerald_from_smelting_emerald_ore.json", label: "Emerald ore to emerald" },

    { value: "gold_ingot_from_smelting_deepslate_gold_ore.json", label: "Deepslate gold ore to gold ingot" },
    { value: "gold_ingot_from_smelting_gold_ore.json", label: "Gold ore to gold ingot" },
    { value: "gold_ingot_from_smelting_nether_gold_ore.json", label: "Nether gold ore to gold ingot" },
    { value: "gold_ingot_from_smelting_raw_gold.json", label: "Raw gold to gold ingot" },
    { value: "gold_nugget_from_smelting.json", label: "Smelting to gold nugget" },

    { value: "iron_ingot_from_smelting_deepslate_iron_ore.json", label: "Deepslate iron ore to iron ingot" },
    { value: "iron_ingot_from_smelting_iron_ore.json", label: "Iron ore to iron ingot" },
    { value: "iron_ingot_from_smelting_raw_iron.json", label: "Raw iron to iron ingot" },
    { value: "iron_nugget_from_smelting.json", label: "Smelting to iron nugget" },

    { value: "lapis_lazuli_from_smelting_deepslate_lapis_ore.json", label: "Deepslate lapis ore to lapis lazuli" },
    { value: "lapis_lazuli_from_smelting_lapis_ore.json", label: "Lapis ore to lapis lazuli" },

    { value: "netherite_scrap.json", label: "Netherite scrap" },

    { value: "redstone_from_smelting_deepslate_redstone_ore.json", label: "Deepslate redstone ore to redstone" },
    { value: "redstone_from_smelting_redstone_ore.json", label: "Redstone ore to redstone" },

    { value: "stone.json", label: "Stone" },
    { value: "terracotta.json", label: "Terracotta" },
    { value: "quartz.json", label: "Quartz" },
  ];

  private _biomes = [
    { value: 'badlands.json', label: 'Badlands' },
    { value: 'bamboo_jungle.json', label: 'Bamboo jungle' },
    { value: 'basalt_deltas.json', label: 'Basalt deltas' },
    { value: 'beach.json', label: 'Beach' },
    { value: 'birch_forest.json', label: 'Birch forest' },
    { value: 'cherry_grove.json', label: 'Cherry grove' },
    { value: 'cold_ocean.json', label: 'Cold ocean' },
    { value: 'crimson_forest.json', label: 'Crimson forest' },
    { value: 'dark_forest.json', label: 'Dark forest' },
    { value: 'deep_cold_ocean.json', label: 'Deep cold ocean' },
    { value: 'deep_dark.json', label: 'Deep dark' },
    { value: 'deep_frozen_ocean.json', label: 'Deep frozen ocean' },
    { value: 'deep_lukewarm_ocean.json', label: 'Deep lukewarm ocean' },
    { value: 'deep_ocean.json', label: 'Deep ocean' },
    { value: 'desert.json', label: 'Desert' },
    { value: 'dripstone_caves.json', label: 'Dripstone caves' },
    { value: 'end_barrens.json', label: 'End barrens' },
    { value: 'end_highlands.json', label: 'End highlands' },
    { value: 'end_midlands.json', label: 'End midlands' },
    { value: 'eroded_badlands.json', label: 'Eroded badlands' },
    { value: 'flower_forest.json', label: 'Flower forest' },
    { value: 'forest.json', label: 'Forest' },
    { value: 'frozen_ocean.json', label: 'Frozen ocean' },
    { value: 'frozen_peaks.json', label: 'Frozen peaks' },
    { value: 'frozen_river.json', label: 'Frozen river' },
    { value: 'grove.json', label: 'Grove' },
    { value: 'ice_spikes.json', label: 'Ice spikes' },
    { value: 'jagged_peaks.json', label: 'Jagged peaks' },
    { value: 'jungle.json', label: 'Jungle' },
    { value: 'lukewarm_ocean.json', label: 'Lukewarm ocean' },
    { value: 'lush_caves.json', label: 'Lush caves' },
    { value: 'mangrove_swamp.json', label: 'Mangrove swamp' },
    { value: 'meadow.json', label: 'Meadow' },
    { value: 'mushroom_fields.json', label: 'Mushroom fields' },
    { value: 'nether_wastes.json', label: 'Nether wastes' },
    { value: 'ocean.json', label: 'Ocean' },
    { value: 'old_growth_birch_forest.json', label: 'Old growth birch forest' },
    { value: 'old_growth_pine_taiga.json', label: 'Old growth pine taiga' },
    { value: 'old_growth_spruce_taiga.json', label: 'Old growth spruce taiga' },
    { value: 'pale_garden.json', label: 'Pale garden' },
    { value: 'plains.json', label: 'Plains' },
    { value: 'river.json', label: 'River' },
    { value: 'savanna.json', label: 'Savanna' },
    { value: 'savanna_plateau.json', label: 'Savanna plateau' },
    { value: 'small_end_islands.json', label: 'Small end islands' },
    { value: 'snowy_beach.json', label: 'Snowy beach' },
    { value: 'snowy_plains.json', label: 'Snowy plains' },
    { value: 'snowy_slopes.json', label: 'Snowy slopes' },
    { value: 'snowy_taiga.json', label: 'Snowy taiga' },
    { value: 'soul_sand_valley.json', label: 'Soul sand valley' },
    { value: 'sparse_jungle.json', label: 'Sparse jungle' },
    { value: 'stony_peaks.json', label: 'Stony peaks' },
    { value: 'stony_shore.json', label: 'Stony shore' },
    { value: 'sunflower_plains.json', label: 'Sunflower plains' },
    { value: 'swamp.json', label: 'Swamp' },
    { value: 'taiga.json', label: 'Taiga' },
    { value: 'the_end.json', label: 'The end' },
    { value: 'the_void.json', label: 'The void' },
    { value: 'warm_ocean.json', label: 'Warm ocean' },
    { value: 'warped_forest.json', label: 'Warped forest' },
    { value: 'windswept_forest.json', label: 'Windswept forest' },
    {
      value: 'windswept_gravelly_hills.json',
      label: 'Windswept gravelly hills',
    },
    { value: 'windswept_hills.json', label: 'Windswept hills' },
    { value: 'windswept_savanna.json', label: 'Windswept savanna' },
    { value: 'wooded_badlands.json', label: 'Wooded badlands' },
  ];
  
  public get biomes() {
    return this._biomes;
  }


  public get smeltingRecipes() {
    return this._smeltingRecipes;
  }


  public get heightType() {
    return this._heightType;
  }

  public get oreGeneration() {
    return this._oreGeneration;
  }
  
}
