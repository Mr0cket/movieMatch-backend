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
  try {
    // findAndCountAll({offset: ?, limit: 5})
    const movies = await Movie.findAndCountAll({ limit: 10 });
    const movieList = movies.rows.map((movie) => movie.dataValues);
    // console.log(movieList);
    console.log("list length:", movies.rows.length);
    res.send(movieList);
  } catch (e) {
    console.log(`error: ${e}`);
    next(e);
  }
});

module.exports = router;
