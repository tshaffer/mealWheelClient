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

import { setGroceryListStartDate, setNumberOfMealsInGroceryList } from '../models';
import { getGroceryListStartDate, getNumberOfMealsInGroceryList } from '../selectors';

export interface GenerateGroceryListDialogPropsFromParent {
  open: boolean;
  onGenerateGroceryList: (startDate: Date, numberOfMealsInGroceryList: number) => void;
  onClose: () => void;
}

export interface GenerateGroceryListDialogProps extends GenerateGroceryListDialogPropsFromParent {
  startDate: Date;
  numberOfMealsInGroceryList: number;
  onSetStartDate: (startDate: Date) => void;
  onSetNumberOfMealsInGroceryList: (numberOfMealsInGroceryList: number) => void;
}

function GenerateGroceryListDialog(props: GenerateGroceryListDialogProps) {

  const { open, onClose, onGenerateGroceryList } = props;

  const handleUpdateStartDate = (newValue: Dayjs | null) => {
    props.onSetStartDate((newValue as Dayjs).toDate());
  };

  const handleUpdateNumberOfMealsInGroceryList = (event: object) => {
    const textEntry = ((event as any).target as any).value;
    const numberOfMealsInGroceryListEntry = parseInt(textEntry, 10);
    props.onSetNumberOfMealsInGroceryList(numberOfMealsInGroceryListEntry);
  };

  const handleGenerateGroceryList = () => {
    if (!isNil(props.startDate)) {
      onGenerateGroceryList(props.startDate, props.numberOfMealsInGroceryList);
      onClose();
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Generate GroceryList</DialogTitle>
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
          label="Number of meals in grocery list"
          InputProps={{
            inputProps: { min: 1 }
          }}
          value={props.numberOfMealsInGroceryList}
          onChange={handleUpdateNumberOfMealsInGroceryList}
        />
        <br />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleGenerateGroceryList} autoFocus>
          Generate Grocery List
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function mapStateToProps(state: any) {
  return {
    startDate: getGroceryListStartDate(state),
    numberOfMealsInGroceryList: getNumberOfMealsInGroceryList(state),
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
    onSetStartDate: setGroceryListStartDate,
    onSetNumberOfMealsInGroceryList: setNumberOfMealsInGroceryList,
  }, dispatch);
};


export default connect(mapStateToProps, mapDispatchToProps)(GenerateGroceryListDialog);

