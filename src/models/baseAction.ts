/* eslint-disable @typescript-eslint/ban-types */
import {
  Action,
  AnyAction,
} from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { MealWheelState } from '../types';

export interface MealWheelBaseAction extends Action {
  type: string;   // override Any - must be a string
  payload: {} | null;
}

export interface MealWheelModelBaseAction<T> extends Action {
  type: string;   // override Any - must be a string
  payload: T;
  // error?: boolean;
  // meta?: {};
}

export interface MealWheelPlaylistAction<T> extends MealWheelBaseAction {
  payload: T;
}

export interface MealWheelApiAction<T> extends MealWheelBaseAction {
  payload: T;
}

export interface MealWheelAction<T> extends MealWheelBaseAction {
  payload: T | any;
}

export type MealWheelDispatch = ThunkDispatch<MealWheelState, undefined, MealWheelAction<AnyAction>>;
export type MealWheelAnyThunkAction = (dispatch: MealWheelDispatch, getState: () => MealWheelState, extraArgument: undefined) => any;
export type MealWheelVoidThunkAction = (dispatch: MealWheelDispatch, getState: () => MealWheelState, extraArgument: undefined) => void;
export type MealWheelStringThunkAction = (dispatch: MealWheelDispatch, getState: () => MealWheelState, extraArgument: undefined) => string;
export type MealWheelVoidPromiseThunkAction = (dispatch: MealWheelDispatch, getState: () => MealWheelState, extraArgument: undefined) => Promise<void>;
export type MealWheelAnyPromiseThunkAction = (dispatch: MealWheelDispatch, getState: () => MealWheelState, extraArgument: undefined) => Promise<any>;
export type MealWheelStringPromiseThunkAction = (dispatch: MealWheelDispatch, getState: () => MealWheelState, extraArgument: undefined) => Promise<string>;
export type MealWheelStringOrNullPromiseThunkAction = (dispatch: MealWheelDispatch, getState: () => MealWheelState, extraArgument: undefined) => Promise<string | null>;


