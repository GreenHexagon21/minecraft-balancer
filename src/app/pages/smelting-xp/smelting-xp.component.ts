import { Component } from '@angular/core';
import { JsonLoaderService } from '../../services/json-loader.service';
import {MatSelectChange, MatSelectModule} from '@angular/material/select';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { Globals } from '../../services/globals';

@Component({
    selector: 'app-smelting-xp',
    imports: [MatSelectModule, FormsModule,MatInputModule,MatButtonModule],
    templateUrl: './smelting-xp.component.html',
    styleUrl: './smelting-xp.component.scss'
})
export class SmeltingXpComponent {
  loadedRecipe: any;
  jsonPath = 'recipe/';
  selectedRecipe:any;
  xp: number | string = "";
  cookingTime: number | string = "";

  constructor(private jsonLoaderService: JsonLoaderService,public globals: Globals) {}

  ngOnInit(): void {

    console.log(localStorage.getItem("saved-items"));
  }

  recipeSelectionChanged(event:MatSelectChange) {

    const localCopy = JSON.parse(localStorage.getItem(event.value) ?? "[]")
    if (localCopy.length != 0) {
      this.loadedRecipe = localCopy;
      this.xp = localCopy.experience;
      this.cookingTime = localCopy.cookingtime;
    } else {
    this.jsonLoaderService
      .getJsonData(this.jsonPath+event.value)
      .subscribe((data: any) => {
        this.loadedRecipe = data;
        this.xp = this.loadedRecipe.experience;
        this.cookingTime = this.loadedRecipe.cookingtime;
      });
    }

  }

  save() {
    let tempObj = this.loadedRecipe;
    tempObj.experience = this.xp;
    tempObj.cookingtime = this.cookingTime;

    localStorage.setItem(this.selectedRecipe, JSON.stringify(tempObj));
    let tempItems:any[]
    if (localStorage.getItem("saved-items")) {
      tempItems = JSON.parse(localStorage.getItem("saved-items")??"[]");
    } else {
      tempItems = [];
    }
    tempItems.push(this.selectedRecipe);
    let tempSet = new Set(tempItems);
    
    localStorage.setItem("saved-items", JSON.stringify(Array.from(tempSet.values())));
  }
}
