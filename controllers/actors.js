const db = require("../database/index");
const dbQueris = require("../database/queries");

const getAllActors = (req, res) => {
  db.all(dbQueris.actorsByTotalEventsQuery, [], (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
    } else if (!null && result.length > 0) {
      res.status(200).json(result);
    } else {
      res.status(400).json({ error: "No actor found!!!" });
    }
  });
};

const updateActor = (req, res) => {
  const { actor_id } = req.body;
  let params = [req.body.avatar_url, actor_id];
  db.run(dbQueris.updateActorLoginField, params, function (err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    if (this.lastID) {
      return res.status(200).json({ message: "Updated successfully!!!" });
    } else {
      return res.status(404).json({ error: "Not found" });
    }
  });
};

const getStreak = (req, res) => {
  db.all(dbQueris.getStreakActors, [], (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    return res.json(row);
  });
};

module.exports = {
  updateActor: updateActor,
  getAllActors: getAllActors,
  getStreak: getStreak,
};
