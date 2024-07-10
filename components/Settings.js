// import { useState } from "react";

// const Settings = ({ calculateBestMove }) => {
//   const [activeColor, setActiveColor] = useState("black");
//   const [castlingAvailability, setCastlingAvailability] = useState({
//     whiteKingside: false,
//     whiteQueenside: false,
//     blackKingside: false,
//     blackQueenside: false,
//   });

//   const handleCastlingChange = (e) => {
//     setCastlingAvailability({
//       ...castlingAvailability,
//       [e.target.name]: e.target.checked,
//     });
//   };

//   return (
//     <div className="bg-gray-900 text-white p-4 rounded-lg shadow-md">
//       <h2 className="text-xl font-semibold mb-4">Settings</h2>
//       <div className="mb-4">
//         <label className="block mb-2">Active Color</label>
//         <div className="flex items-center">
//           <input
//             type="radio"
//             name="activeColor"
//             value="white"
//             checked={activeColor === "white"}
//             onChange={() => setActiveColor("white")}
//             className="mr-2"
//           />
//           <label className="mr-4">White to move</label>
//           <input
//             type="radio"
//             name="activeColor"
//             value="black"
//             checked={activeColor === "black"}
//             onChange={() => setActiveColor("black")}
//             className="mr-2"
//           />
//           <label>Black to move</label>
//         </div>
//       </div>
//       <div className="mb-4">
//         <label className="block mb-2">Castling Availability</label>
//         <div className="flex flex-wrap items-center">
//           <input
//             type="checkbox"
//             name="whiteKingside"
//             checked={castlingAvailability.whiteKingside}
//             onChange={handleCastlingChange}
//             className="mr-2"
//           />
//           <label className="mr-4">White/kingside</label>
//           <input
//             type="checkbox"
//             name="whiteQueenside"
//             checked={castlingAvailability.whiteQueenside}
//             onChange={handleCastlingChange}
//             className="mr-2"
//           />
//           <label className="mr-4">White/queenside</label>
//           <input
//             type="checkbox"
//             name="blackKingside"
//             checked={castlingAvailability.blackKingside}
//             onChange={handleCastlingChange}
//             className="mr-2"
//           />
//           <label className="mr-4">Black/kingside</label>
//           <input
//             type="checkbox"
//             name="blackQueenside"
//             checked={castlingAvailability.blackQueenside}
//             onChange={handleCastlingChange}
//             className="mr-2"
//           />
//           <label>Black/queenside</label>
//         </div>
//       </div>
//       <button
//         onClick={calculateBestMove}
//         className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
//       >
//         Calculate Next Move
//       </button>
//     </div>
//   );
// };

// export default Settings;


import React, { useState } from "react";

const Settings = ({ calculateBestMove, activeColor, setActiveColor }) => {
  const [castlingAvailability, setCastlingAvailability] = useState({
    whiteKingside: false,
    whiteQueenside: false,
    blackKingside: false,
    blackQueenside: false,
  });

  const handleCastlingChange = (e) => {
    setCastlingAvailability({
      ...castlingAvailability,
      [e.target.name]: e.target.checked,
    });
  };

  return (
    <div className="bg-gray-900 text-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Settings</h2>
      <div className="mb-4">
        <label className="block mb-2">Active Color</label>
        <div className="flex items-center">
          <input
            type="radio"
            name="activeColor"
            value="white"
            checked={activeColor === "white"}
            onChange={() => setActiveColor("white")}
            className="mr-2"
          />
          <label className="mr-4">White to move</label>
          <input
            type="radio"
            name="activeColor"
            value="black"
            checked={activeColor === "black"}
            onChange={() => setActiveColor("black")}
            className="mr-2"
          />
          <label>Black to move</label>
        </div>
      </div>
      <button
        onClick={calculateBestMove}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
      >
        Calculate Next Move
      </button>
    </div>
  );
};

export default Settings;
