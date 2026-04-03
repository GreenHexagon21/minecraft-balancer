import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MinecraftCraftingShapedRecipe } from '../crafting/crafting';
import { TagList } from '../tag-sets/tag-sets';
import { JsonLoaderService } from '../../services/json-loader.service';
import { FormBuilder } from '@angular/forms';
import { Globals } from '../../services/globals';

interface DatapackObject {
  biomes: Array<object>;
  smeltingRecipes: Array<object>;
  craftingRecipes: Array<MinecraftCraftingShapedRecipe>;
  oreFeatures: Array<object>;
  itemsTags: Array<TagList>;
}

@Component({
  selector: 'app-home',
  imports: [MatButtonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
fullDatapack: DatapackObject = {
    biomes: [],
    smeltingRecipes: [],
    craftingRecipes: [],
    oreFeatures:  [],
    itemsTags: []
};
  constructor(
    private jsonLoaderService: JsonLoaderService,
    private fb: FormBuilder,
    public globals: Globals,
  ) {
  }

  exportDatapack() {
    let loadedBiome:any = {};
    const validOreValues = this.globals.oreGeneration.map((x) => x.value);
    const validBiomeValues = this.globals.biomes.map((x) => x.value);
    const validSmeltingValues = this.globals.smeltingRecipes.map(
      (x) => x.value,
    );
    const validToolValues = this.globals.tools.map((x) => x.label);
    const validTagValues = this.globals.tags.map((x) => x.displayName);
    const localObjects = JSON.parse(
      localStorage.getItem('saved-items') ?? '[]',
    );
    localObjects.forEach((element: any) => {
      const localCopy = JSON.parse(localStorage.getItem(element) ?? '[]');
      if (validOreValues.includes(element)) {
        this.fullDatapack.oreFeatures.push(localCopy);
      }
      if (validBiomeValues.includes(element)) {
        this.jsonLoaderService
          .getJsonData('worldgen/biome/' + element)
          .subscribe((data: any) => {
            loadedBiome = data;
            loadedBiome!.features![6] = localCopy;
            this.fullDatapack.biomes.push(loadedBiome);
          });
          
      }
      if (validSmeltingValues.includes(element)) {
        this.fullDatapack.smeltingRecipes.push(localCopy);

      }
      if (validSmeltingValues.includes(element)) {
        this.fullDatapack.smeltingRecipes.push(localCopy);
      }
      if (validToolValues.includes(element)) {
        this.fullDatapack.craftingRecipes.push(localCopy);
      }
      if (validTagValues.includes(element.replace('.tags', ''))) {
        this.fullDatapack.itemsTags.push(localCopy)
      } 
      if (element.includes(".tags")) {
        if (!(validTagValues.includes(element.replace('.tags', '')))) {
            const localRecipe = JSON.parse(localStorage.getItem(element) ?? '[]');
            if (localRecipe.length != 0) {
                this.fullDatapack.itemsTags.push(localRecipe);
            }

        }
      }
      if (element.includes(".recipe")) {
        if (!(validTagValues.includes(element.replace('.recipe', '')))) {
            const localRecipe = JSON.parse(localStorage.getItem(element) ?? '[]');
            if (localRecipe.length != 0) {
                this.fullDatapack.craftingRecipes.push(localRecipe);
            }

        }
      }

    });
    console.log(this.fullDatapack);
  }
}
