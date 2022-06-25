export const serverUrl = 'http://localhost:8000';
// export const serverUrl = 'https://tswordle.herokuapp.com';

export const apiUrlFragment = '/api/v1/';

export interface TedState {
  appState: AppState;
}

export interface AppState {
  placeholder: string;
}
