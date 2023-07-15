import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GeneratorService } from '../../services/generator.service';
import { AddMealToPlanDto, MealPlan, MealPlanItem } from '../../models/generator.model';
import { RecipeService } from 'src/app/services/recipe.service';
import { RecipeReturnDto } from 'src/app/models/recipe.model';

@Component({
  selector: 'app-generator',
  templateUrl: './generator.component.html',
  styleUrls: ['./generator.component.scss']
})
export class GeneratorComponent implements OnInit {
  generateMealPlanForm: FormGroup;
  submitted = false;
  mealPlans: Map<string, MealPlan> = new Map<string, MealPlan>();
  selectedDate: Date = new Date();
  filteredRecipes: RecipeReturnDto[] = [];
  selectedRecipe: RecipeReturnDto = {
    id: 0,
    name: '',
    instructions: '',
    totalEnergy: 0,
    totalFat: 0,
    totalCarbs: 0,
    totalProtein: 0,
    products: []
  };

  constructor(private fb: FormBuilder, private generatorService: GeneratorService, private recipeService: RecipeService) {
    this.generateMealPlanForm = this.fb.group({
      startDate: [''],
      endDate: ['']
    });
  }

  ngOnInit(): void {
    this.generatorService.getMealPlans().subscribe((mealPlans: MealPlan[]) => {
      mealPlans.forEach((mealPlan: MealPlan) => {
        const date = new Date(mealPlan.date);
        this.mealPlans.set(this.formatDate(date), mealPlan);
      });
    });

    this.recipeService.getRecipes().subscribe((recipes: RecipeReturnDto[]) => {
      this.filteredRecipes = recipes;
    });
  }

  onAddRecipe() {
    let newMealPlanItem: AddMealToPlanDto = {
      mealPlanDate: this.selectedDate,
      recipeId: this.selectedRecipe.id,
      servings: 1,
    };

    this.generatorService.addMeal(newMealPlanItem).subscribe((updatedMealPlan: MealPlan) => {
      this.mealPlans.set(this.formatDate(new Date(updatedMealPlan.date)), updatedMealPlan);
    });
  }

  onDeleteMealPlanItem(mealPlanItem: MealPlanItem) {
    this.generatorService.deleteMeal(mealPlanItem.id).subscribe(() => {
      let mealPlan = this.mealPlans.get(this.formatDate(this.selectedDate));
      if (mealPlan) {
        mealPlan.meals = mealPlan.meals.filter(item => item.id !== mealPlanItem.id);
      }
    });
  }

  onDateSelect(date: Date) {
    date.setHours(0, 0, 0, 0);
    this.selectedDate = date;
  }

  onEatenChange(mealPlanItem: MealPlanItem) {
    this.generatorService.updateMeal(mealPlanItem.id, mealPlanItem.isEaten).subscribe((updatedMealPlanItem: MealPlanItem) => {
      mealPlanItem.isEaten = updatedMealPlanItem.isEaten;
    });
  }

  onSubmit() {
    this.submitted = true;

    if (this.generateMealPlanForm.invalid) {
      return;
    }

    const startDate = this.generateMealPlanForm.get('startDate')?.value;
    const endDate = this.generateMealPlanForm.get('endDate')?.value;

    const formattedStartDate = this.formatDate(new Date(startDate));
    const formattedEndDate = this.formatDate(new Date(endDate));

    this.generatorService.generateMealPlan(formattedStartDate, formattedEndDate).subscribe((mealPlans: MealPlan[]) => {
      mealPlans.forEach((mealPlan: MealPlan) => {
        const date = new Date(mealPlan.date);
        this.mealPlans.set(this.formatDate(date), mealPlan);
      });
      this.ngOnInit();
    });
  }

  onNextDay() {
    this.selectedDate = new Date(this.selectedDate.setDate(this.selectedDate.getDate() + 1));
    this.selectedDate.setHours(0, 0, 0, 0);
  }

  onPrevDay() {
    this.selectedDate = new Date(this.selectedDate.setDate(this.selectedDate.getDate() - 1));
    this.selectedDate.setHours(0, 0, 0, 0);
  }

  onFilterRecipes(event: any) {
    let query = event.query;

    this.recipeService.getRecipes().subscribe((recipes: RecipeReturnDto[]) => {
      this.filteredRecipes = recipes.filter((recipe: RecipeReturnDto) => {
        return recipe.name.toLowerCase().indexOf(query.toLowerCase()) > -1;
      });
    });
  }

  formatDate(date: Date): string {
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  }

  formatDatePicker(date: any): string {
    const day = ('0' + date.day).slice(-2);
    const month = ('0' + (date.month + 1)).slice(-2);
    const year = date.year;
    return `${year}-${month}-${day}`;
  }

  getEatenTotalsForDay(): { totalEnergy: number, totalFat: number, totalCarbs: number, totalProtein: number } {
    let mealPlanItems = this.selectedMealPlan();

    let totalEnergy = 0;
    let totalFat = 0;
    let totalCarbs = 0;
    let totalProtein = 0;

    for (let mealPlanItem of mealPlanItems) {
      if (mealPlanItem.isEaten) {
        totalEnergy += mealPlanItem.recipe.totalEnergy * mealPlanItem.servings;
        totalFat += mealPlanItem.recipe.totalFat * mealPlanItem.servings;
        totalCarbs += mealPlanItem.recipe.totalCarbs * mealPlanItem.servings;
        totalProtein += mealPlanItem.recipe.totalProtein * mealPlanItem.servings;
      }
    }

    return { totalEnergy, totalFat, totalCarbs, totalProtein };
  }

  getTotalsForDay(): { totalEnergy: number, totalFat: number, totalCarbs: number, totalProtein: number } {
    let mealPlanItems = this.selectedMealPlan();

    let totalEnergy = 0;
    let totalFat = 0;
    let totalCarbs = 0;
    let totalProtein = 0;

    for (let mealPlanItem of mealPlanItems) {
      totalEnergy += mealPlanItem.recipe.totalEnergy * mealPlanItem.servings;
      totalFat += mealPlanItem.recipe.totalFat * mealPlanItem.servings;
      totalCarbs += mealPlanItem.recipe.totalCarbs * mealPlanItem.servings;
      totalProtein += mealPlanItem.recipe.totalProtein * mealPlanItem.servings;
    }

    return { totalEnergy, totalFat, totalCarbs, totalProtein };
  }

  selectedMealPlan(): MealPlanItem[] {
    let mealPlan = this.mealPlans.get(this.formatDate(this.selectedDate));
    return mealPlan ? mealPlan.meals : [];
  }
}