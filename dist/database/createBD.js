"use strict";

var _database = require("./database.js");
require("./models/project.js");
require("./models/task.js");
await _database.sequelize.sync({
  force: true
});