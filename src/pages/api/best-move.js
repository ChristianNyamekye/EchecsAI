import { Chess, validateFen } from "chess.js";
import { getBestMove } from "../../../lib/stockfish";
import { analyzePosition } from "../../../lib/stockfish";
import { getFen } from "../../../lib/chess";

export default async (req, res) => {
  if (req.method === "POST") {
    console.log(`here!!!`);
    const fen2 = getFen();
    const { fen, rDepth, time } = req.body;  // Destructure FEN and color from request body
    console.log("Received FEN:", fen, "Depth:", rDepth, "Time:", time);
    console.log(fen2);
    // Initialize a new game instance with the FEN
    
    // const game = new Chess(fen2);

    const validation = validateFen(fen);
    console.log(validation);
    if (!validateFen(fen)) {
      return res.status(400).json({ error: "Invalid FEN string provided." });
    }

    // You may need to adjust how the best move is calculated based on the color
    // const bestMove = await getBestMove(fen);
    const { bestMove, score, depth, pv } = await analyzePosition(fen, rDepth, parseInt(time));

    res.status(200).json({ bestMove, score, depth, pv });
  } else {
    console.log(`cccccccc!!!`);
    res.status(405).end(); // Method Not Allowed
  }
};
