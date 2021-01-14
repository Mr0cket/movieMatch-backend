const express = require("express");
const app = express();
const cors = require("cors");
const corsInstance = cors();
const httpServer = require("http").createServer(app);
const logMiddleware = require("morgan");

// Import Routers
const authRouter = require("./routers/auth");

const ioOptions = {
  cors: {
    origin: "*",
  },
};
const io = require("socket.io")(httpServer, ioOptions);

// socket handler
const socketHandler = require("./socket");
io.on("connection", socketHandler);

// Middleware
app.use(corsInstance);
app.use(express.json());
app.use(logMiddleware("dev")); // level of verboseness

// routes
app.use("/", authRouter);

// initiate server process
const port = process.env.PORT || 4000;
httpServer.listen(port, () =>
  console.log(`listening:
local:  localhost:${port}
lan:    192.168.1.20:${port}
`)
);
