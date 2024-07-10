
// import path from "path";
// import * as fs from "fs";
// import crypto from 'crypto';

// export default async function handler(req, res) {
//   if (req.method === "POST") {
//     try {
//       console.log("Text to be processed:", req.body);
//       const { text } = req.body;

//       if (!text) {
//         throw new Error("No text provided");
//       }

//       console.log("Text to be processed:", req.body);

//       const response = await fetch("https://api.openai.com/v1/audio/speech", {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           model: "tts-1",
//           // input: "text the little brown fox jum pf othe lazy dog",
//           input: text,
//           voice: "alloy",
//         }),
//       });

//       console.log("Generated text:", req.body, text);

//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }

      

//       const blob = await response.blob();
//       const buffer = Buffer.from(await blob.arrayBuffer());

      
//       const outputPath = "/tmp/output.mp3";
//       const _output = path.resolve(outputPath);

      
//       await fs.promises.writeFile(`./public/${_output}`, buffer);

//       const url = URL.createObjectURL(blob);
      
//       console.log("Generated Blob URL:", url, blob, outputPath);

//       // return blob;
//       res.status(200).json({ outputPath });
//     } catch (error) {
//       console.error("Error generating speech:", error);
//       res.status(500).json({ error: error.message });
//     }
//   } else {
//     res.setHeader("Allow", ["POST"]);
//     res.status(405).end(`Method ${req.method} Not Allowed`);
//   }
// }

import path from "path";
import * as fs from "fs";
import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      console.log("Text to be processed:", req.body);
      const { combinedText } = req.body;

      if (!combinedText) {
        return res.status(400).json({ error: "No text provided" });
      }

      const response = await fetch("https://api.openai.com/v1/audio/speech", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "tts-1",
          input: combinedText,
          voice: "alloy",
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const blob = await response.blob();
      const buffer = Buffer.from(await blob.arrayBuffer());

      // Generate a random filename using a random hexadecimal string
      const randomFilename = `speech${crypto.randomBytes(8).toString('hex')}.mp3`;
      const outputPath =  `/tmp/${randomFilename}`;

      const _output = path.resolve(outputPath);


      // Ensure directory exists
      // await fs.promises.mkdir(path.dirname(outputPath), { recursive: true });

      // Write file to the local file system in the public directory
      // await fs.promises.writeFile(outputPath, buffer);
      await fs.promises.writeFile(`./public/${_output}`, buffer);

      // Construct a URL to access the file
      // const url = `${req.headers.origin}/audio/${randomFilename}`;

      console.log("Generated Blob URL:", outputPath);

      res.status(200).json({ outputPath });
    } catch (error) {
      console.error("Error generating speech:", error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
