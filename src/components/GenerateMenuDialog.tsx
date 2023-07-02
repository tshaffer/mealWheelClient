import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';

import { Dayjs } from 'dayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { isNil } from 'lodash';

import { setStartDate, setNumberOfMealsToGenerate, MealWheelDispatch } from '../models';
import { getStartDate, getNumberOfMealsToGenerate } from '../selectors';

export interface GenerateMenuDialogPropsFromParent {
  open: boolean;
  onGenerateMenus: (startDate: Date, numberOfMealsToGenerate: number) => void;
  onClose: (generateMealsCancelled: boolean) => void;
}

export interface GenerateMenuDialogProps extends GenerateMenuDialogPropsFromParent {
  startDate: Date;
  numberOfMealsToGenerate: number;
  onSetStartDate: (startDate: Date) => void;
  onSetNumberOfMealsToGenerate: (numberOfMealsToGenerate: number) => void;
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

  const handleGenerateMenu = () => {
    if (!isNil(props.startDate)) {
      onGenerateMenus(props.startDate, props.numberOfMealsToGenerate);
      onClose(false);
    }
  };

  const handleClose = () => {
    onClose(true);
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Generate Menu</DialogTitle>
      <DialogContent>
        <div style={{ marginBottom: '6px' }}></div>
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
  };
}

const mapDispatchToProps = (dispatch: MealWheelDispatch) => {
  return bindActionCreators({
    onSetStartDate: setStartDate,
    onSetNumberOfMealsToGenerate: setNumberOfMealsToGenerate,
  }, dispatch);
};


export default connect(mapStateToProps, mapDispatchToProps)(GenerateMenuDialog);

