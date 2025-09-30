const mongodb = require("../db/connect");
const { ObjectId } = require("mongodb");

const getAll = async (req, res, next) => {
	const result = await mongodb.getDb().db().collection("movie-ratings").find();
	result.toArray().then((lists) => {
		res.setHeader("Content-Type", "application/json");
		res.status(200).json(lists);
	});
};

const getById = async (req, res, next) => {
	const { id } = req.params;
	const result = await mongodb
		.getDb()
		.db()
		.collection("movie-ratings")
		.findOne({ _id: new ObjectId(id) });

	res.setHeader("Content-Type", "application/json");
	return res.json(result);
};

const createMovieRating = async (req, res) => {
	try {
		const userId = req.auth.sub;
		const githubId = req.auth.githubId;

		const movieRating = {
            userId,
  			githubId,
  			userName: req.user?.username || req.body.userName,
  			movieType: req.body.movieType,
  			movieTitle: req.body.movieTitle,
  			watchDate: req.body.watchDate,
  			rating: req.body.rating,
  			movieGenre: req.body.movieGenre,
  			movieReleaseYear: req.body.movieReleaseYear,
  			createdAt: new Date()
		};
		const result = await mongodb
			.getDb()
			.db()
			.collection("movie-ratings")
			.insertOne(movieRating);

		if (!result.acknowledged) {
			return res.status(500).json({ error: "Insert not acknowledged" });
		}

		const id = result.insertedId.toString();
		return res.status(201).location(`/movieRating/${id}`).json({ id });
	} catch (err) {
		console.error(err);
		return res
			.status(500)
			.json({ error: "An error occurred while creating the movie rating" });
	}
};

const updateMovieRating = async (req, res, next) => {
	try {
		const { id } = req.params;
		const movieRating = {
			userName: req.body.userName,
			movieType: req.body.movieType,
			movieTitle: req.body.movieTitle,
			watchDate: req.body.watchDate,
			rating: req.body.rating,
            movieGenre: req.body.movieGenre,
            movieReleaseYear: req.body.movieReleaseYear
		};
		const result = await mongodb
			.getDb()
			.db()
			.collection("movie-ratings")
			.replaceOne({ _id: new ObjectId(id) }, movieRating);

		if (!result.acknowledged) {
			return res.status(500).json({ error: "Update not acknowledged" });
		}

		if (result.matchedCount === 0) {
			return res.status(404).json({ error: "Movie rating not found" });
		}
		return res.status(204).send();
	} catch (err) {
		return next?.(err) || res.status(500).json({ error: err.message });
	}
};
const deleteMovieRating = async (req, res, next) => {
	try {
		const { id } = req.params;
		const result = await mongodb
			.getDb()
			.db()
			.collection("movie-ratings")
			.deleteOne({ _id: new ObjectId(id) });

		if (result.deletedCount === 0) {
			return res.status(404).json({ error: "Movie rating not found" });
		}

		return res.status(204).send();
	} catch (err) {
		return next?.(err) || res.status(500).json({ error: err.message });
	}
};

module.exports = {
	getAll,
	getById,
	createMovieRating,
	updateMovieRating,
	deleteMovieRating,
};
