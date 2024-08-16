const bcrypt = require("bcryptjs");
const User = require("../models/user");
const Role = require("../models/role");
const image = require("../utils/image");
const { default: mongoose } = require("mongoose");

async function getUser(req, res) {
  const { user_id } = req.user;

  const response = await User.findById(user_id).populate("role").populate("company");
  // console.log(response)
  if (!response) {
    res.status(400).send({ msg: "No se ha encontrado usuario" });
  } else {
    res.status(200).send(response);
  }
}

async function getUsers(req, res) {
  const { active } = req.query;
  let response = null;

  let role= await Role.find({"name":"Master"});

  if (active === undefined) {
    response = await User.find({"role":{$ne: role[0]._id }});
  } else {
    response = await User.find({ active , "role":{$ne:role[0]._id }});
  }

  res.status(200).send(response);
}

async function createUser(req, res) {
  const { password } = req.body;
  //console.log(req.body);
  const user = new User({ ...req.body, active: false });

  const salt = bcrypt.genSaltSync(10);
  const hasPassword = bcrypt.hashSync(password, salt);
  user.password = hasPassword;

  if (req.files.avatar) {
    const imagePath = image.getFilePath(req.files.avatar);
    user.avatar = imagePath;
    user.avatar = "avatar/"+imagePath;
  }

  user.save((error, userStored) => {
    if (error) {
      console.log(error)
      res.status(500).send({ code:400, msg: "El usuario ya existe" });
    } else {
      if (!userStored) {
        res.status(400).send({ msg: "Error al crear el usuario" });
      } else {
        res.status(200).send(userStored);
      }
    }
  });
}

async function updateUser(req, res) {
  const { id } = req.params;
  const userData = req.body;

  if (userData.password) {
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(userData.password, salt);
    userData.password = hashPassword;
  } else {
    delete userData.password;
  }

  if (req.files.avatar) {
    const imagePath = image.getFilePath(req.files.avatar);
    userData.avatar = "avatar/"+imagePath;
  }

  User.findByIdAndUpdate({ _id: id }, userData, (error,response) => {
    if (error) {
      console.log(error)
      res.status(400).send({ msg: "Error al actualizar el usuario" });
    } else {
      res.status(200).send({ msg: "Actualizacion correcta" });
    }
  });
}

async function deleteUser(req, res) {
  const { id } = req.params;

  User.findByIdAndDelete(id, (error) => {
    if (error) {
      res.status(400).send({ msg: "Error al eliminar el usuario" });
    } else {
      res.status(200).send({ msg: "Usuario eliminado" });
    }
  });
}

async function verifyEmail(req, res) {
  //para recuperar contraseña
  const params = req.body;
  const email = params.email.toLowerCase();

  User.findOne({ email }, (err, userStored) => {
    if (err) {
      res.status(500).send({ msg: "Error del servidor" });
    } else {
      if (!userStored) {
        //si no puede enviar el correo
        res.status(404).send({ msg: "e-mail no encontrado" });
      } else {
        res.status(200).send({ msg: "e-mail encontrado" });
      }
    }
  });
}

async function sendEmail(req, res) {
  //para recuperar contraseña
  let userData = req.body;
  const email = userData.email.toLowerCase();

  if (email === "") {
    res.status(400).send("e-mail requerido");
  }
  console.error(email);

  let user = await User.findOneAndUpdate(
    { email },
    userData,
    (err, userStored) => {
      userData.resetPasswordToken = "aaa";
      userData.resetPasswordExpires = "aaa";
      resetPToken = userData.resetPasswordToken; //"aaa"
      resetPExpires = userData.resetPasswordExpires; //"aaa"
      if (err) {
        res.status(500).send({ message: "Error del servidor" });
      } else {
        if (!userStored) {
          res.status(404).send({ message: "e-mail no encontrado" });
        } else {
          console.log("e-mail encontrado");

          const token = crypto.randomBytes(20).toString("hex");
          console.log("token: ", token);
          if (resetPToken) {
            //resetPToken = JSON.stringify(token);
            resetPToken = token;
            console.log("token actualizado");
          }
          if (resetPExpires) {
            resetPExpires = Date.now() + 3600000; //caduca en una hora
            console.log("expiraciÓn actualizada");
          }
          sendNodemailer(email, resetPToken);
          userData.resetPasswordToken = resetPToken;
          userData.resetPasswordExpires = resetPExpires;

          res.status(200).send({ message: "email de recuperación enviado" });
        }
      }

    }
  );
  user.resetPasswordToken = resetPToken;
  await user.save(); //lo guarda en la db
  user.resetPasswordExpires = resetPExpires;
  await user.save(); //lo guarda en la db
}

async function sendNodemailer(email, token) {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "",
      pass: "",
    },
  });

  const mailOptions = {
    from: "",
    to: `${email}`,
    subject: "Enlace para restablecer la contraseña",
    text:
      "Has solicitado el restablecimiento de la contraseña de tu cuenta.\n\n" +
      "Por favor haz clic en el siguiente enlace, o copialo y pegalo en una pestaña de tu navegador web para completar el proceso, tienes una hora para hacerlo:\n\n" +
      `http://localhost:3000/reset/${token}\n\n` +
      "Si usted no solicitó esto, por favor ignore este correo y su contraseña seguirá sin cambios.\n",
  };

  await transporter.sendMail(mailOptions, (err, response) => {
    if (err) {
      console.log("response error: ", response);
      console.error("hubo un error: ", err);
    } else {
      console.log("enviando email");
      console.log("response ok: ", response);
      res.status(200).json("email de recuperación enviado!");
      //return (token);
    }
  });
}

async function updatePasswordByToken(req, res) {
  let userData = req.body;

  const email = userData.email;
  const params = req.params;

  // actualiza la contraseña encriptada
  if (userData.password) {
    await bcrypt.hash(userData.password, null, null, (err, hash) => {
      if (err) {
        res.status(500).send({ message: "Error al encriptar la contraseña" });
      } else {
        userData.password = hash;
      }
    });
  }

  await User.findOneAndUpdate({ email }, userData, (err, userStored) => {

    if (err) {
      res.status(500).send({ msg: "Error del servidor" });
    } else if (
      userStored.resetPasswordToken === null ||
      userStored.resetPasswordToken === ""
    ) {
      res
        .status(404)
        .send({ msg: "No existe token de reseteo de password" });
    } else {
      if (!userStored) {
        res
          .status(404)
          .send({ msg: "No se ha podido actualizar la contraseña" });
      } else if (userStored.resetPasswordToken !== params.resetPasswordToken) {
        res
          .status(404)
          .send({ msg: "Ingresó un token diferente o caducado" });
      } else {
        res.status(200).send({ msg: "Contraseña actualizada" });
      }
    }
  });
}

module.exports = {
  getUser,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  sendEmail,
  updatePasswordByToken,
  verifyEmail
};