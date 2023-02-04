import * as React from 'react';
import { connect } from 'react-redux';

import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';

import { getVersionInfo } from '../selectors';
import { VersionInfo } from '../types';

export interface AccountDialogPropsFromParent {
  open: boolean;
  onClose: () => void;
}

export interface AccountDialogProps extends AccountDialogPropsFromParent {
  versionInfo: VersionInfo;
}

function AccountDialog(props: AccountDialogProps) {

  const { open, onClose } = props;

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Account MealWheel</DialogTitle>
      <div style={{ marginLeft: '10px', marginRight: '10px', marginBottom: '10px' }}>
        <p style={{ marginTop: '0px' }}>{'Client version: ' + props.versionInfo.clientVersion}</p>
        <p>{'Server version: ' + props.versionInfo.serverVersion}</p>
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: '10px',
          right: '10px',
        }}
      >
      </div>
    </Dialog>
  );
}

function mapStateToProps(state: any) {
  return {
    versionInfo: getVersionInfo(state),
  };
}

export default connect(mapStateToProps)(AccountDialog);



