import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GeneratorService } from '../../services/generator.service';
import { MealPlan, MealPlanItem, ProductAggregate, RecipeProduct } from '../../models/generator.model';

@Component({
  selector: 'app-generator',
  templateUrl: './grocery.component.html',
  styleUrls: ['./grocery.component.scss']
})
export class GroceryComponent implements OnInit {
  generateMealPlanForm: FormGroup;
  submitted = false;
  mealPlans: Map<string, MealPlan> = new Map<string, MealPlan>();
  selectedDate: Date = new Date();
  aggregatedProducts: ProductAggregate[] = [];

  constructor(private fb: FormBuilder, private generatorService: GeneratorService) {
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
  }

  onSubmit() {
    this.submitted = true;

    if (this.generateMealPlanForm.invalid) {
      return;
    }

    const startDate = this.generateMealPlanForm.get('startDate')?.value;
    const endDate = this.generateMealPlanForm.get('endDate')?.value;

    const filteredMealPlans = Array.from(this.mealPlans.values()).filter(mealPlan => {
      const date = new Date(mealPlan.date);
      return date >= startDate && date <= endDate;
    });

    this.aggregatedProducts = this.aggregateProducts(filteredMealPlans);
  }

  onPrintGroceryList(): void {
    let printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write('<html><head><title>Print Grocery List</title></head><body>');
      printWindow.document.write('<h1>Grocery List</h1>');
      printWindow.document.write('<table>');
      printWindow.document.write('<tr><th>Name</th><th>Amount</th></tr>');
  
      this.aggregatedProducts.forEach(product => {
        if (printWindow) {
          printWindow.document.write(`<tr><td>${product.name}</td><td>${product.amount}</td></tr>`);
        }
      });
  
      printWindow.document.write('</table></body></html>');
      printWindow.document.close();
      printWindow.print();
    }
  }

  aggregateProducts(mealPlans: MealPlan[]): ProductAggregate[] {
    let aggregatedProducts: { [key: string]: ProductAggregate } = {};

    for (let mealPlan of mealPlans) {
      for (let mealPlanItem of mealPlan.meals) {
        if (!mealPlanItem.isEaten && mealPlanItem.recipe && mealPlanItem.recipe.recipeProducts) {
          mealPlanItem.recipe.recipeProducts.forEach((recipeProduct: RecipeProduct) => {
            let product = recipeProduct.product;
            if (!aggregatedProducts[product.name]) {
              aggregatedProducts[product.name] = {
                name: product.name,
                amount: recipeProduct.amount * mealPlanItem.servings,
                url: product.url
              };
            } else {
              aggregatedProducts[product.name].amount += recipeProduct.amount * mealPlanItem.servings;
            }
          });
        }
      }
    }

    return Object.values(aggregatedProducts);
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
}
