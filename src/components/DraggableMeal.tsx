import * as React from 'react';

import { MealEntity } from '../types';
import MenuItemDescriptor from './MenuItemDescriptor';

import type { CSSProperties } from 'react';

import { useDrag } from 'react-dnd';

const style: CSSProperties = {
  border: '1px dashed gray',
  backgroundColor: 'white',
  padding: '0.5rem 1rem',
  marginRight: '1.5rem',
  marginBottom: '1.5rem',
  cursor: 'move',
  float: 'left',
};

export interface DraggableMealProps {
  meal: MealEntity;
}

function DraggableMeal(props: DraggableMealProps) {

  const [{ opacity }, drag] = useDrag(
    () => ({
      type: 'draggableMeal',
      item: props.meal,
      collect: (monitor) => ({
        opacity: monitor.isDragging() ? 0.4 : 1,
      }),
    }),
  );

  return (
    <div key={props.meal.id} ref={drag} style={{ ...style, opacity }}>
      <MenuItemDescriptor
        meal={props.meal}
      />
    </div>
  );
}

export default DraggableMeal;

