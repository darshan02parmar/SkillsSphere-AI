import express from "express";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

router.post("/create", (req, res) => {
  const roomId = uuidv4();
  res.status(201).json({ success: true, roomId });
});

export default router;
