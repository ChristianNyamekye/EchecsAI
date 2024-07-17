
// export default LandingPage;
import React, { useState, useEffect, useCallback, useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChessBoard, faRedoAlt, faUndoAlt, faSyncAlt, faSearch } from '@fortawesome/free-solid-svg-icons';
import styles from "/components/ChessboardComponent.module.css";
import TextGenerateEffect from '/components/TextGenerateEffect';
import UploadForm from '/components/UploadForm';

import {
  Container,
  Box,
  Button,
  TextInput,
  Tooltip,
  Radio,
  RadioGroup,
  Group,
  Switch,
} from "@mantine/core";
import 'tailwindcss/tailwind.css';
import { showNotification } from '@mantine/notifications';


import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";

import 'tailwindcss/tailwind.css';
import { RiAiGenerate } from "react-icons/ri";
import { HiSpeakerWave } from "react-icons/hi2";
import { FaRegStopCircle } from "react-icons/fa";

import { FaCirclePlay } from "react-icons/fa6";
import { BsSoundwave } from "react-icons/bs";


import {
  handleCalculate,
  fetchExplanation,
  handlePlayAudio,
  handleFenChange,
  flipBoard,
  handleDifficultyChange,
  resetGame,
  undoMove,
  togglePlayerToMove,
  handleMove,
  handleTextComplete,
  onSquareClick,
  onDrop,
  initiateFetchSpeech,
} from './chessUtils';



