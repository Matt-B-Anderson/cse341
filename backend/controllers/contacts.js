const mongodb = require("../db/connect");
const { ObjectId } = require("mongodb");

const getAll = async (req, res, next) => {
	const result = await mongodb.getDb().db().collection("contacts").find();
	result.toArray().then((lists) => {
		res.setHeader("Content-Type", "application/json");
		res.status(200).json(lists); // we just need the first one (the only one)
	});
};

const getById = async (req, res, next) => {
	const { id } = req.params;
	const result = await mongodb
		.getDb()
		.db()
		.collection("contacts")
		.findOne({ _id: new ObjectId(id) });

	res.setHeader("Content-Type", "application/json");
	return res.json(result);
};

const createContact = async (req, res) => {
	try {
		const contact = {
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			email: req.body.email,
			favoriteColor: req.body.favoriteColor,
			birthday: req.body.birthday,
		};
		const result = await mongodb
			.getDb()
			.db()
			.collection("contacts")
			.insertOne(contact);

		if (!result.acknowledged) {
			return res.status(500).json({ error: "Insert not acknowledged" });
		}

		const id = result.insertedId.toString();
		return res.status(201).location(`/contacts/${id}`).json({ id });
	} catch (err) {
		console.error(err);
		return res
			.status(500)
			.json({ error: "An error occurred while creating the contact" });
	}
};

const updateContact = async (req, res, next) => {
	try {
		const { id } = req.params;
		const contact = {
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			email: req.body.email,
			favoriteColor: req.body.favoriteColor,
			birthday: req.body.birthday,
		};
		const result = await mongodb
			.getDb()
			.db()
			.collection("contacts")
			.replaceOne({ _id: new ObjectId(id) }, contact);

		if (!result.acknowledged) {
			return res.status(500).json({ error: "Update not acknowledged" });
		}

		if (result.matchedCount === 0) {
			return res.status(404).json({ error: "Contact not found" });
		}
		return res.status(204).send();
	} catch (err) {
		return next?.(err) || res.status(500).json({ error: err.message });
	}
};
const deleteContact = async (req, res, next) => {
	try {
		const { id } = req.params;
		const result = await mongodb
			.getDb()
			.db()
			.collection("contacts")
			.deleteOne({ _id: new ObjectId(id) });

		if (result.deletedCount === 0) {
			return res.status(404).json({ error: "Contact not found" });
		}

		return res.status(204).send();
	} catch (err) {
		return next?.(err) || res.status(500).json({ error: err.message });
	}
};

module.exports = {
	getAll,
	getById,
	createContact,
	updateContact,
	deleteContact,
};
