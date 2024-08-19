import React, { SetStateAction } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Box } from '@mui/material';

//reordering the result
const reorder = (list: Object[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const getItemStyle = (isDragging: any, draggableStyle: any): any => ({
  userSelect: 'none',
  background: isDragging ? 'lightblue' : '#fff',
  ...draggableStyle,
});

export interface DragAndDropProps {
  state: Object[];
  setState: React.Dispatch<SetStateAction<any>>;
  Component?: React.ElementType;
  listStyle?: React.CSSProperties;
  itemStyle?: React.CSSProperties;
  componentProps?: Object;
}

function DragAndDrop({
  state,
  setState,
  Component,
  listStyle = {},
  itemStyle = {},
  componentProps = {},
}: DragAndDropProps) {
  function onDragEnd(result: any) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }
    const items = reorder(state, result.source.index, result.destination.index);
    setState(items);
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {(provided: any) => (
          <Box
            {...provided.droppableProps}
            ref={provided.innerRef}
            style={{
              width: '100%',
              backgroundColor: 'white',
              ...listStyle,
            }}
          >
            {state?.map((item: any, index: number) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided: any, snapshot: any) => (
                  <Box
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{
                      ...getItemStyle(
                        snapshot.isDragging,
                        provided.draggableProps.style
                      ),
                      ...itemStyle,
                    }}
                  >
                    {Component && (
                      <Component content={item} {...componentProps} />
                    )}
                  </Box>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </Box>
        )}
      </Droppable>
    </DragDropContext>
  );
}
export default DragAndDrop;
