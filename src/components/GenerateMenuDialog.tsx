import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

import dayjs, { Dayjs } from 'dayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { isNil } from 'lodash';

import { setStartDate, setNumberOfMealsToGenerate, setOverwriteExistingMeals } from '../models';
import { getStartDate, getNumberOfMealsToGenerate, getOverwriteExistingMeals } from '../selectors';

export interface GenerateMenuDialogPropsFromParent {
  open: boolean;
  onGenerateMenus: (startDate: Date, numberOfMealsToGenerate: number, overwriteExistingMeals: boolean) => void;
  onClose: () => void;
}

export interface GenerateMenuDialogProps extends GenerateMenuDialogPropsFromParent {
  startDate: Date;
  numberOfMealsToGenerate: number;
  overwriteExistingMeals: boolean;
  onSetStartDate: (startDate: Date) => void;
  onSetNumberOfMealsToGenerate: (numberOfMealsToGenerate: number) => void;
  onSetOverwriteExistingMeals: (overwriteExistingMeals: boolean) => void;
}

function GenerateMenuDialog(props: GenerateMenuDialogProps) {

  const { open, onClose, onGenerateMenus } = props;

  const handleUpdateStartDate = (newValue: Dayjs | null) => {
    props.onSetStartDate((newValue as Dayjs).toDate());
  };

  const handleUpdateNumberOfMealsToGenerate = (event: object) => {
    const textEntry = ((event as any).target as any).value;
    const numberOfMealsToGenerateEntry = parseInt(textEntry, 10);
    props.onSetNumberOfMealsToGenerate(numberOfMealsToGenerateEntry);
  };

  const handleUpdateOverwriteExistingMeals = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.onSetOverwriteExistingMeals(event.target.checked);
  };

  const handleGenerateMenu = () => {
    if (!isNil(props.startDate)) {
      onGenerateMenus(props.startDate, props.numberOfMealsToGenerate, props.overwriteExistingMeals);
      onClose();
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Generate Menu </DialogTitle>
      <DialogContent>
        <LocalizationProvider
          dateAdapter={AdapterDayjs}
        >
          <DesktopDatePicker
            label="Start Date"
            inputFormat="MM/DD/YYYY"
            value={props.startDate}
            onChange={handleUpdateStartDate}
            disablePast={true}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
        <br />
        <TextField
          sx={{ m: 1, maxHeight: '40px', marginTop: '12px' }}
          type='number'
          label="Number of meals to generate"
          InputProps={{
            inputProps: { min: 1 }
          }}
          value={props.numberOfMealsToGenerate}
          onChange={handleUpdateNumberOfMealsToGenerate}
        />
        <br />
        <FormGroup
          sx={{ m: 1, maxHeight: '40px', marginTop: '12px' }}
        >
          <FormControlLabel
            control={
              <Checkbox
                checked={props.overwriteExistingMeals}
                onChange={handleUpdateOverwriteExistingMeals}
              />
            }
            label="Overwrite existing meals"
          />
        </FormGroup>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleGenerateMenu} autoFocus>
          Generate Menu
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function mapStateToProps(state: any) {
  return {
    startDate: getStartDate(state),
    numberOfMealsToGenerate: getNumberOfMealsToGenerate(state),
    overwriteExistingMeals: getOverwriteExistingMeals(state),
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
    onSetStartDate: setStartDate,
    onSetNumberOfMealsToGenerate: setNumberOfMealsToGenerate,
    onSetOverwriteExistingMeals: setOverwriteExistingMeals,
  }, dispatch);
};


export default connect(mapStateToProps, mapDispatchToProps)(GenerateMenuDialog);

