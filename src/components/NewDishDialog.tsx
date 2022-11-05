import * as React from 'react';
import { connect } from 'react-redux';

import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { Button, Checkbox, DialogActions, DialogContent, FormControlLabel, FormGroup, FormLabel, TextField } from '@mui/material';
import { DishType, RequiredAccompanimentFlags } from '../types';

export interface NewDishDialogPropsFromParent {
  open: boolean;
  onAddDish: (dishName: string, dishType: DishType, requiredAccompanimentFlags?: RequiredAccompanimentFlags) => void;
  onClose: () => void;
  dishType: DishType;
}

export interface NewDishDialogProps extends NewDishDialogPropsFromParent {
  pizza: string;
}

function NewDishDialog(props: NewDishDialogProps) {

  const { open, onClose } = props;

  const [dishName, setDishName] = React.useState('');
  const [requiredAccompanimentFlags, setRequiredAccompanimentFlags] = React.useState(RequiredAccompanimentFlags.None);

  const getTypeLabelFromType = (): string => {
    switch (props.dishType) {
      case DishType.Main:
        return 'Main';
      case DishType.Salad:
        return 'Salad';
      case DishType.Side:
        return 'Side';
      case DishType.Veggie:
      default:
        return 'Veggie';
    }
  };

  const sideRequired = (): boolean => {
    return (requiredAccompanimentFlags & RequiredAccompanimentFlags.Side) !== 0;
  };

  const saladRequired = (): boolean => {
    return (requiredAccompanimentFlags & RequiredAccompanimentFlags.Salad) !== 0;
  };

  const veggieRequired = (): boolean => {
    return (requiredAccompanimentFlags & RequiredAccompanimentFlags.Veggie) !== 0;
  };


  const handleAddNewDish = () => {
    if (props.dishType === DishType.Main) {
      props.onAddDish(dishName, props.dishType, requiredAccompanimentFlags);
    }
    else {
      props.onAddDish(dishName, props.dishType);
    }
  };

  const handleClose = () => {
    onClose();
  };

  const renderRequiresAccompaniment = () => {
    if (props.dishType !== DishType.Main) {
      return null;
    }

    return (
      <div>
        <FormGroup
          sx={{ m: 1, maxHeight: '40px', marginTop: '12px' }}
        >
          <FormLabel
            style={{ marginRight: '20px', marginTop: '10px' }}
          >
            <label>Requires Accompaniment:</label>
          </FormLabel>
          <FormControlLabel
            control={
              <Checkbox
                checked={sideRequired()}
                onChange={(event) => setRequiredAccompanimentFlags(event.target.checked ? (RequiredAccompanimentFlags.Side + requiredAccompanimentFlags) : (requiredAccompanimentFlags & (~RequiredAccompanimentFlags.Side)))}
              />
            }
            label="Side"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={saladRequired()}
                onChange={(event) => setRequiredAccompanimentFlags(event.target.checked ? (RequiredAccompanimentFlags.Salad + requiredAccompanimentFlags) : (requiredAccompanimentFlags & (~RequiredAccompanimentFlags.Salad)))}
              />
            }
            label="Salad"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={veggieRequired()}
                onChange={(event) => setRequiredAccompanimentFlags(event.target.checked ? (RequiredAccompanimentFlags.Veggie + requiredAccompanimentFlags) : (requiredAccompanimentFlags & (~RequiredAccompanimentFlags.Veggie)))}
              />
            }
            label="Veggie"
          />
        </FormGroup>
      </div>
    );
  };

  /*
    Form
      Text field for
        Name
      If main, checkbox for
        Requires accompaniment
    Validation
      Name - not empty
      Name - unique within type
  */

  const requiresAccompanimentJsx = renderRequiresAccompaniment();

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      // fullWidth={true}
      // maxWidth={'lg'}
      // PaperProps={{ sx: { width: '30%', height: '40%' } }}
      PaperProps={{ sx: { width: '518px', height: '220px' } }}
    >
      <DialogTitle>New {getTypeLabelFromType()}</DialogTitle>
      <DialogContent
      >
        <div
          style={{
            position: 'absolute',
            top: '45px',
          }}
        >
          <TextField
            sx={{ m: 1, maxHeight: '40px', marginTop: '12px' }}
            type='string'
            label="Dish name"
            value={dishName}
            onChange={(event) => setDishName(event.target.value)}
          />
          {requiresAccompanimentJsx}
        </div>
      </DialogContent>
      <DialogActions
        style={{ marginTop: '10px' }}
      >
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleAddNewDish} autoFocus>
          Add
        </Button>
      </DialogActions>

    </Dialog>
  );
}

function mapStateToProps(state: any) {
  return {
    pizza: 'sausage',
  };
}

export default connect(mapStateToProps)(NewDishDialog);



