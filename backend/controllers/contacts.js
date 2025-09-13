const mongodb = require('../db/connect');
const { ObjectId } = require('mongodb');

const getAll = async (req, res, next) => {
  const result = await mongodb.getDb().db().collection('contacts').find();
  result.toArray().then((lists) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(lists); // we just need the first one (the only one)
  });
};

const getById = async (req, res, next) => {
    const {id} = req.params
    const result = await mongodb.getDb().db().collection('contacts').findOne({ _id: new ObjectId(id) });

    res.setHeader('Content-Type', 'application/json');
    return res.json(result);
}

const createContact = async (req, res, ) => {
    const contact = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        favoriteColor: req.body.favoriteColor,
        birthday: req.body.birthday
    }
    const response = await mongodb.getDb().db().collection('contacts').insertOne(user);
    if (response.acknowledged) {
        res.status(204).send();
        return res.body._id;
    } else {
        res.status(500).json(response.error || 'An error occured while creating the user');
    }
}

const updateContact = async (req, res, ) => {
    const {id} = req.params
    const contact = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        favoriteColor: req.body.favoriteColor,
        birthday: req.body.birthday
    }
    const response = await mongodb.getDb().db().collection('contacts').replaceOne({_id: id}, user);
    if (response.modifiedCount > 0) {
        res.status(204).send();
    } else {
        res.status(500).json(response.error || 'An error occured while updating the user');
    }
}

const deleteContact = async (req, res, ) => {
    const {id} = req.params
    const response = await mongodb.getDb().db().collection('contacts').remove({_id: id}, true);
    if (response.deletedCount > 0) {
        res.status(204).send();
    } else {
        res.status(500).json(response.error || 'An error occured while deleting the user');
    }
}

module.exports = { getAll, getById, createContact, updateContact, deleteContact };