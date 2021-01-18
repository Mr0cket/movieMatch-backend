const { userFromToken } = require("../auth/jwt");
const UserMovie = require("../models").userMovie;

// socket handler
module.exports = function socketHandler(socket) {
  console.log(`new connection: ${socket.id}`);

  socket.on("user/join", async (userToken) => {
    try {
      const user = await userFromToken(userToken);
      socket.user = user;
      const { name, partyId } = user;
      // what if userMovie had a partyId ?? then could just query the partyId of the user to get the movies to show.

      // each party has their own room;
      // whenever a user in a party likes/dislikes movie,
      // movie is added to other users staging lists...?
      // event is emited to all other members of party?
      // other user clients then get that movie and add it to their staging list?
      // or, added when they fetch a new list from /staginglist...??
      // OOOR, just socket.emit an event to the party room with the movie??
      socket.join(partyId);
      console.log(`[socket]user connected: ${name} joined party: ${partyId}`);
    } catch (e) {
      console.log(`[socket] error getting user from DB`);
    }
  });

  socket.on("user/likedMovie", async (movie) => {
    // Add movie to userMovies (liked: true)
    // Add movie to staging list of other users (or just do that in the stagingList route...?)
    // Where to check for a movie match?
    if (!socket.user) return; // need to have a user.
    const { name, id: userId, partyId } = socket.user;
    const { id: movieId, title } = movie;

    try {
      // create new association
      const newUserMovie = await UserMovie.create({ userId, movieId, liked: true });
      console.log(
        `[socket][${partyId ? "group: " + partyId : ""}]movie ${title} liked by: ${name} `
      );
      socket.to(partyId).emit("party/movieLiked", movie);
    } catch (error) {
      console.log(`[socket]:${error}`);
    }
  });

  socket.on("user/dislikedMovie", async (movie) => {
    // Add movie to userMovies (liked: false)
    // Add movie to staging list of other users (or just do that in the stagingList route...?)
    // Where to check for a movie match?
    /* on match:  
    - socket.send() */
    if (!socket.user) return; // need to have a user.
    const { name, id: userId, partyId } = socket.user;
    const { id: movieId, title } = movie;
    try {
      const newUserMovie = await UserMovie.create({ userId, movieId, liked: true });
      socket.to(partyId).emit("party/movieLiked", movie);
      console.log(
        `[socket][${partyId ? "group: " + partyId : ""}]movie ${movieId} disliked by: ${name}`
      );
    } catch (error) {
      console.log(`[socket]:${error}`);
    }
  });
};
