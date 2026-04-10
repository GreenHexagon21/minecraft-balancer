import { Component } from '@angular/core';
import { JsonLoaderService } from '../../services/json-loader.service';
import { FormBuilder } from '@angular/forms';
import { Globals } from '../../services/globals';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { ChipModule } from 'primeng/chip';
import { FormsModule } from '@angular/forms';
import { TagList } from '../tag-sets/tag-sets';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';

export interface MinecraftCraftingShapedRecipe {
  type: 'minecraft:crafting_shaped';
  category: string;
  key: Record<string, string>;
  pattern: string[];
  result: {
    components?: {
      'minecraft:tool': {
        rules: Array<ToolRule>;
        default_mining_speed: number;
        damage_per_block: number;
      };
      'minecraft:custom_name'?: string | undefined;
    };
    count: number;
    id: string;
  };
}

export interface ToolRule {
  blocks: undefined | string | Array<string>;
  speed: number;
  correct_for_drops: boolean;
}

interface ToolRuleEditor {
  mode: 'single' | 'multiple';
  rule: ToolRule;
}

@Component({
  selector: 'app-crafting',
  imports: [
    SelectModule,
    MultiSelectModule,
    ChipModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatCheckboxModule,
    CommonModule,
  ],
  templateUrl: './crafting.html',
  styleUrl: './crafting.scss',
})
export class Crafting {
  allItems: any;
  justItems: any;
  recipe: any = [
    [undefined, undefined, undefined],
    [undefined, undefined, undefined],
    [undefined, undefined, undefined],
  ];
  newRecipeName: string | undefined;
  jsonPath = 'recipe/';
  savedTagLists: Array<TagList> = [];
  savedRecipes: Array<any> = [];
  selectedRecipe: any = undefined;
  convertedTagLists: Array<any> = [];
  resultItem: string | undefined;

  toolRules: Array<ToolRuleEditor> = [];
  customToolName: string | undefined;
  damagePerBlock: number = 1;
  defaultMiningSpeed: number = 1.0;

  ruleModes = [
    { label: 'Single', value: 'single' },
    { label: 'Multiple', value: 'multiple' },
  ];

  constructor(
    private jsonLoaderService: JsonLoaderService,
    private fb: FormBuilder,
    public globals: Globals,
  ) {}

  ngOnInit(): void {
    this.jsonLoaderService.getJsonData('items.json').subscribe((data: any) => {
      this.refreshLocalstorageLists();
      this.convertLocalTagLists();
      let tempItems: Array<object> = this.globals.tags.concat(data);
      this.justItems = data;
      tempItems = tempItems.concat(this.convertedTagLists);
      this.allItems = tempItems;
    });
    this.refreshLocalstorageRecipes();
  }

  refreshLocalstorageRecipes() {
    this.savedRecipes = [];
    const localCopy = JSON.parse(localStorage.getItem('saved-items') ?? '[]');
    localCopy.forEach((element: string) => {
      if (element.includes('.recipe')) {
        const localRecipe = JSON.parse(localStorage.getItem(element) ?? '[]');
        if (!Array.isArray(localRecipe)) {
          this.savedRecipes.push({
            value: element.replaceAll(' ', '_'),
            label: element.replaceAll('.recipe', ''),
          });
          console.log(this.savedRecipes);
        }
      }
    });
    this.savedRecipes = this.savedRecipes.concat(this.globals.tools);
    console.log(this.savedRecipes);
  }

  convertLocalTagLists() {
    this.savedTagLists.forEach((tagList) => {
      this.convertedTagLists.push({
        id: -1,
        name: tagList.name,
        displayName: tagList.name,
        stackSize: -1,
        namespacedName: '#minecraft:' + tagList.name,
      });
    });
  }

  refreshLocalstorageLists() {
    this.savedTagLists = [];
    const localCopy = JSON.parse(localStorage.getItem('saved-items') ?? '[]');
    localCopy.forEach((element: string) => {
      if (element.includes('.tags')) {
        let localTagList = JSON.parse(localStorage.getItem(element) ?? '[]');
        localTagList.name = localTagList.name 
        if (!Array.isArray(localTagList)) {
          this.savedTagLists.push(localTagList);
        }
      }
    });
  }

