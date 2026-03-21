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

interface MinecraftCraftingShapedRecipe {
  type: 'minecraft:crafting_shaped';
  category: string;
  key: Record<string, string>;
  pattern: string[];
  result: {
    components?: {
      'minecraft:tool': {
        rules: Array<ToolRule>;
      };
    };
    count: number;
    id: string;
  };
}

interface ToolRule {
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
  convertedTagLists: Array<any> = [];
  resultItem: string | undefined;

  toolRules: Array<ToolRuleEditor> = [];

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
  }

  convertLocalTagLists() {
    this.savedTagLists.forEach((tagList) => {
      this.convertedTagLists.push({
        id: -1,
        name: tagList.name,
        displayName: tagList.name,
        stackSize: -1,
        namespacedName: 'minecraft:' + tagList.name,
      });
    });
  }

  refreshLocalstorageLists() {
    this.savedTagLists = [];
    const localCopy = JSON.parse(localStorage.getItem('saved-items') ?? '[]');
    localCopy.forEach((element: string) => {
      if (element.includes('.tags')) {
        const localTagList = JSON.parse(localStorage.getItem(element) ?? '[]');
        if (!Array.isArray(localTagList)) {
          this.savedTagLists.push(localTagList);
        }
      }
    });
  }

  onCraftingRecipeSelectChanged(event: any) {
    console.log(event);
    this.newRecipeName = event.value.label;
    const localCopy = JSON.parse(localStorage.getItem(event.value) ?? '[]');

    if (localCopy.length != 0) {
    } else {
      if (event?.value?.value) {
        this.jsonLoaderService
          .getJsonData(this.jsonPath + event.value.value)
          .subscribe((data: MinecraftCraftingShapedRecipe) => {
            console.log(data);
            this.resultItem = data.result.id;
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
    console.log(result);
    console.log(compiledRecipe);

    const minecraftToolRules: ToolRule[] = this.toolRules.map((x) => x.rule);
    compiledRecipe.result.components ??= {
      'minecraft:tool': {
        rules: [],
      },
    };

    compiledRecipe.result.components['minecraft:tool'] ??= {
      rules: [],
    };

    compiledRecipe.result.components['minecraft:tool'].rules =
      minecraftToolRules;
    console.log(compiledRecipe);
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
}
