import { Product } from "./product.model";

export interface MealPlan {
    id: number;
    date: Date;
    userId: number;
    meals: MealPlanItem[];
  }
  
  export interface MealPlanItem {
    id: number;
    mealPlanId: number;
    recipeId: number;
    recipe: Recipe;
    servings: number;
    isEaten: boolean;
  }

  export interface Recipe {
    id: number;
    name: string;
    instructions: string;
    totalEnergy: number;
    totalFat: number;
    totalCarbs: number;
    totalProtein: number;
    recipeProducts: RecipeProduct[];
  }

  export interface RecipeProduct {
    amount: number;
    product: Product;
  }

  export interface ProductAggregate {
    name: string;
    amount: number;
    url: string;
  }

  export interface AddMealToPlanDto {
    mealPlanDate: Date;
    recipeId: number;
    servings: number;
  }