"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = _interopRequireDefault(require("express"));
var _morgan = _interopRequireDefault(require("morgan"));
var _path = require("path");
var _url = require("url");
var _cors = _interopRequireDefault(require("cors"));
var _carriersRoute = _interopRequireDefault(require("./routes/carriers.route.js"));
var _utilsRoute = _interopRequireDefault(require("./routes/utils.route.js"));
var _router_usersRoute = _interopRequireDefault(require("./routes/router_users.route.js"));
var _dropshipperRouter = _interopRequireDefault(require("./routes/dropshipper.router.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
// I import my scrip app where I do the routing and server configurations

// importing routes

/**
 * 
 * @apiDescription inicialization around variables
 *
 */
var app = (0, _express["default"])();
var CURRENT_DIR = (0, _path.dirname)((0, _url.fileURLToPath)(import.meta.url));
// Configuring CORS options to include multiple sources
var corsOptions = {
  origin: ["http://localhost:3000", "http://127.0.0.1:5500"],
  methods: ["OPTIONS", "GET", "POST", "PUT", "DELETE"],
  credentials: true,
  // Allow cross-origin cookies
  allowedHeaders: ["Content-Type", "Authorization"]
};
/**
 * 
 * @apiDescription middlewares and necessary settings
 *
 */
app.use((0, _cors["default"])(corsOptions));
app.use((0, _morgan["default"])('dev'));
app.use(_express["default"].json());
app.use(_express["default"].urlencoded({
  extended: true
}));
app.use('/documents_carrier', _express["default"]["static"]((0, _path.join)(CURRENT_DIR, '../documents_carrier')));
app.use('/documents_vehicle_carrier', _express["default"]["static"]((0, _path.join)(CURRENT_DIR, '../documents_vehicle_carrier')));

/**
 * @api /api
 * @apiName routes
 * @apiGroup routes
 * @apiDescription route definition
 *
 */
app.use(_carriersRoute["default"]);
app.use(_utilsRoute["default"]);
app.use(_router_usersRoute["default"]);
app.use(_dropshipperRouter["default"]);

// I export my app variable
var _default = exports["default"] = app;