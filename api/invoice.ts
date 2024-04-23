// Import the necessary database connection module
const { connectToDatabase } = require("../db");

// Define types for the incoming request and response
type RequestBody = {
  event: {
    data: {
      new: {
        id: number;
      };
    };
  };
};

type Invoice = {
  amount: number;
  date: string;
};

export default async (
  req: { method: string; body: RequestBody },
  res: {
    status: (code: number) => { json: (body: Record<string, any>) => void };
  }
) => {
  if (req.method === "POST") {
    try {
      const client = await connectToDatabase();
      const { id } = req.body.event.data.new;
      const fetchDataQuery = "SELECT amount, date FROM invoices WHERE id = $1";
      const result = await client.query(fetchDataQuery, [id]);

      if (result.rows.length === 0) {
        await client.end();
        return res.status(404).json({
          success: false,
          message: "No invoice found with the provided ID",
        });
      }
      const { amount, date } = result.rows[0];
      const month = new Date(date).getMonth() + 1;
      let discountPercentage = 0;
      switch (month) {
        case 5: // May
          discountPercentage = 10;
          break;
        case 11: // November
          discountPercentage = 3;
          break;
        case 12: // December
          discountPercentage = 20;
          break;
      }
      const discount = amount * (discountPercentage / 100);
      const discountedAmount = amount - discount;
      const updateQuery = "UPDATE invoices SET amount = $1 WHERE id = $2;";
      await client.query(updateQuery, [discountedAmount, id]);
      await client.end();
      res.status(200).json({
        originalAmount: amount,
        discountedAmount,
        discountApplied: discount,
      });
    } catch (error) {
      console.error("error:", error);
      res.status(500).json({ message: "An error occurred" });
    }
  } else {
    res.status(403).json({
      message: "Prohibited",
    });
  }
};
