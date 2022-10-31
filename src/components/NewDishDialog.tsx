import * as React from 'react';
import { connect } from 'react-redux';

import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

// import { getVersionInfo } from '../selectors';
// import { VersionInfo } from '../types';

export interface NewDishDialogPropsFromParent {
  open: boolean;
  onClose: () => void;
}

export interface NewDishDialogProps extends NewDishDialogPropsFromParent {
  // versionInfo: VersionInfo;
  pizza: string;
}

function NewDishDialog(props: NewDishDialogProps) {

  const { open, onClose } = props;

  const handleUpdateType = (event: any): void => {
    console.log('handleUpdateType: ', event.target.value);
  };
  
  const handleClose = () => {
    onClose();
  };

  const renderTypeSelect = (): JSX.Element => {

    return (
      <div>
        <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="mainLabel">Main</InputLabel>
          <Select
            labelId="mainLabel"
            id="demo-simple-select-filled"
            value={'main'}
            onChange={(event) => handleUpdateType(event)}
          >
            <MenuItem value={'main'} key={'main'}>Main</MenuItem>
            <MenuItem value={'side'} key={'side'}>Side</MenuItem>
            <MenuItem value={'salad'} key={'salad'}>Salad</MenuItem>
            <MenuItem value={'veggie'} key={'veggie'}>Veggie</MenuItem>
          </Select>
        </FormControl>
      </div>
    );
  };

  const typeSelect = renderTypeSelect();

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>New Dish</DialogTitle>
      <div style={{ marginLeft: '10px', marginRight: '10px', marginBottom: '10px' }}>
        {typeSelect}
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
    // versionInfo: getVersionInfo(state),
    pizza: 'sausage',
  };
}

export default connect(mapStateToProps)(NewDishDialog);



