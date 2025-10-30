import express from "express";
import { OnDemandProcessor } from "./OnDemandProcessor.js";
import { gracefulShutdown } from "./gracefulShutdown.js";
import { Server } from "socket.io";
import http from "http";

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// configurable task count
const maxTasks = process.env.MAX_CONCURRENT_TASKS || 3;

const processor = OnDemandProcessor.getInstance(maxTasks);
processor.init(io);

app.use(express.json());

app.post("/jobs", async (req, res) => {
  try {
    const { numTask } = req.body || {};

    if (!numTask) {
      return res
        .status(400)
        .json({ success: false, message: "Number of task required" });
    }

    const jobId = await processor.addJob(numTask);

    return res.status(201).json({ success: true, jobId });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log(`Client disconnected ${socket.id}`);
  });
});

server.listen(3000, () => {
  console.log(`Server is listening at: http://localhost:3000`);
});

// Graceful shutdown
process.on("SIGINT", () => gracefulShutdown(server, processor));
process.on("SIGTERM", () => gracefulShutdown(server, processor));
process.on("uncaughtException", (err) =>
  gracefulShutdown(server, processor, err)
);
process.on("unhandledRejection", (err) =>
  gracefulShutdown(server, processor, err)
);
