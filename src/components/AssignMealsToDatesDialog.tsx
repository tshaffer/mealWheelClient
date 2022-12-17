import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import { MealEntity } from '../types';
import { getUnassignedMeals } from '../selectors';
import { List, ListItem, ListItemText } from '@mui/material';

export interface AssignMealsToDatesDialogPropsFromParent {
  open: boolean;
  onClose: () => void;
}

export interface AssignMealsToDatesDialogProps extends AssignMealsToDatesDialogPropsFromParent {
  meals: MealEntity[];
}

function AssignMealsToDatesDialog(props: AssignMealsToDatesDialogProps) {

  const handleClose = () => {
    props.onClose();
  };

  const getRenderedListOfMealsItems = () => {
    const renderedListOfMeals = props.meals.map((meal: MealEntity, index: number) => {
      return (
        <ListItem key={index}>
          <ListItemText>
            {meal.mainDish.name}
          </ListItemText>
        </ListItem>
      );
    });

    return renderedListOfMeals;
  };

  const getRenderedListOfMeals = () => {
    const listOfMealsItems = getRenderedListOfMealsItems();
    return (
      <List>
        {listOfMealsItems}
      </List>
    );
  };

  const listOfMeals = getRenderedListOfMeals();

  return (
    <Dialog onClose={handleClose} open={props.open}>
      <DialogTitle>Assign Meals to Dates</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            height: 500,
            width: '100%',
            '& .actions': {
              color: 'text.secondary',
            },
            '& .textPrimary': {
              color: 'text.primary',
            },
          }}
        >
          {listOfMeals}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

function mapStateToProps(state: any, ownProps: AssignMealsToDatesDialogPropsFromParent) {
  return {
    meals: getUnassignedMeals(state),
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
  }, dispatch);
};


export default connect(mapStateToProps, mapDispatchToProps)(AssignMealsToDatesDialog);

