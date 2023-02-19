import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { Dayjs } from 'dayjs';

import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';


import { MealWheelDispatch, setCleanupEffort, setDinnerTime, setPrepEffort } from '../models';
import { isNil, isNumber } from 'lodash';

export interface MealWheelTonightProps {
  onSetDinnerTime: (dinnerTime: string) => void;
  onSetCleanupEffort: (cleanupEffort: number) => void;
  onSetPrepEffort: (prepEffort: number) => void;
};

const MealWheelTonight = (props: MealWheelTonightProps) => {

  const [value, setValue] = React.useState<Dayjs | null>(null);

  const sliderStyle = {
    display: 'inline-block',
  };

  const effortStyle = {
    marginTop: '20px',
    marginLeft: '20px',
  };

  const effortMarks = [
    {
      value: 0,
      label: 'Zero',
    },
    {
      value: 2,
      label: 'Very low',
    },
    {
      value: 5,
      label: 'Medium',
    },
    {
      value: 10,
      label: 'High',
    },
  ];

  function valuetext(value: number) {
    return `${value}°C`;
  }

  const handleUpdateDinnerTime = (value: Dayjs | null) => {
    if (!isNil(value)) {
      props.onSetDinnerTime(value.toString());
    }
  };

  const handleUpdatePrepEffort = (event: any, value: number | number[]) => {
    if (isNumber(value)) {
      props.onSetPrepEffort(value);
    }
  };

  const handleUpdateCleanupEffort = (event: any, value: number | number[]) => {
    if (isNumber(value)) {
      props.onSetCleanupEffort(value);
    }
  };

  const renderTargetDinnerTime = (): JSX.Element => {
    return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <TimePicker
          label="Dinner time"
          value={value}
          onChange={(newValue) => {
            setValue(newValue);
            handleUpdateDinnerTime(newValue);
          }}
          renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>
    );
  };

  const renderPrepEffort = (): JSX.Element => {
    return (
      <Box
        sx={{ width: 300 }}
        style={effortStyle}
      >
        <span>Prep effort willingness</span>
        <Slider
          style={sliderStyle}
          defaultValue={5}
          getAriaValueText={valuetext}
          step={1}
          valueLabelDisplay="auto"
          marks={effortMarks}
          min={0}
          max={10}
          onChange={handleUpdatePrepEffort}
        />
      </Box>
    );
  };

  const renderCleanupEffort = (): JSX.Element => {
    return (
      <Box
        sx={{ width: 300 }}
        style={effortStyle}
      >
        <span>Cleanup effort willingness</span>
        <Slider
          style={sliderStyle}
          defaultValue={5}
          getAriaValueText={valuetext}
          step={1}
          valueLabelDisplay="auto"
          marks={effortMarks}
          min={0}
          max={10}
          onChange={handleUpdateCleanupEffort}
        />
      </Box>
    );
  };

  const targetDinnerTime: JSX.Element = renderTargetDinnerTime();
  const prepEffort: JSX.Element = renderPrepEffort();
  const cleanupEffort: JSX.Element = renderCleanupEffort();

  return (
    <div>
      {targetDinnerTime}
      {prepEffort}
      {cleanupEffort}
    </div>
  );
};

function mapStateToProps(state: any) {
  return {
  };
}

const mapDispatchToProps = (dispatch: MealWheelDispatch) => {
  return bindActionCreators({
    onSetDinnerTime: setDinnerTime,
    onSetCleanupEffort: setCleanupEffort,
    onSetPrepEffort: setPrepEffort,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(MealWheelTonight);
