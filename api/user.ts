// Import the necessary module for database connection
const { connectToDatabase } = require("../db");

// Define types for the incoming request body and the expected structure of the database query result
type RequestBody = {
  event: {
    data: {
      new: {
        name: string;
        email: string;
      };
    };
  };
};

export default async (
  req: { method: string; body: RequestBody },
  res: {
    status: (code: number) => { json: (body: Record<string, any>) => void };
  }
) => {
  /**
   * @todo
   * 1. add check for event type: INSERT, UPDATE, etc
   * 2. Do validation of data
   * 3. use transactions if multiple steps
   */
  if (req.method === "POST") {
    try {
      const client = await connectToDatabase();
      const { name, email } = req.body.event.data.new;

      // Perform some validation here. Example:
      if (!name || !email) {
        await client.end();
        return res.status(400).json({
          success: false,
          message: "Missing name or email",
        });
      }

      // Create a customer using parameterized query for security
      const insertQuery =
        "INSERT INTO customers (name, image_url, email) VALUES ($1, '-', $2)";
      await client.query(insertQuery, [name, email]);

      // Close connection
      await client.end();
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
