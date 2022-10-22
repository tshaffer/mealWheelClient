import * as React from 'react';
import { connect } from 'react-redux';

import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';

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
      <div style={{ marginLeft: '10px', marginRight: '10px', marginBottom: '10px' }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>

          <DesktopDatePicker
            label="Start Date"
            inputFormat="MM/DD/YYYY"
            value={startDate}
            onChange={handleUpdateStartDate}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
      </div>
    </Dialog>
  );
}

function mapStateToProps(state: any) {
  return {
    pizza: 'stromboli',
  };
}

export default connect(mapStateToProps)(GenerateMenuDialog);



/*
import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';

export default function MaterialUIPickers() {
  const [value, setValue] = React.useState<Dayjs | null>(
    dayjs('2014-08-18T21:11:54'),
  );

  const handleChange = (newValue: Dayjs | null) => {
    setValue(newValue);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack spacing={3}>
        <DesktopDatePicker
          label="Date desktop"
          inputFormat="MM/DD/YYYY"
          value={value}
          onChange={handleChange}
          renderInput={(params) => <TextField {...params} />}
        />
        <MobileDatePicker
          label="Date mobile"
          inputFormat="MM/DD/YYYY"
          value={value}
          onChange={handleChange}
          renderInput={(params) => <TextField {...params} />}
        />
        <TimePicker
          label="Time"
          value={value}
          onChange={handleChange}
          renderInput={(params) => <TextField {...params} />}
        />
        <DateTimePicker
          label="Date&Time picker"
          value={value}
          onChange={handleChange}
          renderInput={(params) => <TextField {...params} />}
        />
      </Stack>
    </LocalizationProvider>
  );
}
*/