import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MealPlan, MealPlanItem, AddMealToPlanDto } from 'src/app/models/generator.model';

@Injectable({
  providedIn: 'root'
})
export class GeneratorService {

  private apiUrl = 'http://localhost:5287/api/MealPlan';

  constructor(private http: HttpClient) { }

  generateMealPlan(startDate: string, endDate: string): Observable<MealPlan[]> {
    return this.http.post<MealPlan[]>(this.apiUrl, { startDate, endDate });
  }

  getMealPlans(): Observable<MealPlan[]> {
    return this.http.get<MealPlan[]>(this.apiUrl);
  }

  addMeal(addMealToPlanDto: AddMealToPlanDto): Observable<MealPlan> {
    return this.http.post<MealPlan>(`${this.apiUrl}/addMeal`, addMealToPlanDto);
  }

  deleteMeal(mealPlanItemId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deleteMeal/${mealPlanItemId}`);
  }

  updateMeal(mealPlanItemId: number, isEaten: boolean): Observable<MealPlanItem> {
    return this.http.patch<MealPlanItem>(`${this.apiUrl}/switchMeal/${mealPlanItemId}`, isEaten);
  }
}