  onCraftingRecipeSelectChanged(event: any) {
    this.toolRules = [];
    this.customToolName = '';
    this.defaultMiningSpeed = 1;
    this.damagePerBlock = 1;
    this.newRecipeName = event?.value?.label ?? '';

    const storageKey = event?.value?.label;
    if (!storageKey) {
      return;
    }

    let localCopy: any = [];

    try {
      localCopy = JSON.parse(localStorage.getItem(storageKey) ?? '[]');

      if (!localCopy || (Array.isArray(localCopy) && localCopy.length === 0)) {
        localCopy = JSON.parse(
          localStorage.getItem(`${storageKey}.recipe`) ?? '[]',
        );
      }
    } catch (error) {
      console.error('Failed to parse localStorage recipe data:', error);
      localCopy = [];
    }

    const hasLocalRecipe =
      localCopy &&
      !Array.isArray(localCopy) &&
      localCopy.result &&
      localCopy.result.components;

    if (hasLocalRecipe) {
      const localTool = localCopy.result.components['minecraft:tool'] ?? {};
      const localRules = localTool.rules ?? [];

      this.customToolName =
        localCopy.result.components['minecraft:custom_name'] ?? '';
      this.damagePerBlock = localTool.damage_per_block ?? 1;
      this.defaultMiningSpeed = localTool.default_mining_speed ?? 1;

      localRules.forEach((rule: ToolRule) => {
        console.log(rule);

        const localToolRule: ToolRuleEditor = {
          mode: Array.isArray(rule.blocks) ? 'multiple' : 'single',
          rule: rule,
        };

        this.toolRules.push(localToolRule);
      });

      if (localCopy.result?.id) {
        this.resultItem = localCopy.result.id;
      }

      if (Array.isArray(localCopy.pattern) && localCopy.key) {
        for (let i = 0; i < localCopy.pattern.length; i++) {
          const patternRow = localCopy.pattern[i];

          for (let j = 0; j < patternRow.length; j++) {
            const patternItem = patternRow[j];
            this.recipe[i][j] = localCopy.key[patternItem];
          }
        }
      }
    } else {
      if (event?.value?.value) {
        this.jsonLoaderService
          .getJsonData(this.jsonPath + event.value.value)
          .subscribe((data: MinecraftCraftingShapedRecipe) => {
            console.log(data);

            this.resultItem = data.result.id;

            for (let i = 0; i < data.pattern.length; i++) {
              const patternRow = data.pattern[i];

              for (let j = 0; j < patternRow.length; j++) {
                const patternItem = patternRow[j];
                this.recipe[i][j] = data.key[patternItem];
              }
            }
          });
      }
    }
  }

