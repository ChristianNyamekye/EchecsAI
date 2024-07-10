"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "../utils/cn";
import { showNotification } from '@mantine/notifications';

export const Onboarding = () => {
  const rows = new Array(100).fill(1); // Adjust the number of rows as needed
  const cols = new Array(100).fill(1); // Adjust the number of columns as needed
  const [email, setEmail] = useState('');

  let colors = [
    "--sky-300",
    "--pink-300",
    "--green-300",
    "--yellow-300",
    "--red-300",
    "--purple-300",
    "--blue-300",
    "--indigo-300",
    "--violet-300",
  ];

  const getRandomColor = () => {
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const handleSubmit = async (event) => {
    event.preventDefault();  // Prevent the default form submission behavior

    if (!email.trim()) {
      console.log(`failed email: ${email}`);
      showNotification({
        title: 'Validation Error',
        message: 'Email address is required',
        color: 'red',
      });
      return;
    }

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim() }),  // Ensure email is correctly passed
      });

      const data = await response.json();

      if (response.ok) {
        setEmail('');  // Clear the input after successful submission
        alert('Thank you for joining our waitlist!');
        showNotification({
          title: 'Success',
          message: 'Thank you for joining our waitlist!',
          color: 'green',
        });
      } else {
        throw new Error(data.message || 'Failed to join the waitlist');
      }
    } catch (error) {
      console.error('Error during form submission:', error);
      showNotification({
        title: 'Error',
        message: error.message || 'Could not reach the server',
        color: 'red',
      });
    }
  };

  return (
    <div className="relative overflow-hidden bg-black-900 flex flex-col items-center justify-center rounded-lg h-screen bg-black">
      <div className="absolute inset-0 w-full h-full bg-black-900 z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />

      <div
        style={{
          transform: `translate(-40%,-60%) skewX(-48deg) skewY(14deg) scale(0.675) rotate(0deg) translateZ(0)`,
        }}
        className={cn(
          "absolute left-1/4 p-4 -top-1/4 flex -translate-x-1/2 -translate-y-1/2 w-full h-full z-0"
        )}
      >
        {rows.map((_, i) => (
          <motion.div
            key={`row` + i}
            className="w-16 h-8 border-l border-slate-700 relative"
          >
            {cols.map((_, j) => (
              <motion.div
                whileHover={{
                  backgroundColor: `var(${getRandomColor()})`,
                  transition: { duration: 0 },
                }}
                animate={{
                  transition: { duration: 2 },
                }}
                key={`col` + j}
                className="w-16 h-8 border-r border-t border-slate-700 relative"
              >
                {j % 2 === 0 && i % 2 === 0 ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="absolute h-6 w-10 -top-[14px] -left-[22px] text-slate-700 stroke-[1px] pointer-events-none"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6v12m6-6H6"
                    />
                  </svg>
                ) : null}
              </motion.div>
            ))}
          </motion.div>
        ))}
      </div>

      <div className="max-w-3xl mx-auto p-8">
        <h1 className="relative z-10 text-3xl md:text-8xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600 text-center font-times font-bold">
          Join the waitlist
        </h1>
        <p className="text-neutral-500 max-w-xl mx-auto my-6 text-lg text-center relative z-10 font-times">
          Welcome to EchecsAI, your premier chess learning platform. We offer
          robust, adaptable, and engaging tools to enhance your chess skills.
          Whether youre practicing openings, mastering endgames, or exploring
          new strategies, EchecsAI provides an interactive and supportive
          environment to elevate your game.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="christian@echecsai.in"
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-lg border border-neutral-800 focus:ring-2 focus:ring-teal-500 w-full relative z-10 p-4 text-lg bg-neutral-950 placeholder:text-neutral-700"
            />
            <button className="font-bold bg-teal-500 text-white rounded-lg px-4 py-2 relative z-10 text-lg">
              Join
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
