import { MealStatus } from './base';

export enum DishType {
  Main = 'main',
  Side = 'side',
  Salad = 'salad',
  Veg = 'veg',
}

export enum RequiredAccompanimentFlags {
  None = 0,
  Side = 1,
  Salad = 2,
  Veg = 4,
}

export interface DishEntity {
  id: string;
  name: string;
  type: DishType;
  accompaniment?: RequiredAccompanimentFlags;
}

export interface UserEntity {
  id: string;
  userName: string;
  password: string;
  email: string;
}

export interface MealEntity {
  id: string;
  userId: string;
  // mealId: string;
  mainDishId: string;
  accompanimentDishId: string | null;
  dateScheduled: Date;
  status: MealStatus;
}