  saveRecipe() {
    let possibleSymbols = ['X', '#', 'H', 'N', '0', 'W', '8', 'Z', '+'];
    let assingedSymbolCount = 0;
    let keyPairs: any[] = [];
    let keyDecoders: any[] = [];
    let itemSet: Set<string> = new Set<string>();
    let patternResult: Array<string> = ['', '', ''];
    let compiledRecipe: MinecraftCraftingShapedRecipe = {
      type: 'minecraft:crafting_shaped',
      category: 'equipment',
      key: {},
      pattern: [],
      result: {
        count: 1,
        id: '',
      },
    };

    this.jsonLoaderService.getJsonData('items.json').subscribe((data: any) => {
      this.refreshLocalstorageLists();
      this.convertLocalTagLists();
      let tempItems: Array<object> = this.globals.tags.concat(data);
      this.justItems = data;
      tempItems = tempItems.concat(this.convertedTagLists);
      this.allItems = tempItems;
    });

    this.refreshLocalstorageRecipes();

    for (let i = 0; i < this.recipe.length; i++) {
      for (let j = 0; j < this.recipe[i].length; j++) {
        if (!itemSet.has(this.recipe[i][j]) && this.recipe[i][j]) {
          itemSet.add(this.recipe[i][j]);
          keyPairs.push({
            [possibleSymbols[assingedSymbolCount]]: this.recipe[i][j],
          });
          keyDecoders.push({
            [this.recipe[i][j]]: possibleSymbols[assingedSymbolCount],
          });
          assingedSymbolCount++;
        }
      }
    }

    const result = {
      key: Object.assign({}, ...keyPairs),
    };
    const decodingResult = {
      key: Object.assign({}, ...keyDecoders),
    };

    for (let i = 0; i < this.recipe.length; i++) {
      for (let j = 0; j < this.recipe[i].length; j++) {
        console.log(decodingResult.key[this.recipe[i][j]]);
        if (this.recipe[i][j]) {
          patternResult[i] =
            patternResult[i] + decodingResult.key[this.recipe[i][j]];
        } else {
          patternResult[i] = patternResult[i] + ' ';
        }
      }
    }

    compiledRecipe.key = result.key;
    compiledRecipe.pattern = patternResult;
    if (this.resultItem) {
      compiledRecipe.result.id = this.resultItem;
    }

    const minecraftToolRules: ToolRule[] = this.toolRules.map((x) => x.rule);
    compiledRecipe.result.components ??= {
      'minecraft:tool': {
        rules: [],
        default_mining_speed: this.defaultMiningSpeed,
        damage_per_block: this.damagePerBlock,
      },
    };

    compiledRecipe.result.components['minecraft:tool'] ??= {
      rules: [],
      default_mining_speed: this.defaultMiningSpeed,
      damage_per_block: this.damagePerBlock,
    };

    if (this.customToolName !== undefined && this.customToolName != '') {
      compiledRecipe.result.components['minecraft:custom_name'] =
        this.customToolName;
    }

    compiledRecipe.result.components['minecraft:tool'].rules =
      minecraftToolRules;
    console.log(compiledRecipe);

    const existingRecipe = this.globals.tools.some(
      (element) => element.label === this.newRecipeName,
    );

    if (!existingRecipe) {
      if (this.newRecipeName) {
        localStorage.setItem(
          this.newRecipeName + '.recipe',
          JSON.stringify(compiledRecipe),
        );
      }

      let tempItems: any[];
      if (localStorage.getItem('saved-items')) {
        tempItems = JSON.parse(localStorage.getItem('saved-items') ?? '[]');
      } else {
        tempItems = [];
      }

      tempItems.push(this.newRecipeName + '.recipe');
      let tempSet = new Set(tempItems);

      localStorage.setItem(
        'saved-items',
        JSON.stringify(Array.from(tempSet.values())),
      );
    } else {
      if (this.newRecipeName) {
        localStorage.setItem(
          this.newRecipeName,
          JSON.stringify(compiledRecipe),
        );
      }

      let tempItems: any[];
      if (localStorage.getItem('saved-items')) {
        tempItems = JSON.parse(localStorage.getItem('saved-items') ?? '[]');
      } else {
        tempItems = [];
      }

      tempItems.push(this.newRecipeName);
      let tempSet = new Set(tempItems);

      localStorage.setItem(
        'saved-items',
        JSON.stringify(Array.from(tempSet.values())),
      );
    }

    this.refreshLocalstorageRecipes();

    const savedKey = existingRecipe
      ? this.newRecipeName
      : this.newRecipeName + '.recipe';

    this.selectedRecipe =
      this.savedRecipes.find((x) => x.value === savedKey) ?? undefined;
  }

  clearRecipe() {
    this.selectedRecipe = undefined;

    for (let i = 0; i < this.recipe.length; i++) {
      const patterRow = this.recipe[i];
      for (let j = 0; j < patterRow.length; j++) {
        this.recipe[i][j] = undefined;
      }
    }
    this.resultItem = undefined;
    this.newRecipeName = undefined;
  }

  addToolRule() {
    this.toolRules.push({
      mode: 'single',
      rule: {
        blocks: undefined,
        speed: 1,
        correct_for_drops: true,
      },
    });
  }

  deleteRule(index: number) {
    this.toolRules.splice(index, 1);
  }

  onToolRuleModeChange(editor: ToolRuleEditor) {
    if (editor.mode === 'single') {
      if (Array.isArray(editor.rule.blocks)) {
        editor.rule.blocks = editor.rule.blocks[0] ?? undefined;
      }
    } else {
      if (!Array.isArray(editor.rule.blocks)) {
        editor.rule.blocks = editor.rule.blocks ? [editor.rule.blocks] : [];
      }
    }
  }

  isMultiBlockRule(
    editor: ToolRuleEditor,
  ): editor is ToolRuleEditor & { rule: { blocks: string[] } } {
    return Array.isArray(editor.rule.blocks);
  }

  removeSelectedBlock(editor: ToolRuleEditor, blockToRemove: string) {
    if (!Array.isArray(editor.rule.blocks)) {
      return;
    }

    editor.rule.blocks = editor.rule.blocks.filter(
      (block) => block !== blockToRemove,
    );
  }

  getItemLabel(namespacedName: string): string {
    const item = this.allItems?.find(
      (x: any) => x.namespacedName === namespacedName,
    );

    return item?.displayName ?? namespacedName;
  }

  onSelectChanged(event:any) {
    console.log(event);
  }
}