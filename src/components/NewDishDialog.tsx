import * as React from 'react';
import { connect } from 'react-redux';

import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { Button, Checkbox, DialogActions, DialogContent, FormControlLabel, FormGroup, FormLabel, TextField } from '@mui/material';
import { getAccompaniments, getAccompanimentTypeNamesById, getAccompanimentTypeEntitiessByUser } from '../selectors';
import { AccompanimentTypeEntity, AccompanimentTypeNameById, DishEntity } from '../types';
import { cloneDeep } from 'lodash';
// import {
//   DishType,
//   RequiredAccompanimentFlags
// } from '../types';

export interface NewDishDialogPropsFromParent {
  open: boolean;
  accompanimentTypeNameById: AccompanimentTypeNameById;
  onAddDish: (
    dishName: string,
    dishType: string,
    minimumInterval: number,
    numAccompanimentsRequired?: number,
    allowableAccompanimentTypeEntityIds?: string[],
  ) => void;
  onClose: () => void;
  dishType: string;
}

export interface NewDishDialogProps extends NewDishDialogPropsFromParent {
  allAccompanimentTypes: AccompanimentTypeEntity[];
}

function NewDishDialog(props: NewDishDialogProps) {

  const { open, onClose } = props;

  const [dishName, setDishName] = React.useState('');
  const [minimumInterval, setMinimumInterval] = React.useState(5);
  // const [requiredAccompanimentFlags, setRequiredAccompanimentFlags] = React.useState(RequiredAccompanimentFlags.None);
  const [requiredAccompanimentTypes, setRequiredAccompanimentTypes] = React.useState<string[]>([]);

  const getTypeLabelFromType = (id: string): string => {
    if (id === 'main') {
      return 'Main';
    }
    return props.accompanimentTypeNameById[id];
  };

  const handleAddNewDish = () => {
    if (props.dishType === 'main') {
      props.onAddDish(dishName, props.dishType, minimumInterval, requiredAccompanimentTypes.length, requiredAccompanimentTypes);
    }
    else {
      props.onAddDish(dishName, props.dishType, minimumInterval);
    }
  };

  const handleClose = () => {
    onClose();
  };

  const isAccompanimentRequired = (accompanimentTypeId: string): boolean => {
    return requiredAccompanimentTypes.indexOf(accompanimentTypeId) >= 0;
  };

  const setRequiredAccompanimentType = (accompanimentTypeId: string, checked: boolean) => {
    console.log('setRequiredAccompanimentType');
    console.log(accompanimentTypeId);
    console.log(checked);

    const localRequiredAccompanimentTypes = cloneDeep(requiredAccompanimentTypes);

    const indexOfAccompanimentType = requiredAccompanimentTypes.indexOf(accompanimentTypeId);
    if (indexOfAccompanimentType >= 0) {
      localRequiredAccompanimentTypes.splice(indexOfAccompanimentType, 1);
    } else {
      localRequiredAccompanimentTypes.push(accompanimentTypeId);
    }
    setRequiredAccompanimentTypes(localRequiredAccompanimentTypes);
  };

  const renderRequiresAccompaniment = (accompanimentTypeId: string): JSX.Element => {
    return (
      <React.Fragment>
        <FormControlLabel
          control={
            <Checkbox
              checked={isAccompanimentRequired(accompanimentTypeId)}
              onChange={(event) => setRequiredAccompanimentType(accompanimentTypeId, event.target.checked)}
            />
          }
          label={getTypeLabelFromType(accompanimentTypeId)}
        />
        <br />
      </React.Fragment>
    );
  };

  const renderRequiresAccompaniments = () => {
    if (props.dishType !== 'main') {
      return null;
    }

    const requiresAccompanimentsElements: JSX.Element[] = [];

    props.allAccompanimentTypes.forEach((accompanimentType: AccompanimentTypeEntity) => {
      const jsx = renderRequiresAccompaniment(accompanimentType.id);
      requiresAccompanimentsElements.push(jsx);
    });

    return (
      <div>
        {requiresAccompanimentsElements}
      </div>
    );
  };

  /*
    Form
      Text field for
        Name
      If main, checkboxes for each accompaniment, indicating whether it's required or not.
    Validation
      Name - not empty
      Name - unique within type
  */

  const requiresAccompanimentsJsx = renderRequiresAccompaniments();

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      // fullWidth={true}
      // maxWidth={'lg'}
      // PaperProps={{ sx: { width: '30%', height: '40%' } }}
      PaperProps={{ sx: { width: '518px', height: '220px' } }}
    >
      <DialogTitle>New {getTypeLabelFromType(props.dishType)}</DialogTitle>
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
          <TextField
            sx={{ m: 1, maxHeight: '40px', marginTop: '12px' }}
            type='number'
            label='Min interval'
            value={minimumInterval}
            onChange={(event) => setMinimumInterval(parseInt(event.target.value, 10))}
            InputProps={{
              inputProps: {
                min: 0
              }
            }}
          />
          {requiresAccompanimentsJsx}
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
    allAccompanimentTypes: getAccompanimentTypeEntitiessByUser(state),
    accompanimentTypeNameById: getAccompanimentTypeNamesById(state),
  };
}

export default connect(mapStateToProps)(NewDishDialog);



