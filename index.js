const express = require("express");
const app = express();
const cors = require("cors");
const corsInstance = cors();
const httpServer = require("http").createServer(app);
const logMiddleware = require("morgan");
const jsonParser = express.json();

// Import Routers
const authRouter = require("./routers/auth");
const stagingRouter = require("./routers/stagingList");
const partyRouter = require("./routers/party");
const matchesRouter = require("./routers/matches");
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
app.use(jsonParser);
app.use(logMiddleware("dev")); // level of verboseness

// routes
app.use("/", authRouter);
app.use("/stagingList", stagingRouter);
app.use("/party", partyRouter);
app.use("/matches", matchesRouter);

// initiate server process
const internalIp = require("internal-ip").v4.sync();
const port = process.env.PORT || 4000;
httpServer.listen(port, () =>
  console.log(`listening on:
local:  localhost:${port}
lan:    ${internalIp}:${port}
`)
);
