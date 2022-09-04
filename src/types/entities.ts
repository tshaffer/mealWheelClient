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
  accompanimentRequired?: RequiredAccompanimentFlags;   // only applies when dishType === DishType.Main
}

export interface DefinedMealEntity {
  id: string;
  userId: string;
  name: string;
  mainDishId: string;
  mainName: string;
  accompanimentDishIds: string[];
  veggieName: string;
  saladName: string;
  sideName: string;
}

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
  accompanimentDishes: DishEntity[];
  dateScheduled: Date;
  status: MealStatus;
}

