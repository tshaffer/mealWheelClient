import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';

import TextField from '@mui/material/TextField';

export interface GroceryListDialogPropsFromParent {
  open: boolean;
  onClose: () => void;
}

export interface GroceryListDialogProps extends GroceryListDialogPropsFromParent {
}

function GroceryListDialog(props: GroceryListDialogProps) {

  const { open, onClose } = props;

  const handleClose = () => {
    onClose();
  };

  const ingredientsInGroceryList = 'Eggs\nMilk';

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Grocery List</DialogTitle>
      <DialogContent>
        <TextField
          sx={{ m: 1, maxHeight: '40px', marginTop: '12px' }}
          type='number'
          multiline
          variant='standard'
          InputProps={{
            readOnly: true
          }}
          value={ingredientsInGroceryList}
        />
        <br />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}

function mapStateToProps(state: any) {
  return {
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
  }, dispatch);
};


export default connect(mapStateToProps, mapDispatchToProps)(GroceryListDialog);

