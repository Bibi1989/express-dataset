const express = require("express");
const router = express.Router();
const getAllActors = require("../controllers/actors").getAllActors;
const updateActor = require("../controllers/actors").updateActor;

// Routes related to actor.

router.get("/", getAllActors);
// router.get("/", (req, res) => {
//   getAllActors(res);
// });

router.put("/", updateActor);

module.exports = router;
