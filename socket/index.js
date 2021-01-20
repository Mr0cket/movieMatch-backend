const { userFromToken } = require("../auth/jwt");
const UserMovie = require("../models").userMovie;
const User = require("../models").user;

// socket handler
module.exports = function socketHandler(socket) {
  console.log(`new connection: ${socket.id}`);

  socket.on("disconnect", () =>
    console.log(`user:${socket.user && socket.user.name} disconnected`)
  );

  socket.on("user/join", async (userToken) => {
    console.log("user/join event from client");
    if (socket.user && socket.user.name)
      return console.log(`[socket]: user (${socket.user.name}) is already connected`);
    try {
      const user = await userFromToken(userToken);
      socket.user = user;
      const { name, partyId } = user;

      socket.join(partyId);
      console.log(`[socket]user connected: ${name} in party: ${partyId}`);
    } catch (e) {
      console.log(`[socket] error getting user from DB`);
    }
  });

  socket.on("user/likedMovie", async (movie) => {
    console.log("[socket]: Liked ");
    if (!socket.user) return; // need to have a user.
    const { name, id: userId, partyId } = socket.user;
    const { id: movieId, title } = movie;

    try {
      // create new association
      const newUserMovie = await UserMovie.create({ userId, movieId, liked: true });
      console.log(
        `[socket][${partyId ? "group: " + partyId : ""}]movie ${title} liked by: ${name} `
      );
      const groupUsers = await User.findAll({ where: { partyId }, attributes: ["id"] });
      const userIds = groupUsers.map((user) => user.dataValues.id);
      console.log(userIds);
      const matches = await UserMovie.findAll({ where: { userId: userIds, movieId } });
      // There could be a problem here if not implemented correctly.
      // need to handle:
      // - match notification already shown
      if (matches.length > 1) socket.send("party/match", movie); // should use only movie ID, but will implement this later.
      console.log("[socket]: matches length", matches.length);
    } catch (error) {
      console.log(`[socket]:${error}`);
    }
  });

  socket.on("user/dislikedMovie", async (movie) => {
    // Add movie to userMovies (liked: false)
    // Add movie to staging list of other users (or just do that in the stagingList route...?)
    // Where to check for a movie match?
    /* on match:  
    -  */
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
