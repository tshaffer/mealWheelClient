/** @module Model:base */

import { combineReducers } from 'redux';
import { MealWheelState } from '../types';
import { appParametersReducer } from './appParameters';

import { appStateReducer } from './appState';
import { definedMealsStateReducer } from './definedMeals';
import { dishesStateReducer } from './dishes';
import { generateMealsStateReducer } from './generateMeals';
import { mealsResolutionStateReducer } from './mealsResolution';
import { scheduledMealsStateReducer } from './scheduledMeals';
import { usersReducer } from './users';
import { versionInfoReducer } from './versionInfo';

// -----------------------------------------------------------------------
// Reducers
// -----------------------------------------------------------------------
export const rootReducer = combineReducers<MealWheelState>({
  appParameters: appParametersReducer,
  appState: appStateReducer,
  dishesState: dishesStateReducer,
  definedMealsState: definedMealsStateReducer,
  generateMealsState: generateMealsStateReducer,
  scheduledMealsState: scheduledMealsStateReducer,
  mealsResolutionState: mealsResolutionStateReducer,
  users: usersReducer,
  versionInfo: versionInfoReducer,
});

// -----------------------------------------------------------------------
// Validators
// -----------------------------------------------------------------------

