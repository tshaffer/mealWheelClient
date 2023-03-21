import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';


import { DishEntity } from '../types';
import { addIngredientToDish, replaceIngredientInDish, deleteIngredientFromDish } from '../controllers';
import { MealWheelDispatch } from '../models';
import { getDishById, getIngredients, getIngredientsByDish } from '../selectors';
import { isNil } from 'lodash';

export interface AssignIngredientsToDishDialogNewPropsFromParent {
  open: boolean;
  dishId: string;
  onClose: () => void;
}

export interface AssignIngredientsToDishNewDialogProps extends AssignIngredientsToDishDialogNewPropsFromParent {
  dish: DishEntity | null;
}

function AssignIngredientsToDishNewDialog(props: AssignIngredientsToDishNewDialogProps) {

  if (isNil(props.dishId) || props.dishId === '') {
    return null;
  }

  const handleClose = () => {
    props.onClose();
  };

  const dishLabel: string = isNil(props.dish) ? 'Unknown dish' : props.dish.name;

  return (
    <Dialog onClose={handleClose} open={props.open}>
      <DialogTitle>Assign Ingredients to {dishLabel}</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            height: 500,
            width: '100%',
            '& .actions': {
              color: 'text.secondary',
            },
            '& .textPrimary': {
              color: 'text.primary',
            },
          }}
        >
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

function mapStateToProps(state: any, ownProps: AssignIngredientsToDishDialogNewPropsFromParent) {
  return {
    dish: getDishById(state, ownProps.dishId),
    // allIngredients: getIngredients(state),
    // ingredientsInDish: getIngredientsByDish(state, ownProps.dishId),
  };
}

const mapDispatchToProps = (dispatch: MealWheelDispatch) => {
  return bindActionCreators({
    onAddIngredientToDish: addIngredientToDish,
    onReplaceIngredientInDish: replaceIngredientInDish,
    onDeleteIngredientFromDish: deleteIngredientFromDish,
  }, dispatch);
};


export default connect(mapStateToProps, mapDispatchToProps)(AssignIngredientsToDishNewDialog);

