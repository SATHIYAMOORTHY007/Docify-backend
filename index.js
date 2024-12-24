const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const connectdb = require("./db/database");
const student = require("./routers/student");
const admin = require("./routers/admin");
const auth = require("./routers/auth");
const Student = require("./models/student");
const Document = require("./models/docModel");
const cors = require("cors");

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

const io = new Server(8081, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("get-document", async (documentId) => {
    console.log("documentId",documentId)
     try{
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
          console.error("Error saving document", err);
        }
      });
     }catch(err)
     {
         console.log(err)
     }
  });
});

async function findOrCreateDocument(id) {
  if (id == null) return null;

  let document = await Document.findById(id);
  return document;
}
app.use("/api/student", student);
app.use("/api/admin", admin);
app.use("/api/auth", auth);

app.listen(8081, () => {
  console.log(`Server is running on port 8080`);
  connectdb();
});