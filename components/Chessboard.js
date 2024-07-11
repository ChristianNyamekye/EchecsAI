import React, { useState, useEffect, useCallback, useRef } from "react";
import { Chessboard } from "react-chessboard";
import { move } from "../lib/chess";
import { Chess } from "chess.js";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChessBoard, faRedoAlt, faUndoAlt, faSyncAlt, faSearch } from '@fortawesome/free-solid-svg-icons';
import { RiAiGenerate } from "react-icons/ri";
import { HiSpeakerWave } from "react-icons/hi2";
import { FaRegStopCircle } from "react-icons/fa";

import { FaCirclePlay } from "react-icons/fa6";
import { BsSoundwave } from "react-icons/bs";


import styles from "./ChessboardComponent.module.css";
import floatingLabelStyles from "./FloatingLabelInput.module.css";


import { Container, Box, Button, TextInput, Tooltip, Progress, Text, Group } from "@mantine/core";

import HoverEffect from "./HoverEffect";
import TextGenerateEffect from './TextGenerateEffect';
import Header from './Header.js';

import { showNotification } from '@mantine/notifications';

export function ChessboardComponent() {
  const [position, setPosition] = useState(
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
  );
  const [game, setGame] = useState(new Chess(position));
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [depth, setDepth] = useState();
  const [time, setTime] = useState(5);
  const [bestMove, setBestMove] = useState("");
  const [score, setScore] = useState("");
  const [pv, setPv] = useState("");
  const [isFlipped, setIsFlipped] = useState(false);
  const [history, setHistory] = useState([]);
  const [explanation, setExplanation] = useState("");
  const [explanations, setExplanations] = useState(null);
  // const [typedExplanation, setTypedExplanation] = useState("");
  const [typedExplanations, setTypedExplanations] = useState([]); // Each item is { text: string, speechUrl: string }

  const [showTypedExplanation, setShowTypedExplanation] = useState(false);
  const [speechUrl, setSpeechUrl] = useState("");
  const [example, setExample] = useState(
    "On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain. These cases are perfectly simple and easy to distinguish. In a free hour, when our power of choice is untrammelled and when nothing prevents our being able to do what we like best, every pleasure is to be welcomed and every pain avoided. But in certain circumstances and owing to the claims of duty or the obligations of business it will frequently occur that pleasures have to be repudiated and annoyances accepted. The wise man therefore always holds in these matters to this principle of selection: he rejects pleasures to secure other greater pleasures, or else he endures pains to avoid worse pains."
  );

  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  

  // const [accumulatedData, setAccumulatedData] = useState('');
  
  let accumulatedData = "";

  const audioRef = useRef(null);
  const scrollRef = useRef(null);

  
  const [premove, setPremove] = useState(null);

  useEffect(() => {
    const updatedGame = new Chess(position);
    setGame(updatedGame);
  }, [position]);

  useEffect(() => {
    // Function to scroll to the bottom of the chat
    const scrollToBottom = () => {
      const scroll = scrollRef.current;
      if (scroll) {
        scroll.lastElementChild.scrollIntoView({ behavior: 'smooth' });
      }
    };

    // Call the function to scroll to the bottom smoothly
    scrollToBottom();
  }, [typedExplanations, explanations]);

  const handleCalculate = async () => {
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
      console.log("return1EEd json: ", JSON.stringify(data));
      // setBestMove(data.bestMove);

      if (response.ok) {
        // setBestMove(data.bestMove);
        // setScore(data.score);
        // setDepth(data.depth);
        // setPv(data.pv);
        setBestMove(data.recMove);
        setScore(data.recScore);
        setDepth(data.recDepth);
        setPv(data.recPv);
      } else {
        console.error("Failed to fetch the best move:", data.error);
        showNotification({
          title: "Error",
          message: "Failed to fetch the best move.",
          color: "red",
        });
      }
    } catch (error) {
      console.error("Error during calculation:", error);
      showNotification({
        title: "Network error",
        message: "Could not reach the calculation service.",
        color: "red",
      });
    }
    setIsCalculating(false);
  };

  // todo: working streaming

  const fetchExplanation = async (recommendedMove) => {
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
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Now, handle the streaming data with EventSource
      const eventSource = new EventSource("/api/generate-explanation");
      

      eventSource.onmessage = (event) => {
        setExplanation((prevExplanation) => prevExplanation + event.data);
        // setAccumulatedData(prevData => prevData + event.data);
        // console.log('Received chunk:', event.data);
        accumulatedData += event.data;
        // console.log('Received chunk:', accumulatedData);
        
        // console.log(`EXPLANATION: ${explanation}`);
      };


      eventSource.addEventListener("end", () => {
        try {
          // console.log("Complete accumulated data:", accumulatedData);
           // Check if relevances is an array, if not, treat it as a single element array
          
          const completeJsonData = JSON.parse(accumulatedData);

          const formattedRelevances = Array.isArray(completeJsonData.relevances) ? 
                                      completeJsonData.relevances.join(", ") :
                                      completeJsonData.relevances;

          setExplanations( {
            title: `Recommended Move: ${recommendedMove}`,
            player: completeJsonData.player_to_move,
            implementation: completeJsonData.alternative_implementation,
            relevance: formattedRelevances,
            funFact: completeJsonData.funFact
          });
          // console.log("Explanations:", explanations);

          // setAccumulatedData('');
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
        });
        eventSource.close();
      };

    } catch (error) {
      console.error("Error fetching explanation:", error);
      showNotification({
        title: "Error",
        message: "Failed to fetch explanation.",
        color: "red",
      });
    }
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 1500);
    
  };

  const fetchSpeech = async (index) => {
    try {

      if (index >= typedExplanations.length) {
        console.error("Index out of range");
        return;
      }

      const explanation = typedExplanations[index];
      const combinedText = `The ${explanation.title}. Player to move is: ${explanation.player}. ` +
                          `Others ways to achieve similar results would be: ${explanation.implementation}. ` +
                          `Relevance: ${explanation.relevance}. ` +
                          `Food for thought: ${explanation.funFact}`;
      // console.log("combined text:", combinedText);
      // console.log("typedExplanation text:", typedExplanation);

      const text = typedExplanations[index].text;

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

      // const data = await response.json();
      const newSpeechUrl = data.outputPath;

      // Update the typedExplanations array with the new speech URL
      setTypedExplanations((prev) =>
        prev.map((item, idx) =>
          idx === index ? { ...item, speechUrl: data.url } : item
        )
      );
      // console.log(`${outputPath}, ${data.url}`);
    } catch (error) {
      console.error("Error fetching speech:", error);
    }
  };

  const handlePlayAudio = (url) => {
    // Initialize the audio object only once
    if (!audioRef.current) {
      audioRef.current = new Audio(url);
      audioRef.current.addEventListener('ended', () => setIsPlaying(false));
    } else {
      audioRef.current.src = url;
    }

    // console.log("speechUrl:", url, audioRef.current);

    if (isPlaying) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch((error) => console.error("Error playing the audio file:", error));
      setIsPlaying(true);
    }
  };


  const updateGameFromFen = () => {
    try {
      const newGame = new Chess();
      if (newGame.load(position)) {
        setGame(newGame);
        setPosition(newGame.fen()); // Ensure position is also updated
      } else {
        showNotification({
          title: "Invalid FEN",
          message: "The FEN string provided is invalid.",
          color: "red",
        });
      }
      // 4k2r/6r1/8/8/8/8/3R4/R3K3 w Qk - 0 1

    } catch (error) {
      console.error("Error updating game from FEN:", error);
      showNotification({
        title: "Error",
        message: "Error processing FEN string.",
        color: "red",
      });
    }
  };

  const hoverItems = [
    {
      title: "Rec: ",
      description: bestMove,
      link: "bestmove", // Assuming there's no specific URL to link to
    },
    {
      title: "Score:",
      description: score,
      link: "score", // You can replace "#" with a more relevant link if available
    },
    {
      title: "Depth:",
      description: depth,
      link: "depth", // Replace with actual link if needed
    },
    {
      title: "PV: ",
      description: pv,
      link: "pv", // Use actual links if these should lead somewhere
    },
  ];

  const flipBoard = () => {
    setIsFlipped(!isFlipped); // Toggle the board orientation
  };

  const handleSwitchChange = () => {
    setIsFlipped(game.turn() === "b"); // Flip board to match the current player's turn
  };

  const resetGame = () => {
    const newGame = new Chess();
    setGame(newGame);
    setPosition(newGame.fen());
  };

  const undoMove = () => {
    game.undo();
    setPosition(game.fen()); // Update position after undoing
  };

  const handleMove = (from, to) => {
    try {
      // console.log(`game fen: ${game.fen()} fen:${position} from: ${from}, to: ${to}`);
      const moveResult = game.move({
        from: from,
        to: to,
        promotion: "q", // assuming queen promotion for simplicity
      });
      

      if (moveResult) {
        setPosition(game.fen());
        setSelectedSquare(null); // Clear selection after a successful move
      } else { 
        showNotification({
          title: "Invalid Move",
          message: "That move is not valid. Please try again.",
          color: "red",
        });
      }
    } catch (error) {
      // Handle unexpected errors such as issues with the game.move method or state setting.
      console.error("Failed to execute move:", error);
      showNotification({
        title: "Error",
        message:
          "An error occurred while trying to make the move. Please try again.",
        color: "red",
      });
    }
  };

  const handleTextComplete = (newExplanation) => {
    setTypedExplanations((prev) => [
      ...prev, 
      { 
        title: newExplanation.title,
        player: newExplanation.player,
        implementation: newExplanation.implementation,
        relevance: newExplanation.relevance,
        funFact: newExplanation.funFact,
        speechUrl: "" 
      }
    ]);
    setShowTypedExplanation(true);
    setExplanation(""); // Clear explanation to stop TextGenerateEffect
    setExplanations(null);
  };

  const onSquareClick = (square) => {
    if (selectedSquare) {
      handleMove(selectedSquare, square);
    } else {
      if (game.get(square)) {
        setSelectedSquare(square);
      }
    }
  };

  const onDrop = (selectedSquare, square) => {
    handleMove(selectedSquare, square);
  };

  const initiateFetchSpeech = async (index) => {
    setIsLoading(true);
    await fetchSpeech(index);
    setIsLoading(false);
  };


  const FloatingLabelInput = ({ label, placeholder, value, onChange }) => {
    const [focused, setFocused] = useState(false);
    const floating = String(value).trim().length !== 0 || focused || undefined;

    return (
      <TextInput
        label={label}
        placeholder={placeholder}
        classNames={floatingLabelStyles}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        data-floating={floating}
        mt="md"
        autoComplete="nope"
        labelProps={{ "data-floating": floating }}
      />
    );
  };

  const squareStyles = bestMove ? {
    [bestMove.substring(0, 2)]: { backgroundColor: 'rgba(255, 215, 0, 0.4)' }, // highlight start square
    [bestMove.substring(2, 4)]: { backgroundColor: 'rgb(96 165 250)' } // highlight end square
  } : {};

  const gridItemStyle = {
    border: "0.05px solid #ffffff33",
    borderRadius: "4px",
    padding: "10px",
    width: "100%", // Ensure items fill the flex container
    marginBottom: "16px", // Space between rows
    backgroundColor: "#00dac6",
  };

  const flexContainerStyle = {
    display: "flex",
    flexDirection: "column", // Column for vertical stack, use 'row' for a horizontal stack
    gap: "100px", // Space between flex items
    height: "100%", // Full height
    alignItems: "stretch", // Stretch items to fill the cross-axis
  };

  const flexContainerStyleSmall = {
    display: "flex",
    flexDirection: "column", // Column for vertical stack, use 'row' for a horizontal stack
    gap: "100px", // Space between flex items
    height: "20%",
    alignItems: "stretch", // Stretch items to fill the cross-axis
  };

  const gameAreaStyle = {
    display: "flex",
    // flexDirection: "row",
    alignItems: "start",
    // justifyContent: 'space-between',
    height: "auto",
    gap: "10px",
    margin: "10px 0",
  };

  const boardStyle = {
    border: "0.05px solid #ffffff33",
    borderRadius: "8px",
    padding: "10px",
    marginRight: "10px", // Add some margin between chessboard and menu
    marginBottom: "10px",
  };

  return (
    <div>
      <Header /> 
      <main>
        <Container
          style={{
            // padding: 50,
          }}
          fluid
        >
          {/* <Skeleton
            height="60px"
            radius="md"
            animate={false}
            style={{ marginBottom: "10px" }}
          /> */}

          {/* Four small grids */}
          <Box>
            <div className="flex flex-row items-center justify-start w-62 overflow-x-auto">
              <HoverEffect items={hoverItems} />
            </div>
            <Box
              style={{
                ...flexContainerStyle,
                marginTop: "20px",
                flexDirection: "row",
              }}
            >
              <Box style={{ ...gameAreaStyle, flexDirection: "column" }}>
                <Box style={{ ...boardStyle }}>
                  <Chessboard
                    id="MainChessboard"
                    position={position}
                    boardOrientation={isFlipped ? "black" : "white"}
                    onSquareClick={onSquareClick}
                    onPieceDrop={onDrop}
                    boardWidth="500"
                    customDarkSquareStyle={{ backgroundColor: "#779952" }}
                    customLightSquareStyle={{ backgroundColor: "#edeed1" }}
                    customNotationStyle={{
                      color: "#000",
                      fontWeight: "bold",
                    }}
                    // customArrows={bestMove ? [[bestMove.substring(0, 2), bestMove.substring(2, 4), "rgb(0, 128, 0)"]] : []}
                    customSquareStyles={squareStyles}
                    customBoardStyle={{
                      borderRadius: "8px",
                      boxShadow: "0 5px 15px rgba(0, 0, 0, 0.5 ",
                    }}
                    arePiecesDraggable={true}
                  />
                </Box>

                <Box className={styles.menuStyle}>
                  <div className={styles.buttonRow}>
                    <div className="flex space-x-4">
                      <button
                        className="relative group inline-flex h-12 w-12 items-center justify-center rounded-full border border-slate-800 bg-gradient-to-r from-gray-900 to-gray-700 text-white transition-colors focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-offset-gray-900 focus:ring-[#00dac6]"
                        onClick={updateGameFromFen}
                      >
                        <span className="icon-wrapper group-hover:animate-spin group-hover:text-[#00dac6]">
                          <FontAwesomeIcon icon={faChessBoard} />
                        </span>
                        <span className="absolute bottom-12 left-1/2 transform rounded-md -translate-x-1/2 whitespace-nowrap bg-gray-700 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          Set FEN
                        </span>
                      </button>
                      <button
                        className="relative group inline-flex h-12 w-12 items-center justify-center rounded-full border border-slate-800 bg-gradient-to-r from-gray-900 to-gray-700 text-white transition-colors focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-offset-gray-900 focus:ring-[#00dac6]"
                        onClick={resetGame}
                      >
                        <span className="icon-wrapper group-hover:animate-spin group-hover:text-[#00dac6]">
                          <FontAwesomeIcon icon={faRedoAlt} />
                        </span>
                        <span className="absolute bottom-12 left-1/2 transform rounded-md -translate-x-1/2 whitespace-nowrap bg-gray-700 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          Reset
                        </span>
                      </button>
                      <button
                        className="relative group inline-flex h-12 w-12 items-center justify-center rounded-full border border-slate-800 bg-gradient-to-r from-gray-900 to-gray-700 text-white transition-colors focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-offset-gray-900 focus:ring-[#00dac6]"
                        onClick={undoMove}
                      >
                        <span className="icon-wrapper group-hover:animate-reverse-spin group-hover:text-[#00dac6]">
                          <FontAwesomeIcon icon={faUndoAlt} />
                        </span>
                        <span className="absolute bottom-12 left-1/2 transform rounded-md -translate-x-1/2 whitespace-nowrap bg-gray-700 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          Undo
                        </span>
                      </button>
                      <button
                        className="relative group inline-flex h-12 w-12 items-center justify-center rounded-full border border-slate-800 bg-gradient-to-r from-gray-900 to-gray-700 text-white transition-colors focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-offset-gray-900 focus:ring-[#00dac6]"
                        onClick={flipBoard}
                      >
                        <span className="icon-wrapper group-hover:animate-spin group-hover:text-[#00dac6]">
                          <FontAwesomeIcon icon={faSyncAlt} />
                        </span>
                        <span className="absolute bottom-12 left-1/2 transform rounded-md -translate-x-1/2 whitespace-nowrap bg-gray-700 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          Flip
                        </span>
                      </button>
                    </div>

                    {/* <button
                      className="inline-flex h-10 animate-shimmer items-center justify-center rounded-xl border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#C0C0C0,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-transform transform-gpu  hover:animate-[shimmer_4s_linear_infinite] hover:text-white hover:bg-[linear-gradient(110deg,#000103,45%,#FFD700,55%,#000103)]"
                      onClick={handleCalculate}
                      style={{ marginLeft: "120px" }}
                    >
                      Calculate
                    </button> */}
                    <>
                      <Button
                        className={styles.calculate}
                        onClick={handleCalculate}
                        variant="light"
                        color="1f2937"
                        size="md"
                        radius="lg"
                        width="200px"
                        ml="120px"
                      
                        loading={isCalculating} 
                        loaderProps={{ type: 'dots', color:"black" }}
                      >
                        Calculate
                      </Button>
                    </>
                    {/* <button
                      className="inline-flex h-10  items-center justify-center bg-[#1f2937] text-white px-4 py-2 rounded-xl text-lg font-semibold  hover:animate-[shimmer_4s_linear_infinite] hover:text-[#00dac6] hover:bg-gray-700"
                      onClick={handleCalculate}
                      style={{ marginLeft: "120px" }}
                    >
                      Calculate
                    </button> */}
                  </div>
                </Box>
              </Box>
              <div>
                <Box>
                  <Box>
                    <Group className={styles.inputRow} grow>
                      <Box>
                        <Group className={styles.labelRow}>
                          <FloatingLabelInput
                            label="FEN:"
                            value={position}
                            // onChange={(event) => setPosition(event.target.value)}
                            onChange={(event) => {
                              const fen = event.target.value;
                              setPosition(fen); // This will update the position state
                              updateGameFromFen(fen); // Assuming you have a function to update the game state
                            }}
                          />
                        </Group>
                      </Box>
                      <Box>
                        <Group className={styles.labelRow}>
                          <FloatingLabelInput
                            label="Time: "
                            value={time}
                            onChange={(value) => setTime(event.target.value)}
                          />
                        </Group>
                      </Box>
                      <Box>
                        <Group className={styles.labelRow}>
                          <FloatingLabelInput
                            label="Depth: "
                            value={depth}
                            onChange={(value) => setDepth(event.target.value)}
                          />
                        </Group>
                      </Box>
                    </Group>
                  </Box>
                  <Box
                    ref={scrollRef}
                    style={{
                      ...gridItemStyle,
                      marginTop: "20px",
                      flex: "4 1 0%",
                      height: "455px",
                      display: "flex",
                      flexDirection: "column",
                      backgroundColor: "transparent",
                      borderRadius: "10px",
                      alignItems: "center",
                      overflow: "hidden",
                      overflowY: "auto",
                      padding: "30px",
                    }}
                  >
                    {typedExplanations.map((explanation, index) => (
                      <div
                        key={index}
                        style={{
                          height: "auto",
                          width: "500px",
                          backgroundColor: "#2C3639",
                          borderRadius: "8px",
                          padding: "10px",
                          marginBottom: "20px", // Adds space between cards
                          boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
                          color: "#F5EFE6",
                        }}
                      >
                        <div class="text-white p-5 rounded-lg shadow-lg font-times text-sm bg-gray-800">
                          <span class="text-lg text-blue-400 mb-2 font-semibold">
                            {explanation.title}
                          </span>
                          <div class="text-gray-300 mb-2">
                            <span>Player: </span>
                            <span>{explanation.player}</span>
                          </div>
                          <div class="text-gray-300 mb-2">
                            <span>Alternative Implementation: </span>
                            <span>{explanation.implementation}</span>
                          </div>
                          <div class="text-gray-300 mb-2">
                            <span>Relevance: </span>
                            <span>{explanation.relevance}</span>
                          </div>
                          <div class="text-gray-300 mb-4">
                            <span>Fun Fact: </span>
                            <span>{explanation.funFact}</span>
                          </div>
                        </div>
                        <div
                          style={{
                            position: "relative",
                            marginTop: "10px",
                            bottom: "10px",
                            left: "10px",
                          }}
                        >
                          <Tooltip label="generate sound" position="bottom">
                            <button
                              className="text-red-500 mr-2.5 mt-2.5 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                              onClick={() => initiateFetchSpeech(index)}
                              disabled={isLoading}
                            >
                              {isLoading ? (
                                <div className="animate-spin">
                                  <BsSoundwave />
                                </div>
                              ) : (
                                <BsSoundwave />
                              )}
                            </button>
                          </Tooltip>
                          {explanation.speechUrl && (
                            <Tooltip
                              label={isPlaying ? "Stop" : "Play"}
                              position="bottom"
                            >
                              <button
                                className={`text-${
                                  isPlaying ? "red" : "green"
                                }-900 mt-2.5 hover:text-${
                                  isPlaying ? "red" : "green"
                                }-700 focus:outline-none focus:ring-2 focus:ring-${
                                  isPlaying ? "red" : "green"
                                }-500 focus:ring-opacity-50`}
                                onClick={() =>
                                  handlePlayAudio(explanation.speechUrl)
                                }
                              >
                                {isPlaying ? (
                                  <FaRegStopCircle />
                                ) : (
                                  <HiSpeakerWave />
                                )}
                              </button>
                            </Tooltip>
                          )}
                        </div>
                      </div>
                    ))}
                    <Box
                      style={{
                        height: "auto",
                        width: "500px", // Explicit width
                        backgroundColor: "#2C3639",
                        borderRadius: "8px",
                        padding: "10px",
                        boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
                        marginTop: "20px",
                        color: "#F5EFE6",
                      }}
                    >
                      {isAnalyzing ? (
                        <div className=" shadow-lg rounded-lg p-2 max-w-lg w-full mx-auto  transition-opacity duration-500 ease-in-out opacity-0 animate-fade-in">
                          <div className="animate-pulse flex space-x-4">
                            <div className="flex-1 space-y-2 py-1">
                              <div className="h-3 w-full rounded-md bg-gradient-to-r from-green-400 via-blue-500 to-green-600 rounded"></div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div>
                          {explanations && (
                            <TextGenerateEffect
                              explanation={explanations}
                              onComplete={handleTextComplete}
                            />
                          )}
                        </div>
                      )}
                    </Box>
                  </Box>
                </Box>
                <div className={styles.menuStyle} style={{ width: "600px" }}>
                  <div className="relative  justify-left">
                    <Tooltip label="Analyze best move" position="bottom" withArrow>
                      {/* <button
                        className="relative group inline-flex h-12 w-20 overflow-hidden rounded-full p-[1px] items-left justify-left"
                        onClick={() => fetchExplanation(bestMove)}
                      >
                        <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#284E78_0%,#FFF6E0_50%,#95CD41_100%)]" />
                        <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-[#146356] px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl hover:bg-[#285524] hover:text-[#95CD41] transition-colors duration-300 hover:scale-10 focus:scale-95">
                          <RiAiGenerate />
                        </span>
                      </button> */}
                      <Button
                        className={styles.analyze}
                        onClick={() => fetchExplanation(bestMove)}
                        variant="light"
                        color="1f2937" // Ensure this is a valid color or style this appropriately
                        size="md"
                        radius="lg"
                        style={{ width: '100px' }} // Use inline style or adjust according to your setup
                        loading={isAnalyzing} // This will enable the loading indicator when isCalculating is true
                        loaderProps={{ type: 'dots', color: "black" }} // Customize the loader appearance
                      >
                        <RiAiGenerate />
                      </Button>
                    </Tooltip>
                  </div>
                </div>
              </div>
            </Box>
          </Box>
        </Container>
      </main>
    </div>
  );
}

export default ChessboardComponent;
