import { GridRowModel } from '@mui/x-data-grid';
import {
  AccompanimentTypeEntity,
  DishEntityRedux,
  DishRow,
  IngredientEntity,
  IngredientRow,
  IngredientsByDish,
  IngredientsById,
  MealEntity,
  ScheduledMealEntity,
  UserEntity,
  VerboseScheduledMeal,
}
  from './entities';

export const serverUrl = 'http://localhost:8000';
// export const serverUrl = 'https://tsmealwheel.herokuapp.com';

export const apiUrlFragment = '/api/v1/';

export interface MealWheelState {
  accompanimentTypes: AccompanimentTypesMap;
  appParameters: AppParameters;
  appState: AppState;
  dishesState: DishesState;
  dishesUIState: DishesUIState;
  generateGroceryListState: GenerateGroceryListStateRedux;
  generateMealsState: GenerateMealsStateRedux;
  groceryListState: GroceryListState;
  ingredientsState: IngredientsState;
  ingredientsUIState: IngredientsUIState;
  scheduledMealsState: ScheduledMealsState;
  mealsResolutionState: MealsResolutionState;
  unassignedMealsState: UnassignedMealsState;
  users: UsersMap;
  versionInfo: VersionInfo;
  mealWheelTonightUIState: MealWheelTonightUIState,
}

export interface MealWheelTonightUIState {
  dinnerTime: string,   // TEDTODO - not date due to redux
  prepEffort: number,
  cleanupEffort: number,
}

export interface UnassignedMealsState {
  meals: MealEntity[];
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
  MealSchedule = 'MealSchedule',
  Dishes = 'Dishes',
  Ingredients = 'Ingredients',
  MealWheelTonight = 'MealWheelTonight',
  Settings = 'Settings',
}

export enum AppTab {
  MealSchedule = 'MealSchedule',
  Dishes = 'Dishes',
  Ingredients = 'Ingredients',
  MealWheelTonight = 'MealWheelTonight',
  Settings = 'Settings',
}

export interface VersionInfo {
  clientVersion: string;
  serverVersion: string;
}

export interface DishesState {
  // dishes: DishesMap;
  dishes: DishEntityRedux[];
}

// export interface DishesMap {
//   [id: string]: DishEntity; // dish name
// }

export interface DishesUIState {
  sortOrder: Order;
  sortBy: string;
  rows: DishRow[];
  currentEditDish: DishRow | null;
}

export interface IngredientsUIState {
  sortOrder: Order;
  sortBy: string;
  rows: IngredientRow[];
  currentEditIngredient: IngredientRow | null;
}


export interface IngredientsState {
  ingredientsById: IngredientsById;
  ingredientsByDish: IngredientsByDish;
}

export interface ScheduledMealsState {
  scheduledMeals: ScheduledMealEntity[];
  scheduledMealsToResolve: ScheduledMealEntity[];
}

export interface GenerateMealsStateRedux {
  startDateAsStr: string;
  numberOfMealsToGenerate: number;
}

export interface GenerateMealsState {
  startDate: Date;
  numberOfMealsToGenerate: number;
}

export interface GenerateGroceryListStateRedux {
  startDateAsStr: string;
  numberOfMealsInGroceryList: number;
  showStaples: boolean;
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

export interface DishRowModel {
  id: string;
  name: string,
  type: string,
  numAccompanimentsRequired: number,
  allowableAccompanimentTypes: string[],
  accompaniments: string[],
}

export interface IngredientInDishRowModel extends GridRowModel {
  id: string;
  name: string,
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

export interface AccompanimentTypesMap {
  [id: string]: AccompanimentTypeEntity[]; // userId
}

export interface AppParameters {
  startPage: StartPage;
}

export enum MealStatus {
  pending = 0,
  prepared = 1,
  different = 2,
}

export interface MealOnDate {
  date: Date;
  meal: MealEntity | null;
}

export type Order = 'asc' | 'desc';

