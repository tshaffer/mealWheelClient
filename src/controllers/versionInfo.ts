import axios from 'axios';
import { MealWheelDispatch, setClientVersion, setServerVersion } from '../models';

import { apiUrlFragment, serverUrl } from '../index';

import { version } from '../version';

export const getServerVersion = () => {
  return (dispatch: MealWheelDispatch) => {
    const path = serverUrl + apiUrlFragment + 'version';
    return axios.get(path)
      .then((versionResponse: any) => {
        dispatch(setServerVersion(versionResponse.data.serverVersion));
      });
  };
};

export const getVersions = () => {
  return (dispatch: MealWheelDispatch) => {
    dispatch(setClientVersion(version));
    dispatch(getServerVersion());
  };
};