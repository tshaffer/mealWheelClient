/** @module Model:base */

import { combineReducers } from 'redux';
import { MealWheelState } from '../types';
import { appParametersReducer } from './appParameters';

import { appStateReducer } from './appState';
import { definedMealsStateReducer } from './definedMeals';
import { dishesStateReducer } from './dishes';
import { generateGroceryListStateReducer } from './generateGroceryList';
import { generateMealsStateReducer } from './generateMeals';
import { groceryListStateReducer } from './groceryList';
import { ingredientsStateReducer } from './ingredients';
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
  definedMealsState: definedMealsStateReducer,
  dishesState: dishesStateReducer,
  generateGroceryListState: generateGroceryListStateReducer,
  generateMealsState: generateMealsStateReducer,
  groceryListState: groceryListStateReducer,
  ingredientsState: ingredientsStateReducer,
  mealsResolutionState: mealsResolutionStateReducer,
  scheduledMealsState: scheduledMealsStateReducer,
  users: usersReducer,
  versionInfo: versionInfoReducer,
});

// -----------------------------------------------------------------------
// Validators
// -----------------------------------------------------------------------

