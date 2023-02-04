import axios from 'axios';
import { MealWheelDispatch, MealWheelVoidThunkAction, setClientVersion, setServerVersion } from '../models';

import { apiUrlFragment, serverUrl } from '../index';

import { version } from '../version';

export const getServerVersion = (): MealWheelVoidThunkAction => {
  return (dispatch: MealWheelDispatch) => {
    const path = serverUrl + apiUrlFragment + 'version';
    return axios.get(path)
      .then((versionResponse: any) => {
        dispatch(setServerVersion(versionResponse.data.serverVersion));
      });
  };
};

export const getVersions = (): MealWheelVoidThunkAction => {
  return (dispatch: MealWheelDispatch) => {
    dispatch(setClientVersion(version));
    dispatch(getServerVersion());
  };
};