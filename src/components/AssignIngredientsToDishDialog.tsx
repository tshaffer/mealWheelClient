import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Checkbox from '@mui/material/Checkbox';

import { Dayjs } from 'dayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { isNil } from 'lodash';

import { getDish, getGroceryListStartDate, getNumberOfMealsInGroceryList } from '../selectors';
import { getShowStaples } from '../selectors';
import { FormGroup, FormControlLabel } from '@mui/material';
import { setShowStaples } from '../models';
import { DishEntity } from '../types';

export interface AssignIngredientsToDishDialogPropsFromParent {
  open: boolean;
  dishId: string;
  onClose: () => void;
}

export interface AssignIngredientsToDishDialogProps extends AssignIngredientsToDishDialogPropsFromParent {
  dish: DishEntity | null;
}

function AssignIngredientsToDishDialog(props: AssignIngredientsToDishDialogProps) {

  const { open, dish, onClose } = props;

  const handleClose = () => {
    onClose();
  };

  const dishLabel: string = isNil(dish) ? 'Unknown dish' : dish.name;

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Assign ingredients to {dishLabel}</DialogTitle>
      <DialogContent>
        eat pizza
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

function mapStateToProps(state: any, ownProps: AssignIngredientsToDishDialogPropsFromParent) {
  return {
    dish: getDish(state, ownProps.dishId),
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
  }, dispatch);
};


export default connect(mapStateToProps, mapDispatchToProps)(AssignIngredientsToDishDialog);

