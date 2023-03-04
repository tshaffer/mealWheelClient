import {
  AppState,
  MealWheelState,
  UiState
} from '../types';

export const getAppState = (state: MealWheelState): AppState => {
  return state.appState;
};

export const getAppInitialized = (state: MealWheelState): boolean => {
  return state.appState.appInitialized;
};

export const getCurrentUser = (state: MealWheelState): string | null => {
  return state.appState.userId;
};

export const getUiState = (state: MealWheelState): UiState => {
  return state.appState.uiState;
};
