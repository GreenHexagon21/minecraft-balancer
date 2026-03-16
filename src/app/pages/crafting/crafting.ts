import { Component } from '@angular/core';
import { JsonLoaderService } from '../../services/json-loader.service';
import { FormBuilder } from '@angular/forms';
import { Globals } from '../../services/globals';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';

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
  imports: [SelectModule,FormsModule],
  templateUrl: './crafting.html',
  styleUrl: './crafting.scss',
})
export class Crafting {
  allItems:any;
  recipe: any = [[undefined,undefined,undefined],[undefined,undefined,undefined],[undefined,undefined,undefined]]
  jsonPath = 'recipe/';
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
            console.log(patternItem);
            console.log(data.key[patternItem]);
            this.recipe[i][j] = data.key[patternItem];
          }
        }
        
      });
      }

    }
    console.log(this.recipe);
  }

}
