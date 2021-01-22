"use strict";
const axios = require("axios");
const pages = require("../config/constants").movieSeedPages;
const genres = require("./genres.json");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const endpoint = `https://api.themoviedb.org/3/discover/movie?api_key=eb066629e9e5aca99797f3955400c4bd&language=en-US&sort_by=popularity.desc&include_adult=true&include_video=false&page=`;
    try {
      let combinedPagesList = [];
      for (let i = 1; i <= pages; i++) {
        const res = await axios.get(endpoint + i);
        // need to properly parse data to make it fit table columns
        const originalList = res.data.results;
        const parsedList = originalList.map((movie) => {
          const {
            id: movieId,
            title,
            overview,
            poster_path,
            release_date: releaseDate,
            vote_average: rating,
            genre_ids,
            popularity,
          } = movie;
          const posterUrl = "https://image.tmdb.org/t/p/w500" + poster_path;
          const genresMapped =
            genre_ids && genre_ids.length > 0 ? genre_ids.map((id) => genres[id].name) : ["Idunno"];
          const mainGenre = genresMapped.join(",");

          if (releaseDate)
            return {
              movieId,
              title,
              mainGenre,
              overview,
              posterUrl,
              releaseDate,
              rating,
              popularity,
              createdAt: new Date(),
              updatedAt: new Date(),
            };
          else
            return {
              movieId,
              title,
              overview,
              posterUrl,
              rating,
              createdAt: new Date(),
              updatedAt: new Date(),
            };
        });
        combinedPagesList = [...combinedPagesList, ...parsedList];
      }
      await queryInterface.bulkInsert("movies", combinedPagesList);
    } catch (e) {
      console.log(e.message);
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("movies", null, {});
  },
};
