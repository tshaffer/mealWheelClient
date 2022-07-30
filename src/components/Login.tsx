import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// import { HashRouter } from 'react-router-dom';
import { createHashHistory } from 'history';

import Select from 'react-select';

import { AppState, UiState, UserEntity, UsersMap } from '../types';
import {
  initializeApp,
  setStartupAppState
} from '../controllers';
import { getAppInitialized, getAppState, getUsers } from '../selectors';
import { setUiState, setUser } from '../models';
import { isNil } from 'lodash';

export interface LoginProps {
  appInitialized: boolean;
  appState: AppState,
  users: UsersMap;
  onInitializeApp: () => any;
  onSetUser: (userId: string) => any;
  onSetUiState: (uiState: UiState) => any;
  onSetStartupAppState: () => any;
}

const Login = (props: LoginProps) => {

  const [selectedUser, setSelectedUser] = React.useState<UserEntity>(null);

  React.useEffect(() => {
    console.log('Login: ', props.appInitialized);
    if (!props.appInitialized) {
      props.onInitializeApp();
    }
  }, [props.appInitialized]);

  const getUsers = (): UserEntity[] => {
    const users: UserEntity[] = [];
    for (const userId in props.users) {
      if (Object.prototype.hasOwnProperty.call(props.users, userId)) {
        const user: UserEntity = props.users[userId];
        users.push(user);
      }
    }
    return users;
  };

  const getUserOptions = (users: UserEntity[]) => {
    const userOptions = users.map((user: UserEntity) => {
      return {
        value: user,
        label: user.userName,
      };
    });
    return userOptions;
  };

  // https://react-select.com/typescript
  // https://github.com/JedWatson/react-select/blob/master/packages/react-select/src/types.ts
  const handleUserChange = (selectedUser: any) => {
    console.log('handleUserChange, selected user is:', selectedUser.value);
    setSelectedUser(selectedUser.value);
  };

  const handleLogin = () => {
    if (isNil(selectedUser)) {
      console.log('Select a user then click on Login');
      return;
    }
    localStorage.setItem('userId', selectedUser.id);
    props.onSetUser(selectedUser.id);
    props.onSetStartupAppState();

    //joining a game from invitation (onSetStartupAppState) not supported yet
    // const hashHistory = createHashHistory();
    // hashHistory.push('/launcher');
  };

  const renderSelectUser = () => {

    const users: UserEntity[] = getUsers();
    const userOptions = getUserOptions(users);

    return (
      // <HashRouter>
      <div>
        <p>Select user</p>
        <Select
          options={userOptions}
          onChange={handleUserChange}
          placeholder={'Select a user'}
        />
        <p>
          <button
            type="button"
            onClick={handleLogin}
          >
            Login
          </button>
        </p>
      </div>
      // </HashRouter>
    );

  };

  const divStyle = {
    height: '98vh',
  };

  if (!props.appInitialized) {
    return (
      <div style={divStyle}>Loading...</div>
    );
  }

  return renderSelectUser();
};

function mapStateToProps(state: any) {
  return {
    appInitialized: getAppInitialized(state),
    users: getUsers(state),
    appState: getAppState(state),
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
    onInitializeApp: initializeApp,
    onSetUser: setUser,
    onSetUiState: setUiState,
    onSetStartupAppState: setStartupAppState,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);

