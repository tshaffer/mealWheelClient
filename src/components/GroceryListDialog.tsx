import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';

import TextField from '@mui/material/TextField';
import { IngredientEntity } from '../types';
import { getGroceryListIngredients } from '../selectors';
import { MealWheelDispatch } from '../models';

export interface GroceryListDialogPropsFromParent {
  open: boolean;
  onClose: () => void;
}

export interface GroceryListDialogProps extends GroceryListDialogPropsFromParent {
  ingredientsInGroceryList: IngredientEntity[];
}

function GroceryListDialog(props: GroceryListDialogProps) {

  const { ingredientsInGroceryList, open, onClose } = props;

  const handleCopyToClipboard = (ingredientsString: string) => {
    window.navigator['clipboard'].writeText(ingredientsString);
  };

  const handleClose = () => {
    onClose();
  };

  const getIngredientsInGroceryList = (): string => {
    let ingredientsString = '';
    for (let index = 0; index < ingredientsInGroceryList.length; index++) {
      const ingredient: IngredientEntity = ingredientsInGroceryList[index];
      if (index > 0) {
        ingredientsString += '\n';
      }
      ingredientsString = ingredientsString + ingredient.name;
    }
    return ingredientsString;
  };

  const ingredientsString: string = getIngredientsInGroceryList();

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Grocery List</DialogTitle>
      {/* https://medium.com/the-clever-dev/how-to-size-and-position-the-material-ui-mui-dialog-component-a5601cedc1c9 */}
      <DialogContent>
        <TextField
          sx={{ m: 1, maxHeight: '200px', marginTop: '12px' }}
          multiline
          variant='standard'
          InputProps={{
            readOnly: true
          }}
          value={ingredientsString}
        />
        <Button
          onClick={() => handleCopyToClipboard(ingredientsString)}
        >Copy to Clipboard</Button>
        <br />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

function mapStateToProps(state: any) {
  return {
    ingredientsInGroceryList: getGroceryListIngredients(state),
  };
}

const mapDispatchToProps = (dispatch: MealWheelDispatch) => {
  return bindActionCreators({
  }, dispatch);
};


export default connect(mapStateToProps, mapDispatchToProps)(GroceryListDialog);

