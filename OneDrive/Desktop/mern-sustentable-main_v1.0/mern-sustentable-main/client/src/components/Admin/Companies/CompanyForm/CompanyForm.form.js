import * as Yup from "yup";

export function initialValues(company) {
  return {
    name: company?.name || "",
    cuit: company?.cuit || "",
    address: company?.address || "",
    phone: company?.phone || "",
    email: company?.email || ""
  };
}

export function validationSchema(company) {
  return Yup.object({
    name: Yup.string().required("El campo es requerido"),
    cuit: Yup.string().required("El campo es requerido"),
    address: Yup.string().required("El campo es requerido"),
    phone: Yup.string().required("El campo es requerido"),
    email: Yup.string().email("Ingrese un Correo Electrónico válido").required("El campo es requerido"),
  });
}
