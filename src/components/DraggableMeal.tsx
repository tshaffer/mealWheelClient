import * as React from 'react';

import { MealEntity } from '../types';
import MenuItemDescriptor from './MenuItemDescriptor';

import type { CSSProperties } from 'react';

import { useDrag } from 'react-dnd';

const style: CSSProperties = {
  border: '1px dashed gray',
  padding: '0.5rem 1rem',
  marginRight: '1.5rem',
  marginBottom: '1.5rem',
  cursor: 'move',
  float: 'left',
};

export interface DraggableMealProps {
  meal: MealEntity;
  isAlreadyAssigned: boolean;
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

  const backgroundColor = props.isAlreadyAssigned ? 'limegreen' : 'white';

  return (
    <div
      key={props.meal.id}
      ref={drag}
      style={{
        ...style,
        display: 'inline-block',
        backgroundColor,
        opacity,
        width: '185px',
        height: '115px',
      }}
    >
      <MenuItemDescriptor
        meal={props.meal}
      />
    </div>
  );
}

export default DraggableMeal;

