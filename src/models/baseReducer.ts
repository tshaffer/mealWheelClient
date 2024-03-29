/** @module Model:base */

import { combineReducers } from 'redux';
import { MealWheelState } from '../types';
import { appParametersReducer } from './appParameters';

import { appStateReducer } from './appState';
import { definedMealsStateReducer } from './definedMeals';
import { dishesStateReducer } from './dishes';
import { dishesUIStateReducer } from './dishesUI';
import { generateGroceryListStateReducer } from './generateGroceryList';
import { generateMealsStateReducer } from './generateMeals';
import { groceryListStateReducer } from './groceryList';
import { ingredientsStateReducer } from './ingredients';
import { ingredientsUIStateReducer } from './ingredientsUI';
import { mealsResolutionStateReducer } from './mealsResolution';
import { mealWheelTonightUIStateReducer } from './mealWheelTonightUI';
import { scheduledMealsStateReducer } from './scheduledMeals';
import { unassignedMealsStateReducer } from './unassignedMeals';
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
  dishesUIState: dishesUIStateReducer,
  generateGroceryListState: generateGroceryListStateReducer,
  generateMealsState: generateMealsStateReducer,
  groceryListState: groceryListStateReducer,
  ingredientsState: ingredientsStateReducer,
  ingredientsUIState: ingredientsUIStateReducer,
  mealsResolutionState: mealsResolutionStateReducer,
  mealWheelTonightUIState: mealWheelTonightUIStateReducer,
  scheduledMealsState: scheduledMealsStateReducer,
  unassignedMealsState: unassignedMealsStateReducer,
  users: usersReducer,
  versionInfo: versionInfoReducer,
});

// -----------------------------------------------------------------------
// Validators
// -----------------------------------------------------------------------

