import { Component, OnInit } from '@angular/core';
import { RecipeDto, RecipeReturnDto, RecipeProduct } from 'src/app/models/recipe.model';
import { Product } from 'src/app/models/product.model';
import { RecipeService } from 'src/app/services/recipe.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.scss']
})
export class RecipeComponent implements OnInit {
  recipeList: any;
  recipes: RecipeReturnDto[] = [];
  availableProducts: Product[] = [];
  selectedProducts: RecipeProduct[] = [];
  selectedRecipe: RecipeReturnDto | null = null;
  newRecipe: RecipeDto = { name: '', instructions: '', totalEnergy: 0, totalFat: 0, totalCarbs: 0, totalProtein: 0, products: [] };
  selectedProduct: Product | null = null;
  filteredProducts: Product[] = [];
  totalEnergy: number = 0;
  totalFat: number = 0;
  totalCarbs: number = 0;
  totalProtein: number = 0;

  constructor(
    private recipeService: RecipeService,
    private productService: ProductService
  ) { }

  ngOnInit(): void {
    this.fetchRecipes();
    this.fetchProducts();
  }

  fetchRecipes(): void {
    this.recipeService.getRecipes().subscribe(recipes => {
      this.recipes = recipes;
    });
  }

  fetchProducts(): void {
    this.productService.getProducts().subscribe(products => {
      this.availableProducts = products;
    });
  }

  onNewRecipe(): void {
    this.newRecipe = { name: '', instructions: '', totalEnergy: 0, totalFat: 0, totalCarbs: 0, totalProtein: 0, products: [] };
    this.selectedRecipe = null;
    this.selectedProducts = [];
    this.recipeList.unselectAll();
  }

  onSelectRecipe(recipe: RecipeReturnDto): void {
    this.selectedRecipe = recipe;
    this.newRecipe = { name: '', instructions: '', totalEnergy: 0, totalFat: 0, totalCarbs: 0, totalProtein: 0, products: [] };
    this.selectedProducts = this.getRecipeProducts(recipe);
    this.onUpdateTotals();
  }

  getRecipeProducts(recipe: RecipeReturnDto): RecipeProduct[] {
    return recipe.products.map(rp => {
      const product = this.availableProducts.find(p => p.id === rp.productId);
      return { ...product, amount: rp.amount } as RecipeProduct;
    });
  }

  onSaveRecipe(): void {
    if (this.selectedRecipe) {
      this.selectedRecipe.products = this.selectedProducts.map(product => ({
        productId: product.id!,
        amount: product.amount
      }));
      this.selectedRecipe.totalEnergy = this.totalEnergy;
      this.selectedRecipe.totalFat = this.totalFat;
      this.selectedRecipe.totalCarbs = this.totalCarbs;
      this.selectedRecipe.totalProtein = this.totalProtein;

      this.recipeService.updateRecipe(this.selectedRecipe.id, this.selectedRecipe).subscribe(recipe => {
        this.fetchRecipes();
      });
    } else if (this.newRecipe.name && this.newRecipe.instructions) {
      this.newRecipe.products = this.selectedProducts.map(product => ({
        productId: product.id!,
        amount: product.amount
      }));
      this.newRecipe.totalEnergy = this.totalEnergy;
      this.newRecipe.totalFat = this.totalFat;
      this.newRecipe.totalCarbs = this.totalCarbs;
      this.newRecipe.totalProtein = this.totalProtein;

      this.recipeService.addRecipe(this.newRecipe).subscribe(recipe => {
        this.fetchRecipes();
      });
    }
  }

  onDeleteRecipe(): void {
    if (this.selectedRecipe) {
      this.recipeService.deleteRecipe(this.selectedRecipe.id).subscribe(() => {
        this.fetchRecipes();
        this.selectedRecipe = null;
      });
    }
  }

  onFilterProducts(event: { query: string; }) {
    this.productService.getProducts().subscribe((products: Product[]) => {
      this.filteredProducts = products.filter(product => product.name.toLowerCase().includes(event.query.toLowerCase()));
    });
  }

  onAddProduct() {
    if (this.selectedProduct) {
      const recipeProduct: RecipeProduct = { ...this.selectedProduct, amount: 1 };
      this.selectedProducts.push(recipeProduct);
      this.selectedProduct = null;
      this.onUpdateTotals();
    }
  }

  onRemoveProduct(product: RecipeProduct) {
    this.selectedProducts = this.selectedProducts.filter(p => p !== product);
    this.onUpdateTotals();
  }

  onUpdateTotals(): void {
    this.totalEnergy = 0;
    this.totalFat = 0;
    this.totalCarbs = 0;
    this.totalProtein = 0;

    this.selectedProducts.forEach(product => {
      this.totalEnergy += product.energy * product.amount;
      this.totalFat += product.fat * product.amount;
      this.totalCarbs += product.carbs * product.amount;
      this.totalProtein += product.protein * product.amount;
    });
  }
}
