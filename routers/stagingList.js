const router = require("express").Router();
const auth = require("../auth/middleware");
const Models = require("../models");
const Movie = Models.movie;
const User = Models.user;
const UserMovie = Models.userMovie;
const { Op } = require("sequelize");

// GET /stagedList - Returns a staged list of 5 movies to show to the user.
// user must not have previously interacted with the movies
//
router.get("/", auth, async (req, res, next) => {
  // use auth later on
  // get movies from backend
  // where
  // send movies to FrontEnd
  const { page } = req.query;
  console.log(`fetching page: ${page}`);
  const { id: userId, partyId } = req.user;
  try {
    // get group movies
    const groupMovies = await User.findAll({
      attributes: ["id"],
      include: [
        { model: Movie, through: { model: UserMovie, attributes: ["liked"] } }, // where: { liked: true }
      ],
      where: { partyId },
    });

    // get unique Movies That User Hasnt interacted with But A User In Group Has liked
    const userMovieIdList = groupMovies
      .find((user) => user.id === userId)
      .dataValues.movies.map((movie) => movie.id);
    console.log("userIdList length:", userMovieIdList.length);
    const groupLists = groupMovies
      .filter((user) => user.id !== userId)
      .map((user) => user.dataValues.movies); // gets the lists of all users in the group

    // combine the lists
    const flattenedList = groupLists.flat(1);

    const GroupLikedList = flattenedList
      .filter((movie) => movie.userMovies.dataValues.liked)
      .map((movie) => movie.dataValues);

    const finalList = GroupLikedList.filter((movie) => !userMovieIdList.includes(movie.id));
    console.log(finalList.length);

    if (finalList.length < 10) {
      const amount = 10 - finalList.length;
      const extraItems = await Movie.findAll({
        limit: amount,
        where: { id: { [Op.notIn]: userMovieIdList } },
      });
      console.log("extraItems", extraItems.length);
      console.log("finalList", finalList.length);
      finalList.push(...extraItems.map((item) => item.dataValues));
    }
    // console.log(finalList.length);
    res.send(shuffle(finalList));
  } catch (error) {
    console.log(`[stagingList]: ${error}`);
    next(error);
  }
});
function shuffle(arr) {
  const array = arr;
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/* router.get("/", auth, async (req, res, next) => {
  const { page } = req.query;
  console.log(`fetching page: ${page}`);
  const { id: userId, partyId } = req.user;
  try {
    const movieList = await Movie.findAll({ limit: 20 });

    console.log("first movie", movieList[0]);
    console.log("list length:", movieList.length);
    res.send(movieList);
  } catch (error) {
    console.log(`[stagingList]: ${error}`);
    next(error);
  }
});
 */
module.exports = router;
