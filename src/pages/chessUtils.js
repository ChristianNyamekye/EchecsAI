// chessUtils.js
import { showNotification } from '@mantine/notifications';
import { Notification } from '@mantine/core';
import { Chess } from "chess.js";


// export const handleCalculate = async (
//   position,
//   depth,
//   time,
//   setIsCalculating,
//   setBestMove,
//   setScore,
//   setDepth,
//   setPv,
//   setMovesToMate,
// ) => {
//   // Placeholder for calculation logic
//   try {
//     console.log("Calculating best move...");
//     setIsCalculating(true);
//     const response = await fetch("/api/best-move", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         fen: position,
//         depth: depth,
//         time: time,
//       }),
//     });

//     const data = await response.json();

//     if (response.ok) {
//       setBestMove(data.recMove);
//       setScore(data.recScore);
//       setDepth(data.recDepth);
//       setPv(data.recPv);
//       setMovesToMate(data.recMovesToMate);
//     } else {
//       console.error("Failed to fetch the best move:", data.error);
//       showNotification({
//       title: "Error",
//         message: "Failed to fetch the best move.",
//       color: "red",
//       autoClose: 3000,
//       style: { backgroundColor: '#1f2937', color:'white' },
//       });
//     }
//   } catch (error) {
//     console.error("Error during calculation:", error);
//     showNotification({
//       title: "Network error",
//       message: "Could not reach the calculation service.",
//       color: "red",
//       autoClose: 3000,
//       style: { backgroundColor: '#1f2937', color:'white' },
//       });

//   }
//   setIsCalculating(false);
// };

