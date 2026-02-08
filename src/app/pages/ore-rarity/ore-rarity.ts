import { Component } from '@angular/core';
import {
  MatSelect,
  MatSelectChange,
  MatSelectModule,
} from '@angular/material/select';
import { JsonLoaderService } from '../../services/json-loader.service';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';

@Component({
  selector: 'app-ore-rarity',
  imports: [MatSelect, MatSelectModule, FormsModule,MatInputModule, ReactiveFormsModule],
  templateUrl: './ore-rarity.html',
  styleUrl: './ore-rarity.scss',
})
export class OreRarity {
  filtersForm: FormGroup;
  constructor(private jsonLoaderService: JsonLoaderService,private fb: FormBuilder) {
    this.filtersForm = this.fb.group({
    rarityFilter: [''],
    count: [null, [Validators.min(0)]],
    maxHeight: [null, [Validators.min(0)]],
    minHeight: [null, [Validators.min(0)]],
    distributionShape: [''],
  });
  }

  selectedOre: any;
  loadedRecipe: any;
  jsonPath = 'worldgen/placed_feature/';
  max_height: any;
  max_type: any;
  min_height: any;
  min_type: any;


  oreGeneration = [
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

  oreSelectionChanged(event: MatSelectChange) {
    const localCopy = JSON.parse(localStorage.getItem(event.value) ?? '[]');
    if (localCopy.length != 0) {
      this.loadedRecipe = localCopy;
      // this.xp = localCopy.experience;
      // this.cookingTime = localCopy.cookingtime;
    } else {
      this.jsonLoaderService
        .getJsonData(this.jsonPath + event.value)
        .subscribe((data: any) => {
          this.loadedRecipe = data;
          // console.log(this.loadedRecipe);
          this.loadedRecipe.placement.forEach((element: any) => {
            // console.log(element)
            if (element?.type == 'minecraft:height_range') {
              console.log(element?.height);
              if (element?.height?.max_inclusive) {
                if (element?.height?.max_inclusive?.absolute) {
                  this.max_height = element?.height?.max_inclusive?.absolute;
                  this.max_type = 'Absolute';
                }
                if (element?.height?.max_inclusive?.below_top) {
                  this.max_height = element?.height?.max_inclusive?.below_top;
                  this.max_type = 'Below top';
                }
                if (element?.height?.max_inclusive?.above_bottom) {
                  this.max_height =
                    element?.height?.max_inclusive?.above_bottom;
                  this.max_type = 'Above bottom';
                }
              }
              if (element?.height?.min_inclusive) {
                if (element?.height?.min_inclusive?.absolute) {
                  this.min_height = element?.height?.min_inclusive?.absolute;
                  this.min_type = 'Absolute';
                }
                if (element?.height?.min_inclusive?.below_top) {
                  this.min_height = element?.height?.min_inclusive?.below_top;
                  this.min_type = 'Below top';
                }
                if (element?.height?.min_inclusive?.above_bottom) {
                  this.min_height =
                    element?.height?.min_inclusive?.above_bottom;
                  this.min_type = 'Above bottom';
                }
              }
            }
            // this.xp = this.loadedRecipe.experience;
            // this.cookingTime = this.loadedRecipe.cookingtime;
          });
        });
    }
  }
}
