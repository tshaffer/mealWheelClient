import axios from 'axios';

import { apiUrlFragment, serverUrl } from '../index';
import { loadDishes } from './dish';
import { getVersions } from './versionInfo';

export const initializeApp = () => {
  return (dispatch: any) => {
    dispatch(getVersions());
    dispatch(loadDishes());    
  };
};

export const uploadFile = (formData: FormData): any => {
  return (dispatch: any, getState: any) => {
    const path = serverUrl + apiUrlFragment + 'dishSpec';
    axios.post(path, formData, {
    }).then((response) => {
      console.log(response);
      console.log(response.statusText);
    });
  };
};