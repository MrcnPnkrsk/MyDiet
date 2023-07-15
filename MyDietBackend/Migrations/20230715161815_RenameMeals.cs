using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyDietBackend.Migrations
{
    /// <inheritdoc />
    public partial class RenameMeals : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MealPlanItems_MealPlans_MealPlanId",
                table: "MealPlanItems");

            migrationBuilder.DropForeignKey(
                name: "FK_MealPlanItems_Recipes_RecipeId",
                table: "MealPlanItems");

            migrationBuilder.DropPrimaryKey(
                name: "PK_MealPlanItems",
                table: "MealPlanItems");

            migrationBuilder.RenameTable(
                name: "MealPlanItems",
                newName: "Meals");

            migrationBuilder.RenameIndex(
                name: "IX_MealPlanItems_RecipeId",
                table: "Meals",
                newName: "IX_Meals_RecipeId");

            migrationBuilder.RenameIndex(
                name: "IX_MealPlanItems_MealPlanId",
                table: "Meals",
                newName: "IX_Meals_MealPlanId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Meals",
                table: "Meals",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Meals_MealPlans_MealPlanId",
                table: "Meals",
                column: "MealPlanId",
                principalTable: "MealPlans",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Meals_Recipes_RecipeId",
                table: "Meals",
                column: "RecipeId",
                principalTable: "Recipes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Meals_MealPlans_MealPlanId",
                table: "Meals");

            migrationBuilder.DropForeignKey(
                name: "FK_Meals_Recipes_RecipeId",
                table: "Meals");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Meals",
                table: "Meals");

            migrationBuilder.RenameTable(
                name: "Meals",
                newName: "MealPlanItems");

            migrationBuilder.RenameIndex(
                name: "IX_Meals_RecipeId",
                table: "MealPlanItems",
                newName: "IX_MealPlanItems_RecipeId");

            migrationBuilder.RenameIndex(
                name: "IX_Meals_MealPlanId",
                table: "MealPlanItems",
                newName: "IX_MealPlanItems_MealPlanId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_MealPlanItems",
                table: "MealPlanItems",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_MealPlanItems_MealPlans_MealPlanId",
                table: "MealPlanItems",
                column: "MealPlanId",
                principalTable: "MealPlans",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_MealPlanItems_Recipes_RecipeId",
                table: "MealPlanItems",
                column: "RecipeId",
                principalTable: "Recipes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
