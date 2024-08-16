const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { API_VERSION } = require("./constants");

const app = express();

// Import routings
const authRoutes = require("./router/auth");
const userRoutes = require("./router/user");
const menuRoutes = require("./router/menu");
const courseRoutes = require("./router/course");
const roleRoutes = require("./router/role");
const permissionRoutes = require("./router/permission");
const companyRoutes = require("./router/company");
const siteRoutes = require("./router/site");
const newsletterRoutes = require("./router/newsletter");

// Configure Body Parser
 app.use(bodyParser.urlencoded({ extended: true }));
 app.use(bodyParser.json());

// Configure static folder
 app.use(express.static("uploads"));

// Configure Header HTTP - CORS
app.use(cors());

// Configure routings
app.use(`/api/${API_VERSION}`, authRoutes);
app.use(`/api/${API_VERSION}`, userRoutes);
app.use(`/api/${API_VERSION}`, menuRoutes);
app.use(`/api/${API_VERSION}`, courseRoutes);
app.use(`/api/${API_VERSION}`, siteRoutes);
app.use(`/api/${API_VERSION}`, newsletterRoutes);
app.use(`/api/${API_VERSION}`, roleRoutes);
app.use(`/api/${API_VERSION}`, permissionRoutes);
app.use(`/api/${API_VERSION}`, companyRoutes);

module.exports = app;