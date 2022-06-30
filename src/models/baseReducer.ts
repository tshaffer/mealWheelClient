/** @module Model:base */

import { combineReducers } from 'redux';
import { MealWheelState } from '../types';

import { dishesStateReducer } from './dishes';
import { mealsStateReducer } from './meals';
import { versionInfoReducer } from './versionInfo';

// -----------------------------------------------------------------------
// Reducers
// -----------------------------------------------------------------------
export const rootReducer = combineReducers<MealWheelState>({
  dishesState: dishesStateReducer,
  mealsState: mealsStateReducer,
  versionInfo: versionInfoReducer,
});

// -----------------------------------------------------------------------
// Validators
// -----------------------------------------------------------------------

