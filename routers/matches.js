const router = require("express").Router();

const auth = require("../auth/middleware");
const Models = require("../models");
const User = Models.user;
const UserMovie = Models.userMovie;
const Movie = Models.movie;

// get userMovies for current user
// GET => /matches (authorised request)
router.get("/", auth, async (req, res, next) => {
  const { id: userId } = req.user;
  try {
    const userMovies = await UserMovie.findAll({ where: { userId, liked: true } });
    const movieIds = userMovies.map((userMovie) => userMovie.movieId);

    // get other users Ids in group
    const groupUsers = User.findAll({
      where: { partyId: req.user.partyId, id: { [Op.ne]: req.user.id } },
    });
    const groupIds = groupUsers.map((user) => user.dataValues.id);

    // get the matches between current user and other users in same party
    const matches = UserMovie.findAll({ where: { movieId: movieIds, userId: groupIds } });
    const matchIds = matches.map((match) => match.movieId);
    const rawMovieList = Movie.findAll({ where: { id: matchIds } });

    const movieList = rawMovieList.map((movie) => movie.dataValues);

    res.send(movieList);
  } catch (error) {
    console.log(`[matches]: ${error}`);
    next(error);
  }
});

module.exports = router;
