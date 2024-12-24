const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const connectdb = require("./db/database");
const student = require("./routers/student");
const admin = require("./routers/admin");
const auth = require("./routers/auth");
const Document = require("./models/docModel");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Connect to the database
connectdb();

// Create HTTP server and initialize Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Socket.IO logic
io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("get-document", async (documentId) => {
    try {
      const document = await findOrCreateDocument(documentId);
      socket.join(documentId);
      socket.emit("load-document", document.content);

      socket.on("send-changes", (delta) => {
        socket.broadcast.to(documentId).emit("receive-changes", delta);
      });

      socket.on("save-document", async (content) => {
        try {
          await Document.findByIdAndUpdate(documentId, { content });
        } catch (err) {
          console.error("Error saving document:", err);
        }
      });
    } catch (err) {
      console.error("Error handling document:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Helper function to find or create a document
async function findOrCreateDocument(id) {
  if (id == null) return null;

  let document = await Document.findById(id);
  if (!document) {
    document = await Document.create({ _id: id, content: "" });
  }
  return document;
}

// Routes
app.use("/api/student", student);
app.use("/api/admin", admin);
app.use("/api/auth", auth);

// Start the server
const PORT = 8081;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
