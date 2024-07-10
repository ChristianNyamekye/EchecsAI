
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

let promptData = null;

export default async function handler(req, res) {
  if (req.method === "POST") {
    // Handle POST request to receive initial data
    const { fen, history, pv, recommendedMove } = req.body;

    if (!fen || !history || !recommendedMove) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    promptData = {
      fen,
      history,
      pv,
      recommendedMove,
    };

    res.status(200).json({ message: "Data received, ready to stream" });
  } else if (req.method === "GET") {
    // Handle GET request to stream data
    if (!promptData) {
      return res.status(400).json({ error: "No prompt data available" });
    }

    const { fen, history, pv, recommendedMove } = promptData;

    const prompt = `Given the current FEN position: ${fen} and the following game history: ${history}, explain why the recommended move ${recommendedMove} by Stockfish is optimal. Can this objective be achieved with any alternative moves (${pv} should help you with that)?  Provide details on grandmasters who've used this move and how it can help improve one's chess skills.`;

    const messages = [
      {
        role: "system",
        content:
          "You are a chess coach. Make your answers as short as possible. If you can answer in a single word do that. If you can answer in a single sentence do that. Only use multiple sentences or paragraphs when it’s necessary to convey the meaning of your answer in longer responses. you should return a json in the form with required fields: recommended, player to move (should be white or black), alternative implementation (should be a string. information from provided pv can help), relevances(should be a string of sentences), funFact. JSON return should be formatted in a way that can be easily parsed by doing the following: Remove the backticks: Ensure that the JSON data being sent and received does not include Markdown like triple backticks (```) or other extraneous characters. Check both the sending and receiving ends of your data transfer. Correct JSON Key Syntax: JSON keys should be enclosed in double quotes. Your JSON keys such as recommended, player_to_move, etc., are correct, but ensure all are consistently formatted. Correct Data Formatting: Make sure the entire structure of the JSON data is correct, including commas, brackets, and braces. ",
      },
      { role: "user", content: prompt },
    ];

    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    });

    const stream = await openai.chat.completions.create({
      messages: messages,
      // model: "gpt-3.5-turbo",
      model: "gpt-4o-2024-05-13",
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      res.write(`data: ${content}\n\n`);
    }

    res.write("event: end\ndata: \n\n");
    res.end();
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}


// move recommended, move by black or white, relevance of move, ways to imlement, fun fact/grandmasters.