import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { JsonLoaderService } from '../../services/json-loader.service';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { Globals } from '../../services/globals';

@Component({
  selector: 'app-biome',
  standalone: true,
  imports: [
    MatSelect,
    MatSelectModule,
    MatCheckboxModule,
    FormsModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
  ],
  templateUrl: './biome.component.html',
  styleUrl: './biome.component.scss',
})
export class BiomeComponent {
  filtersForm: FormGroup;
  jsonPath = 'worldgen/biome/';

  selectedBiome: any;
  loadedBiome: any;
  biomeFeatures: string[] = [];

  oreChecks: { [key: string]: boolean } = {};

  constructor(
    private jsonLoaderService: JsonLoaderService,
    private fb: FormBuilder,
    public globals: Globals
  ) {
    this.filtersForm = this.fb.group({
      rarityFilter: [null],
      count: [null],
      maxHeight: [null],
      minHeight: [null],
      distributionShape: [null],
    });
  }

  biomeSelectionChanged(event: any) {
    const localCopy = JSON.parse(localStorage.getItem(event.value) ?? '[]');

    if (localCopy.length != 0) {
      this.loadedBiome = localCopy;
      this.filtersForm.setValue(this.loadedBiome);
      this.setOreChecks();
    } else {
      this.filtersForm.reset();

      this.jsonLoaderService
        .getJsonData(this.jsonPath + event.value)
        .subscribe((data: any) => {
          this.loadedBiome = data;
          this.setOreChecks();
        });
    }
  }

  setOreChecks() {
    this.biomeFeatures = this.loadedBiome?.features?.[6] ?? [];

    this.oreChecks = {};

    for (const ore of this.globals.oreGeneration) {
      const featureName = 'minecraft:' + ore.value.replace('.json', '');
      this.oreChecks[ore.value] = this.biomeFeatures.includes(featureName);
    }
  }

  updateBiomeFeatures() {
    this.biomeFeatures = this.globals.oreGeneration
      .filter(ore => this.oreChecks[ore.value])
      .map(ore => 'minecraft:' + ore.value.replace('.json', ''));

    this.loadedBiome['features'][6] = this.biomeFeatures;
    console.log(this.loadedBiome['features'][6]);
  }
}