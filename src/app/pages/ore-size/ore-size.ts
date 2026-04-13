import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Globals } from '../../services/globals';
import { JsonLoaderService } from '../../services/json-loader.service';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelect, MatSelectChange, MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-ore-size',
  imports: [
    MatSelect,
    MatSelectModule,
    FormsModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
  ],
  templateUrl: './ore-size.html',
  styleUrl: './ore-size.scss',
})
export class OreSize {
  filtersForm: FormGroup;
  selectedOre: any;
  loadedOre: any;
  jsonPath: string = 'worldgen/configured_feature/';

    isVisible(controlName: string): boolean {
    return this.filtersForm.get(controlName)?.value != null;
  }

    constructor(
    private jsonLoaderService: JsonLoaderService,
    private fb: FormBuilder,
    public globals: Globals
  ) {
    this.filtersForm = this.fb.group({
      size: [null],
      discardChanceOnAirExposure: [null],
    });
  }

  oreSelectionChanged(event: MatSelectChange) {
    console.log(event);
    const localCopy = JSON.parse(localStorage.getItem(event.value) ?? '[]');
if (localCopy.length != 0) {
      this.loadedOre = localCopy;
      this.filtersForm.setValue(this.loadedOre);
    } else {
      this.filtersForm.reset();

      this.jsonLoaderService
        .getJsonData(this.jsonPath + event.value)
        .subscribe((data: any) => {
          this.loadedOre = data;
          console.log(data);
          this.filtersForm.get('size')?.setValue(data.config.size);
          this.filtersForm.get('discardChanceOnAirExposure')?.setValue(data.config.discard_chance_on_air_exposure);
          });
        };
    }
  
  
  save() {
let tempObj = this.filtersForm.value;

    console.log(this.filtersForm.value);
        localStorage.setItem(this.selectedOre+'.size', JSON.stringify(tempObj));

    let tempItems: any[];
    if (localStorage.getItem('saved-items')) {
      tempItems = JSON.parse(localStorage.getItem('saved-items') ?? '[]');
    } else {
      tempItems = [];
    }

    tempItems.push(this.selectedOre+'.size');
    let tempSet = new Set(tempItems);

    localStorage.setItem(
      'saved-items',
      JSON.stringify(Array.from(tempSet.values())),
    );

  }

}
