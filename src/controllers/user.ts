import axios from 'axios';
import { MealWheelState, UiState, UserEntity, UsersMap } from '../types';
import { addUser, MealWheelDispatch, setUiState, setUser } from '../models';

import { apiUrlFragment, serverUrl } from '../index';
import { isNil, isString } from 'lodash';

export const loadUsers = () => {
  return (dispatch: MealWheelDispatch) => {

    const path = serverUrl + apiUrlFragment + 'users';

    return axios.get(path)
      .then((usersResponse: any) => {
        const users: UserEntity[] = (usersResponse as any).data;
        // TEDTODO - add all in a single call
        for (const user of users) {
          dispatch(addUser(user.id, user));
        }
        if (users.length > 0) {

          let selectedUser = '';

          // if there's a stored / persistent id and it matches a user name in the downloaded list of users,
          // bypass the signin screen
          const storedUserId = localStorage.getItem('userId');
          if (isString(storedUserId)) {
            const matchedUser = users.find(o => o.id === storedUserId);

            if (!isNil(matchedUser)) {
              dispatch(setUser(matchedUser.id));
              dispatch(setUiState(UiState.App));
              return;
            } else {
              selectedUser = users[0].id;
            }

          } else {
            selectedUser = users[0].id;
          }
          dispatch(setUser(selectedUser));
        }

      });
  };
};

export const loginPersistentUser = () => {
  return (dispatch: MealWheelDispatch, getState: any) => {

    const storedUserId = localStorage.getItem('userId');
    if (!isString(storedUserId)) {
      return null;
    }

    const state: MealWheelState = getState();
    const usersMap: UsersMap = state.users;
    const users: UserEntity[] = [];
    for (const id in usersMap) {
      if (Object.prototype.hasOwnProperty.call(usersMap, id)) {
        const user = usersMap[id];
        users.push(user);
      }
    }

    // if there's a stored / persistent id and it matches a user name in the downloaded list of users,
    // bypass the signin screen
    const matchedUser = users.find(o => o.id === storedUserId);

    if (!isNil(matchedUser)) {
      dispatch(setUser(matchedUser.id));
      dispatch(setUiState(UiState.App));
      return matchedUser;
    }

    return null;
  };
};
