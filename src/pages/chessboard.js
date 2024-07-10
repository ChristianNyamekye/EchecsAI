// pages/chessboard.js
"use client";
import React from "react";
import Head from "next/head";
import ChessboardComponent from "../../components/Chessboard";

export default function ChessboardPage() {
  return (
    <div>
      <Head>
        <title>Chessboard | EchecsAI</title>
        <meta name="description" content="Chessboard component for EchecsAI" />
      </Head>
      <main
        className="flex justify-center items-center h-full w-full backgroundBlur"
        style={{
          // backgroundImage:
          //   'url("https://images.unsplash.com/photo-1560174038-da43ac74f01b?q=80&w=2914&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
          backgroundImage:
            'url("https://images.unsplash.com/photo-1529699211952-734e80c4d42b?q=80&w=2942&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
            backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundColor: "#222831",
          backgroundBlendMode: "multiply",
        }}
      >
        <ChessboardComponent />
      </main>
    </div>
  );
}
// 31363F
