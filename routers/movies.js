const router = require("express").Router();
const { Op } = require("sequelize");
const auth = require("../auth/middleware");
const Models = require("../models");
const User = Models.user;
const UserMovie = Models.userMovie;
const Movie = Models.movie;

// GET => /movies/liked (authorised request)
router.get("/liked", async (req, res, next) => {
  // const { id: userId, partyId } = req.user;
  const userId = 1;
  // Need to validate fields
  // - check if user is even in a party etc.
  try {
    const userWithMovies = await User.findByPk(userId, {
      attributes: [],
      include: [
        { model: Movie, through: { model: UserMovie, attributes: [], where: { liked: true } } },
      ],
    });
    console.log("likedMovies", Object.keys(userWithMovies));
    const likedList = userWithMovies.movies.map((movie) => movie.dataValues);
    res.send(likedList);
  } catch (error) {
    console.log(`[matches]: ${error}`);
    next(error);
  }
});

module.exports = router;

// GET => /movies/matches (authorised request)
router.get("/matches", auth, async (req, res, next) => {
  const { id: userId, partyId } = req.user;
  // const userId = 1;
  // const partyId = 1;
  // Need to validate fields
  // - check if user is even in a party etc..
  try {
    const userMovies = await UserMovie.findAll({ where: { userId, liked: true } });
    const movieIds = userMovies.map((userMovie) => userMovie.movieId);

    // get other users Ids in group
    const groupUsers = await User.findAll({
      where: { partyId, id: { [Op.ne]: userId } },
    });
    const groupIds = groupUsers.map((user) => user.dataValues.id);
    console.log("groupIds:", groupIds);

    // get the matches between current user and other users in same party
    const movies = await UserMovie.findAll({ where: { userId: groupIds } });

    console.log("potential matches", movies);
    const matchIds = movies.map((movie) => movie.movieId);
    const rawMovieList = await Movie.findAll({ where: { id: matchIds } });

    const matchesList = rawMovieList
      .filter((movie) => movieIds.includes(movie.dataValues.id))
      .map((movie) => movie.dataValues);

    res.send(matchesList);
  } catch (error) {
    console.log(`[matches]: ${error}`);
    next(error);
  }
});

module.exports = router;
