const Workspace = require("../models/workspaceModel");

exports.getAllWorkspace = async function (req, res) {
  const workspaces = await Workspace.find();

  res.status(200).json({ status: "success", data: { workspaces } });
};

exports.createWorkspace = async function (req, res) {
  const workspace = await Workspace.create(req.body);
  res.status(201).json({ status: "success", data: { workspace } });
};
