const db = require("../database/index");
const dbQueries = require("../database/queries");

const getAllEvents = (req, res) => {
  db.all(dbQueries.getAllEventsAscEventId, (err, result) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    const resultObject = result.map((r) => ({
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
    res.status(200).json(resultObject);
  });
};

const addEvent = (req, res) => {
  const { repo, actor, ...event } = req.body;

  try {
    db.serialize(function () {
      db.all(
        "SELECT * FROM repos WHERE repos.id = ?",
        repo.id,
        (err, result) => {
          if (!err && result.length < 1) {
            db.run(dbQueries.createRepoQuery, Object.values(repo));
          }
        }
      );

      db.all(
        "SELECT * FROM actors WHERE actors.id = ?",
        actor.id,
        (err, result) => {
          if (!err && result.length === 0) {
            db.run(dbQueries.createActorQuery, Object.values(actor));
          }
        }
      );

      db.all(
        "SELECT * FROM events WHERE events.id = ?",
        event.id,
        (err, result) => {
          if (!err && result.length > 0) {
            res.status(400).json({ message: "Shit happened" });
          } else {
            db.run(
              dbQueries.createEventQuery,
              Object.values({
                repo_id: repo.id,
                actor_id: actor.id,
                id: event,
                ...event,
              })
            );
            console.log(
              Object.values({
                repo_id: repo.id,
                actor_id: actor.id,
                id: event,
                ...event,
              })
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

const getByActor = (req, res) => {
  const params = [Number(req.params.actor_id)];
  db.all(dbQueries.getEventByActorId, params, (err, rows) => {
    if (err) {
      res.status(404).json({ error: err.message });
    }
    if (rows.length < 1) {
      res.status(404).json({});
    }
    const rowObject = rows.map((r) => ({
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
    res.status(200).json(rowObject);
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
