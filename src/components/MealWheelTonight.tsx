import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';


import { MealWheelDispatch } from '../models';

export interface MealWheelTonightProps {
}

const MealWheelTonight = (props: MealWheelTonightProps) => {

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
      value: 20,
      label: 'Very low',
    },
    {
      value: 50,
      label: 'Medium',
    },
    {
      value: 100,
      label: 'High',
    },
  ];

  function valuetext(value: number) {
    return `${value}°C`;
  }

  const renderEffort = (): JSX.Element => {
    return (
      <Box
        sx={{ width: 300 }}
        style={effortStyle}
      >
        <span>Prep effort</span>
        <Slider
          defaultValue={50}
          getAriaValueText={valuetext}
          step={10}
          valueLabelDisplay="auto"
          marks={effortMarks}
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

