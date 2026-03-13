import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Globals } from '../../services/globals';
import { JsonLoaderService } from '../../services/json-loader.service';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';

  interface tagList {
    replace: boolean;
    values: Array<string>;
  };

@Component({
  selector: 'app-tag-sets',
  imports: [SelectModule,FormsModule,MatButtonModule],
  templateUrl: './tag-sets.html',
  styleUrl: './tag-sets.scss',
})
export class TagSets {

  allItems:any;
  selectedItem:any;
  tagList:tagList = {replace:true, values:[]}

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
  addTag() {
    this.tagList.values.push("minecraft:"+this.selectedItem.name);
    let tempSet = new Set(this.tagList.values);
    this.tagList.values = Array.from(tempSet);
    console.log(this.selectedItem);
    console.log(this.tagList);
  }
}
