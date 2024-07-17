import fs from "fs";
import path from "path";
import os from "os";

// Decode the base64 service account key and write it to a temporary location
export function initializeGCloudCredentials() {
  const serviceAccountBase64 =
    process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64;
  if (!serviceAccountBase64) {
    throw new Error(
      "The GOOGLE_APPLICATION_CREDENTIALS_BASE64 environment variable is not set."
    );
  }

  const serviceAccountJson = Buffer.from(
    serviceAccountBase64,
    "base64"
  ).toString("utf-8");
  const serviceAccountPath = path.join(os.tmpdir(), "service-account.json");
  fs.writeFileSync(serviceAccountPath, serviceAccountJson);

  // Set the environment variable to point to the temporary file
  process.env.GOOGLE_APPLICATION_CREDENTIALS = serviceAccountPath;
}


