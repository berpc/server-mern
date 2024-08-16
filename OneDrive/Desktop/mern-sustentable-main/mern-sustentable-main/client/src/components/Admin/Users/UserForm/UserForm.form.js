import * as Yup from "yup";

export function initialValues(user) {
  console.log(user)
  return {
    avatar: user?.avatar || "",
    fileAvatar: null,
    firstname: user?.firstname || "",
    lastname: user?.lastname || "",
    email: user?.email || "",
    role: user? user.role && user.role._id? user.role._id : user.role : "",
    password: "",
    company: user?.company || "",
    position: user?.position || "",
    sector: user?.sector || "",
  };
}

export function validationSchema(user) {
  return Yup.object({
    firstname: Yup.string().required(true),
    lastname: Yup.string().required(true),
    email: Yup.string().email(true).required(true),
    // role: Yup.string().required(true),
    password: user ? Yup.string() : Yup.string().required(true),
    // repeatPassword: Yup.string()
    // .required(true)
    // .oneOf([Yup.ref("password")], "Las contraseñas tienen que ser iguales"),
    // company: Yup.string().required(true),
    position: Yup.string().required(true),
    sector: Yup.string().required(true),
  });
}
