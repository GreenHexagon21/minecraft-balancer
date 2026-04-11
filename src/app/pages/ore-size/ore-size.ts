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
    const localCopy = JSON.parse(localStorage.getItem(event.value) ?? '[]');

  }
  save() {

  }
}
