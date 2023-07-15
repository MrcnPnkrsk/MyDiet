import { Product } from "./product.model";

export interface RecipeProductDto {
  productId: number;
  amount: number;
}

export interface RecipeDto {
  name: string;
  instructions: string;
  totalEnergy: number;
  totalFat: number;
  totalCarbs: number;
  totalProtein: number;
  products: RecipeProductDto[];
}

export interface RecipeReturnDto {
  id: number;
  name: string;
  instructions: string;
  totalEnergy: number;
  totalFat: number;
  totalCarbs: number;
  totalProtein: number;
  products: RecipeProductDto[];
}

export interface RecipeProduct extends Product {
  amount: number;
}
