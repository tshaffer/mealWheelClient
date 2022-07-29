import { cloneDeep } from 'lodash';
import { User, UsersMap } from '../types';
import { MealWheelModelBaseAction } from './baseAction';

// ------------------------------------
// Constants
// ------------------------------------
export const ADD_USER = 'ADD_USER';

// ------------------------------------
// Actions
// ------------------------------------

export interface AddUserPayload {
  userName: string;
  user: User;
}

export const addUser = (
  userName: string,
  user: User
): any => {
  return {
    type: ADD_USER,
    payload: {
      userName,
      user,
    },
  };
};

// ------------------------------------
// Reducer
// ------------------------------------

const initialState: UsersMap = {};

export const usersReducer = (
  state: UsersMap = initialState,
  action: MealWheelModelBaseAction<AddUserPayload>
): UsersMap => {
  switch (action.type) {
    case ADD_USER: {
      const newState = cloneDeep(state);
      newState[action.payload.userName] = action.payload.user;
      return newState;
    }
    default:
      return state;
  }
};
