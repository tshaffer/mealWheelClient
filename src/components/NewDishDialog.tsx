import * as React from 'react';
import { connect } from 'react-redux';

import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { Button, Checkbox, DialogActions, DialogContent, FormControlLabel, FormGroup, FormLabel, TextField } from '@mui/material';
import { getAccompaniments, getAccompanimentTypeNamesById, getAccompanimentTypeEntitiessByUser } from '../selectors';
import { AccompanimentTypeEntity, AccompanimentTypeNameById, DishEntity, DishType, SuggestedAccompanimentTypeForMainSpec } from '../types';
import { cloneDeep, isNil } from 'lodash';
// import {
//   DishType,
//   RequiredAccompanimentFlags
// } from '../types';

export interface NewDishDialogPropsFromParent {
  open: boolean;
  accompanimentTypeNameById: AccompanimentTypeNameById;
  onAddDish: (
    dishName: string,
    dishType: DishType,
    minimumInterval: number,
    suggestedAccompanimentTypeSpecs?: SuggestedAccompanimentTypeForMainSpec[]
  ) => void;
  onClose: () => void;
  dishType: DishType;
}

export interface NewDishDialogProps extends NewDishDialogPropsFromParent {
  allAccompanimentTypes: AccompanimentTypeEntity[];
}

function NewDishDialog(props: NewDishDialogProps) {

  const { open, onClose } = props;

  const [dishName, setDishName] = React.useState('');
  const [minimumInterval, setMinimumInterval] = React.useState(5);
  const [suggestedAccompanimentTypes, setSuggestedAccompanimentTypes] = React.useState<SuggestedAccompanimentTypeForMainSpec[]>([]);

  const getTypeLabelFromType = (id: string): string => {
    if (id === 'main') {
      return 'Main';
    }
    return props.accompanimentTypeNameById[id];
  };

  const handleAddNewDish = () => {
    if (props.dishType === 'main') {
      props.onAddDish(dishName, props.dishType, minimumInterval, suggestedAccompanimentTypes);
    }
    else {
      props.onAddDish(dishName, props.dishType, minimumInterval);
    }
  };

  const handleClose = () => {
    onClose();
  };

  const handleUpdateSuggestedAccompanimentCount = (
    accompanimentTypeEntity: AccompanimentTypeEntity,
    suggestedAccompanimentCountStr: string,
  ) => {
    console.log('handleUpdateSuggestedAccompanimentCount');
    console.log(accompanimentTypeEntity);
    console.log(suggestedAccompanimentCountStr);

    const suggestedAccompanimentTypeEntityCount = parseInt(suggestedAccompanimentCountStr, 10);
    const localSuggestedAccompanimentTypes = cloneDeep(suggestedAccompanimentTypes);

    let matchedSuggestedAccompanimentType: SuggestedAccompanimentTypeForMainSpec | null = null;
    localSuggestedAccompanimentTypes.forEach((suggestedAccompanimentType: SuggestedAccompanimentTypeForMainSpec, index: number) => {
      if (suggestedAccompanimentType.suggestedAccompanimentTypeEntityId === accompanimentTypeEntity.id) {
        matchedSuggestedAccompanimentType = suggestedAccompanimentType;
      }
    });

    if (isNil(matchedSuggestedAccompanimentType)) {
      const suggestedAccompanimentType: SuggestedAccompanimentTypeForMainSpec = {
        suggestedAccompanimentTypeEntityId: accompanimentTypeEntity.id,
        count: suggestedAccompanimentTypeEntityCount,
      };
      localSuggestedAccompanimentTypes.push(suggestedAccompanimentType);
    } else {
      (matchedSuggestedAccompanimentType as SuggestedAccompanimentTypeForMainSpec).count = suggestedAccompanimentTypeEntityCount;
    }
    setSuggestedAccompanimentTypes(localSuggestedAccompanimentTypes);

    console.log(localSuggestedAccompanimentTypes);
  };

  const renderSuggestedAccompaniment = (accompanimentTypeEntity: AccompanimentTypeEntity): JSX.Element => {
    return (
      <React.Fragment key={accompanimentTypeEntity.id}>
        <TextField
          sx={{ m: 1, maxHeight: '40px', marginTop: '12px' }}
          type='number'
          label={accompanimentTypeEntity.name}
          defaultValue={0}
          variant='standard'
          onChange={(event) => handleUpdateSuggestedAccompanimentCount(accompanimentTypeEntity, event.target.value)}
          InputProps={{
            inputProps: {
              min: 0
            }
          }}
        />
      </React.Fragment>
    );
    // return (
    //   <React.Fragment key={accompanimentTypeId}>
    //     <FormControlLabel
    //       control={
    //         <Checkbox
    //           checked={isAccompanimentRequired(accompanimentTypeId)}
    //           onChange={(event) => setRequiredAccompanimentType(accompanimentTypeId, event.target.checked)}
    //         />
    //       }
    //       label={getTypeLabelFromType(accompanimentTypeId)}
    //     />
    //     <br />
    //   </React.Fragment>
    // );
  };

  const renderSuggestedAccompaniments = () => {
    if (props.dishType !== 'main') {
      return null;
    }

    const suggestedAccompanimentsElements: JSX.Element[] = [];

    props.allAccompanimentTypes.forEach((accompanimentType: AccompanimentTypeEntity) => {
      const jsx = renderSuggestedAccompaniment(accompanimentType);
      suggestedAccompanimentsElements.push(jsx);
    });

    return (
      <div>
        {suggestedAccompanimentsElements}
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

  const suggestedAccompanimentsJsx = renderSuggestedAccompaniments();

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
          {suggestedAccompanimentsJsx}
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



