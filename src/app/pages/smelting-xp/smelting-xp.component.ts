import { Component } from '@angular/core';
import { JsonLoaderService } from '../../services/json-loader.service';

@Component({
  selector: 'app-smelting-xp',
  standalone: true,
  imports: [],
  templateUrl: './smelting-xp.component.html',
  styleUrl: './smelting-xp.component.scss',
})
export class SmeltingXpComponent {
  loadedRecipe: any[] = [];
  jsonPath = "recipe/"

  constructor(private jsonLoaderService: JsonLoaderService) {}

  ngOnInit(): void {
    this.jsonLoaderService.getJsonData("recipe/acacia_button.json").subscribe((data:any) => {
      console.log(data)
    });
  }
}
