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
import { Globals } from '../../services/globals';

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
    public globals: Globals
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
