import dotenv from "dotenv";
dotenv.config();
import { Client } from "pg";

// Direct connection string provided
const connectionString = process.env.POSTGRES_URL as string;

class Database {
  static client: Client;

  static connectToDatabase = async () => {
    try {
      // Check if the client is already connected
      if (Database.client) {
        console.log("client already connected");
      }
      Database.client = new Client({
        connectionString: connectionString,
      });

      await Database.client.connect();
      console.log("Connected to the database");
    } catch (error) {
      console.error("Error connecting to the database:", error);
    }
  };
}

export default Database;
