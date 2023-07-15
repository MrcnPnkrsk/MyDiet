import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RecipeDto, RecipeReturnDto } from '../models/recipe.model';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private apiUrl = 'http://localhost:5287/api/Recipe';

  constructor(private http: HttpClient) { }

  getRecipes(): Observable<RecipeReturnDto[]> {
    return this.http.get<RecipeReturnDto[]>(this.apiUrl);
  }

  getRecipe(id: number): Observable<RecipeReturnDto> {
    return this.http.get<RecipeReturnDto>(`${this.apiUrl}/${id}`);
  }

  addRecipe(recipe: RecipeDto): Observable<RecipeReturnDto> {
    return this.http.post<RecipeReturnDto>(this.apiUrl, recipe);
  }

  updateRecipe(id: number, recipe: RecipeDto): Observable<RecipeReturnDto> {
    return this.http.put<RecipeReturnDto>(`${this.apiUrl}/${id}`, recipe);
  }

  deleteRecipe(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
