const express = require("express");
const router = express.Router();
const workspaceController = require("../controllers/workspaceController");

router
  .route("/")
  .get(workspaceController.getAllWorkspace)
  .post(workspaceController.createWorkspace);

module.exports = router;
