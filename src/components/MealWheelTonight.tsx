import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';


import { MealWheelDispatch } from '../models';

export interface MealWheelTonightProps {
}

const MealWheelTonight = (props: MealWheelTonightProps) => {

  const marks = [
    {
      value: 0,
      label: '0°C',
    },
    {
      value: 20,
      label: '20°C',
    },
    {
      value: 37,
      label: '37°C',
    },
    {
      value: 100,
      label: '100°C',
    },
  ];

  function valuetext(value: number) {
    return `${value}°C`;
  }

  const renderEffort = (): JSX.Element => {
    return (
      <Box sx={{ width: 300 }}>
        <Slider
          aria-label="Custom marks"
          defaultValue={20}
          getAriaValueText={valuetext}
          step={10}
          valueLabelDisplay="auto"
          marks={marks}
        />
      </Box>
    );
  }

  const effort: JSX.Element = renderEffort();

  return (
    <div>{effort}</div>
  );
};

function mapStateToProps(state: any) {
  return {
  };
}

const mapDispatchToProps = (dispatch: MealWheelDispatch) => {
  return bindActionCreators({
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(MealWheelTonight);

