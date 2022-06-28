import { DishEntity } from './entities';

export const serverUrl = 'http://localhost:8000';
// export const serverUrl = 'https://tswordle.herokuapp.com';

export const apiUrlFragment = '/api/v1/';

export interface MealWheelState {
  versionInfo: VersionInfo;
  dishesState: DishesState;
}

export interface VersionInfo {
  clientVersion: string;
  serverVersion: string;
}

export interface DishesState {
  // dishes: DishesMap;
  dishes: DishEntity[];
}

export interface DishesMap {
  [id: string]: DishEntity; // dish name
}




