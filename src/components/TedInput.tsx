import * as React from 'react';
import { DishRow } from './NewDishes';
import TextField from '@mui/material/TextField';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';


export interface TedInputProps {
  row: DishRow;
  value: string;
  onChange: any;
}


const TedInput = (props: TedInputProps) => {

  const handleTedInputChange = (dishRow: DishRow, value: string) => {
    console.log('handleTedInputChange');
    console.log(value);
    props.onChange(dishRow, value);
  };

  return (
    <TextField
      sx={{ m: 1, maxHeight: '40px', marginTop: '12px' }}
      type='string'
      label='Dish name'
      value={props.value}
      onChange={(event) => handleTedInputChange(props.row, event.target.value)}
      variant='standard'
    />
  );
};

function mapStateToProps(state: any) {
  return {
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(TedInput);
