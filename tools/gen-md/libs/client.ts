import { MongoClient } from "../deps.ts";

const uri = Deno.env.get("MONGODB_URI_ENGDB");
if (!uri) {
  console.error("ERROR: MONGODB_URI_ENGDB environment variable is not set.");
  Deno.exit(1);
}

export const client = new MongoClient();
await client.connect(uri);
