import * as React from 'react';
import { connect } from 'react-redux';

import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';

import { getCurrentUser, getUsers } from '../selectors';
import { UsersMap } from '../types';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { DialogContent } from '@mui/material';
import { isNil } from 'lodash';

export interface AccountDialogPropsFromParent {
  open: boolean;
  onClose: () => void;
}

export interface AccountDialogProps extends AccountDialogPropsFromParent {
  currentUser: string | null;
  users: UsersMap,
}

function AccountDialog(props: AccountDialogProps) {

  const { open, onClose } = props;

  const handleClose = () => {
    onClose();
  };

  const handleSignout = () => {
    console.log('handleSignout');
  };

  let currentUserName: string = 'Nobody';
  let currentEmailAddress: string = 'nobody@nowhere.com';

  if (!isNil(props.currentUser)) {
    currentUserName = props.users[props.currentUser].userName;
    currentEmailAddress = props.users[props.currentUser].email;
  }

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Account</DialogTitle>
      <DialogContent>
        {currentUserName}
        <br />
        {currentEmailAddress}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSignout}>Signout</Button>
      </DialogActions>
    </Dialog>
  );
}

function mapStateToProps(state: any) {
  return {
    currentUser: getCurrentUser(state),
    users: getUsers(state),
  };
}

export default connect(mapStateToProps)(AccountDialog);



