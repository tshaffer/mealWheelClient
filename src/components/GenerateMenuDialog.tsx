import * as React from 'react';
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

export interface GenerateMenuDialogPropsFromParent {
  open: boolean;
  onClose: () => void;
}

export interface GenerateMenuDialogProps extends GenerateMenuDialogPropsFromParent {
  pizza: string;
}

function GenerateMenuDialog(props: GenerateMenuDialogProps) {

  const { open, onClose } = props;

  const [startDate, setStartDate] = React.useState<Dayjs | null>(
    dayjs('2022-10-22T21:11:54'),
  );
  const [numberOfMealsToGenerate, setNumberOfMealsToGenerate] = React.useState<number>(7);
  const [overwriteExistingMeals, setOverwriteExistingMeals] = React.useState<boolean>(true);

  const handleUpdateStartDate = (newValue: Dayjs | null) => {
    setStartDate(newValue);
  };

  const handleUpdateNumberOfMealsToGenerate = (event: object) => {
    const textEntry = ((event as any).target as any).value;
    const numberOfMealsToGenerateEntry = parseInt(textEntry, 10);
    setNumberOfMealsToGenerate(numberOfMealsToGenerateEntry);
  };

  const handleUpdateOverwriteExistingMeals = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOverwriteExistingMeals(event.target.checked);
  };

  const handleClose = () => {

    if (!isNil(startDate)) {
      const startDateToReturn: Date = startDate?.toDate();
      console.log('Start date: ', startDateToReturn);
    }

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
            value={startDate}
            onChange={handleUpdateStartDate}
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
          value={numberOfMealsToGenerate}
          onChange={handleUpdateNumberOfMealsToGenerate}
        />
        <br />
        <FormGroup
          sx={{ m: 1, maxHeight: '40px', marginTop: '12px' }}
        >
          <FormControlLabel
            control={
              <Checkbox
                checked={overwriteExistingMeals}
                onChange={handleUpdateOverwriteExistingMeals}
              />
            }
            label="Overwrite existing meals"
          />
        </FormGroup>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleClose} autoFocus>
          Generate Menu
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function mapStateToProps(state: any) {
  return {
    pizza: 'stromboli',
  };
}

export default connect(mapStateToProps)(GenerateMenuDialog);

