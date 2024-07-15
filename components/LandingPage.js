// LandingPage.js
import React, { useState } from "react";
import InfiniteMovingCards from './InfiniteMovingCards';
import Link from "next/link";


const features = [
  {
    title: "Advanced AI Analysis",
    description: "Get insights from the latest AI models to improve your game.",
    image: "../images/analysis.jpeg" 
  },
  {
    title: "Real-time Feedback",
    description: "Receive instant feedback on your moves and learn from your mistakes.",
    image: "../images/feedback.png"
  },
  {
    title: "Chess History",
    description: "Explore games from chess legends and understand their strategies.",
    image: "/images/history.jpeg"
  },
  {
    title: "Interactive Tutorials",
    description: "Engage in hands-on tutorials to master different chess strategies and tactics.",
    image: "/images/tutorial.jpeg" 
  },
  {
    title: "Community and Support",
    description: "Join a community of chess enthusiasts and get support from experts.",
    image: "/images/community.png"
  }
];

const LandingPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "https://us-central1-echecsai-429021.cloudfunctions.net/waitlist",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      if (response.ok) {
        setMessage("Successfully added to the waitlist!");
      } else {
        setMessage("Failed to add to the waitlist. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting email:", error);
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="bg-[#2c3639] text-[#edeed1]">
      {/* Navbar */}
      <nav className="bg-[#1f2937]">
        <div
          className="container mx-auto flex justify-between items-center"
          style={{ height: "90px" }}
        >
          <a href="#" className="text-xl font-bold text-[#edeed1]">
            <img
              src="../images/echecsai.png"
              alt="EchecsAI Logo"
              style={{ height: "200px", width: "190px" }}
            />
          </a>
          <div>
            <a
              href="#features"
              className="text-[#edeed1] hover:text-[#60a5fa] mx-2"
            >
              Features
            </a>
            <a
              href="#waitlist"
              className="text-[#edeed1] hover:text-[#60a5fa] mx-2"
            >
              Join Waitlist
            </a>
            <a
              href="/chessgame"
              className="text-[#edeed1] hover:text-[#60a5fa] mx-2"
            >
              ChessGPT
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        className="hero-bg h-screen flex items-center justify-center text-center"
        style={{
          backgroundImage:
            // 'url("https://images.unsplash.com/photo-1560174038-da43ac74f01b?q=80&w=2914&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
            'url("https://images.unsplash.com/photo-1645765734294-ad4719c296e0?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
            backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="bg-[#2c3639] bg-opacity-75 p-8 rounded-lg">
          <h1 className="text-5xl font-bold text-[#edeed1]">
            Master Chess with EchecsAI
          </h1>
          <p className="mt-4 text-xl text-[#60a5fa]">
            Unlock the secrets of grandmasters with our AI-driven chess platform
          </p>
          <a
            href="#waitlist"
            className="mr-2 mt-6 inline-block bg-[#17cadc] text-[#2c3639] px-6 py-3 rounded-lg text-lg font-semibold hover:bg-[#2c3639] hover:text-[#17cadc]"
          >
            Join Waitlist
          </a>
          <a
            href="#demo"
            className="ml-2 mt-6 inline-block bg-[#2c3639] text-[#17cadc] px-6 py-3 rounded-lg text-lg font-semibold border-1.5 border-[#17cadc] hover:bg-[#17cadc] hover:text-[#2c3639]"
          >
            Watch the Demo
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-[#edeed1] text-[#1f2937]">
        <div className="container mx-auto text-center">
          <div className="mb-4">
            <span className="inline-block px-4 py-2 text-sm font-semibold text-white bg-[#60a5fa] rounded-full">
              Best Chess Engine and Analyzer Ever!
            </span>
          </div>
          <h2 className="text-4xl font-bold">learn chess seemlessly with AI</h2>
          <p className="mt-2 text-lg text-[#60a5fa]">
            Elevate your chess skills with personalized feedback and insights
            from our AI.
          </p>
          <div className="mt-8">
            <InfiniteMovingCards items={features} />
          </div>
        </div>
      </section>

      {/* Waitlist Section */}
      <section id="waitlist" className="py-16 bg-[#1f2937] text-[#edeed1]">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold">Join Our Waitlist</h2>
          <p className="mt-4 text-lg text-[#60a5fa]">
            Be the first to experience EchecsAI. Sign up now!
          </p>
          <form
            onSubmit={handleSubmit}
            className="mt-8 flex flex-col md:flex-row justify-center items-center"
          >
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-2 rounded-lg text-[#2c3639] md:mr-4 mb-4 md:mb-0"
              required
            />
            <button
              type="submit"
              className="bg-[#17cadc] text-[#2c3639] px-6 py-2 rounded-lg font-semibold hover:bg-[#60a5fa]"
            >
              Sign Up
            </button>
          </form>
          {message && <p className="mt-4 text-lg">{message}</p>}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1f2937] text-[#edeed1] py-6">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 EchecsAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;