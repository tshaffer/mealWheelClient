import {
  DefinedMealEntity,
  DishEntity,
  IngredientEntity,
  IngredientsByDish,
  IngredientsById,
  ScheduledMealEntity,
  UserEntity,
  VerboseScheduledMeal,
}
  from './entities';

export const serverUrl = 'http://localhost:8000';
// export const serverUrl = 'https://tsmealwheel.herokuapp.com';

export const apiUrlFragment = '/api/v1/';

export interface MealWheelState {
  appParameters: AppParameters;
  appState: AppState;
  dishesState: DishesState;
  definedMealsState: DefinedMealsState;
  generateGroceryListState: GenerateGroceryListState;
  generateMealsState: GenerateMealsState;
  groceryListState: GroceryListState;
  ingredientsState: IngredientsState;
  scheduledMealsState: ScheduledMealsState;
  mealsResolutionState: MealsResolutionState;
  users: UsersMap;
  versionInfo: VersionInfo;
}

export interface AppState {
  appInitialized: boolean;
  uiState: UiState;
  userId: string | null;
}

export enum UiState {
  SelectUser = 'SelectUser',
  App = 'App',
  Other = 'Other',
}


export interface VersionInfo {
  clientVersion: string;
  serverVersion: string;
}

export interface DishesState {
  // dishes: DishesMap;
  dishes: DishEntity[];
}

// export interface DishesMap {
//   [id: string]: DishEntity; // dish name
// }

export interface IngredientsState {
  ingredientsById: IngredientsById;
  ingredientsByDish: IngredientsByDish;
}

export interface DefinedMealsState {
  definedMeals: DefinedMealEntity[];
}

export interface ScheduledMealsState {
  scheduledMeals: ScheduledMealEntity[];
  scheduledMealsToResolve: ScheduledMealEntity[];
}

export interface GenerateMealsState {
  startDate: Date;
  numberOfMealsToGenerate: number;
  overwriteExistingMeals: boolean;
}

export interface GenerateGroceryListState {
  startDate: Date;
  numberOfMealsInGroceryList: number;
  showStaples: boolean;
}

export interface GroceryListState {
  ingredients: IngredientEntity[];
}

export interface MealsResolutionState {
  pendingMeal: VerboseScheduledMeal | null;
  mealIndex: number;
  mealsToResolve: VerboseScheduledMeal[];
}

export interface Meal {
  mainDishId: string;
  accompanimentDishId: string | null;
}

export interface DishRowModel {
  id: string;
  name: string,
  type: string,
  requiresAccompaniment: boolean;
  side: number;
  salad: number;
  veggie: number;
}

export interface StartupParams {
  startPage: StartPage,
}

export enum StartPage {
  Standard = 'Standard',
}

export interface UsersMap {
  [id: string]: UserEntity; // userId
}

export interface AppParameters {
  startPage: StartPage;
  // startupBoardId: string | null;
}

export enum DishType {
  Main = 'main',
  Side = 'side',
  Salad = 'salad',
  Veggie = 'veggie',
}

export enum RequiredAccompanimentFlags {
  None = 0,
  Side = 1,
  Salad = 2,
  Veggie = 4,
}

export enum MealStatus {
  pending = 0,
  prepared = 1,
  different = 2,
}
