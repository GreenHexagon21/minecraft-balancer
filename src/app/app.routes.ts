import { Routes } from '@angular/router';
import { SmeltingXpComponent } from './pages/smelting-xp/smelting-xp.component';
import { HomeComponent } from './pages/home/home.component';
import { OreRarity } from './pages/ore-rarity/ore-rarity';
import { BiomeComponent } from './pages/biome/biome.component';
import { TagSets } from './pages/tag-sets/tag-sets';
import { Crafting } from './pages/crafting/crafting';

export const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    data: { nav: { label: 'Home', order: 1 } },
  },
  {
    path: 'smelting',
    component: SmeltingXpComponent,
    data: { nav: { label: 'Smelting', order: 2 }  },
  },
    {
    path: 'biomes',
    component: BiomeComponent,
    data: { nav: { label: 'Biome Ores', order: 3 }  },
  },
    {
    path: 'placed-ore',
    component: OreRarity,
    data: { nav: { label: 'Ore rarity', order: 4 }  },
  },
      {
    path: 'tag-sets',
    component: TagSets,
    data: { nav: { label: 'Crafting Tag Set Creator', order: 5 }  },
  },
        {
    path: 'crafting-recipes',
    component: Crafting,
    data: { nav: { label: 'Crafting Recipes', order: 6 }  },
  },
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: '**', redirectTo: 'home' },
];
