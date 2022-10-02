import * as React from 'react';
import { connect } from 'react-redux';

import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';

import { getVersionInfo } from '../selectors';
import { VersionInfo } from '../types';

export interface AboutDialogPropsFromParent {
  open: boolean;
  onClose: () => void;

}

export interface AboutDialogProps extends AboutDialogPropsFromParent {
  versionInfo: VersionInfo;
}

function AboutDialog(props: AboutDialogProps) {

  const { open, onClose } = props;

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>About MealWheel</DialogTitle>
      <div>
        <div style={{ marginLeft: '10px', marginRight: '10px', marginBottom: '10px' }}>
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
        </div>
      </div>
    </Dialog>
  );
}

function mapStateToProps(state: any) {
  return {
    versionInfo: getVersionInfo(state),
  };
}

export default connect(mapStateToProps)(AboutDialog);