export const fetchExplanation = async (
  position,
  history,
  pv,
  recommendedMove,
  movesToMate,
  setIsAnalyzing,
  setExplanation,
  setExplanations,
  accumulatedData,
) => {
  try {
    // First, initiate the POST request to send necessary data
    setIsAnalyzing(true);
    console.log(`Analyzing...`);
    const response = await fetch("/api/generate-explanation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fen: position,
        history: history,
        pv: pv,
        recommendedMove: recommendedMove,
        movesToMate: movesToMate,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Now, handle the streaming data with EventSource
    const eventSource = new EventSource("/api/generate-explanation");

    eventSource.onmessage = (event) => {
      setExplanation((prevExplanation) => prevExplanation + event.data);
      accumulatedData += event.data;
    };

    eventSource.addEventListener("end", () => {
      try {
        const completeJsonData = JSON.parse(accumulatedData);

        const formattedRelevances = Array.isArray(completeJsonData.relevances)
          ? completeJsonData.relevances.join(", ")
          : completeJsonData.relevances;

        setExplanations({
          title: `Recommended Move: ${recommendedMove}`,
          player: completeJsonData.player_to_move,
          implementation: completeJsonData.alternative_implementation,
          relevance: formattedRelevances,
          funFact: completeJsonData.funFact,
          movesToMate: completeJsonData.movesToMate,
        });

        accumulatedData = "";
      } catch (parseError) {
        console.error("Error parsing explanation data:", parseError);
      }
      eventSource.close();
    });

    eventSource.onerror = (error) => {
      console.error("Error fetching explanation:", error);
      showNotification({
      title: "Error",
        message: "Failed to fetch explanation.",
      color: "red",
      autoClose: 3000,
      style: { backgroundColor: '#1f2937', color:'white' },
      });
      eventSource.close();
    };
  } catch (error) {
    console.error("Error fetching explanation:", error);
    showNotification({
      title: "Error",
      message: "Failed to fetch explanation.",
      color: "red",
      autoClose: 3000,
      style: { backgroundColor: '#1f2937', color:'white' },
      });
  }
  setTimeout(() => {
    setIsAnalyzing(false);
  }, 1500);
};

export const fetchSpeech = async (
  index,
  typedExplanations,
  setTypedExplanations
) => {
  try {
    if (index >= typedExplanations.length) {
      console.error("Index out of range");
      return;
    }

    const explanation = typedExplanations[index];
    const combinedText =
      `The ${explanation.title}. Player to move is: ${explanation.player}. ` +
      `The sequence of moves that would be best for both sides include: ${explanation.implementation}. ` +
      `Relevance: ${explanation.relevance}. ` +
      `Food for thought: ${explanation.funFact}` +
      `Mate: ${explanation.movesToMate}. `;

    const response = await fetch("/api/generate-speech", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ combinedText }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    const newSpeechUrl = data.outputPath;

    setTypedExplanations((prev) =>
      prev.map((item, idx) =>
        idx === index ? { ...item, speechUrl: data.url } : item
      )
    );
  } catch (error) {
    console.error("Error fetching speech:", error);
  }
};

export const handlePlayAudio = (url, audioRef, isPlaying, setIsPlaying) => {
  // Initialize the audio object only once
  if (!audioRef.current) {
    audioRef.current = new Audio(url);
    audioRef.current.addEventListener("ended", () => setIsPlaying(false));
  } else {
    audioRef.current.src = url;
  }

  if (isPlaying) {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
  } else {
    audioRef.current
      .play()
      .catch((error) => console.error("Error playing the audio file:", error));
    setIsPlaying(true);
  }
};

export const updateGameFromFen = (
  fen,
  setGame,
  setPosition,
) => {
  try {
    const fields = fen.split(" ");
    while (fields.length < 6) {
      fields.push("1");
    }

    if (fields.length === 6) {
      if (!["w", "b"].includes(fields[1])) {
        fields[1] = "w";
      }
      if (!/^[KQkq-]+$/.test(fields[2])) {
        fields[2] = "-";
      }
      if (!/^(-|[a-h][36])$/.test(fields[3])) {
        fields[3] = "-";
      }
      if (!/^\d+$/.test(fields[4])) {
        fields[4] = "0";
      }
      if (!/^\d+$/.test(fields[5])) {
        fields[5] = "1";
      }
    }

    fen = fields.join(" ");

    const newGame = new Chess(fen);
    setPosition(newGame.fen());
    setGame(newGame);
  } catch (error) {
    showNotification({
      title: "Invalid FEN",
      message: "The FEN notation provided is invalid. Please provide a valid FEN string.",
      color: "red",
      autoClose: 3000,
      style: { backgroundColor: '#1f2937', color: 'white' },
    });
  }
};

export const handleFenChange = (event, fen, setGame, setPosition) => {
  fen = fen.trim();
  updateGameFromFen(fen, setGame, setPosition);
};



export const flipBoard = (setIsFlipped, isFlipped) => {
  setIsFlipped(!isFlipped); // Toggle the board orientation
};

const handleSwitchChange = () => {
  setIsFlipped(game.turn() === "b"); // Flip board to match the current player's turn
};

export const resetGame = (setGame, setPosition) => {
  const newGame = new Chess();
  setGame(newGame);
  setPosition(newGame.fen());
};

export const undoMove = (game, setPosition) => {
  const history = game.history();
  game.undo();
  setPosition(game.fen()); // Update position after undoing
};

// export const handleMove = (game, from, to, setPosition, setSelectedSquare) => {
//   try {
//     const moveResult = game.move({
//       from: from,
//       to: to,
//       promotion: "q",
//     });

//     if (moveResult) {
//       setPosition(game.fen());
//       setSelectedSquare(null);
//     } else {
//       showNotification({
//         title: "Invalid Move",
//         message: "That move is not valid. Please try again.",
//         color: "red",
//         autoClose: 3000,
//         style: { backgroundColor: '#1f2937', color: 'white' },
//       });
//     }
//   } catch (error) {
//     console.error("Failed to execute move:", error);
//     showNotification({
//       title: "Error",
//       message: "An error occurred while trying to make the move. Please try again.",
//       color: "red",
//       autoClose: 3000,
//       style: { backgroundColor: '#1f2937', color: 'white' },
//     });
//   }
// };



export const handleTextComplete = (newExplanation, setTypedExplanations, setShowTypedExplanation, setExplanation, setExplanations) => {
  setTypedExplanations((prev) => [
    ...prev,
    {
      title: newExplanation.title,
      player: newExplanation.player,
      implementation: newExplanation.implementation,
      relevance: newExplanation.relevance,
      funFact: newExplanation.funFact,
      movesToMate: newExplanation.movesToMate,
      speechUrl: "",
    },
  ]);
  setShowTypedExplanation(true);
  setExplanation(""); // Clear explanation to stop TextGenerateEffect
  setExplanations(null);
};

// export const onSquareClick = (square, selectedSquare, setSelectedSquare, game, setPosition) => {
//   if (selectedSquare) {
//     handleMove(game, selectedSquare, square, setPosition, setSelectedSquare);
//   } else {
//     if (game.get(square)) {
//       setSelectedSquare(square);
//     }
//   }
// };


// export const onDrop = (game, sourceSquare, targetSquare, setPosition, setSelectedSquare) => {
//   handleMove(game, sourceSquare, targetSquare, setPosition, setSelectedSquare);
// };



export const initiateFetchSpeech = async (index, setIsLoading, typedExplanations, setTypedExplanations) => {
  setIsLoading(true);
  await fetchSpeech(index, typedExplanations, setTypedExplanations);
  setIsLoading(false);
};



export const togglePlayerToMove = (event, checked, setChecked, position, setPosition, setPlayerToMove) => {
  const isChecked = event.currentTarget.checked;
  setChecked(isChecked);
  const newPlayerToMove = isChecked ? 'b' : 'w';
  setPlayerToMove(newPlayerToMove);

  const fields = position.split(" ");
  if (fields.length >= 2) {
    fields[1] = newPlayerToMove;
    const updatedFen = fields.join(" ");
    setPosition(updatedFen);
  }
};



/////////////////////////////
//////////////////////////////
////////////////////////////




export const onSquareClick = (square, selectedSquare, setSelectedSquare, game, setPosition) => {
  if (selectedSquare) {
    handleMove(game, selectedSquare, square, setPosition, setSelectedSquare);
  } else {
    if (game.get(square)) {
      setSelectedSquare(square);
    }
  }
};


export const onDrop = async (game, sourceSquare, targetSquare, setPosition, setSelectedSquare, piece) => {
  handleMove(game, sourceSquare, targetSquare, setPosition, setSelectedSquare);
};

export const handleDifficultyChange = (value, setDifficulty, setStockfishLevel, levels) => {
  setDifficulty(value);
  setStockfishLevel(levels[value]);
};


  export const handleMove = async (
    game,
    from,
    to,
    piece,
    setPosition,
    setSelectedSquare,
    difficulty,
    stockfishLevel,
    time,
    setIsCalculating,
    setBestMove,
    setScore,
    setDepth,
    setPv,
    setMovesToMate
  ) => {
    try {

      const moveResult = game.move({
        from: from,
        to: to,
        promotion: "q",
      });

      if (moveResult) {
        setPosition(game.fen());
        setSelectedSquare(null);
        // if (game.game_over() || game.in_draw()) return false;

        if (difficulty !== 'default') {
        // Call handleCalculate directly if difficulty is not 'default'
          const bestMove = await handleCalculate(
            game.fen(),
            stockfishLevel, // Use stockfishLevel for depth
            time,
            setIsCalculating,
            setBestMove,
            setScore,
            setDepth,
            setPv,
            setMovesToMate
          );
          if (bestMove) {
            game.move({
              from: bestMove.substring(0, 2),
              to: bestMove.substring(2, 4),
              promotion: bestMove.substring(4, 5),
            });
            setPosition(game.fen());
          }
        }

      } else {
        showNotification({
          title: "Invalid Move",
          message: "That move is not valid. Please try again.",
          color: "red",
          autoClose: 3000,
          style: { backgroundColor: '#1f2937', color: 'white' },
        });
      }

    } catch (error) {
      console.error("Failed to execute move:", error);
      showNotification({
        title: "Error",
        message: "An error occurred while trying to make the move. Please try again.",
        color: "red",
        autoClose: 3000,
        style: { backgroundColor: '#1f2937', color: 'white' },
      });
    }
  };

  export const handleCalculate = async (
  position,
  depth,
  time,
  setIsCalculating,
  setBestMove,
  setScore,
  setDepth,
  setPv,
  setMovesToMate,
) => {
  // Placeholder for calculation logic
  try {
    console.log("Calculating best move...");
    setIsCalculating(true);
    const response = await fetch("/api/best-move", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fen: position,
        depth: depth,
        time: time,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      setBestMove(data.recMove);
      setScore(data.recScore);
      setDepth(data.recDepth);
      setPv(data.recPv);
      setMovesToMate(data.recMovesToMate);
      return data.recMove;
    } else {
      console.error("Failed to fetch the best move:", data.error);
      showNotification({
      title: "Error",
        message: "Failed to fetch the best move.",
      color: "red",
      autoClose: 3000,
      style: { backgroundColor: '#1f2937', color:'white' },
      });
    }
  } catch (error) {
    console.error("Error during calculation:", error);
    showNotification({
      title: "Network error",
      message: "Could not reach the calculation service.",
      color: "red",
      autoClose: 3000,
      style: { backgroundColor: '#1f2937', color:'white' },
      });

  }
  setIsCalculating(false);
};