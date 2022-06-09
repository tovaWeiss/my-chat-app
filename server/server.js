const express = require("express");
const db = require("./db/db.js");
const cors = require("cors");
const { mongoUri, port, secretCode, clientServer } = require("./config");
const bodyParser = require("body-parser")
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const app = express();

async function main() {

  // MongoDB
  try {
    await db.connect(mongoUri);
  } catch (except) {
    console.log("Error during connection to the database:");
    console.error(except);
    process.exit(1);
  }

  // Server
  app.use(bodyParser.json());

  app.get("/", function (req, res) {
    res.send({ status: "success" });
  });

  app.use(cors({
    origin: clientServer,
    optionsSuccessStatus: 200,
    credentials: true,
  }));

  app.use("/user", require("./routes/user.route"));
  app.use("/chat", require("./routes/chat.route"));

  const server = app.listen(port, () => console.log(`Server running on port ${port}.`));

  //Socket.IO

  //Bring in the models
  require("./models/chat");
  require("./models/user");
  require("./models/message");

  const Message = mongoose.model("Message");
  const User = mongoose.model("User");

  const io = require("socket.io")(server, {
    allowEIO3: true,

    cors: {
      origin: clientServer,
      methods: ["GET", "POST"],
      credentials: true
    },
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.query.token;
      const payload = await jwt.verify(token, secretCode);
      socket.userId = payload.user_id;
      next();
    } catch (err) { }
  });

  io.on("connection", (socket) => {
    console.log("Connected: " + socket.userId);

    socket.on("disconnect", () => {
      console.log("Disconnected: " + socket.userId);
    });

    socket.on("joinChat", ({ chatId }) => {
      socket.join(chatId);
      console.log("A user joined chat: " + chatId);
    });

    socket.on("leaveChat", ({ chatId }) => {
      socket.leave(chatId);
      console.log("A user left chat: " + chatId);
    });

    socket.on("chatMessage", async ({ chatId, message }) => {
      if (message.trim().length > 0) {
        const user = await User.findOne({ _id: socket.userId });
        // Create new Message.
        const newMessage = new Message({
          chat: chatId,
          user: socket.userId,
          message,
        });
        message = { message, user: user }

        io.to(chatId).emit("newMessage", {
          message
        });
        await newMessage.save();
      }
    });
  });
}

main();
