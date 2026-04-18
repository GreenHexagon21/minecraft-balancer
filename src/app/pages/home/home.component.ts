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

interface DatapackEntry {
  name: string;
  value: any;
}

interface DatapackObject {
  biomes: Array<DatapackEntry>;
  smeltingRecipes: Array<DatapackEntry>;
  craftingRecipes: Array<DatapackEntry>;
  oreFeatures: Array<DatapackEntry>;
  oreSizes: Array<DatapackEntry>;
  itemsTags: Array<DatapackEntry>;
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
    oreSizes: [],
    itemsTags: [],
  };

  fullPath = 'assets/minecraft-data/1.21.10/data/minecraft/';
  biomePath = 'worldgen/biome/';
  oreFeaturePath = 'worldgen/placed_feature/';
  recipePath = 'recipe/';
  tagItemPath = 'tags/item/';
  tagBlockPath = 'tags/block/';

  private readonly finishAudio = new Audio('/assets/sounds/complete.wav');

  constructor(
    private jsonLoaderService: JsonLoaderService,
    private fb: FormBuilder,
    public globals: Globals,
  ) {
    this.finishAudio.preload = 'auto';
  }

  downloadFullDatapackJson() {
    const jsonString = JSON.stringify(this.fullDatapack, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'fullDatapack.json';
    a.click();

    window.URL.revokeObjectURL(url);
    this.finishAudio.currentTime = 0;
    this.finishAudio.play().catch((err) => {
      console.error('Audio playback failed:', err);
    });
  }

  clearLocalStorage() {
    localStorage.clear();
  }

  async importDatapackFromJson(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    try {
      const fileText = await file.text();
      const importedDatapack: DatapackObject = JSON.parse(fileText);

      this.validateImportedDatapack(importedDatapack);

      localStorage.clear();

      const savedItems: string[] = [];

      for (const entry of importedDatapack.oreFeatures ?? []) {
        localStorage.setItem(entry.name, JSON.stringify(entry.value));
        savedItems.push(entry.name);
      }

      for (const entry of importedDatapack.oreSizes ?? []) {
        localStorage.setItem(entry.name, JSON.stringify(entry.value));
        savedItems.push(entry.name);
      }

      for (const entry of importedDatapack.biomes ?? []) {
        const biomeValue = entry.value?.features?.[7] ?? entry.value;
        localStorage.setItem(entry.name, JSON.stringify(biomeValue));
        savedItems.push(entry.name);
      }

      for (const entry of importedDatapack.smeltingRecipes ?? []) {
        localStorage.setItem(entry.name, JSON.stringify(entry.value));
        savedItems.push(entry.name);
      }

      for (const entry of importedDatapack.craftingRecipes ?? []) {
        localStorage.setItem(entry.name, JSON.stringify(entry.value));
        savedItems.push(entry.name);
      }

      for (const entry of importedDatapack.itemsTags ?? []) {
        localStorage.setItem(entry.name, JSON.stringify(entry.value));
        savedItems.push(entry.name);
      }

      localStorage.setItem(
        'saved-items',
        JSON.stringify([...new Set(savedItems)]),
      );

      this.fullDatapack = importedDatapack;

      console.log('Datapack imported successfully.');
    } catch (error) {
      console.error('Failed to import datapack JSON:', error);
      alert('Invalid datapack JSON file.');
    } finally {
      input.value = '';
      this.finishAudio.currentTime = 0;
      this.finishAudio.play().catch((err) => {
        console.error('Audio playback failed:', err);
      });
    }
  }

  validateImportedDatapack(data: any): asserts data is DatapackObject {
    if (!data || typeof data !== 'object') {
      throw new Error('Imported file is not a valid object.');
    }

    const requiredKeys: Array<keyof DatapackObject> = [
      'biomes',
      'smeltingRecipes',
      'craftingRecipes',
      'oreFeatures',
      'oreSizes',
      'itemsTags',
    ];

    for (const key of requiredKeys) {
      if (!Array.isArray(data[key])) {
        throw new Error(`Missing or invalid "${key}" array.`);
      }
    }
  }

  async exportDatapack() {
    this.fullDatapack = {
      biomes: [],
      smeltingRecipes: [],
      craftingRecipes: [],
      oreFeatures: [],
      oreSizes: [],
      itemsTags: [],
    };

    let loadedBiome: any = {};
    const validOreValues = this.globals.oreGeneration.map((x) => x.value);
    const validOreSizeValues = this.globals.oreSize.map(
      (x) => x.value + '.size',
    );
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

      if (validOreSizeValues.includes(element)) {
        this.fullDatapack.oreSizes.push({ name: element, value: localCopy });
        console.log(this.fullDatapack.oreSizes);
      }

      if (validBiomeValues.includes(element)) {
        loadedBiome = await firstValueFrom(
          this.jsonLoaderService.getJsonData('worldgen/biome/' + element),
        );
        loadedBiome.features[6] = [];
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
    const placedFeatureFolder = root
      .folder('worldgen')
      ?.folder('placed_feature');
    const configuredFeatureFolder = root
      .folder('worldgen')
      ?.folder('configured_feature');
    const recipeFolder = root.folder('recipe');
    const itemTagFolder = root.folder('tags')?.folder('item');
    const blockTagFolder = root.folder('tags')?.folder('block');

    if (
      !biomeFolder ||
      !placedFeatureFolder ||
      !recipeFolder ||
      !itemTagFolder ||
      !blockTagFolder ||
      !configuredFeatureFolder
    ) {
      return;
    }

    for (const element of this.fullDatapack.biomes) {
      const fileName = this.fileNameProcessor(element.name);
      biomeFolder.file(fileName, JSON.stringify(element.value, null, 2));
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
        this.jsonLoaderService.getJsonData(this.oreFeaturePath + element.name),
      );

      const countValue = Number(element.value.count);
      const minHeightValue = Number(element.value.minHeight);
      const maxHeightValue = Number(element.value.maxHeight);
      const rarityValue =
        element.value.rarityFilter !== null &&
        element.value.rarityFilter !== undefined
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
      this.finishAudio.currentTime = 0;
      this.finishAudio.play().catch((err) => {
        console.error('Audio playback failed:', err);
      });
    }

    for (const element of this.fullDatapack.oreSizes) {
      const fileName = this.fileNameProcessor(element.name);
      console.log(fileName);

      const data: any = await firstValueFrom(
        this.jsonLoaderService.getJsonData(
          'worldgen/configured_feature/' + element.name.replaceAll('.size', ''),
        ),
      );

      const sizeValue =
        element.value?.size !== null && element.value?.size !== undefined
          ? Number(element.value.size)
          : Number(element.value);

      if (!Number.isNaN(sizeValue)) {
        if (!data.config) {
          data.config = {};
        }

        data.config.size = sizeValue;
      }

      configuredFeatureFolder.file(
        fileName,
        JSON.stringify(this.removeNullValues(data), null, 2),
      );
    }

    for (const element of this.fullDatapack.itemsTags) {
      const fileName = this.fileNameProcessor(element.name);
      blockTagFolder.file(
        fileName,
        JSON.stringify(this.removeNullValues(element.value), null, 2),
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
      .replaceAll('.size', '')
      .replaceAll('.tags', '');
    const existingTag = this.globals.tags.find(
      (element) => element.displayName == cleaned,
    );
    if (existingRecipe) {
      return existingRecipe.value.replaceAll(' ', '_').toLowerCase();
    }
    if (existingTag) {
      return (existingTag.name + '.json').replaceAll(' ', '_').toLowerCase();
    }
    return (cleaned + '.json').replaceAll(' ', '_').toLowerCase();
  }

  removeNullValues<T>(input: T): T {
    if (Array.isArray(input)) {
      return input
        .map((item) => this.removeNullValues(item))
        .filter((item) => item !== null) as unknown as T;
    }

    if (input !== null && typeof input === 'object') {
      return Object.entries(input as Record<string, any>).reduce(
        (acc, [key, value]) => {
          if (value === null) {
            return acc;
          }

          const cleanedValue = this.removeNullValues(value);

          if (
            cleanedValue !== null &&
            !(
              typeof cleanedValue === 'object' &&
              Object.keys(cleanedValue).length === 0
            )
          ) {
            acc[key] = cleanedValue;
          }

          return acc;
        },
        {} as Record<string, any>,
      ) as T;
    }

    return input;
  }
}
