const db = require("../database/index");
const dbQueries = require("../database/queries");

const getAllEvents = (req, res) => {
  db.all(dbQueries.getAllEventsAscEventId, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    const m = result.map((r) => ({
      id: r.id,
      type: r.type,
      actor: {
        id: r.actor_id,
        login: r.login,
        avatar_url: r.avatar_url,
      },
      repo: {
        id: r.repo_id,
        name: r.name,
        url: r.url,
      },
      created_at: r.created_at,
    }));
    res.status(200).json({ data: m });
  });
};

const addEvent = (req, res) => {
  const { repo, actor, ...event } = req.body;
  // console.log({ repo, actor, event });
  // console.log(
  //   Object.values({ repo_id: 4849849040994904, actor_id: actor.id, ...event }),
  //   Object.values(repo),
  //   Object.values(actor)
  // );

  try {
    db.serialize(function () {
      db.all(
        "SELECT * FROM repos WHERE repos.id = ?",
        repo.id,
        (err, result) => {
          // console.log({ err, result });
          if (!err && result.length < 1) {
            db.run(dbQueries.createRepoQuery, Object.values(repo));
          }
        }
      );

      db.all(
        "SELECT * FROM actors WHERE actors.id = ?",
        actor.id,
        (err, result) => {
          // console.log({ err, result });
          if (!err && result.length === 0) {
            db.run(dbQueries.createActorQuery, Object.values(actor));
          }
        }
      );

      db.all(
        "SELECT * FROM events WHERE events.id = ?",
        event.id,
        (err, result) => {
          // console.log({ err, result });
          if (!err && result.length > 0) {
            res.status(400).json({ message: "Shit happened" });
          } else {
            db.run(
              dbQueries.createEventQuery,
              Object.values({ repo_id: repo.id, actor_id: actor.id, ...event })
            );
            res.status(201).json(req.body);
          }
        }
      );
    });
  } catch (error) {
    console.log({ error });
  }
};

// const addEvent = (req, res) => {
//   // const {
//   //   id,
//   //   type,
//   //   created_at,
//   //   actor: { id: actor_id, login, avatar_url },
//   //   repo: { id: repo_id, name, url },
//   // } = req.body;

//   const sql =
//     "INSERT INTO events (id, type, actor_id, repo_id, created_at) VALUES (?,?,?,?,?)";
//   const params = [
//     req.body.id,
//     req.body.type,
//     req.body.actor_id,
//     req.body.repo_id,
//     "2015-10-03 06:13:31",
//   ];
//   db.run(sql, params, function (err) {
//     if (err) {
//       console.log({ err });
//       res.status(400).json({ error: err.message });
//     }
//     res.json({
//       message: "success",
//       data: req.body,
//     });
//   });
// };

const getByActor = (req, res) => {
  const sql = `SELECT * FROM events WHERE actor_id=? ORDER BY id ASC`;
  const params = [Number(req.params.actor_id)];
  db.all(sql, params, (err, row) => {
    if (err) {
      res.status(404).json({ error: err.message });
    }
    if (row.length < 1) {
      res.status(404).json({});
    }
    res.status(200).json({ data: row });
  });
};

const eraseEvents = (_req, res) => {
  db.run(dbQueries.eraseAllEvents, (err) => {
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
