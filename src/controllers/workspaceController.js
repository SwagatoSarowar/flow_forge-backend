const Workspace = require("../models/workspaceModel");
const catchAsync = require("../utils/catchAsync");

exports.getAllWorkspace = catchAsync(async function (req, res, next) {
  const workspaces = await Workspace.find();

  res.status(200).json({ status: "success", data: { workspaces } });
});

exports.getWorkspace = catchAsync(async function (req, res, next) {
  const workspace = await Workspace.findById(req.params.id);
  res.status(200).json({ status: "success", data: { workspace } });
});

exports.createWorkspace = catchAsync(async function (req, res, next) {
  const workspace = await Workspace.create(req.body);
  res.status(201).json({ status: "success", data: { workspace } });
});
