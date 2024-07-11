
// todo: cloud
import { Storage } from "@google-cloud/storage";
import crypto from "crypto";
import path from "path";
import fs from "fs";

const storage = new Storage();
const bucketName = process.env.GCLOUD_STORAGE_BUCKET;
const bucket = storage.bucket(bucketName);

// Decode base64 string to JSON and write to a temporary file
const serviceAccountBase64 = process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64;
if (!serviceAccountBase64) {
  throw new Error('The GOOGLE_APPLICATION_CREDENTIALS_BASE64 environment variable is not set.');
}

const serviceAccountJson = Buffer.from(serviceAccountBase64, 'base64').toString('utf-8');
const serviceAccountPath = path.join('/tmp', 'service-account.json');
fs.writeFileSync(serviceAccountPath, serviceAccountJson);

// Set the environment variable to point to the temporary file
process.env.GOOGLE_APPLICATION_CREDENTIALS = serviceAccountPath;


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
      const randomFilename = `audio/speech${crypto
        .randomBytes(8)
        .toString("hex")}.mp3`;

      // Upload the file to Google Cloud Storage
      const file = bucket.file(randomFilename);
      await file.save(buffer, {
        metadata: {
          contentType: "audio/mpeg",
        },
      });

      // Generate a signed URL for the uploaded file
      const [url] = await file.getSignedUrl({
        action: "read",
        expires: Date.now() + 24 * 60 * 60 * 1000, // 1 day
      });

      console.log("Generated Signed URL:", url);

      res.status(200).json({ url });
    } catch (error) {
      console.error("Error generating speech:", error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}


// todo: local
// import path from "path";
// import * as fs from "fs";
// import crypto from 'crypto';

// export default async function handler(req, res) {
//   if (req.method === "POST") {
//     try {
//       console.log("Text to be processed:", req.body);
//       const { combinedText } = req.body;

//       if (!combinedText) {
//         return res.status(400).json({ error: "No text provided" });
//       }

//       const response = await fetch("https://api.openai.com/v1/audio/speech", {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           model: "tts-1",
//           input: combinedText,
//           voice: "alloy",
//         }),
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }

//       const blob = await response.blob();
//       const buffer = Buffer.from(await blob.arrayBuffer());

//       // Generate a random filename using a random hexadecimal string
//       const randomFilename = `speech${crypto.randomBytes(8).toString('hex')}.mp3`;
//       const outputPath =  `/tmp/${randomFilename}`;

//       const _output = path.resolve(outputPath);


//       // Ensure directory exists
//       // await fs.promises.mkdir(path.dirname(outputPath), { recursive: true });

//       // Write file to the local file system in the public directory
//       // await fs.promises.writeFile(outputPath, buffer);
//       await fs.promises.writeFile(`./public/${_output}`, buffer);

//       // Construct a URL to access the file
//       // const url = `${req.headers.origin}/audio/${randomFilename}`;

//       console.log("Generated Blob URL:", outputPath);

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

