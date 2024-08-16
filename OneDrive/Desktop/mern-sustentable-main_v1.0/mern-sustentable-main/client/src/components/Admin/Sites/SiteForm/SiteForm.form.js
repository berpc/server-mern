import * as Yup from "yup";

const phoneRegExp= /^(?:(?:00)?549?)?0?(?:11|[2368]\d)(?:(?=\d{0,2}15)\d{2})??\d{8}$/

export function initialValues(site) {
  return {
    name: site?.name || "",
    cuit: site?.cuit || "",
    address: site?.address || "",
    phone: site?.phone || "",
    email: site?.email || ""
  };
}

export function validationSchema(site) {
  return Yup.object({
    name: Yup.string().required("El campo es requerido"),
    cuit: Yup.string().required("El campo es requerido"),
    address: Yup.string().required("El campo es requerido"),
    phone: Yup.string().required("El campo es requerido").matches(phoneRegExp, 'El número de teléfono no es válido'),
    email: Yup.string().email("Ingrese un Correo Electrónico válido").required("El campo es requerido"),
  });
}
