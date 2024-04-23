import Database from "./db";

export default async (
  req: { method: string },
  res: {
    status: (code: number) => { json: (body: Record<string, any>) => void };
  }
) => {
  if (req.method === "POST") {
    try {
      console.log("done");
      // Connect to the database
      await Database.connectToDatabase();
      const insertQuery =
        "UPDATE TODOS SET status='archived' WHERE status='done';";
      const result = await Database.client.query(insertQuery);

      // Close connection
      await Database.client.end();
      console.log("result:", result);
      res.status(200).json({
        success: true,
      });
    } catch (error) {
      console.error("error:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred in done",
      });
    }
  } else {
    // For non-POST methods
    res.status(403).json({
      message: "Prohibited",
    });
  }
};
