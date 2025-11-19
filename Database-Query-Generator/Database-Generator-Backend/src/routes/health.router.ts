import { Request, Router, Response } from "express";

const healthRouter = Router();

healthRouter.get("/health", (req: Request, res: Response) => {
  return res.status(201).json({
    message: `Backend Service is Running`,
    time: new Date().toDateString(),
    error: false,
  });
});

export default healthRouter;
