// pages/api/generate-fen.js

import fetch from 'node-fetch';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function generateFEN(base64Image) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-2024-05-13',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: "Generate ONLY the FEN string for this chessboard position. There shouldn't be any back ticks",
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`,
              },
            },
          ],
        },
      ],
      max_tokens: 300,
    }),
  });
  const data = await response.json();
  if (!data.choices || data.choices.length === 0) {
    throw new Error('No choices returned from API.');
  }

  const choice = data.choices[0];
  if (!choice.message || !choice.message.content) {
    throw new Error('Malformed choice data received from API.');
  }
  console.log(`${JSON.stringify(choice)}`);

  
  return choice.message.content;
}
