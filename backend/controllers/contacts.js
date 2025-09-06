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

module.exports = { getAll, getById };