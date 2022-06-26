import axios from 'axios';
import { setClientVersion, setServerVersion } from '../models';

import { apiUrlFragment, serverUrl } from '../index';

import { version } from '../version';

export const getServerVersion = () => {
  return (dispatch: any) => {
    const path = serverUrl + apiUrlFragment + 'version';
    return axios.get(path)
      .then((versionResponse: any) => {
        dispatch(setServerVersion(versionResponse.data.serverVersion));
      });
  };
};

export const getVersions = () => {
  return (dispatch: any) => {
    dispatch(setClientVersion(version));
    dispatch(getServerVersion());
  };
};