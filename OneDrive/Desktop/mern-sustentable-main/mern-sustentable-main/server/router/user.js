const express = require("express");
const multiparty = require("connect-multiparty");
const UserController = require("../controllers/user");
const md_auth = require("../middlewares/authenticated");

const md_upload = multiparty({ uploadDir: "./uploads/avatar" });
const api = express.Router();

api.get("/user/me", [md_auth.asureAuth], UserController.getUser);
api.get("/users", [md_auth.asureAuth], UserController.getUsers);
api.post("/add-user", [md_auth.asureAuth, md_upload], UserController.createUser);
api.patch(
  "/update-user/:id",
  [md_auth.asureAuth, md_upload],
  UserController.updateUser
);
api.delete("/delete-user/:id", [md_auth.asureAuth], UserController.deleteUser);
api.post("/verify-email", UserController.verifyEmail); //para recuperar contraseña
api.post("/send-email", UserController.sendEmail); //para recuperar contraseña
api.put("/update-password-by-token/:resetPasswordToken", UserController.updatePasswordByToken); //para recuperar contraseña

module.exports = api;