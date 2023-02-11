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
}

export interface MainDishEntity extends BaseDishEntityRedux {
  accompanimentRequired: RequiredAccompanimentFlags;
}

export interface BaseDishEntityMongo {
  id: string;
  userId: string;
  name: string;
  type: DishType;
  minimumInterval: number;
  last: Date | null;
}

export interface MainDishEntity extends BaseDishEntityMongo {
  accompanimentRequired: RequiredAccompanimentFlags;
}

export interface DishEntityMongo {
  id: string;
  name: string;
  type: DishType;
  minimumInterval: number;
  last: Date | null;
  // lastAsStr: string | null;
  accompanimentRequired?: RequiredAccompanimentFlags;   // only applies when dishType === DishType.Main
}


export interface DishEntityRedux {
  id: string;
  name: string;
  type: DishType;
  minimumInterval: number;
  // last: Date | null;
  lastAsStr: string | null;
  accompanimentRequired?: RequiredAccompanimentFlags;   // only applies when dishType === DishType.Main
}

export interface MealEntity {
  id: string;
  mainDish: DishEntityMongo;
  salad?: DishEntityMongo;
  veggie?: DishEntityMongo;
  side?: DishEntityMongo;
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
  main: DishEntityMongo | null;
  mainName: string;
  salad: DishEntityMongo | null;
  saladName: string;
  veggie: DishEntityMongo | null;
  veggieName: string;
  side: DishEntityMongo | null;
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

