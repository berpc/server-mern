import * as Yup from "yup";

export function inititalValues(user) {
  return {
    email: user? user.email : "",
    resetPasswordToken: user? user.resetPasswordToken : "",
    resetPasswordExpires: user? user.resetPasswordExpires : ""
  };
}

export function validationSchema() {
  return Yup.object({
    email: Yup.string()
      .email("El email no es valido")
      .required("Campo obligatorio"),
    password: Yup.string()
      .required("Campo obligatorio"),
    repeatPassword: Yup.string()
      .required("Campo obligatorio")
  });
}