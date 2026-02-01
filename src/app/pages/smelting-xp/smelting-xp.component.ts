import { Component } from '@angular/core';
import { JsonLoaderService } from '../../services/json-loader.service';

@Component({
  selector: 'app-smelting-xp',
  standalone: true,
  imports: [],
  templateUrl: './smelting-xp.component.html',
  styleUrl: './smelting-xp.component.scss',
})
export class SmeltingXpComponent {
  loadedRecipe: any[] = [];
  jsonPath = 'recipe/';
  smeltingRecipes = [
    'coal_from_smelting_deepslate_coal_ore.json',
    'coal_from_smelting_coal_ore.json',
    'charcoal.json',
    'copper_ingot_from_smelting_deepslate_copper_ore.json',
    'copper_ingot_from_smelting_copper_ore.json',
    'copper_ingot_from_smelting_raw_copper.json',
    'copper_ingot_from_smelting_deepslate_copper_ore.json',
    'copper_nugget_from_smelting.json',
    'diamond_from_smelting_deepslate_diamond_ore.json',
    'diamond_from_smelting_diamond_ore.json',
    'emerald_from_smelting_deepslate_emerald_ore.json',
    'emerald_from_smelting_emerald_ore.json',
    'gold_ingot_from_smelting_deepslate_gold_ore.json',
    'gold_ingot_from_smelting_gold_ore.json',
    'gold_ingot_from_smelting_nether_gold_ore.json',
    'gold_ingot_from_smelting_raw_gold.json',
    'gold_nugget_from_smelting.json',
    'iron_ingot_from_smelting_deepslate_iron_ore.json',
    'iron_ingot_from_smelting_iron_ore.json',
    'iron_ingot_from_smelting_raw_iron.json',
    'iron_nugget_from_smelting.json',
    'lapis_lazuli_from_smelting_deepslate_lapis_ore.json',
    'lapis_lazuli_from_smelting_lapis_ore.json',
    'netherite_scrap.json',
    'redstone_from_smelting_deepslate_redstone_ore.json',
    'redstone_from_smelting_redstone_ore.json',
    'stone.json',
    'terracotta.json',
    'quartz.json',
  ];

  constructor(private jsonLoaderService: JsonLoaderService) {}

  ngOnInit(): void {
    this.jsonLoaderService
      .getJsonData('recipe/acacia_button.json')
      .subscribe((data: any) => {
        console.log(data);
      });
  }
}
