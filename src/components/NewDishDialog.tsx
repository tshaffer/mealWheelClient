import * as React from 'react';
import { connect } from 'react-redux';

import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { Button, Checkbox, DialogActions, DialogContent, FormControlLabel, FormGroup, TextField } from '@mui/material';
import { DishType } from '../types';

export interface NewDishDialogPropsFromParent {
  open: boolean;
  onAddDish: (dishName: string, requiresAccompaniment?: boolean) => void;
  onClose: () => void;
  dishType: DishType;
}

export interface NewDishDialogProps extends NewDishDialogPropsFromParent {
  pizza: string;
}

function NewDishDialog(props: NewDishDialogProps) {

  const { open, onClose } = props;

  const [dishName, setDishName] = React.useState('');
  const [requiresAccompaniment, setRequiresAccompaniment] = React.useState(false);

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

  const handleAddNewDish = () => {
    if (props.dishType === DishType.Main) {
      props.onAddDish(dishName, requiresAccompaniment);
    }
    else {
      props.onAddDish(dishName);
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
          <FormControlLabel
            control={
              <Checkbox
                checked={requiresAccompaniment}
                onChange={(event) => setRequiresAccompaniment(event.target.checked)}
              />
            }
            label="Requires Accompaniment"
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
      PaperProps={{ sx: { width: '300px', height: '220px' } }}
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
    // versionInfo: getVersionInfo(state),
    pizza: 'sausage',
  };
}

export default connect(mapStateToProps)(NewDishDialog);



