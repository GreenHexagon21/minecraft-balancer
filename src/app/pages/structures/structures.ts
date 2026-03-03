import { Component } from '@angular/core';
import { JsonLoaderService } from '../../services/json-loader.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-structures',
  imports: [],
  templateUrl: './structures.html',
  styleUrl: './structures.scss',
})
export class Structures {

   filtersForm: FormGroup;
   jsonPath = 'worldgen/biome/';

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

}
