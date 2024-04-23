import express, { Request, Response, NextFunction } from "express";
import { handlerService } from "./doneStatusHandler-2";
const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.post("/doneHandler", handlerService);
app.use((req, res, next) => {
  res.status(403).json({
    message: "Prohibited",
  });
});

// create a global error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

export default app;
