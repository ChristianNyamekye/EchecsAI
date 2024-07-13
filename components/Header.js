import React from 'react';
import { FaChessKing } from 'react-icons/fa'; // Importing a chess icon from React Icons

const Header = () => {
  return (
    <header
      style={{ height: "81px" }}
      className=" text-white mb-2 py-4 flex justify-start items-center rounded-lg"
    >
      <div className="flex justify-center items-center">
        <a href="#" className="text-xl font-bold text-[black]">
          <img
            src="../images/echecsai.png"
            alt="EchecsAI Logo"
            style={{ height: "200px", width: "190px" }}
          />
        </a>
        <a href="/" className="px-4 py-2 bg-blue-500 rounded-md text-white">
          Home
        </a>
        {/* <h1 className="text-lg font-bold flex justify-center items-center">
          <FaChessKing className="mr-2 text-[#60a5fa]" size={30} />
          EchecsAI
        </h1> */}
        {/* <nav>
          <ul className="flex items-center space-x-4">
            <li><a href="#" className="hover:text-gray-300">Features</a></li>
            <li><a href="about" className="hover:text-gray-300">About</a></li>
            <li><a href="contact" className="hover:text-gray-300">Contact</a></li>
          </ul>
        </nav> */}
      </div>
    </header>
  );
};

export default Header;
// /Users/christian/Documents/myPROJECTS/webdev/echecsAi/EchecsAi/echecsai/components/Header.js