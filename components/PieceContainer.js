import React from "react";
import DraggablePiece from "./DraggablePiece";

const PieceContainer = () => {
  const pieces = [
    "wP",
    "wN",
    "wB",
    "wR",
    "wQ",
    "wK",
    "bP",
    "bN",
    "bB",
    "bR",
    "bQ",
    "bK",
  ];

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md w-[300px] h-[300px] flex flex-wrap items-center justify-center">
      {pieces.map((piece, index) => (
        <DraggablePiece key={index} piece={piece} />
      ))}
    </div>
  );
};

export default PieceContainer;
