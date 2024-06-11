const express = require("express");
const router = express.Router();
const workspaceController = require("../controllers/workspaceController");

router
  .route("/")
  .get(workspaceController.getAllWorkspace)
  .post(workspaceController.createWorkspace);

router.route("/:id").get(workspaceController.getWorkspace);

module.exports = router;
