import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Globals } from '../../services/globals';
import { JsonLoaderService } from '../../services/json-loader.service';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tag-sets',
  imports: [SelectModule,FormsModule],
  templateUrl: './tag-sets.html',
  styleUrl: './tag-sets.scss',
})
export class TagSets {
  allItems:any;
  selectedItem:any;

    constructor(
    private jsonLoaderService: JsonLoaderService,
    private fb: FormBuilder,
    public globals: Globals
  ) {}


  ngOnInit(): void {
        this.jsonLoaderService
      .getJsonData("items.json")
      .subscribe((data: any) => {
        this.allItems = data;
      });

  }
}
