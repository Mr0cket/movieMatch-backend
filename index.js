const express = require("express");
const app = express();
const cors = require("cors");
const corsInstance = cors();
const logMiddleware = require("morgan");
const jsonParser = express.json();

// Middleware
app.use(corsInstance);
app.use(jsonParser);
app.use(logMiddleware("dev")); // level of verboseness

// Import Routers
const authRouter = require("./routers/auth");
const stagingRouter = require("./routers/stagingList");
const partyRouter = require("./routers/party");
const moviesRouter = require("./routers/movies");

// Routes
app.use("/", authRouter);
app.use("/stagingList", stagingRouter);
app.use("/party", partyRouter);
app.use("/movies", moviesRouter);

// Execute server process
const internalIp = require("internal-ip").v4.sync();
const port = process.env.PORT || 4000;
const httpServer = app.listen(port, () =>
  console.log(`listening on:
local:  localhost:${port}
lan:    ${internalIp}:${port}
`)
);

// initialise socket.io & configure CORS
const io = require("socket.io")(httpServer, {
  cors: {
    origin: "*",
  },
});

// handle web-socket connections
const socketHandler = require("./socket");
io.on("connection", (socket) => socketHandler(socket, io));
