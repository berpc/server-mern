import * as Yup from "yup";
import { isAdmin, isMaster } from "../../../../utils/checkPermission";

export function initialValues(user) {

  let data = {
    avatar: user?.avatar || "",
    fileAvatar: null,
    firstname: user?.firstname || "",
    lastname: user?.lastname || "",
    email: user?.email || "",
    role: user? user.role && user.role._id? user.role._id : user.role : "",
    password: "",
    // company: user?.company ||null,
    // site: user?.site || null,
    position: user?.position || "",
    sector: user?.sector || "",
  };
  if(user?.site){
    data.site=user.site._id
  }
  if(user?.company){
    data.company=user.company._id
  }
  return data;
}

export function validationSchema(user, role) {
  if(isAdmin(role) || isMaster(role)){
    return Yup.object({
      // firstname: Yup.string().required(true),
      // lastname: Yup.string().required(true),
      email: Yup.string().email(true).required(true),
      role: Yup.string().required(true),
      password: user ? Yup.string() : Yup.string().required(true),
      // repeatPassword: Yup.string()
      // .required(true)
      // .oneOf([Yup.ref("password")], "Las contraseñas tienen que ser iguales"),
      // company: Yup.string().required(true),
      // position: Yup.string().required(true),
      // sector: Yup.string().required(true),
    });
  }
  else{
  return Yup.object({
    firstname: Yup.string().required(true),
    lastname: Yup.string().required(true),
    email: Yup.string().email(true).required(true),
    //role: Yup.string().required(true),
    password: user ? Yup.string() : Yup.string().required(true),
    // repeatPassword: Yup.string()
    // .required(true)
    // .oneOf([Yup.ref("password")], "Las contraseñas tienen que ser iguales"),
    // company: Yup.string().required(true),
    position: Yup.string().required(true),
    sector: Yup.string().required(true),
  });
}
}
