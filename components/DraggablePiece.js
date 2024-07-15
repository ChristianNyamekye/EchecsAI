import React from 'react';
import { useDrag } from 'react-dnd';

const DraggablePiece = ({ piece }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'PIECE',
    item: { piece },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
        width: '40px',
        height: '40px',
      }}
    >
      {/* Placeholder for the piece rendering logic */}
      {piece}
    </div>
  );
};

export default DraggablePiece;
