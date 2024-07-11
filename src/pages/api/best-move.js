// import { Chess, validateFen } from "chess.js";
// import { getBestMove } from "../../../lib/stockfish";
// import { analyzePosition } from "../../../lib/stockfish";
// import { getFen } from "../../../lib/chess";

// export default async (req, res) => {
//   if (req.method === "POST") {
//     console.log(`here!!!`);
//     const fen2 = getFen();
//     const { fen, rDepth, time } = req.body;  // Destructure FEN and color from request body
//     console.log("Received FEN:", fen, "Depth:", rDepth, "Time:", time);
//     console.log(fen2);
//     // Initialize a new game instance with the FEN
    
//     // const game = new Chess(fen2);

//     const validation = validateFen(fen);
//     console.log(validation);
//     if (!validateFen(fen)) {
//       return res.status(400).json({ error: "Invalid FEN string provided." });
//     }

//     // You may need to adjust how the best move is calculated based on the color
//     // const bestMove = await getBestMove(fen);
//     const { bestMove, score, depth, pv } = await analyzePosition(fen, rDepth, parseInt(time));

//     res.status(200).json({ bestMove, score, depth, pv });
//   } else {
//     console.log(`cccccccc!!!`);
//     res.status(405).end(); // Method Not Allowed
//   }
// };





import { Chess, validateFen } from "chess.js";
import { getBestMove } from "../../../lib/stockfish";
import { analyzePosition } from "../../../lib/stockfish";
import { getFen } from "../../../lib/chess";

export default async (req, res) => {
  if (req.method === "POST") {
    console.log(`here!!!`);
    const fen2 = getFen();
    const { fen, rDepth, time } = req.body; // Destructure FEN and color from request body
    console.log("Received FEN:", fen, "Depth:", rDepth, "Time:", time);
    console.log(fen2);
    // Initialize a new game instance with the FEN

    // const game = new Chess(fen2);

    const validation = validateFen(fen);
    console.log(validation);
    if (!validateFen(fen)) {
      return res.status(400).json({ error: "Invalid FEN string provided." });
    }

    const response = await fetch(
      "https://us-central1-echecsai-429021.cloudfunctions.net/analyzeChessPosition",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          position: fen,
          depth: rDepth,
          time: parseInt(time),
        }),
      }
    );

    const sent = JSON.stringify({
      position: fen,
      depth: rDepth,
      time: parseInt(time),
    });
    console.log(`sent dataa:  ${sent}`);

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: "Error analyzing position" });
    }

    let recMove = null;
    let recDepth = null;
    let recScore = null;
    let recPv = null;

    const data = await response.json();

    // Convert depth to integer
    recDepth = parseInt(data.depth, 10);

    // Convert score to floating-point number
    recScore = data.score;

    // Extract the principal variation text up to the first newline character
    recPv = data.pv.split("\n")[0];

    // Extract the move from the pv string between "bestmove" and "ponder"
    const bestMoveRegex = /bestmove\s+(\S+)\s+ponder/;
    const match = bestMoveRegex.exec(data.pv);
    if (match && match[1]) {
      recMove = match[1]; // Assigns the move between "bestmove" and "ponder"
    } else {
        recMove = recPv.split(" ")[0]; // Fallback if no match is found
    }

    console.log(`best move: ${recMove} depth: ${recDepth} score: ${recScore} pv: ${recPv}`);

    res.status(200).json({ recMove, recScore, recDepth, recPv });

    console.log("return1EEd json: ", JSON.stringify(data));
    // res.status(200).json(data);
  } else {
    res.status(405).end(); // Method Not Allowed
  }
};

