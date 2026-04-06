import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MinecraftCraftingShapedRecipe } from '../crafting/crafting';
import { TagList } from '../tag-sets/tag-sets';
import { JsonLoaderService } from '../../services/json-loader.service';
import { FormBuilder } from '@angular/forms';
import { Globals } from '../../services/globals';
import { firstValueFrom } from 'rxjs';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

interface DatapackObject {
  biomes: Array<any>;
  smeltingRecipes: Array<any>;
  craftingRecipes: Array<any>;
  oreFeatures: Array<any>;
  itemsTags: Array<any>;
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
    oreFeatures: [],
    itemsTags: [],
  };

  fullPath = 'assets/minecraft-data/1.21.10/data/minecraft/';
  biomePath = 'worldgen/biome/';
  oreFeaturePath = 'worldgen/placed_feature/';
  recipePath = 'recipe/';
  tagItemPath = 'tags/item/';
  tagBlockPath = 'tags/block/';

  constructor(
    private jsonLoaderService: JsonLoaderService,
    private fb: FormBuilder,
    public globals: Globals,
  ) {}

  downloadFullDatapackJson() {
    const jsonString = JSON.stringify(this.fullDatapack, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'fullDatapack.json';
    a.click();

    window.URL.revokeObjectURL(url);
  }

  clearLocalStorage() {
    localStorage.clear();
  }

  async exportDatapack() {
    this.fullDatapack = {
      biomes: [],
      smeltingRecipes: [],
      craftingRecipes: [],
      oreFeatures: [],
      itemsTags: [],
    };

    let loadedBiome: any = {};
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

    for (const element of localObjects) {
      const localCopy = JSON.parse(localStorage.getItem(element) ?? '[]');

      if (validOreValues.includes(element)) {
        this.fullDatapack.oreFeatures.push({ name: element, value: localCopy });
      }

      if (validBiomeValues.includes(element)) {
        loadedBiome = await firstValueFrom(
          this.jsonLoaderService.getJsonData('worldgen/biome/' + element),
        );
        loadedBiome.features[7] = localCopy;
        this.fullDatapack.biomes.push({ name: element, value: loadedBiome });
      }

      if (validSmeltingValues.includes(element)) {
        this.fullDatapack.smeltingRecipes.push({
          name: element,
          value: localCopy,
        });
      }

      if (validToolValues.includes(element)) {
        this.fullDatapack.craftingRecipes.push({
          name: element,
          value: localCopy,
        });
      }

      if (validTagValues.includes(element.replace('.tags', ''))) {
        this.fullDatapack.itemsTags.push({ name: element, value: localCopy });
      }

      if (element.includes('.tags')) {
        if (!validTagValues.includes(element.replace('.tags', ''))) {
          const localRecipe = JSON.parse(localStorage.getItem(element) ?? '[]');
          if (localRecipe.length != 0) {
            this.fullDatapack.itemsTags.push({
              name: element,
              value: localRecipe,
            });
          }
        }
      }

      if (element.includes('.recipe')) {
        if (!validTagValues.includes(element.replace('.recipe', ''))) {
          const localRecipe = JSON.parse(localStorage.getItem(element) ?? '[]');
          if (localRecipe.length != 0) {
            this.fullDatapack.craftingRecipes.push({
              name: element,
              value: localRecipe,
            });
          }
        }
      }
    }

    console.log(this.fullDatapack);
  }

  async exportAndDownloadDatapack() {
    await this.exportDatapack();
    this.downloadFullDatapackJson();
  }
 async buildAndDownloadDatapackZip() {
  await this.exportDatapack();

  const zip = new JSZip();
const packMcmeta = {
  pack: {
    description: 'Minecraft Rebalance Datapack',
    min_format: 82,
    max_format: 88,
  },
};

  zip.file('pack.mcmeta', JSON.stringify(packMcmeta, null, 2));
  const root = zip.folder('data')?.folder('minecraft');

  if (!root) {
    return;
  }

  const biomeFolder = root.folder('worldgen')?.folder('biome');
  const placedFeatureFolder = root.folder('worldgen')?.folder('placed_feature');
  const recipeFolder = root.folder('recipe');
  const itemTagFolder = root.folder('tags')?.folder('item');
  const blockTagFolder = root.folder('tags')?.folder('block');

  if (
    !biomeFolder ||
    !placedFeatureFolder ||
    !recipeFolder ||
    !itemTagFolder ||
    !blockTagFolder
  ) {
    return;
  }

  for (const element of this.fullDatapack.biomes) {
    const fileName = this.fileNameProcessor(element.name);
    biomeFolder.file(
      fileName,
      JSON.stringify(element.value, null, 2),
    );
  }

  for (const element of this.fullDatapack.smeltingRecipes) {
    const fileName = this.fileNameProcessor(element.name);
    recipeFolder.file(
      fileName,
      JSON.stringify(this.removeNullValues(element.value), null, 2),
    );
  }

  for (const element of this.fullDatapack.craftingRecipes) {
    const fileName = this.fileNameProcessor(element.name);
    recipeFolder.file(
      fileName,
      JSON.stringify(this.removeNullValues(element.value), null, 2),
    );
  }

for (const element of this.fullDatapack.oreFeatures) {
  const fileName = this.fileNameProcessor(element.name);

  const data: any = await firstValueFrom(
    this.jsonLoaderService.getJsonData(this.oreFeaturePath + element.name)
  );

  const countValue = Number(element.value.count);
  const minHeightValue = Number(element.value.minHeight);
  const maxHeightValue = Number(element.value.maxHeight);
  const rarityValue =
    element.value.rarityFilter !== null && element.value.rarityFilter !== undefined
      ? Number(element.value.rarityFilter)
      : null;

  data.placement.forEach((place: any) => {
    if (place.type === 'minecraft:count') {

      place.count = countValue;
    }

    if (place.type === 'minecraft:height_range') {
      place.height = {
        type: element.value.distributionShape,
        min_inclusive: {
          absolute: minHeightValue,
        },
        max_inclusive: {
          absolute: maxHeightValue,
        },
      };
    }

    if (place.type === 'minecraft:rarity_filter') {
      if (rarityValue !== null && !Number.isNaN(rarityValue)) {
        place.chance = rarityValue;
      }
    }
  });

  placedFeatureFolder.file(
    fileName,
    JSON.stringify(this.removeNullValues(data), null, 2),
  );
}

  for (const element of this.fullDatapack.itemsTags) {
    const fileName = this.fileNameProcessor(element.name);
    itemTagFolder.file(
      fileName,
      JSON.stringify(this.removeNullValues(element.value), null, 2),
    );
  }

  const blob = await zip.generateAsync({ type: 'blob' });
  saveAs(blob, 'minecraft-rebalance-datapack.zip');
}

  fileNameProcessor(name: string) {
    const existingRecipe = this.globals.tools.find(
      (element) => element.label === name,
    );
    const cleaned = name
      .replaceAll('.json', '')
      .replaceAll('.recipe', '')
      .replaceAll('.tags', '');
    const existingTag = this.globals.tags.find(
      (element) => element.displayName == cleaned,
    );
      if (existingRecipe) {
        return existingRecipe.value;
      }
      if (existingTag) {
        return existingTag.name+".json";
      }
    return cleaned+".json"

  }
removeNullValues<T>(input: T): T {
  if (Array.isArray(input)) {
    return input
      .map(item => this.removeNullValues(item))
      .filter(item => item !== null) as unknown as T;
  }

  if (input !== null && typeof input === 'object') {
    return Object.entries(input as Record<string, any>)
      .reduce((acc, [key, value]) => {
        if (value === null) {
          return acc;
        }

        const cleanedValue = this.removeNullValues(value);

        // Optional: remove empty objects/arrays as well
        if (
          cleanedValue !== null &&
          !(typeof cleanedValue === 'object' && Object.keys(cleanedValue).length === 0)
        ) {
          acc[key] = cleanedValue;
        }

        return acc;
      }, {} as Record<string, any>) as T;
  }

  return input;
}
}
