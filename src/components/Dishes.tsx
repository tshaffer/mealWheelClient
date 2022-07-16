import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { DataGrid, GridColumns, GridRowModel, GridRowsProp } from '@mui/x-data-grid';

import { DishEntity } from '../types';
import { getDishes } from '../selectors';

export interface DishesProps {
  dishes: DishEntity[];
}

const dishesColumns: GridColumns = [
  { field: 'name', headerName: 'Name', width: 240, editable: true },
  { field: 'type', headerName: 'Type', width: 180, editable: true },
];

const Dishes = (props: DishesProps) => {

  const getRows = () => {
    const rows: GridRowsProp = props.dishes.map((dish: DishEntity) => {
      const row: GridRowModel = {
        id: dish.id,
        name: dish.name,
        type: dish.type.toString(),
      };
      return row;
    });
    return rows;
  };

  const rows: GridRowsProp = getRows();

  return (
    <div style={{ height: 300, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={dishesColumns}
        experimentalFeatures={{ newEditingApi: true }}
      />
    </div>
  );
};

function mapStateToProps(state: any) {
  return {
    dishes: getDishes(state),
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Dishes);
