const { userFromToken } = require("../auth/jwt");
const UserMovie = require("../models").userMovie;
const User = require("../models").user;

// socket handler
module.exports = function socketHandler(socket, io) {
  console.log(`new connection: ${socket.id}`);

  // error handling/listeners
  socket.on("disconnect", () =>
    console.log(`[socket]: ${socket.user && socket.user.name} disconnected`)
  );
  socket.on("connect_failed", () =>
    console.log(`[socket]: connection failed with: ${socket.user && socket.user.name}`)
  );
  socket.on("reconnect", () =>
    console.log(`[socket]: reconnected to client: ${socket.user && socket.user.name}`)
  );
  socket.on("error", () => console.log(`[socket]: error: ${socket.user && socket.user.name}`));

  socket.on("user/join", async (userToken) => {
    console.log("[socket]: user/join event from client");
    if (socket.user && socket.user.name)
      return console.log(`[socket]: user (${socket.user.name}) is already connected`);
    if (!userToken) return console.log(`[socket]: no user token to authenticate session`);
    try {
      const user = await userFromToken(userToken);
      socket.user = user;
      const { name, partyId } = user;

      socket.join(partyId);
      console.log(`[socket]user connected: ${name} in party: ${partyId}`);
    } catch (e) {
      console.log(`[socket] DBerror: ${e}`);
    }
  });

  socket.on("user/likedMovie", async (movie) => {
    if (!socket.user) return console.log("[socket]: liked movie, No user attached.");
    const { name, id: userId, partyId } = socket.user;
    const { id: movieId, title } = movie;
    try {
      // create new association
      const newUserMovie = await UserMovie.create({ userId, movieId, liked: true });
      console.log(
        `[socket][${partyId ? "group: " + partyId : ""}]movie ${title} liked by: ${name} `
      );
      // check if there is a match
      const groupUsers = await User.findAll({ where: { partyId }, attributes: ["id"] });
      const userIds = groupUsers.map((user) => user.dataValues.id);
      const matches = await UserMovie.findAll({ where: { userId: userIds, movieId } });
      // There could be a problem here if not implemented correctly.
      // need to handle:
      // - match notification already shown
      if (matches.length > 1) {
        // should use only movie ID, but will implement this later
        io.in(partyId).emit("party/match", movie);
        console.log("[socket]: match emitted to party!", matches.length);
      } else console.log("[socket]: no movie match");
    } catch (error) {
      console.log(`[socket]likedMovie error:${error}`);
    }
  });

  socket.on("user/dislikedMovie", async (movie) => {
    // Add movie to userMovies (liked: false)
    // Add movie to staging list of other users (or just do that in the stagingList route...?)
    // Where to check for a movie match?
    /* on match:  
    - 
    */
    if (!socket.user) return; // need to have a user.
    const { name, id: userId, partyId } = socket.user;
    const { id: movieId, title } = movie;
    try {
      const newUserMovie = await UserMovie.create({ userId, movieId, liked: false });
      console.log(
        `[socket][${partyId ? "group: " + partyId : ""}]movie ${movieId} disliked by: ${name}`
      );
    } catch (error) {
      console.log(`[socket]:${error}`);
    }
  });
};
