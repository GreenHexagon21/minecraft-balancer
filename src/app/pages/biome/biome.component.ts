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
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { Globals } from '../../services/globals';

@Component({
  selector: 'app-biome',
  standalone: true,
  imports: [
    MatSelect,
    MatSelectModule,
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

  biomeSelectionChanged(event:any){
     const localCopy = JSON.parse(localStorage.getItem(event.value) ?? '[]');

    if (localCopy.length != 0) {
      this.loadedBiome = localCopy;
      this.filtersForm.setValue(this.loadedBiome);
    } else {
      this.filtersForm.reset();
      console.log(this.jsonPath + event.value);

      this.jsonLoaderService
        .getJsonData(this.jsonPath + event.value)
        .subscribe((data: any) => {

          this.loadedBiome = data;
                    console.log(this.loadedBiome['features'][6]);

         
        });
    }
  }
}
