const db = require("../database/index");

const getAllActors = async (res) => {
  var sql = "select * from events";
  var params = [];
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.json({ error: err.message });
    }
    res.json({ data: rows });
  });
};

const updateActor = () => {};

const getStreak = () => {};

module.exports = {
  updateActor: updateActor,
  getAllActors: getAllActors,
  getStreak: getStreak,
};