const ChessGame = () => {
  const [game, setGame] = useState(new Chess());
  const [position, setPosition] = useState(game.fen());
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [depth, setDepth] = useState("");
  const [time, setTime] = useState("");
  const [bestMove, setBestMove] = useState("");
  const [score, setScore] = useState("");
  const [pv, setPv] = useState("");
  const [movesToMate, setMovesToMate] = useState("0");
  const [isFlipped, setIsFlipped] = useState(false);
  const [history, setHistory] = useState([]);
  const [explanation, setExplanation] = useState("");
  const [explanations, setExplanations] = useState(null);
  // const [typedExplanation, setTypedExplanation] = useState("");
  const [typedExplanations, setTypedExplanations] = useState([]); // Each item is { text: string, speechUrl: string }

  const [playerToMove, setPlayerToMove] = useState("w");
  const [showTypedExplanation, setShowTypedExplanation] = useState(false);
  const [speechUrl, setSpeechUrl] = useState("");

  const [example, setExample] = useState(
    "On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain. These cases are perfectly simple and easy to distinguish. In a free hour, when our power of choice is untrammelled and when nothing prevents our being able to do what we like best, every pleasure is to be welcomed and every pain avoided. But in certain circumstances and owing to the claims of duty or the obligations of business it will frequently occur that pleasures have to be repudiated and annoyances accepted. The wise man therefore always holds in these matters to this principle of selection: he rejects pleasures to secure other greater pleasures, or else he endures pains to avoid worse pains."
  );

  const [checked, setChecked] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [difficulty, setDifficulty] = useState('default');
  const eliminatedPieces = ['pawn', 'knight', 'bishop'];

  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);

  // const [accumulatedData, setAccumulatedData] = useState('');
  const [stockfishLevel, setStockfishLevel] = useState(0);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [screenshotFen, setScreenshotFen] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  let accumulatedData = "";



  const audioRef = useRef(null);
  const scrollRef = useRef(null);
  const chessboardRef = useRef(null);

  const [premove, setPremove] = useState(null);

  // useEffect(() => {
  //   if (position) {
  //     try {
  //       console.log(`${(position)}`);
  //       const updatedGame = new Chess(position);
  //       setGame(updatedGame);
  //     } catch (error) {
  //       showNotification({
  //         title: 'Invalid FEN',
  //         message: 'The FEN provided is invalid. Please provide a valid FEN string.',
  //         color: 'red',
  //       });
  //       setGame(new Chess()); // Reset to a default game if FEN is invalid
  //     }
  //   }
  // }, [position]);

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


  // Reset the game state when difficulty changes
  useEffect(() => {
    setGame(new Chess());
    setPosition(game.fen());
    resetGame(setGame, setPosition);
    setSelectedSquare(null);
    setBestMove("");
    setScore("");
    setPv("");
    setMovesToMate("0");
    setPlayerToMove("w");
    setShowTypedExplanation(false);
    setChecked(false);
    setDropdownOpen(false);
    setStockfishLevel(levels[difficulty]);
    setIsCalculating(false);
    chessboardRef.current?.clearPremoves();
  }, [difficulty]);

  const hoverItems = [
    {
      title: "Best Move: ",
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

  const difficulties = [
    { label: 'Default', value: 'default' },
    { label: 'Easy', value: 'easy' },
    { label: 'Medium', value: 'medium' },
    { label: 'Hard', value: 'hard' },
    { label: 'Stockfish', value: 'stockfish' },
  ];

  const levels = {
    default: 0,  // Assuming default is 0, no evaluation
    easy: 2,
    medium: 8,
    hard: 18,
    stockfish: 18, // Assuming the highest level for Stockfish
  };

  const squareStyles = bestMove ? {
    [bestMove.substring(0, 2)]: { backgroundColor: 'rgba(255, 215, 0, 0.4)' }, // highlight start square
    [bestMove.substring(2, 4)]: { backgroundColor: 'rgb(96 165 250)' } // highlight end square
  } : {};

  const handleMoveWrapper = async (from, to, piece) => {
    await handleMove(
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
    );
  };

   const safeGameMutate = (modify) => {
     setGame((g) => {
       const update = { ...g };
       modify(update);
       return update;
     });
   };

  const handleSquareClick = async (square) => {
    if (selectedSquare) {
      await handleMoveWrapper( selectedSquare, square, "q");
      setSelectedSquare(null);
    } else {
      if (game.get(square)) {
        setSelectedSquare(square);
      }
    }
  };

  const onDropIntegrated = async (sourceSquare, targetSquare, piece) => {
    await handleMoveWrapper(sourceSquare, targetSquare, piece);
  };

  const handleUpload = (data) => {
    
    setUploadedFile(data.imageUrl);
    setScreenshotFen(data.fen);
    console.log("Uploaded File URL:", uploadedFile);
    console.log(`screenshot fen: ${screenshotFen}`);
  };

  const handleCopy = async () => {
      try {
          await navigator.clipboard.writeText(screenshotFen);
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2000); // Reset icon after 2 seconds
      } catch (err) {
          console.error('Failed to copy text: ', err);
      }
  };

  return (
    <div className="h-screen w-screen bg-gray-900 text-white flex flex-col">
      <header className="bg-gray-800 py-3 h-[60px] px-4 flex justify-between items-center shadow-lg">
        <div className="flex ml-10 mt-5 items-center space-x-4">
          {/* Difficulty buttons */}
          {/* {difficulties.map((level) => (
            <button
              key={level.value}
              className={`px-4 py-1 rounded-lg ${
                difficulty === level.value ? 'bg-[#779952]' : 'bg-gray-600'
              } text-white hover:bg-[#779952] transition`}
              onClick={() => setDifficulty(level.value)}
            >
              {level.label}
            </button>
          ))} */}
          {difficulties.map((level) => (
            <button
              key={level.value}
              className={`px-4 py-1 rounded-lg ${
                difficulty === level.value ? "bg-[#779952]" : "bg-gray-600"
              } text-white hover:bg-[#779952] transition`}
              onClick={() =>
                handleDifficultyChange(
                  level.value,
                  setDifficulty,
                  setStockfishLevel,
                  levels
                )
              }
            >
              {level.label}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-1">
          <a href="/" className="flex items-center">
            <img
              src="/images/echecsai.png"
              alt="EchecsAI Logo"
              className="h-[200px] w-[180px] mr-[350px]"
            />
            {/* <span className="text-xl font-semibold text-white">EchecsAI</span> */}
          </a>
        </div>
        <div className="flex items-center space-x-4 relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="text-white focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 12l2-2m0 0l7-7 7 7m-7 7v11m0-11l-7 7m14-7l-7 7"
              ></path>
            </svg>
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-20">
              <a
                href="/profile"
                className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
              >
                Profile
              </a>
              <a
                href="/settings"
                className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
              >
                Settings
              </a>
              <a
                href="/logout"
                className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
              >
                Logout
              </a>
            </div>
          )}
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-col space-y-4 p-4 w-2/ bg-gray-800 border-r border-gray-700 overflow-hidden">
          {/* Chessboard Container */}

          <div className="bg-gray-900 p-4 rounded-lg shadow-lg flex-1 ">
            <Chessboard
              id="Configurable Board"
              arePremovesAllowed={true}
              position={position}
              boardOrientation={isFlipped ? "black" : "white"}
              // onSquareClick={(square) => onSquareClick(square, selectedSquare, setSelectedSquare, game, setPosition)}
              // onPieceDrop={(square, selectedSquare) => onDrop(game, square, selectedSquare, setPosition, setSelectedSquare, piece)}
              onSquareClick={handleSquareClick}
              onPieceDrop={onDropIntegrated}
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
          </div>

          {/* Control Bar */}

          <div className="bg-gray-900 w-15 p-4 rounded-lg shadow-lg overflow-y-auto h-1/4">
            <div className="text-sm flex space-x-1  mb-4">
              <input
                type="text"
                className="bg-gray-700 text-white p-1 rounded-lg focus:outline-none"
                placeholder="FEN"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
              />
              <input
                type="text"
                className="bg-gray-700 text-white p-1 rounded-lg focus:outline-none"
                placeholder="Time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
              <input
                type="text"
                className="bg-gray-700 text-white p-1 rounded-lg focus:outline-none"
                placeholder="Depth"
                value={depth}
                onChange={(e) => setDepth(e.target.value)}
              />
            </div>
            <div className="flex flex-row">
              <div className="flex flex-row gap-1">
                <button
                  className="relative group inline-flex h-12 w-12 items-center justify-center rounded-full border border-slate-800 bg-gradient-to-r from-gray-900 to-gray-700 text-white transition-colors focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-offset-gray-900 focus:ring-[#00dac6]"
                  onClick={() => {
                    handleFenChange(null, position, setGame, setPosition);
                  }}
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
                  onClick={() => {
                    resetGame(setGame, setPosition);
                    chessboardRef.current?.clearPremoves();
                  }}
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
                  onClick={() => {
                    undoMove(game, setPosition);
                    chessboardRef.current?.clearPremoves();
                  }}
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
                  onClick={() => flipBoard(setIsFlipped, isFlipped)}
                  // onClick={flipBoard}
                >
                  <span className="icon-wrapper group-hover:animate-spin group-hover:text-[#00dac6]">
                    <FontAwesomeIcon icon={faSyncAlt} />
                  </span>
                  <span className="absolute bottom-12 left-1/2 transform rounded-md -translate-x-1/2 whitespace-nowrap bg-gray-700 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    Flip
                  </span>
                </button>
                <div className="relative group">
                  <Switch
                    checked={checked}
                    onChange={(event) =>
                      togglePlayerToMove(
                        event,
                        checked,
                        setChecked,
                        position,
                        setPosition,
                        setPlayerToMove
                      )
                    }
                    color="#1f2937"
                    size="xl"
                    style={{
                      marginTop: "6px",
                      marginLeft: "30px",
                      cursor: "pointer",
                    }}
                  />
                  {/* </Switch> */}
                  <span className="absolute bottom left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-gray-700 text-white text-xs py-1 px-2 rounded rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                    Toggle black/white to move
                  </span>
                </div>
              </div>
              <>
                <Button
                  className={styles.calculate}
                  onClick={() =>
                    handleCalculate(
                      position,
                      depth,
                      time,
                      setIsCalculating,
                      setBestMove,
                      setScore,
                      setDepth,
                      setPv,
                      setMovesToMate
                    )
                  }
                  variant="light"
                  color="1f2937"
                  size="md"
                  radius="lg"
                  width="200px"
                  ml="60px"
                  loading={isCalculating}
                  loaderProps={{ type: "dots", color: "black" }}
                >
                  Calculate
                </Button>
              </>
            </div>
          </div>
        </div>

        {/* Analysis Area  */}

        <div className="flex-1 flex flex-col p-4 space-y-2">
          <div className="relative flex flex-1 items-center flex-row space-x-4">
            <Box
              ref={scrollRef}
              className="mt-5 flex-4 flex-col bg-transparent items-center rounded-xl overflow-hidden overflow-y-auto p-6 h-[455px]"
              style={{ border: "0.05px solid #ffffff33" }}
            >
              {typedExplanations.map((explanation, index) => (
                <div
                  key={index}
                  className="relative h-auto w-[500px] bg-gray-800 items-center rounded-xl p-4 mb-5 shadow-lg text-white"
                >
                  <div className="text-white p-5 rounded-lg shadow-lg font-times text-sm bg-gray-800">
                    <span className="text-lg text-blue-400 mb-2 font-semibold">
                      {explanation.title}
                    </span>
                    <div className="text-gray-300 mb-2">
                      <span>Player: </span>
                      <span>{explanation.player}</span>
                    </div>
                    <div className="text-gray-300 mb-2">
                      <span>Alternative Implementation: </span>
                      <span>{explanation.implementation}</span>
                    </div>
                    <div className="text-gray-300 mb-2">
                      <span>Relevance: </span>
                      <span>{explanation.relevance}</span>
                    </div>
                    <div className="text-gray-300 mb-4">
                      <span>Fun Fact: </span>
                      <span>{explanation.funFact}</span>
                    </div>
                    <div className="text-gray-300 mb-4">
                      <span>Check Mate: </span>
                      <span>{explanation.movesToMate}</span>
                    </div>
                  </div>
                  <div className="relative mt-2.5 ml-2.5">
                    <Tooltip label="generate sound" position="bottom">
                      <button
                        className="text-red-500 mr-2.5 mt-2.5 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                        onClick={() =>
                          initiateFetchSpeech(
                            index,
                            setIsLoading,
                            typedExplanations,
                            setTypedExplanations
                          )
                        }
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
                            handlePlayAudio(
                              explanation.speechUrl,
                              audioRef,
                              isPlaying,
                              setIsPlaying
                            )
                          }
                        >
                          {isPlaying ? <FaRegStopCircle /> : <HiSpeakerWave />}
                        </button>
                      </Tooltip>
                    )}
                  </div>
                </div>
              ))}
              <Box className="h-auto w-[500px] bg-gray-800 rounded-xl p-4 shadow-lg mt-15 text-white">
                {isAnalyzing ? (
                  <div className="shadow-lg rounded-lg p-2 max-w-lg w-full mx-auto transition-opacity duration-500 ease-in-out opacity-0 animate-fade-in">
                    <div className="animate-pulse flex space-x-4">
                      <div className="flex-1 space-y-2 py-1">
                        <div className="h-3 w-full rounded-md bg-gradient-to-r from-green-400 via-blue-500 to-green-600"></div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    {explanations && (
                      <TextGenerateEffect
                        explanation={explanations}
                        onComplete={(newExplanation) =>
                          handleTextComplete(
                            newExplanation,
                            setTypedExplanations,
                            setShowTypedExplanation,
                            setExplanation,
                            setExplanations
                          )
                        }
                      />
                    )}
                  </div>
                )}
              </Box>
            </Box>
            <div className="relative flex-row">
              <div className="relative flex-col flex-1 items-center justify-center space-y-4 h-[380px] w-[280px] overflow-y-auto border border-radius-md border-white border-opacity-20 rounded-lg">
                  <h1 className="text-lg mt-6 font-bold text-white-800">
                      Image to FEN
                  </h1>
                  <div className="flex flex-col items-center space-y-2">
                      <UploadForm onUpload={handleUpload} />
                  </div>
                  {uploadedFile && (
                      <div className="flex flex-col items-center">
                          {screenshotFen && (
                            <div className="relative bg-gray-100 rounded-lg shadow flex items-center space-x-2 w-[250px] h-8 overflow-hidden overflow-x-auto">
                              <p className="text-sm md:text-md text-gray-800 whitespace-nowrap px-2">
                                  FEN: <span className="font-semibold text-blue-600 hover:text-blue-800 transition-colors duration-300 cursor-pointer">{screenshotFen}</span>
                              </p>
                              <button
                                  onClick={handleCopy}
                                  className="p-2 rounded-full hover:bg-gray-200 transition-colors duration-300"
                                  title="Copy FEN"
                              >
                                  {isCopied ? (
                                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="green" className="w-6 h-6">
                                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-11.293a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L8 11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                      </svg>
                                  ) : (
                                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="black" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15.75h7.5m-7.5-4.5h7.5m-7.5-4.5h7.5M6 21a3 3 0 003-3V6a3 3 0 00-3-3H3a3 3 0 00-3 3v12a3 3 0 003 3h3zm9-18a3 3 0 013 3v12a3 3 0 01-3 3h-3a3 3 0 01-3-3V6a3 3 0 013-3h3z" />
                                    </svg>
                                  )}
                              </button>
                            </div>
                          )}
                      </div>
                    )
                  }
              </div>
              <div className={" flex mt-[15px] bottom-[-30px] right-[100px]"}>
                <Tooltip label="Analyze best move" position="bottom" withArrow>
                  <Button
                    // className="bg-gray-700 text-white p-2 rounded-lg focus:outline-none"
                    className={styles.analyze}
                    onClick={() =>
                      fetchExplanation(
                        position,
                        history,
                        pv,
                        bestMove,
                        movesToMate,
                        setIsAnalyzing,
                        setExplanation,
                        setExplanations,
                        accumulatedData
                      )
                    }
                    variant="light"
                    color="1f2937"
                    size="md"
                    // mt="20"
                    radius="lg"
                    style={{ width: "100px" }}
                    loading={isAnalyzing}
                    loaderProps={{ type: "dots", color: "black" }}
                  >
                    <RiAiGenerate />
                  </Button>
                </Tooltip>
                <Tooltip label="Analyze best move" position="bottom" withArrow>
                  <Button
                    className={styles.analyze}
                    onClick={() => fetchExplanation(bestMove)}
                    variant="light"
                    color="1f2937"
                    size="md"
                    ml="80"
                    radius="lg"
                    style={{ width: "100px" }}
                    loading={isAnalyzing}
                    loaderProps={{ type: "dots", color: "black" }}
                  >
                    <RiAiGenerate />
                  </Button>
                </Tooltip>
              </div>
            </div>
          </div>
          <div className="flex flex-1 items-center space-x-6 h-[50px] border border-radius-md border-white border-opacity-20 rounded-lg">
            <div className="bg-gray-800 ml-[20px] p-6 rounded-lg shadow-md  w-[580px] h-[180px] flex flex-col justify-center ">
              {/* <div className="text-2xl font-semibold mb-4 text-white">Engine Suggestion</div> */}
              <div className="space-y-3">
                {hoverItems.map((item, index) => (
                  <div
                    key={index}
                    className="bg-gray-700 p-2 h-[30px] rounded-lg shadow-md transform transition duration-300 hover:scale-105 overflow-x-auto"
                  >
                    <div className="text-white text-md">
                      <span className="font-bold">{item.title}</span>
                      <span className="ml-2">{item.description}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-md w-[190px] h-[180px] flex items-center justify-center">
              {/* <Chessboard
                position={position}
                // onDrop={(move) => handleMove(move)}
                boardWidth="150"
              /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChessGame;
