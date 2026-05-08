import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../../../.env") });

import mongoose from "mongoose";


import * as schema from "./schema";

const MONGODB_URI = process.env.MONGODB_URI || process.env.DATABASE_URL;

if (!MONGODB_URI) {
  throw new Error(
    "MONGODB_URI or DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Connect to MongoDB
mongoose.connect(MONGODB_URI).catch((err) => {
  console.error("Failed to connect to MongoDB", err);
});

export const db = mongoose.connection;
export * from "./schema";

