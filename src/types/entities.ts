import { DishType, MealStatus, RequiredAccompanimentFlags } from './base';

export interface UserEntity {
  id: string;
  userName: string;
  password: string;
  email: string;
}

export interface BaseDishEntity {
  id: string;
  userId: string;
  name: string;
  type: DishType;
}

export interface MainDishEntity extends BaseDishEntity {
  accompanimentRequired: RequiredAccompanimentFlags;
}

export interface DishEntity {
  id: string;
  name: string;
  type: DishType;
  accompaniment?: RequiredAccompanimentFlags;   // only applies when dishType === DishType.Main
}

// export interface ScheduledMealEntity {
//   id: string;
//   userId: string;
//   name: string;
//   mainDishId: string;
//   accompanimentDishIds: string[];
//   mainName: string;
//   veggieName: string;
//   saladName: string;
//   sideName: string;
// }

// export interface ScheduledMealEntity {
//   id: string;
//   userId: string;
//   // mealId: string;
//   mainDishId: string;
//   accompanimentDishId: string | null;
//   dateScheduled: Date;
//   status: MealStatus;
// }

export interface ScheduledMealEntity {
  id: string;
  userId: string;
  mainDishId: string;
  accompanimentDishIds: string[];
  dateScheduled: Date;
  status: MealStatus;
}

export interface DetailedMealEntity {
  id: string;
  userId: string;
  mainDish: DishEntity;
  accompanimentDish: DishEntity | null;
  dateScheduled: Date;
  status: MealStatus;
}

