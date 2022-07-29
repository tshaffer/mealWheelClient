/** @module Model:base */

import { combineReducers } from 'redux';
import { MealWheelState } from '../types';

import { appStateReducer } from './appState';
import { dishesStateReducer } from './dishes';
import { mealsStateReducer } from './meals';
import { usersReducer } from './users';
import { versionInfoReducer } from './versionInfo';

// -----------------------------------------------------------------------
// Reducers
// -----------------------------------------------------------------------
export const rootReducer = combineReducers<MealWheelState>({
  appState: appStateReducer,
  dishesState: dishesStateReducer,
  mealsState: mealsStateReducer,
  users: usersReducer,
  versionInfo: versionInfoReducer,
});

// -----------------------------------------------------------------------
// Validators
// -----------------------------------------------------------------------

