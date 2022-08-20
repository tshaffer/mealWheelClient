import {
  DishEntity, MealEntity, UserEntity,
}
  from './entities';

export const serverUrl = 'http://localhost:8000';
// export const serverUrl = 'https://tsmealwheel.herokuapp.com';

export const apiUrlFragment = '/api/v1/';

export interface MealWheelState {
  appParameters: AppParameters;
  appState: AppState;
  dishesState: DishesState;
  mealsState: MealsState;
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

export interface MealsState {
  meals: MealEntity[];
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
  Veg = 'veg',
}

export enum RequiredAccompanimentFlags {
  None = 0,
  Side = 1,
  Salad = 2,
  Veg = 4,
}

export enum MealStatus {
  pending = 0,
  accepted = 1,
  completed = 2,
}
