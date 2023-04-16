import {
  // string, 
  MealStatus,
} from './base';

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
  type: string;
  minimumInterval: number;
  // last: Date | null;
  lastAsStr: string | null;
  prepEffort: number;
  prepTime: number;
  cleanupEffort: number;
}

export interface MainDishEntity extends BaseDishEntityRedux {
  numAccompanimentsRequired: number,
  allowableAccompanimentTypes: string[],// accompanimentTypeId[]
}

export interface BaseDishEntity {
  id: string;
  userId: string;
  name: string;
  type: string;
  minimumInterval: number;
  last: Date | null;
  prepEffort: number;
  prepTime: number;
  cleanupEffort: number;
}

export interface MainDishEntity extends BaseDishEntity {
  numAccompanimentsRequired: number,
  allowableAccompanimentTypes: string[],  // accompanimentTypeId[]
}

export interface DishEntityFromServer {
  id: string;
  name: string;
  type: string;
  minimumInterval: number;
  last: string | null;
  numAccompanimentsRequired?: number,
  allowableAccompanimentTypes?: string[],// accompanimentTypeId[]
  prepEffort: number;
  prepTime: number;
  cleanupEffort: number;
}


export interface DishEntity {
  id: string;
  name: string;
  type: string;
  minimumInterval: number;
  last: Date | null;
  numAccompanimentsRequired?: number,
  allowableAccompanimentTypes?: string[],// accompanimentTypeId[]
  prepEffort: number;
  prepTime: number;
  cleanupEffort: number;
}


export interface DishEntityRedux {
  id: string;
  name: string;
  type: string;
  minimumInterval: number;
  // last: Date | null;
  lastAsStr: string | null;
  numAccompanimentsRequired?: number,
  allowableAccompanimentTypes?: string[],// accompanimentTypeId[]
  prepEffort: number;
  prepTime: number;
  cleanupEffort: number;
}

export interface MealEntity {
  id: string;
  mainDish: DishEntity;
  accompanimentDishes?: DishEntity[];
}

export interface ScheduledMealEntity {
  id: string;
  userId: string;
  mainDishId: string;
  accompanimentIds: string[];
  dateScheduled: Date;
  status: MealStatus;
}

export interface VerboseScheduledMeal extends ScheduledMealEntity {
  main: DishEntity | null;
  mainName: string;
  accompaniments: DishEntity[] | null;
  accompanimentNames: string[];
}

export interface AccompanimentTypeEntity {
  id: string;
  userId: string;
  name: string;
  uiIndex: number;
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

// ????
export interface DishRow {
  dish: DishEntity;
  name: string
  type: string;
  minimumInterval: number;
  last: Date | null;
  // requiresAccompaniment: boolean;
  // requiresSalad: boolean;
  // requiresSide: boolean;
  // requiresVeggie: boolean;
}

export interface IngredientRow {
  ingredient: IngredientEntity;
  name: string,
  showInGroceryList: boolean,
}

