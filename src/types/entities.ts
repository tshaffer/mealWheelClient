import { DishType, MealStatus, RequiredAccompanimentFlags } from './base';

export interface UserEntity {
  id: string;
  userName: string;
  password: string;
  email: string;
}

export interface BaseDishEntityRedux {
  id: string;
  userId: string;
  name: string;
  type: DishType;
  minimumInterval: number;
  // last: Date | null;
  lastAsStr: string | null;
  prepEffort: number;
  prepTime: number;
  cleanupEffort: number;
}

export interface MainDishEntity extends BaseDishEntityRedux {
  accompanimentRequired: RequiredAccompanimentFlags;
}

export interface BaseDishEntity {
  id: string;
  userId: string;
  name: string;
  type: DishType;
  minimumInterval: number;
  last: Date | null;
  prepEffort: number;
  prepTime: number;
  cleanupEffort: number;
}

export interface MainDishEntity extends BaseDishEntity {
  accompanimentRequired: RequiredAccompanimentFlags;
}

export interface DishEntityFromServer {
  id: string;
  name: string;
  type: DishType;
  minimumInterval: number;
  last: string | null;
  accompanimentRequired?: RequiredAccompanimentFlags;   // only applies when dishType === DishType.Main
  prepEffort: number;
  prepTime: number;
  cleanupEffort: number;
}


export interface DishEntity {
  id: string;
  name: string;
  type: DishType;
  minimumInterval: number;
  last: Date | null;
  accompanimentRequired?: RequiredAccompanimentFlags;   // only applies when dishType === DishType.Main
  prepEffort: number;
  prepTime: number;
  cleanupEffort: number;
}


export interface DishEntityRedux {
  id: string;
  name: string;
  type: DishType;
  minimumInterval: number;
  // last: Date | null;
  lastAsStr: string | null;
  accompanimentRequired?: RequiredAccompanimentFlags;   // only applies when dishType === DishType.Main
  prepEffort: number;
  prepTime: number;
  cleanupEffort: number;
}

export interface MealEntity {
  id: string;
  mainDish: DishEntity;
  salad?: DishEntity;
  veggie?: DishEntity;
  side?: DishEntity;
  // mainDishId: string;
  // saladId: string;
  // veggieId: string;
  // sideId: string; 
}

export interface DefinedMealEntity {
  id: string;
  userId: string;
  name: string;
  mainDishId: string;
  saladId: string;
  veggieId: string;
  sideId: string;
  mainName: string;
  veggieName: string;
  saladName: string;
  sideName: string;
}

export interface ScheduledMealEntity {
  id: string;
  userId: string;
  mainDishId: string;
  saladId: string;
  veggieId: string;
  sideId: string;
  dateScheduled: Date;
  status: MealStatus;
}

export interface VerboseScheduledMeal extends ScheduledMealEntity {
  main: DishEntity | null;
  mainName: string;
  salad: DishEntity | null;
  saladName: string;
  veggie: DishEntity | null;
  veggieName: string;
  side: DishEntity | null;
  sideName: string;
}

export interface IngredientEntity {
  id: string;
  userId: string;
  name: string;
  showInGroceryList: boolean;
  ingredients: IngredientEntity[];
}

export interface IngredientsById {
  [id: string]: IngredientEntity;   // key is ingredientId

}
export interface IngredientsByDish {
  [dishId: string]: string[];   // string array is list of ingredient ids
}

export interface DishRow {
  dish: DishEntity;
  id: string,
  name: string
  type: DishType;
  minimumInterval: number;
  last: Date | null;
  requiresAccompaniment: boolean;
  requiresSalad: boolean;
  requiresSide: boolean;
  requiresVeggie: boolean;
}

export interface IngredientRow {
  ingredient: IngredientEntity;
  id: string,
  name: string,
  showInGroceryList: boolean,
}

