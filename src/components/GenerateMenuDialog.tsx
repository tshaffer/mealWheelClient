import * as React from 'react';
import { connect } from 'react-redux';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';

import dayjs, { Dayjs } from 'dayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

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

  const handleUpdateStartDate = (newValue: Dayjs | null) => {
    setStartDate(newValue);
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Generate Menu </DialogTitle>
      <DialogContent>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DesktopDatePicker
            label="Start Date"
            inputFormat="MM/DD/YYYY"
            value={startDate}
            onChange={handleUpdateStartDate}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
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
