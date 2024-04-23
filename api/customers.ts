// Import the necessary module for database connection
const { connectToDatabase } = require("../db");

// Define types for the incoming request body and the expected structure of the database query result
type RequestBody = {
  input: {
    email?: string;
  };
};

type Customer = {
  email: string;
  image_url: string;
};

export default async (
  req: { method: string; body: RequestBody },
  res: {
    status: (code: number) => { json: (body: Record<string, any>) => void };
  }
) => {
  if (req.method === "POST") {
    const client = await connectToDatabase();

    // Extract email from the request body
    let { email } = req.body.input;
    let result: Customer[];

    if (!email) {
      res.status(200).json({
        image_url: "none",
      });
      return;
    } else {
      // SQL injection risk: the email should be parameterized to avoid security issues
      result = (
        await client.query(`SELECT * FROM customers WHERE email='${email}'`)
      ).rows;
    }

    result = result[0] ? [result[0]] : [];

    // End database connection
    await client.end();

    if (!result || result.length === 0) {
      res.status(200).json({
        image_url: "No data found",
      });
      return;
    } else {
      // Simulate an intensive operation and modify the image URL
      let { image_url, ...rest } = result[0];
      const modified_image = image_url + "BLURRED";

      res.status(200).json({
        image_url: modified_image,
      });
    }
  } else if (req.method === "GET") {
    res.status(200).json({
      message: "welcome to s",
    });
  }
};
