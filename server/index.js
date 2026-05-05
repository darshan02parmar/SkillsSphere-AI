import express from "express";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();

import http from "http";
import { Server } from "socket.io";
import path from "path";
import connectDB from "./src/database/db.js";
import authRoutes from "./src/modules/auth/routes.js";
import resumeRoutes from "./src/modules/resumes/routes.js";
import jobRoutes from "./src/modules/jobs/routes.js";
import matchingRoutes from "./src/modules/matching/routes.js";
import dashboardRoutes from "./src/modules/dashboard/routes.js";
import classroomRoutes from "./src/modules/classrooms/routes.js";
import { initClassroomSockets } from "./src/modules/classrooms/socket.js";
import globalErrorHandler from "./src/middleware/errorMiddleware.js";
import { logEvaluatorConfig } from "./src/config/evaluatorConfig.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Create HTTP server for Socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // allow frontend access
    methods: ["GET", "POST"]
  }
});

app.use(cors());

app.use(express.json());
app.use("/uploads", express.static(path.resolve("src", "uploads")));

await connectDB();
logEvaluatorConfig();

app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/matching", matchingRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/classrooms", classroomRoutes);

// Initialize Sockets
initClassroomSockets(io);

app.use(globalErrorHandler);

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});