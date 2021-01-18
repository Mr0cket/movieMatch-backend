const router = require("express").Router();
const auth = require("../auth/middleware");
const Movie = require("../models").movie;

// GET /stagedList - Returns a staged list of 5 movies to show to the user.
// user must not have previously interacted with the movies
//
router.get("/", async (req, res, next) => {
  // use auth later on
  console.log(req.user);
  // get movies from backend
  // where
  // send movies to FrontEnd
  const { page } = req.query;
  console.log(`fetching page: ${page}`);
  try {
    // where userId doesn't match user &  any other users in the same group have liked the same movie

    // movies where groupId === userId

    //  needs a crazy where statement....
    const movies = await Movie.findAndCountAll({ offset: page * 10, limit: 10 });

    const movieList = movies.rows.map((movie) => movie.dataValues);
    console.log("first movie", movieList[0]);
    console.log("list length:", movies.rows.length);
    res.send(movieList);
  } catch (e) {
    console.log(`error: ${e}`);
    next(e);
  }
});

module.exports = router;
