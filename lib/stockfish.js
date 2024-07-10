// const { spawn } = require("child_process");
// const readline = require("readline");

// const initializeStockfish = () => {
//   const stockfish = spawn("/opt/homebrew/bin/stockfish", {
//     stdio: ["pipe", "pipe", "pipe"], // Ensure pipes are properly set for stdin, stdout, stderr
//   });

//   stockfish.on("error", (err) => {
//     console.error("Failed to start Stockfish process:", err);
//   });

//   stockfish.on("exit", (code, signal) => {
//     console.log(`Stockfish process exited with code ${code}, signal ${signal}`);
//   });

//   return stockfish;
// };

// const getBestMove = async (fen, depth = 20, movetime = 5000) => {
//   const stockfish = initializeStockfish();

//   const rl = readline.createInterface({
//     input: stockfish.stdout,
//   });

//   return new Promise((resolve, reject) => {
//     stockfish.stderr.on("data", (data) => {
//       console.error(`stderr: ${data}`);
//     });

//     rl.on("line", (line) => {
//       console.log(`stdout: ${line}`);
//       if (line.startsWith("bestmove")) {
//         const bestMove = line.split(" ")[1];
//         resolve(bestMove);
//         rl.close();
//         stockfish.kill();
//       }
//     });

//     stockfish.stdin.write("uci\n");
//     stockfish.stdin.write("isready\n");
//     stockfish.stdin.write(`position fen ${fen}\n`);
//     stockfish.stdin.write(`go depth ${depth} movetime ${movetime}\n`);
//   }).catch((error) => {
//     console.error("Error in getBestMove:", error);
//     reject(error);
//   });
// };

// module.exports = { getBestMove };

// todo: working stockfish
const { spawn } = require("child_process");
const readline = require("readline");

const path = require('path');


const initializeStockfish = () => {

// const stockfishPath = process.env.STOCKFISH_PATH || "/opt/homebrew/bin/stockfish";
const stockfishPath = path.join(process.cwd(), "public/stockfish/stockfish");


  

  console.log(`Using Stockfish path: ${stockfishPath}`);

  const stockfish = spawn("/opt/homebrew/bin/stockfish");
  // const stockfish = spawn(stockfishPath);

  stockfish.on("error", (err) => {
    console.error("Failed to start Stockfish process:", err);
  });

  stockfish.on("exit", (code, signal) => {
    console.log(`Stockfish process exited with code ${code}, signal ${signal}`);
  });

  return stockfish;
};

const analyzePosition = async (fen, depth = 20, movetime = 5000) => {
  const stockfish = initializeStockfish();

  const rl = readline.createInterface({
    input: stockfish.stdout,
  });

  let info = {
    bestMove: null,
    score: null,
    depth: depth,
    pv: null,
  };

  return new Promise((resolve, reject) => {
    stockfish.stderr.on("data", (data) => {
      console.error(`stderr: ${data}`);
    });

    rl.on("line", (line) => {
      console.log(`stdout: ${line}`);

      if (line.startsWith("bestmove")) {
        info.bestMove = line.split(" ")[1];
      }

      if (line.startsWith("info")) {
        const parts = line.split(" ");
        const scoreIndex = parts.indexOf("score");
        const depthIndex = parts.indexOf("depth");
        const pvIndex = parts.indexOf("pv");

        if (scoreIndex !== -1 && parts[scoreIndex + 1] === "cp") {
          info.score = `+${parseInt(parts[scoreIndex + 2]) / 100}`; // converting centipawns to pawn units
        }

        if (depthIndex !== -1) {
          info.depth = parts[depthIndex + 1];
        }

        if (pvIndex !== -1) {
          info.pv = parts.slice(pvIndex + 1).join(" ");
        }
      }

      if (info.bestMove) {
        resolve(info);
        rl.close();
        stockfish.kill();
      }
    });

    stockfish.stdin.write("uci\n");
    stockfish.stdin.write("isready\n");
    stockfish.stdin.write(`position fen ${fen}\n`);
    stockfish.stdin.write(`go depth ${depth} movetime ${movetime}\n`);
  }).catch((error) => {
    console.error("Error in analyzePosition:", error);
    reject(error);
  });
};

module.exports = { analyzePosition };
