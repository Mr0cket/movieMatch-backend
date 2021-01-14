const express = require("express");
const app = express();
const cors = require("cors");
const corsInstance = cors();
const httpServer = require("http").createServer(app);
const ioOptions = {
  cors: {
    origin: "*",
  },
};
const io = require("socket.io")(httpServer, ioOptions);
app.use(corsInstance);

// socket handler
const socketHandler = require("./socket");

io.on("connection", socketHandler);

const port = process.env.PORT || 4000;
httpServer.listen(port, () =>
  console.log(`listening:
local:  localhost:3000
lan:    192.168.1.20:3000
`)
);
