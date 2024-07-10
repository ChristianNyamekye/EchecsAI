"use client";
import React, { useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import Head from "next/head";
import Link from "next/link";
import ChessboardComponent from "../../components/Chessboard";
import { GoogleGeminiEffectDemo } from "../../components/GoogleGeminiEffectDemo";
import { Onboarding } from "../../components/Onboarding";
import LandingPage from "../../components/LandingPage";

import { Feedback } from "../../components/Feedback";

export default function Home() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div>
      <Head>
        <title>EchecsAI</title>
        <meta name="description" content="Chess AI project" />
      </Head>
      <main className="relative">
        {/* <GoogleGeminiEffectDemo /> */}
        <LandingPage />
        {/* <Onboarding /> */}
        {/* <Feedback /> */}
        {/* <ChessboardComponent /> */}
        <motion.div
          className="fixed bottom-0 left-0 right-0 h-1 bg-blue-500"
          style={{ scaleX }}
        />
      </main>
    </div>
  );
}
