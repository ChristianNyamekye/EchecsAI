

// import multer from "multer";
// import { createRouter } from "next-connect"; // Import createRouter instead of nextConnect
// import path from "path";
// import fs from "fs";
// import os from "os";
// import { generateFEN } from "./generate-fen";
// import { Storage } from "@google-cloud/storage";

// const upload = multer({
//   storage: multer.diskStorage({
//     destination: (req, file, cb) => cb(null, os.tmpdir()),
//     filename: (req, file, cb) => cb(null, file.originalname),
//   }),
// });

// // Create the router using createRouter instead of nextConnect
// const apiRoute = createRouter({
//   onError(error, req, res) {
//     res
//       .status(501)
//       .json({ error: `Sorry something happened! ${error.message}` });
//   },
//   onNoMatch(req, res) {
//     res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
//   },
// });

// const storage = new Storage();
// const bucketName = process.env.GCLOUD_STORAGE_BUCKET;

// apiRoute.use(upload.single("file"));

// apiRoute.post(async (req, res) => {
//   try {
//     const file = req.file; // The file uploaded by multer

//     if (!file) {
//       return res.status(400).json({ error: "No file uploaded." });
//     }

//     console.log(`${JSON.stringify(file)}`);
    
//     const bucket = storage.bucket(bucketName);

//     // Create a new blob in the bucket and upload the file data to the 'screenshots' directory.
//     const blob = bucket.file(`screenshots/${file.originalname}`);
//     const blobStream = blob.createWriteStream();

//     blobStream.on("error", (err) => {
//       console.error(err);
//       res.status(500).json({ error: "Failed to upload the image to GCS." });
//     });

//     blobStream.on("finish", async () => {
//       // The public URL can be used to directly access the file via HTTP.
//       const publicUrl = `https://storage.googleapis.com/${bucketName}/screenshots/${file.originalname}`;
//       // const publicUrl = `https://us-central1-echecsai-429021.cloudfunctions.net/screenshots/${file.originalname}`;
//       console.log(publicUrl);

//       // Assuming you still want to generate a FEN from the image
//       const base64Image = fs.readFileSync(file.path, "base64");
//       const fen = await generateFEN(base64Image); // Adjust this according to how you handle image processing

//       res.status(200).json({ fen, imageUrl: publicUrl });
//     });

//     // When data is fully uploaded close the stream
//     blobStream.end(file.buffer);
//   } catch (error) {
//     console.error("Failed to upload to GCS:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// export default apiRoute.handler(); // Use handler method to export

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };



// todo:

import multer from "multer";
import { createRouter } from "next-connect"; // Import createRouter instead of nextConnect
import path from "path";
import fs from "fs";
import os from "os";
import { generateFEN } from "./generate-fen";
import { Storage } from "@google-cloud/storage";
import { initializeGCloudCredentials } from "./setup-gcloud"

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, os.tmpdir()),
    filename: (req, file, cb) => cb(null, file.originalname),
  }),
});

// Create the router using createRouter instead of nextConnect
const apiRoute = createRouter({
  onError(error, req, res) {
    res
      .status(501)
      .json({ error: `Sorry something happened! ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

const storage = new Storage();
const bucketName = process.env.GCLOUD_STORAGE_BUCKET;

apiRoute.use(upload.single("file"));

apiRoute.post(async (req, res) => {
  initializeGCloudCredentials();
  try {
    const file = req.file; // The file uploaded by multer

    if (!file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    console.log(`${JSON.stringify(file)}`);

    const bucket = storage.bucket(bucketName);

    // Create a new blob in the bucket and upload the file data to the 'screenshots' directory.
    const blob = bucket.file(`screenshots/${file.originalname}`);
    const blobStream = blob.createWriteStream();

    blobStream.on("error", (err) => {
      console.error(err);
      res.status(500).json({ error: "Failed to upload the image to GCS." });
    });

    blobStream.on("finish", async () => {
      // Generate a signed URL for the uploaded file
      const [signedUrl] = await blob.getSignedUrl({
        version: "v4",
        action: "read",
        expires: Date.now() + 60 * 60 * 1000, // 1 hour
      });

      console.log(`signed url: ${signedUrl}`);

      // Assuming you still want to generate a FEN from the image
      const base64Image = fs.readFileSync(file.path, "base64");
      const fen = await generateFEN(base64Image); // Adjust this according to how you handle image processing

      res.status(200).json({ fen, imageUrl: signedUrl });
    });

    // When data is fully uploaded close the stream
    fs.createReadStream(file.path).pipe(blobStream);
    // blobStream.end(file.buffer);
  } catch (error) {
    console.error("Failed to upload to GCS:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default apiRoute.handler(); // Use handler method to export

export const config = {
  api: {
    bodyParser: false,
  },
};
