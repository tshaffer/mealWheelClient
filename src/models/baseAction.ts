/* eslint-disable @typescript-eslint/ban-types */
import { Action } from 'redux';

export interface MealWheelBaseAction extends Action {
  type: string;   // override Any - must be a string
  payload: {} | null;
}


export interface MealWheelModelBaseAction<T> extends Action {
  type: string;   // override Any - must be a string
  payload: T;
  error?: boolean;
  meta?: {};
}

export interface MealWheelPlaylistAction<T> extends MealWheelBaseAction {
  payload: T;
}

export interface MealWheelApiAction<T> extends MealWheelBaseAction {
  payload: T;
}



