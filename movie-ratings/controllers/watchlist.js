// controllers/watchlist.js
const { ObjectId } = require('mongodb');
const mongodb = require('../db/connect');

const getCollection = () => mongodb.getDb().db().collection('watchlist');

const getList = async (req, res) => {
  try {
    const col = getCollection();
    const items = await col
      .find({ userId: new ObjectId(req.user._id) })
      .sort({ addedAt: -1 })
      .toArray();
    res.json(items);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
};

const create = async (req, res) => {
  try {
    const {title, status = 'planned', notes = '' } = req.body || {};
    if (!title) {
      return res.status(400).json({ error: 'title are required' });
    }

    const now = new Date();
    const doc = {
      userId: new ObjectId(req.user._id),
      title: String(title),
      status,
      notes,
      addedAt: now,
      updatedAt: now
    };

    const col = getCollection();
    const result = await col.updateOne(
      { userId: doc.userId },
      { $setOnInsert: doc },
      { upsert: true }
    );

    if (result.upsertedCount === 1) {
      return res.status(201).json({ ok: true, insertedId: result.upsertedId });
    } else {
      return res.status(200).json({ ok: true, message: 'Already on watchlist' });
    }
  } catch (e) {
    if (String(e).includes('E11000')) {
      return res.status(200).json({ ok: true, message: 'Already on watchlist' });
    }
    res.status(500).json({ error: String(e) });
  }
};

const update = async (req, res) => {
  try {
    const _id = new ObjectId(req.params.id);
    const { status, notes } = req.body || {};
    const set = { updatedAt: new Date() };
    if (status) set.status = status;
    if (typeof notes === 'string') set.notes = notes;

    if (!status && typeof notes !== 'string') {
      return res.status(400).json({ error: 'Provide status and/or notes to update' });
    }

    const col = getCollection();
    const result = await col.updateOne(
      { _id, userId: new ObjectId(req.user._id) },
      { $set: set }
    );

    if (result.matchedCount === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ ok: true, modifiedCount: result.modifiedCount });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
};

const remove = async (req, res) => {
  try {
    const _id = new ObjectId(req.params.id);
    const col = getCollection();
    const result = await col.deleteOne({ _id, userId: new ObjectId(req.user._id) });
    if (result.deletedCount === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
};

const getStats = async (req, res) => {
  try {
    const col = getCollection();
    const agg = await col.aggregate([
      { $match: { userId: new ObjectId(req.user._id) } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]).toArray();

    const stats = agg.reduce((acc, x) => ({ ...acc, [x._id]: x.count }), {});
    res.json({ stats });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
};


module.exports = { getList, create, update, remove, getStats}