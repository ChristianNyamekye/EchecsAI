// // components/Feedback.js

// "use client";
// import React, { useState } from "react";
// import { InfiniteMovingCards } from "../ui/InfiniteMovingCards";
// import { Input } from "../ui/Input";
// import { Label } from "../ui/Label";

// const testimonials = [
//   {
//     quote:
//       "It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity, it was the season of Light, it was the season of Darkness, it was the spring of hope, it was the winter of despair.",
//     name: "Charles Dickens",
//     title: "A Tale of Two Cities",
//   },
//   {
//     quote:
//       "To be, or not to be, that is the question: Whether 'tis nobler in the mind to suffer The slings and arrows of outrageous fortune, Or to take Arms against a Sea of troubles, And by opposing end them: to die, to sleep.",
//     name: "William Shakespeare",
//     title: "Hamlet",
//   },
//   {
//     quote: "All that we see or seem is but a dream within a dream.",
//     name: "Edgar Allan Poe",
//     title: "A Dream Within a Dream",
//   },
//   {
//     quote:
//       "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.",
//     name: "Jane Austen",
//     title: "Pride and Prejudice",
//   },
//   {
//     quote:
//       "Call me Ishmael. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little and see the watery part of the world.",
//     name: "Herman Melville",
//     title: "Moby-Dick",
//   },
// ];

// export function Feedback() {
//   const [feedback, setFeedback] = useState(testimonials);
//   // const [formData, setFormData] = useState({
//   //   name: "",
//   //   email: "",
//   //   message: "",
//   // });

//   // const handleChange = (e) => {
//   //   setFormData({
//   //     ...formData,
//   //     [e.target.name]: e.target.value,
//   //   });
//   // };

//   // const handleSubmit = (e) => {
//   //   e.preventDefault();
//   //   setFeedback([
//   //     ...feedback,
//   //     {
//   //       quote: formData.message,
//   //       name: formData.name,
//   //       title: "User Feedback",
//   //     },
//   //   ]);
//   //   setFormData({ name: "", email: "", message: "" });
//   // };

//   return (
//     <div className="max-w-5xl mx-auto p-8">
//       {/* <h2 className="text-3xl md:text-6xl font-bold text-center my-8">
//         Contact Me & Leave Your Feedback
//       </h2>
//       <form onSubmit={handleSubmit} className="space-y-6">
//         <div className="space-y-4">
//           <Label htmlFor="name">Name</Label>
//           <Input
//             id="name"
//             name="name"
//             type="text"
//             value={formData.name}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div className="space-y-4">
//           <Label htmlFor="email">Email</Label>
//           <Input
//             id="email"
//             name="email"
//             type="email"
//             value={formData.email}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div className="space-y-4">
//           <Label htmlFor="message">Message/Feedback</Label>
//           <Input
//             as="textarea"
//             id="message"
//             name="message"
//             value={formData.message}
//             onChange={handleChange}
//             rows="5"
//             required
//           />
//         </div>
//         <button
//           type="submit"
//           className="w-full bg-blue-600 text-white font-bold py-2 rounded-md hover:bg-blue-700 transition duration-300"
//         >
//           Submit
//         </button>
//       </form> */}
//       <div className="h-[40rem] rounded-md flex flex-col antialiased bg-white dark:bg-black dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
//         <InfiniteMovingCards
//           items={feedback}
//           direction="right"
//           speed="slow"
//         />
//       </div>
//       {/* <InfiniteMovingCards items={feedback} /> */}
//     </div>
//   );
// }


// components/Feedback.js

"use client";
import React, { useEffect, useState } from "react";
import { InfiniteMovingCards } from "../ui/InfiniteMovingCards";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";

export function Feedback() {

  return (
    <div className="h-[40rem] rounded-md flex flex-col antialiased bg-white dark:bg-black dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
      <InfiniteMovingCards
        items={testimonials}
        direction="right"
        speed="slow"
      />
    </div>
  );
}

const testimonials = [
  {
    quote:
      "It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity, it was the season of Light, it was the season of Darkness, it was the spring of hope, it was the winter of despair.",
    name: "Charles Dickens",
    title: "A Tale of Two Cities",
  },
  {
    quote:
      "To be, or not to be, that is the question: Whether 'tis nobler in the mind to suffer The slings and arrows of outrageous fortune, Or to take Arms against a Sea of troubles, And by opposing end them: to die, to sleep.",
    name: "William Shakespeare",
    title: "Hamlet",
  },
  {
    quote: "All that we see or seem is but a dream within a dream.",
    name: "Edgar Allan Poe",
    title: "A Dream Within a Dream",
  },
  {
    quote:
      "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.",
    name: "Jane Austen",
    title: "Pride and Prejudice",
  },
  {
    quote:
      "Call me Ishmael. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little and see the watery part of the world.",
    name: "Herman Melville",
    title: "Moby-Dick",
  },
];


