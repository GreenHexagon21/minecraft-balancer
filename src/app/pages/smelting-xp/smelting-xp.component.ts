import { Component } from '@angular/core';
import { JsonLoaderService } from '../../services/json-loader.service';
import {MatSelectModule} from '@angular/material/select';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-smelting-xp',
  standalone: true,
  imports: [MatSelectModule,FormsModule],
  templateUrl: './smelting-xp.component.html',
  styleUrl: './smelting-xp.component.scss',
})
export class SmeltingXpComponent {
  loadedRecipe: any[] = [];
  jsonPath = 'recipe/';
  selectedRecipe:any;
smeltingRecipes = [
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

  constructor(private jsonLoaderService: JsonLoaderService) {}

  ngOnInit(): void {
    this.jsonLoaderService
      .getJsonData('recipe/acacia_button.json')
      .subscribe((data: any) => {
        console.log(data);
      });
  }
}
