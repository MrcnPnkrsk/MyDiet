import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AuthGuard } from './guards/auth.guard';
import { ProductComponent } from './components/product/product.component';
import { RoleGuard } from './guards/role.guard';
import { RecipeComponent } from './components/recipe/recipe.component';
import { GeneratorComponent } from './components/generator/generator.component';
import { GroceryComponent } from './components/grocery/grocery.component';

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'product', component: ProductComponent, canActivate: [RoleGuard], data: { role: 'Administrator' } },
  { path: 'recipe', component: RecipeComponent, canActivate: [RoleGuard], data: { role: 'Administrator' } },
  { path: 'generator', component: GeneratorComponent, canActivate: [AuthGuard] },
  { path: 'grocery', component: GroceryComponent, canActivate: [AuthGuard] },
  { path: '**', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
