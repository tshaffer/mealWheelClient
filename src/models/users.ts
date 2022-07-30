import { cloneDeep } from 'lodash';
import { UserEntity, UsersMap } from '../types';
import { MealWheelModelBaseAction } from './baseAction';

// ------------------------------------
// Constants
// ------------------------------------
export const ADD_USER = 'ADD_USER';

// ------------------------------------
// Actions
// ------------------------------------

export interface AddUserPayload {
  id: string;
  user: UserEntity;
}

export const addUser = (
  id: string,
  user: UserEntity
): any => {
  return {
    type: ADD_USER,
    payload: {
      id,
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
      newState[action.payload.id] = action.payload.user;
      return newState;
    }
    default:
      return state;
  }
};
