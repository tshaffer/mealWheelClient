/* eslint-disable @typescript-eslint/no-var-requires */
import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

import { generateMenu, initializeApp, uploadFile } from '../controllers';
import { Meal } from '../types';
import { getMeals } from '../selectors';
import MealComponent from './MealComponent';
import { isNil } from 'lodash';

export interface AppProps {
  meals: Meal[];
  onInitializeApp: () => any;
  onGenerateMenu: () => any;
  onUploadFile: (formData: FormData) => any;
}

const App = (props: AppProps) => {

  React.useEffect(() => {
    props.onInitializeApp();
  }, []);

  const [selectedFile, setSelectedFile] = React.useState(null);

  const handleFileChangeHandler = (e: any) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleGenerateMenu = () => {
    console.log('generateMenu');
    props.onGenerateMenu();
  };

  const handleUploadFile = () => {
    console.log('uploadFile: ', selectedFile);
    const data = new FormData();
    data.append('file', selectedFile);
    props.onUploadFile(data);
  };

  const renderMealRow = (mealId: string) => {

    let mealInRow: Meal = null;

    const meals: Meal[] = props.meals;
    for (const meal of meals) {
      if (mealId === meal.mainDishId) {
        mealInRow = meal;
      }
    }

    if (isNil(mealInRow)) {
      return null;
    }

    return (
      <MealComponent
        mealId={mealInRow.mainDishId}
      >
      </MealComponent>
    );
  };


  const renderMealRows = () => {

    if (props.meals.length === 0) {
      return null;
    }

    const mealRows = props.meals.map((meal: Meal) => {
      return renderMealRow(meal.mainDishId);
    });

    return mealRows;
  };

  // return (
  //   <Box sx={{ flexGrow: 1 }}>
  //     <Grid container spacing={2}>
  //       <Grid item xs={8}>
  //         <Item>xs=8</Item>
  //       </Grid>
  //       <Grid item xs={4}>
  //         <Item>xs=4</Item>
  //       </Grid>
  //       <Grid item xs={4}>
  //         <Item>xs=4</Item>
  //       </Grid>
  //       <Grid item xs={8}>
  //         <Item>xs=8</Item>
  //       </Grid>
  //     </Grid>
  //   </Box>
  // );

  const mealRows = renderMealRows();

  return (
    <div>
      <Box
        component='form'
        sx={{
          '& > :not(style)': { m: 1, width: '25ch' },
        }}
        noValidate
        autoComplete='off'
      >
        <button type="button" onClick={handleGenerateMenu}>Generate Menu</button>
        <br />
        <Grid container spacing={2}>
          {mealRows}
        </Grid>
        <input type="file" name="file" onChange={handleFileChangeHandler} />
        <br />
        <button type="button" onClick={handleUploadFile}>Upload</button>
        <br />
      </Box>
    </div>
  );
};

function mapStateToProps(state: any) {
  return {
    meals: getMeals(state),
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
    onInitializeApp: initializeApp,
    onUploadFile: uploadFile,
    onGenerateMenu: generateMenu,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(App);

