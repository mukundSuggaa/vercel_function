// Import the necessary module for database connection
import * as dotenv from "dotenv";
dotenv.config();

// Define types for the incoming request body and the expected structure of the database query result
type RequestBody = {
  event: {
    data: {
      new: {
        id: string;
      };
    };
  };
};

/**
 * @description This function is called when a POST request is received at the /zeploUpdate endpoint. It handles the incoming request body
 * and triggers a vercel function to update the todos which have 'done' in it, after 1 min, to 'archived'.
 */
export default async (
  req: { method: string; body: RequestBody },
  res: {
    status: (code: number) => { json: (body: Record<string, any>) => void };
  }
) => {
  if (req.method === "POST") {
    try {
      const ZEPLO_AUTH_TOKEN = process.env.ZEPLO_AUTH_TOKEN as string;
      const url =
        "https://zeplo.to/ea75-2406-7400-81-445e-f596-f532-35ae-d861.ngrok-free.app/handle-dones?_interval=60";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "X-Zeplo-Token": ZEPLO_AUTH_TOKEN,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      res.status(200).json({
        success: true,
      });
    } catch (error) {
      console.error("error:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred",
      });
    }
  } else {
    // For non-POST methods
    res.status(403).json({
      message: "Prohibited",
    });
  }
};
