import * as Yup from "yup";

export function initialValues() {
  return {
    email: "",
    password: "",
    repeatPassword: "",
    conditionsAccepted: false,
  };
}

export function validationSchema() {
  return Yup.object({
    email: Yup.string()
      .email("El email no es valido")
      .required("Campo obligatorio"),
    password: Yup.string()
    .min(8, 'La contraseña debe tener 8 al menos caracteres')
      .matches(/[0-9]/, 'La contraseña requiere como minimo un número')
      .matches(/[a-z]/, 'La contraseña requiere como minimo una letra minuscula')
      .matches(/[A-Z]/, 'La contraseña requiere como minimo una letra mayuscula')
      .matches(/[^\w]/, 'La contraseña requiere como minimo un simbolo')
    .required("Campo obligatorio"),
    repeatPassword: Yup.string()
      .required("Campo obligatorio")
      .oneOf([Yup.ref("password")], "Las contraseñas tienen que ser iguales"),
    conditionsAccepted: Yup.bool().isTrue(true),
  });
}