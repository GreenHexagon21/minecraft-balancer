import { Component } from '@angular/core';
import {
  MatSelect,
  MatSelectChange,
  MatSelectModule,
} from '@angular/material/select';
import { JsonLoaderService } from '../../services/json-loader.service';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-ore-rarity',
  imports: [
    MatSelect,
    MatSelectModule,
    FormsModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
  ],
  templateUrl: './ore-rarity.html',
  styleUrl: './ore-rarity.scss',
})
export class OreRarity {
  filtersForm: FormGroup;

  constructor(
    private jsonLoaderService: JsonLoaderService,
    private fb: FormBuilder,
  ) {
    this.filtersForm = this.fb.group({
      rarityFilter: [null],
      count: [null, []],
      maxHeight: [null, []],
      minHeight: [null, []],
      distributionShape: [null],
    });
  }

  isVisible(controlName: string): boolean {
    return this.filtersForm.get(controlName)?.value != null;
  }

  selectedOre: any;
  loadedRecipe: any;
  jsonPath = 'worldgen/placed_feature/';
  max_height: any;
  max_type: any;
  min_height: any;
  min_type: any;

  heightType = [
    { value: 'minecraft:uniform', label: 'Universal' },
    { value: 'minecraft:biased_to_bottom', label: 'Biased To Bottom' },
    { value: 'minecraft:trapezoid', label: 'Trapezoid' },
    {
      value: 'minecraft:very_biased_to_bottom',
      label: 'Very Biased To Bottom',
    },
  ];

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
      this.filtersForm.setValue(this.loadedRecipe);
    } else {
      this.filtersForm.reset();

      this.jsonLoaderService
        .getJsonData(this.jsonPath + event.value)
        .subscribe((data: any) => {
          this.loadedRecipe = data;

          this.loadedRecipe.placement.forEach((element: any) => {
            console.log(element);

            if (element?.type == 'minecraft:rarity_filter') {
              this.filtersForm
                .get('rarityFilter')
                ?.setValue(element?.chance ?? null);
            }

            if (element?.type == 'minecraft:count') {
              this.filtersForm.get('count')?.setValue(element?.count ?? null);
            }

            if (element?.type == 'minecraft:height_range') {
              const max = element?.height?.max_inclusive;
              if (max?.absolute != null) {
                this.filtersForm.get('maxHeight')?.setValue(max.absolute);
                this.max_type = 'Absolute';
              } else if (max?.below_top != null) {
                this.filtersForm.get('maxHeight')?.setValue(max.below_top);
                this.max_type = 'Below top';
              } else if (max?.above_bottom != null) {
                this.filtersForm.get('maxHeight')?.setValue(max.above_bottom);
                this.max_type = 'Above bottom';
              }

              const min = element?.height?.min_inclusive;
              if (min?.absolute != null) {
                this.filtersForm.get('minHeight')?.setValue(min.absolute);
                this.min_type = 'Absolute';
              } else if (min?.below_top != null) {
                this.filtersForm.get('minHeight')?.setValue(min.below_top);
                this.min_type = 'Below top';
              } else if (min?.above_bottom != null) {
                this.filtersForm.get('minHeight')?.setValue(min.above_bottom);
                this.min_type = 'Above bottom';
              }
            }

            if (element?.height?.type) {
              this.filtersForm
                .get('distributionShape')
                ?.setValue(element?.height?.type);
            }
          });
        });
    }
  }

  save() {
    let tempObj = this.filtersForm.value;

    console.log(this.filtersForm.value);
    localStorage.setItem(this.selectedOre, JSON.stringify(tempObj));

    let tempItems: any[];
    if (localStorage.getItem('saved-items')) {
      tempItems = JSON.parse(localStorage.getItem('saved-items') ?? '[]');
    } else {
      tempItems = [];
    }

    tempItems.push(this.selectedOre);
    let tempSet = new Set(tempItems);

    localStorage.setItem(
      'saved-items',
      JSON.stringify(Array.from(tempSet.values())),
    );

    console.log(localStorage.getItem('saved-items'));
    console.log(localStorage.getItem(this.selectedOre));
  }
}
