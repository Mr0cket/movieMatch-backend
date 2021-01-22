const router = require("express").Router();
const auth = require("../auth/middleware");
const Models = require("../models");
const Movie = Models.movie;
const User = Models.user;
const UserMovie = Models.userMovie;
const { Op } = require("sequelize");

// GET /stagedList - Returns a staged list of 10 movies to show to the user.
router.get("/", auth, async (req, res, next) => {
  const { id: userId, partyId } = req.user;
  try {
    // get all group movies
    const groupMovies = await User.findAll({
      attributes: ["id"],
      include: [
        { model: Movie, through: { model: UserMovie, attributes: ["liked"] } }, // where: { liked: true }
      ],
      where: { partyId },
    });

    // get unique Movies That User Hasnt interacted with But Another User In Group Has liked
    const userMovieIdList = groupMovies
      .find((user) => user.id === userId)
      .dataValues.movies.map((movie) => movie.id);
    console.log("userIdList length:", userMovieIdList.length);
    // filter for lists of all other users in the group
    const groupLists = groupMovies
      .filter((user) => user.id !== userId)
      .map((user) => user.dataValues.movies);

    // combine lists into the same level of array
    const flattenedList = groupLists.flat(1);

    // filter for movies that have been liked
    const GroupLikedList = flattenedList
      .filter((movie) => movie.userMovies.dataValues.liked)
      .map((movie) => movie.dataValues);

    // filter for movies the current user hasn't previously interacted with
    const finalList = GroupLikedList.filter((movie) => !userMovieIdList.includes(movie.id));
    console.log("movies liked by group:", finalList.length);

    // ideally, should never have more than half the movies from other people's likes.
    if (finalList.length < 10) {
      // add new movies to the list to increase the length to 10.
      const amount = 10 - finalList.length;
      const extraItems = await Movie.findAll({
        limit: amount,
        where: { id: { [Op.notIn]: userMovieIdList } },
      });
      console.log("extraItems", extraItems.length);
      finalList.push(...extraItems.map((item) => item.dataValues));
    }
    console.log("final list length:", finalList.length); // should be 10
    const shuffled = shuffle(finalList);
    // console.log("first movie:", shuffled[0].title);
    res.send(shuffled);
  } catch (error) {
    console.log(`[stagingList]: ${error}`);
    next(error);
  }
});

// Use Fisher Yates algorithm to randomise staging order
function shuffle(arr) {
  const array = arr;
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

module.exports = router;
