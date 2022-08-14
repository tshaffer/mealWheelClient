/* eslint-disable @typescript-eslint/no-var-requires */
import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Navigate } from 'react-router-dom';

import { AppState, UiState } from '../types';
import {
  initializeApp,
} from '../controllers';

import {
  getAppInitialized,
  getAppState,
} from '../selectors';

export interface HomeProps {
  appInitialized: boolean;
  appState: AppState,
  onInitializeApp: () => any;
}

const Home = (props: HomeProps) => {

  console.log('Home invoked - pre useEffect');

  React.useEffect(() => {
    console.log('Home: appInitialized = ', props.appInitialized);
    if (!props.appInitialized) {
      props.onInitializeApp();
    }
  }, [props.appInitialized]);


  console.log('Home invoked - post useEffect');
  
  const divStyle = {
    height: '98vh',
  };

  if (!props.appInitialized) {
    return (
      <div style={divStyle}>Loading...</div>
    );
  }

  switch (props.appState.uiState) {
    case UiState.SelectUser:
      return <Navigate to='/login' />;
    case UiState.Other:
      return <Navigate to='/app' />;
    default:
      return (
        <div style={divStyle}>Loading...</div>
      );
  }
};

function mapStateToProps(state: any) {
  return {
    appInitialized: getAppInitialized(state),
    appState: getAppState(state),
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
    onInitializeApp: initializeApp,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);

