import Database from "./db";
import { Request, Response } from "express";
export const handlerService = async (req: Request, res: Response) => {
  try {
    console.log("done hit by zeploo");
    // Connect to the database
    await Database.connectToDatabase();
    const insertQuery =
      "UPDATE TODOS SET status='archived' WHERE status='done';";
    const result = await Database.client.query(insertQuery);

    // Close connection
    await Database.client.end();
    // console.log("result:", result);

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
};
