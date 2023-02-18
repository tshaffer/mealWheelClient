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
} from '../types';

import {
  initializeApp,
} from '../controllers';
import {
  MealWheelDispatch,
  setUiState,
  setUser,
} from '../models';
import {
  getAppInitialized,
  getCurrentUser,
  getUsers,
} from '../selectors';
import Dishes from './Dishes';
import Ingredients from './Ingredients';
import MealSchedule from './MealSchedule';
import ToolsAndSettings from './ToolsAndSettings';
import AboutDialog from './AboutDialog';
import AccountDialog from './AccountDialog';
import Box from '@mui/material/Box';
import { isNil } from 'lodash';

export interface AppProps {
  appInitialized: boolean;
  currentUser: string | null;
  users: UsersMap,
  onInitializeApp: () => any;
  onSetUiState: (uiState: UiState) => any;
  onSetUser: (userId: string) => any;
}

const App = (props: AppProps) => {

  const [redirectTarget, setRedirectTarget] = React.useState('');

  const [showAbout, setShowAbout] = React.useState(false);
  const [showAccount, setShowAccount] = React.useState(false);

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

  const handleShowAccount = () => {
    setShowAccount(true);
  };

  const handleCloseAccount = () => {
    setShowAccount(false);
  };

  function handleSelectTab(evt: any) {
    setSelectedTab(evt.target.id);
  }

  const currentUserName: string = isNil(props.currentUser) ? 'None' : props.users[props.currentUser].userName;

  const renderToolbar = () => {
    return (
      <div className='root'>
        <Box sx={{ flexGrow: 1 }}>
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
              <Button
                color='inherit'
                onClick={handleShowAccount}
                sx={{ marginLeft: 'auto' }}
              >
                {currentUserName}
              </Button>
            </Toolbar>
          </AppBar>
        </Box>
      </div >
    );
  };

  const renderTable = () => {

    let dishesTabStyle;
    let dishesTabContentStyle;
    let ingredientsTabStyle;
    let ingredientsTabContentStyle;
    let mealScheduleTabStyle;
    let mealScheduleTabContentStyle;
    let mealWheelTonightTabStyle;
    let mealWheelTonightTabContentStyle;
    let settingsTabStyle;
    let settingsTabContentStyle;

    switch (selectedTab) {
      case 'dishesTabSelect':
        dishesTabStyle = tabLinkSelected;
        dishesTabContentStyle = selectedTabContent;
        ingredientsTabStyle = tabLinkUnselected;
        ingredientsTabContentStyle = unselectedTabContent;
        mealScheduleTabStyle = tabLinkUnselected;
        mealScheduleTabContentStyle = unselectedTabContent;
        mealWheelTonightTabStyle = tabLinkUnselected;
        mealWheelTonightTabContentStyle = unselectedTabContent;
        settingsTabStyle = tabLinkUnselected;
        settingsTabContentStyle = unselectedTabContent;
        break;
      case 'ingredientsTabSelect':
        dishesTabStyle = tabLinkUnselected;
        dishesTabContentStyle = unselectedTabContent;
        ingredientsTabStyle = tabLinkSelected;
        ingredientsTabContentStyle = selectedTabContent;
        mealScheduleTabStyle = tabLinkUnselected;
        mealScheduleTabContentStyle = unselectedTabContent;
        mealWheelTonightTabStyle = tabLinkUnselected;
        mealWheelTonightTabContentStyle = unselectedTabContent;
        settingsTabStyle = tabLinkUnselected;
        settingsTabContentStyle = unselectedTabContent;
        break;
      case 'mealWheelTonightTabSelect':
        dishesTabStyle = tabLinkUnselected;
        dishesTabContentStyle = unselectedTabContent;
        ingredientsTabStyle = tabLinkUnselected;
        ingredientsTabContentStyle = unselectedTabContent;
        mealScheduleTabStyle = tabLinkUnselected;
        mealScheduleTabContentStyle = unselectedTabContent;
        mealWheelTonightTabStyle = tabLinkSelected;
        mealWheelTonightTabContentStyle = selectedTabContent;
        settingsTabStyle = tabLinkUnselected;
        settingsTabContentStyle = unselectedTabContent;
        break;
      default:
      case 'mealScheduleTabSelect':
        dishesTabStyle = tabLinkUnselected;
        dishesTabContentStyle = unselectedTabContent;
        ingredientsTabStyle = tabLinkUnselected;
        ingredientsTabContentStyle = unselectedTabContent;
        mealScheduleTabStyle = tabLinkSelected;
        mealScheduleTabContentStyle = selectedTabContent;
        mealWheelTonightTabStyle = tabLinkUnselected;
        mealWheelTonightTabContentStyle = unselectedTabContent;
        settingsTabStyle = tabLinkUnselected;
        settingsTabContentStyle = unselectedTabContent;
        break;
      case 'settingsTabSelect':
        dishesTabContentStyle = unselectedTabContent;
        dishesTabStyle = tabLinkUnselected;
        ingredientsTabStyle = tabLinkUnselected;
        ingredientsTabContentStyle = unselectedTabContent;
        mealScheduleTabStyle = tabLinkUnselected;
        mealScheduleTabContentStyle = unselectedTabContent;
        mealWheelTonightTabStyle = tabLinkUnselected;
        mealWheelTonightTabContentStyle = unselectedTabContent;
        settingsTabStyle = tabLinkSelected;
        settingsTabContentStyle = selectedTabContent;
        break;
    }

    return (
      <div>
        <div style={tab}>
          <button style={mealScheduleTabStyle} onClick={handleSelectTab} id='mealScheduleTabSelect' >Meal Schedule</button>
          <button style={dishesTabStyle} onClick={handleSelectTab} id='dishesTabSelect'>Dishes</button>
          <button style={ingredientsTabStyle} onClick={handleSelectTab} id='ingredientsTabSelect'>Ingredients</button>
          <button style={mealWheelTonightTabStyle} onClick={handleSelectTab} id='mealWheelTonightTabSelect'>MealWheel Tonight!</button>
          <button style={settingsTabStyle} onClick={handleSelectTab} id='settingsTabSelect'>Tools & Settings</button>
        </div>
        <div id='mealScheduleContent' style={mealScheduleTabContentStyle}>
          <MealSchedule />
        </div>
        <div id='dishesContent' style={dishesTabContentStyle}>
          {/* <Dishes /> */}
          {/* <EnhancedTable/> */}
          <Dishes />
        </div>
        <div id='ingredientsContent' style={ingredientsTabContentStyle}>
          <Ingredients />
        </div>
        <div id='mealWheelTonightContent' style={mealWheelTonightTabContentStyle}>
          Pizza
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
      <div>
        <AccountDialog
          open={showAccount}
          onClose={handleCloseAccount}
          onSignout={handleSignout}
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
    currentUser: getCurrentUser(state),
    users: getUsers(state),
  };
}

const mapDispatchToProps = (dispatch: MealWheelDispatch) => {
  return bindActionCreators({
    onInitializeApp: initializeApp,
    onSetUser: setUser,
    onSetUiState: setUiState,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
