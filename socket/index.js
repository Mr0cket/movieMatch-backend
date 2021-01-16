module.exports = function socketHandler(socket) {
  console.log(`new connection id: ${socket.id}`);

  socket.on("join", (stuff) => {
    // what user thing should I pass?
    socket.user = stuff;
    // add user to the room of other people in same group??

    //
  });
  socket.on("movie liked", (movieId) => {
    // Add movie to userMovies (liked: true)
    // Add movie to staging list of other users (or just do that in the stagingList route...?)
    // Where to check for a movie match?
  });
  socket.on("movie disliked", (movieId) => {
    // Add movie to userMovies (liked: false)
    // Add movie to staging list of other users (or just do that in the stagingList route...?)
    // Where to check for a movie match?
    /* on match:  

    - socket.send() */
  });
};
