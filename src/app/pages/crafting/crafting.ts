import { Component } from '@angular/core';
import { JsonLoaderService } from '../../services/json-loader.service';
import { FormBuilder } from '@angular/forms';
import { Globals } from '../../services/globals';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { TagList } from '../tag-sets/tag-sets';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';

interface MinecraftCraftingShapedRecipe {
  type: "minecraft:crafting_shaped";
  category: string;
  key: Record<string, string>;
  pattern: string[];
  result: {
    count: number;
    id: string;
  };
}

@Component({
  selector: 'app-crafting',
  imports: [SelectModule,FormsModule, MatButtonModule,MatInputModule],
  templateUrl: './crafting.html',
  styleUrl: './crafting.scss',
})
export class Crafting {
  allItems:any;
  recipe: any = [[undefined,undefined,undefined],[undefined,undefined,undefined],[undefined,undefined,undefined]];
  newRecipeName:string|undefined;
  jsonPath = 'recipe/';
    savedTagLists: Array<TagList> = [];
    convertedTagLists: Array<any> = [];
    constructor(
    private jsonLoaderService: JsonLoaderService,
    private fb: FormBuilder,
    public globals: Globals
  ) {}

    ngOnInit(): void {
        this.jsonLoaderService
      .getJsonData("items.json")
      .subscribe((data: any) => {
        this.refreshLocalstorageLists()
        this.convertLocalTagLists();
        let tempItems: Array<object> = this.globals.tags.concat(data);
        tempItems = tempItems.concat(this.convertedTagLists)
        this.allItems = tempItems;
      });

  }
  convertLocalTagLists() {
    this.savedTagLists.forEach(tagList => {
      this.convertedTagLists.push({id:-1, name: tagList.name,displayName:tagList.name,stackSize: -1, namespacedName:"minecraft:"+tagList.name})
    });
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

  onCraftingRecipeSelectChanged(event:any) {
    const localCopy = JSON.parse(localStorage.getItem(event.value) ?? "[]")
    if (localCopy.length != 0) {

    } else {
      if (event?.value?.value) {
            this.jsonLoaderService
      .getJsonData(this.jsonPath+event.value.value)
      .subscribe((data: MinecraftCraftingShapedRecipe) => {
        for (let i = 0; i < data.pattern.length; i++) {
          const patterRow = data.pattern[i];
          for (let j = 0; j < patterRow.length; j++) {
            const patternItem = patterRow[j];
            this.recipe[i][j] = data.key[patternItem];
          }
        }
      });
      }
    }
    console.log(this.recipe);
  }

saveRecipe() {
  let possibleSymbols = ["X", "#", "H", "N", "0", "W", "8", "Z", "+"];
  let assingedSymbolCount = 0;
  let keyPairs: any[] = [];
  let keyDecoders: any[] = [];
  let itemSet: Set<string> = new Set<string>();
  let patternResult: Array<string> = ["","",""];

  for (let i = 0; i < this.recipe.length; i++) {
    for (let j = 0; j < this.recipe[i].length; j++) {
      if (!itemSet.has(this.recipe[i][j]) && this.recipe[i][j]) {
        itemSet.add(this.recipe[i][j]);
        keyPairs.push({ [possibleSymbols[assingedSymbolCount]]: this.recipe[i][j] });
        keyDecoders.push({ [this.recipe[i][j]]:  possibleSymbols[assingedSymbolCount]});
        assingedSymbolCount++;
      }
    }
  }

  const result = {
    key: Object.assign({}, ...keyPairs)
  };
  const decodingResult = {
    key: Object.assign({}, ...keyDecoders)
  };
    for (let i = 0; i < this.recipe.length; i++) {
    for (let j = 0; j < this.recipe[i].length; j++) {
      console.log(decodingResult.key[this.recipe[i][j]])
      if (this.recipe[i][j]) {
        patternResult[i] = patternResult[i]+decodingResult.key[this.recipe[i][j]];
      } else {
        patternResult[i] = patternResult[i]+" "
      }
    }
  }

  console.log(result);
  console.log(patternResult);
}

}

