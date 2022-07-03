/* eslint-disable @typescript-eslint/no-var-requires */
import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { Box } from '@mui/material';
import Grid from '@mui/material/Grid';

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
    props.onGenerateMenu();
  };

  const handleUploadFile = () => {
    const data = new FormData();
    data.append('file', selectedFile);
    props.onUploadFile(data);
  };

  const renderMealRow = (meal: Meal) => {
    return (
      <MealComponent
        mainDishId={meal.mainDishId}
        accompanimentDishId={meal.accompanimentDishId}
        key={meal.mainDishId}
      />
    );
  };


  const renderMealRows = () => {

    if (props.meals.length === 0) {
      return null;
    }

    const mealRows = props.meals.map((meal: Meal) => {
      return renderMealRow(meal);
    });

    return mealRows;
  };

  const renderMeals = () => {

    if (props.meals.length === 0) {
      return null;
    }

    const mealRows = renderMealRows();

    if (isNil(mealRows)) {
      return null;
    }

    return (
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          {mealRows}
        </Grid>
      </Box>
    );
  };

  const meals = renderMeals();

  return (
    <div>
      <button type="button" onClick={handleGenerateMenu}>Generate Menu</button>
      <br />
      {meals}
      <input type="file" name="file" onChange={handleFileChangeHandler} />
      <br />
      <button type="button" onClick={handleUploadFile}>Upload</button>
      <br />
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
