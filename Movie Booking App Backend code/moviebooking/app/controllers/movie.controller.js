// load the schema models 
const { movies } = require("../models");
const db = require("../models");

// use the Schema for the Movies
const Movies = db.movies;


const Movies = require('../models/movie.model');

exports.findAllMovies = (req, res) => {
  console.log(req.query.status);
  if (req.query.status == undefined) {
    Movies.find()
      .then(data => {
        res.send({ "movies": data });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving Movies."
        });
      });
  }
  else {
    let status = req.query.status;
    var conditionToCheck = null;

    if (status == "RELEASED") {
      conditionToCheck = { released: true }

      if (req.query.title != undefined) {
        conditionToCheck = { released: true, title: { $regex: new RegExp(req.query.title, "i") } }
        
      }// Check genres fetched from req.query.genres
      if (req.query.genres != undefined) {
        conditionToCheck.genres = { $in: req.query.genres.split(",") };
      }

      // Check artist fetched from req.query.artists
      if (req.query.artists != undefined) {
        conditionToCheck.artists = { $in: req.query.artists.split(",") };
      }

      // Check StartDate and EndDate fetched from respective query parameters
      if (req.query.start_date != undefined && req.query.end_date != undefined) {
        conditionToCheck.release_date = { $gte: new Date(req.query.start_date), $lte: new Date(req.query.end_date) };
      }
    }
    else if (status == "PUBLISHED") {
      conditionToCheck = { published: true }
    }
    console.log(conditionToCheck);

    Movies.find(conditionToCheck)
      .then(data => {
        res.send({ "movies": data });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving movies."
        });
      });
  }
};


exports.findOne = (req, res) => {
  const id = req.params.id;

  movies.find({ movieid: id })
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Movie with id " + id });
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving Movie with id=" + id });
    });
};


exports.findShows = (req, res) => {

  const id = req.params.id;

  movies.find({ movieid: id })
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Movie with id " + id });
      else {
        res.send(data[0].shows);//since we are getting an array after search
      }
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving Shows for movie with id=" + id });
    });


}