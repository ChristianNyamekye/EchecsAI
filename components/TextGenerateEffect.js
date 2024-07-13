import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "../utils/cn"; // Adjust this import based on your project structure

export const TextGenerateEffect = ({
  explanation,
  className,
  cursorClassName,
  onComplete = () => {}, // Default to no-op function
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const [charIndex, setCharIndex] = useState(0);
  const textRef = useRef(explanation);

  // Prepare the content from the explanation object
  const formattedText = `${explanation.title}\nPlayer: ${explanation.player}\n Alternative Implementation: ${explanation.implementation}\nRelevance: ${explanation.relevance}\nFun Fact: ${explanation.funFact}\n Check Mate: ${explanation.movesToMate}`;

  useEffect(() => {
    const typeEffect = () => {
      if (charIndex < formattedText.length) {
        setDisplayedText((prev) => prev + formattedText[charIndex]);
        setCharIndex((prev) => prev + 1);
      } else {
        onComplete(explanation); // Call the onComplete callback when done
      }
    };

    const intervalId = setInterval(typeEffect, 20); // Adjust typing speed here

    return () => clearInterval(intervalId); // Clean up interval on component unmount
  }, [charIndex, formattedText, onComplete]);

  useEffect(() => {
    if (textRef.current !== explanation) {
      textRef.current = explanation;
      setCharIndex(0);
      setDisplayedText("");
    }
  }, [explanation]);

  const parts = displayedText.split("\n");

  return (
    <div className=" text-white p-5 rounded-lg shadow-lg font-times text-sm bg-gray-800">
      {parts.map((part, index) => (
        <div key={index} className="mb-2">
          <motion.span
            className={index === 0 ? "text-lg text-blue-400 font-semibold"  : "text-gray-300"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {part}
          </motion.span>
        </div>
      ))}
    </div>
  );
};

export default TextGenerateEffect;
