import {
  MealWheelState,
  UsersMap,
} from '../types';

export const getUsers = (state: MealWheelState): UsersMap => {
  return state.users;
};
