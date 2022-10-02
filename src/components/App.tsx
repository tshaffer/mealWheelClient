/* eslint-disable @typescript-eslint/no-var-requires */

import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Navigate } from 'react-router-dom';

import '../styles/MealWheel.css';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import MenuIcon from '@mui/icons-material/Menu';

import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';


import {
  UiState,
  UsersMap,
  VersionInfo,
} from '../types';

import {
  initializeApp,
} from '../controllers';
import {
  setUiState,
  setUser,
} from '../models';
import {
  getAppInitialized,
  getUsers,
  getVersionInfo,
} from '../selectors';
import Dishes from './Dishes';
import MealSchedule from './MealSchedule';
import ToolsAndSettings from './ToolsAndSettings';
import AboutDialog from './AboutDialog';

export interface AppProps {
  appInitialized: boolean;
  versionInfo: VersionInfo;
  users: UsersMap,
  onInitializeApp: () => any;
  onSetUiState: (uiState: UiState) => any;
  onSetUser: (userId: string) => any;
}

const App = (props: AppProps) => {

  const [redirectTarget, setRedirectTarget] = React.useState('');

  const [showAbout, setShowAbout] = React.useState(false);

  const [selectedTab, setSelectedTab] = React.useState<string>('mealScheduleTabSelect');

  React.useEffect(() => {
    if (!props.appInitialized) {
      props.onInitializeApp();
    }
  }, [props.appInitialized]);

  if (redirectTarget === 'login') {
    return <Navigate to='/login' />;
  }

  const unselectedTabContent = {
    display: 'none',
    padding: '6px 12px',
    border: '1px solid #ccc',
    borderTop: 'none',
  };

  const selectedTabContent = {
    display: 'block',
    padding: '6px 12px',
    border: '1px solid #ccc',
    borderTop: 'none',
  };

  const tab = {
    overflow: 'hidden',
    border: '1px solid #ccc',
    backgroundColor: '#f1f1f1',
  };

  const tabLinkSelected = {
    border: 'none',
    outline: 'none',
    cursor: 'pointer',
    padding: '14px 16px',
    transition: '0.3s',
    backgroundColor: '#ccc',
  };

  const tabLinkUnselected = {
    border: 'none',
    outline: 'none',
    cursor: 'pointer',
    padding: '14px 16px',
    transition: '0.3s',
    backgroundColor: 'inherit',
  };


  const handleSignout = () => {

    localStorage.setItem('userName', '');

    const users: string[] = [];
    for (const userKey in props.users) {
      if (Object.prototype.hasOwnProperty.call(props.users, userKey)) {
        users.push(userKey);
      }
    }

    if (users.length > 0) {
      props.onSetUser(users[0]);
    }
    props.onSetUiState(UiState.SelectUser);

    setRedirectTarget('login');
  };


  const handleShowAbout = () => {
    setShowAbout(true);
  };

  const handleCloseAbout = () => {
    setShowAbout(false);
  };

  function handleSelectTab(evt: any) {
    setSelectedTab(evt.target.id);
  }

  const renderToolbar = () => {
    return (
      <div className='root'>
        <AppBar position='static'>
          <Toolbar>
            <IconButton
              className='menuButton'
              color='inherit'
            >
              <MenuIcon />
            </IconButton>
            <Typography variant='h6' noWrap>
              Meal Wheel
            </Typography>
            <IconButton
              className='menuButton'
              color='inherit'
              onClick={handleShowAbout}
            >
              <InfoIcon />
            </IconButton>
            <Button color='inherit' onClick={handleSignout}>Logout</Button>
          </Toolbar>
        </AppBar>
      </div>
    );
  };

  const renderTable = () => {

    let dishesTabStyle;
    let dishesTabContentStyle;
    let mealScheduleTabStyle;
    let mealScheduleTabContentStyle;
    let settingsTabStyle;
    let settingsTabContentStyle;

    switch (selectedTab) {
      case 'newGameTabSelect':
        dishesTabStyle = tabLinkSelected;
        dishesTabContentStyle = selectedTabContent;
        mealScheduleTabStyle = tabLinkUnselected;
        mealScheduleTabContentStyle = unselectedTabContent;
        settingsTabStyle = tabLinkUnselected;
        settingsTabContentStyle = unselectedTabContent;
        break;
      default:
      case 'mealScheduleTabSelect':
        dishesTabStyle = tabLinkUnselected;
        dishesTabContentStyle = unselectedTabContent;
        mealScheduleTabStyle = tabLinkSelected;
        mealScheduleTabContentStyle = selectedTabContent;
        settingsTabStyle = tabLinkUnselected;
        settingsTabContentStyle = unselectedTabContent;
        break;
      case 'settingsTabSelect':
        dishesTabContentStyle = unselectedTabContent;
        dishesTabStyle = tabLinkUnselected;
        mealScheduleTabStyle = tabLinkUnselected;
        mealScheduleTabContentStyle = unselectedTabContent;
        settingsTabStyle = tabLinkSelected;
        settingsTabContentStyle = selectedTabContent;
        break;
    }

    return (
      <div>
        <div style={tab}>
          <button style={mealScheduleTabStyle} onClick={handleSelectTab} id='mealScheduleTabSelect' >Meal Schedule</button>
          <button style={dishesTabStyle} onClick={handleSelectTab} id='newGameTabSelect'>Dishes</button>
          <button style={settingsTabStyle} onClick={handleSelectTab} id='settingsTabSelect' >Tools & Settings</button>
        </div>
        <div id='mealScheduleContent' style={mealScheduleTabContentStyle}>
          <MealSchedule />
        </div>
        <div id='dishesContent' style={dishesTabContentStyle}>
          <Dishes />
        </div>
        <div id='settingsContent' style={settingsTabContentStyle}>
          <ToolsAndSettings />
        </div>
      </div>
    );
  };

  const toolbar = renderToolbar();
  const table = renderTable();

  return (
    <div>
      <div>
        <AboutDialog
          open={showAbout}
          onClose={handleCloseAbout}
        />
      </div>
      {toolbar}
      {table}
    </div >
  );
};

function mapStateToProps(state: any) {
  return {
    appInitialized: getAppInitialized(state),
    users: getUsers(state),
    versionInfo: getVersionInfo(state),
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
    onInitializeApp: initializeApp,
    onSetUser: setUser,
    onSetUiState: setUiState,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
