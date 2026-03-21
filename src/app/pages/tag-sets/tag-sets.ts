import { Component, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Globals } from '../../services/globals';
import { JsonLoaderService } from '../../services/json-loader.service';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';

  export interface TagList {
    name: string;
    replace: boolean;
    values: Array<string>;
  };

@Component({
  selector: 'app-tag-sets',
  imports: [SelectModule,FormsModule,MatButtonModule,MatInputModule],
  templateUrl: './tag-sets.html',
  styleUrl: './tag-sets.scss',
})
export class TagSets {

  allItems:any;
  selectedItem:any;
  selectedTagList: TagList|undefined;
  tagList:TagList = {name: "", replace:true, values:[]};
  savedTagLists: Array<TagList> = [];
  currentListName: string = "";
  existingLists = [];
  inaGameLists: Array<any> = [];

    constructor(
    private jsonLoaderService: JsonLoaderService,
    private fb: FormBuilder,
    public globals: Globals
  ) {}


ngOnInit(): void {
  let completed = 0;
  const total = this.globals.tags.length;

  this.globals.tags.forEach(tag => {
    if (!tag.name.includes('needs')) {
       this.jsonLoaderService
      .getJsonData("tags/item/" + tag.name + ".json")
      .subscribe((data: any) => {
        this.inaGameLists.push({
          name: tag.displayName,
          replace: true,
          values: data.values
        });
        completed++;
        if (completed === total) {
          this.savedTagLists = this.savedTagLists.concat(this.inaGameLists);
        }
      });
    } else {
       this.jsonLoaderService
      .getJsonData("tags/block/" + tag.name + ".json")
      .subscribe((data: any) => {
        this.inaGameLists.push({
          name: tag.displayName,
          replace: true,
          values: data.values
        });
        completed++;
        if (completed === total) {
          this.savedTagLists = this.savedTagLists.concat(this.inaGameLists);
        }
      });
    }
   
  });

  this.jsonLoaderService
    .getJsonData("items.json")
    .subscribe((data: any) => {
      this.allItems = data;
    });

  this.refreshLocalstorageLists();
}

  refreshLocalstorageLists() {
    this.savedTagLists = [];
    const localCopy = JSON.parse(localStorage.getItem("saved-items") ?? "[]")
      localCopy.forEach((element: string) => {
        if (element.includes(".tags")) {
          const localTagList = JSON.parse(localStorage.getItem(element) ?? "[]")
          if (!Array.isArray(localTagList)) {
            this.savedTagLists.push(localTagList);
          }
        }
    });

  }
  onLocallyStoredSelectChanged(event:any) {
    console.log(event);
    this.tagList = event.value;
    this.currentListName = event.value.name;
  }

  deleteList() {
    localStorage.removeItem(this.currentListName+".tags");
    this.tagList = {name: "", replace:true, values:[]};
    this.currentListName = "";
    this.selectedTagList = undefined;
    this.savedTagLists = [];
    this.refreshLocalstorageLists();
    console.log(this.savedTagLists );
  }

  addTag() {
    this.tagList.values.push("minecraft:"+this.selectedItem.name);
    let tempSet = new Set(this.tagList.values);
    this.tagList.values = Array.from(tempSet);
    this.selectedItem = null;
  }

  removeTag(value: string) {
    this.tagList.values = this.tagList.values.filter(v => v !== value);
  }

  saveList() {
    this.tagList.name = this.currentListName;
    localStorage.setItem(this.currentListName+".tags", JSON.stringify(this.tagList));
    let tempItems:any[]
    if (localStorage.getItem("saved-items")) {
      tempItems = JSON.parse(localStorage.getItem("saved-items")??"[]");
    } else {
      tempItems = [];
    }
    tempItems.push(this.currentListName+".tags");
    let tempSet = new Set(tempItems);
    
    localStorage.setItem("saved-items", JSON.stringify(Array.from(tempSet.values())));
    this.refreshLocalstorageLists(); 
  }


}
