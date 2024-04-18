const dotenv = require('dotenv');
dotenv.config();
const { Client } = require('pg');

// Direct connection string provided
const connectionString = process.env.POSTGRES_URL;

// Create a new PostgreSQL client
export const client = new Client({
  connectionString: connectionString
});

export async function connectToDatabase() {
    try {
      // Check if the client is already connected
      if (client && client._connected) {
        console.log('Client is already connected to the database');
        return;
      }
  
      // If the client is not already connected, connect to the database
      await client.connect();
      console.log('Connected to the database');
  
    } catch (error) {
      console.error('Error connecting to the database:', error);
    }
  }
  

// Call the function to connect to the database
// connectToDatabase();
