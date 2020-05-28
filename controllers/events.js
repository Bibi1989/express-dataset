const db = require("../database/index");

const getAllEvents = async (res) => {
  const sql = `SELECT * FROM events`;
  db.all(sql, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.status(200).json({ data: result });
  });
};

const addEvent = (users) => {
  const sql =
    "INSERT INTO events (id, type, actor_id, repo_id, created_at) VALUES (?,?,?,?,?)";
  const params = [1, "pushevevt", 1, 1, "2015-10-03 06:13:31"];
  // const row = await db.run(sql, params);
  // console.log({ row });
  db.run(sql, params, function (err, result) {
    if (err) {
      console.log({ err });
      return { error: err.message };
    }
    console.log(this.lastID);
    return {
      message: "success",
      data: result,
    };
  });
};

const getByActor = () => {};

const eraseEvents = (res) => {
  const sql = `DELETE FROM events`;
  db.run(sql, (err) => {
    if (err) {
      res.status(400).json({ error: err.message });
    }
    res.status(200).json({ message: "Deleted successfully" });
  });
};

module.exports = {
  getAllEvents: getAllEvents,
  addEvent: addEvent,
  getByActor: getByActor,
  eraseEvents: eraseEvents,
};
