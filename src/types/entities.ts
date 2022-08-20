import { DishType, MealStatus, RequiredAccompanimentFlags } from './base';

export interface UserEntity {
  id: string;
  userName: string;
  password: string;
  email: string;
}

export interface DishEntity {
  id: string;
  name: string;
  type: DishType;
  accompaniment?: RequiredAccompanimentFlags;
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

export interface DetailedMealEntity {
  id: string;
  userId: string;
  mainDish: DishEntity;
  accompanimentDish: DishEntity | null;
  dateScheduled: Date;
  status: MealStatus;
}

