import {
  DishEntity,
}
  from './entities';

export const serverUrl = 'http://localhost:8000';
// export const serverUrl = 'https://tsmealwheel.herokuapp.com';

export const apiUrlFragment = '/api/v1/';

export interface MealWheelState {
  appState: AppState;
  dishesState: DishesState;
  mealsState: MealsState;
  users: UsersMap;
  versionInfo: VersionInfo;
}

export interface AppState {
  appInitialized: boolean;
  uiState: UiState;
  userName: string | null;
}

export enum UiState {
  SelectUser = 'SelectUser',
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

export interface MealsState {
  meals: Meal[];
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
  veg: number;
}

export interface StartupParams {
  startPage: StartPage,
}

export enum StartPage {
  Standard = 'Standard',
}

export interface User {
  userName: string;
  password: string;
  email: string;
}

export interface UsersMap {
  [id: string]: User; // userName
}

