/* eslint-disable @typescript-eslint/no-var-requires */
import { isNil } from 'lodash';

import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import ReactModal = require('react-modal');

import '../styles/MealWheel.css';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import MenuIcon from '@mui/icons-material/Menu';

import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';


// import { Box } from '@mui/material';
// import Grid from '@mui/material/Grid';

import {
  Meal,
  UiState,
  UsersMap,
  VersionInfo,
} from '../types';

import {
  // generateMenu,
  initializeApp,
  // uploadFile,
} from '../controllers';
import {
  setUiState,
  setUser,
} from '../models';
import {
  getAppInitialized,
  // getMeals,
  getUsers,
  getVersionInfo,
} from '../selectors';
import Dishes from './Dishes';
import MealSchedule from './MealSchedule';
import ToolsAndSettings from './ToolsAndSettings';
// import MealComponent from './MealComponent';
// import Dishes from './Dishes';

export interface AppProps {
  appInitialized: boolean;
  versionInfo: VersionInfo;
  users: UsersMap,
  onInitializeApp: () => any;
  onSetUiState: (uiState: UiState) => any;
  onSetUser: (userId: string) => any;

  // meals: Meal[];
  // onGenerateMenu: () => any;
  // onUploadFile: (formData: FormData) => any;
}

const App = (props: AppProps) => {

  const [showAboutModal, setShowAboutModal] = React.useState(false);

  const [selectedTab, setSelectedTab] = React.useState<string>('mealScheduleTabSelect');

  // React.useEffect(() => {
  //   props.onInitializeApp();
  // }, []);
  React.useEffect(() => {
    console.log('Launcher: ', props.appInitialized);
    if (!props.appInitialized) {
      props.onInitializeApp();
    }
  }, [props.appInitialized]);

  const modalStyle = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      minHeight: '105px',
      minWidth: '150px',
    },
  };

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

  const divStyle = {
    height: '98vh',
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

    // setRedirectTarget('login');
  };


  const handleShowAbout = () => {
    setShowAboutModal(true);
  };

  const handleHideAbout = () => {
    setShowAboutModal(false);
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
          <MealSchedule
          />
        </div>
        <div id='newGameContent' style={dishesTabContentStyle}>
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
        <ReactModal
          isOpen={showAboutModal}
          style={modalStyle}
          ariaHideApp={false}
        >
          <div>
            <div style={{ marginBottom: '10px' }}>
              <p style={{ marginBottom: '6px' }}>MealWheel</p>
              <p>{'Client version: ' + props.versionInfo.clientVersion}</p>
              <p>{'Server version: ' + props.versionInfo.serverVersion}</p>
            </div>
            <div
              style={{
                position: 'absolute',
                bottom: '10px',
                right: '10px',
              }}
            >
              <button
                onClick={handleHideAbout}
              >
                Close
              </button>
            </div>
          </div>
        </ReactModal>
      </div>
      {toolbar}
      {table}
    </div >
  );




  // const [selectedFile, setSelectedFile] = React.useState(null);

  // const handleFileChangeHandler = (e: any) => {
  //   setSelectedFile(e.target.files[0]);
  // };

  // const handleGenerateMenu = () => {
  //   props.onGenerateMenu();
  // };

  // const handleUploadFile = () => {
  //   const data = new FormData();
  //   data.append('file', selectedFile);
  //   props.onUploadFile(data);
  // };

  // const renderMealRow = (meal: Meal) => {
  //   return (
  //     <MealComponent
  //       mainDishId={meal.mainDishId}
  //       accompanimentDishId={meal.accompanimentDishId}
  //       key={meal.mainDishId}
  //     />
  //   );
  // };


  // const renderMealRows = () => {

  //   if (props.meals.length === 0) {
  //     return null;
  //   }

  //   const mealRows = props.meals.map((meal: Meal) => {
  //     return renderMealRow(meal);
  //   });

  //   return mealRows;
  // };

  // const renderMeals = () => {

  //   if (props.meals.length === 0) {
  //     return null;
  //   }

  //   const mealRows = renderMealRows();

  //   if (isNil(mealRows)) {
  //     return null;
  //   }

  //   return (
  //     <Box sx={{ flexGrow: 1 }}>
  //       <Grid container spacing={2}>
  //         {mealRows}
  //       </Grid>
  //     </Box>
  //   );
  // };

  // const meals = renderMeals();

  // return (
  //   <div>
  //     <button type="button" onClick={handleGenerateMenu}>Generate Menu</button>
  //     <br />
  //     {meals}
  //     <input type="file" name="file" onChange={handleFileChangeHandler} />
  //     <br />
  //     <button type="button" onClick={handleUploadFile}>Upload</button>
  //     <br />
  //     <Dishes />
  //   </div>
  // );


};

function mapStateToProps(state: any) {
  return {
    appInitialized: getAppInitialized(state),
    users: getUsers(state),
    versionInfo: getVersionInfo(state),

    // meals: getMeals(state),
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
    onInitializeApp: initializeApp,
    onSetUser: setUser,
    onSetUiState: setUiState,

    // onUploadFile: uploadFile,
    // onGenerateMenu: generateMenu,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
