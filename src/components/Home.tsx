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

  React.useEffect(() => {
    console.log('Home: ', props.appInitialized);
    if (!props.appInitialized) {
      props.onInitializeApp();
    }
  }, [props.appInitialized]);


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
    // case UiState.SelectPuzzleOrBoard:
    //   return <Redirect to='/launcher'/>;
    // case UiState.NewBoardPlay:
    // case UiState.ExistingBoardPlay: // not implemented yet - old code <Game />
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

