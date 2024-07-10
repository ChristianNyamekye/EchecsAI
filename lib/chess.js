// lib/chess.js
import { Chess } from 'chess.js';

const chess = new Chess();

export const move = (from, to) => {
  console.log(`Attempting move from ${from} to ${to}`);
  const move = chess.move({ from, to, promotion: "q" });
  if (move) {
    console.log(`Move successful, new FEN: ${chess.fen()}`);
    return chess.fen();  // Returns the updated FEN string if the move is successful
  }
  return null;  // Returns null if the move is invalid
};

export const resetGame = () => {
  chess.reset();
  return chess.fen();  // Returns the initial FEN string after resetting the game
};

export const getFen = () => {
  return chess.fen();  // Returns the current FEN string
};
