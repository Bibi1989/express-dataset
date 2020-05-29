const createEventTable = `
  CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY,
    type TEXT NOT NULL,
    repo_id INTEGER NOT NULL,
    actor_id INTEGER NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY (repo_id) REFERENCES repos (repo_id),
    FOREIGN KEY (actor_id) REFERENCES actors (actor_id)
  )
`;

const createActorTable = `
  CREATE TABLE IF NOT EXISTS actors (
    id INTEGER PRIMARY KEY,
    login TEXT NOT NULL,
    avatar_url TEXT NOT NULL
  )
`;

const createRepoTable = `
  CREATE TABLE IF NOT EXISTS repos (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    url TEXT NOT NULL
  )
`;

const eraseAllEvents = `DELETE FROM events`;

const getAllEventsAscEventId = `SELECT * FROM events INNER JOIN actors ON events.actor_id=actors.id INNER JOIN repos ON events.repo_id=repos.id ORDER BY id ASC`;

const getEventByActorId = `SELECT * FROM events INNER JOIN actors ON events.actor_id=actors.id INNER JOIN repos ON events.repo_id=repos.id WHERE actor_id=? ORDER BY id ASC`;

const getStreakActors = `SELECT MIN(created_at) start
, MAX(created_at) end
, COUNT(*) total
FROM 
( SELECT l.*
       , CASE WHEN @prevx > created_at - INTERVAL 3600 SECOND THEN @ix:=@ix+1 ELSE @ix:=1 END i
       , CASE WHEN @ix=1 THEN @jx:=@jx+1 ELSE @jx:=@jx END j
       , @prevx := created_at
    FROM events l
       , (SELECT @prevx:=null,@ix:=1,@jx:=0) vars
   ORDER  
      BY l.created_at
) x
GROUP 
BY j
;`;

const updateActorLoginField = `UPDATE actors SET avatar_url=COALESCE(?,avatar_url) WHERE id=?`;

const createRepoQuery = `
  INSERT INTO repos(id, name, url) 
  VALUES(?, ?, ?)
`;

const createActorQuery = `
  INSERT INTO actors(id, login, avatar_url) 
  VALUES(?, ?, ?)
`;

const createEventQuery = `
  INSERT INTO events(repo_id, actor_id, id, type, created_at) 
  VALUES(?, ?, ?, ?, ?);
`;

const actorsByTotalEventsQuery = `
  SELECT *, (SELECT COUNT() FROM events WHERE actors.id = events.actor_id) as total_events FROM actors
  ORDER BY total_events DESC, actors.login
`;

module.exports = {
  createEventTable,
  createActorTable,
  createRepoTable,
  eraseAllEvents,
  getAllEventsAscEventId,
  updateActorLoginField,
  getEventByActorId,
  getStreakActors,
  createRepoQuery,
  createActorQuery,
  createEventQuery,
  actorsByTotalEventsQuery,
};
