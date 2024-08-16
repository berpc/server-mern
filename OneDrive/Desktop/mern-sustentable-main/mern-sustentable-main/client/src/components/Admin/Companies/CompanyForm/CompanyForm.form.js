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
    name: Yup.string().required(true),
    cuit: Yup.string().required(true),
    address: Yup.string().required(true),
    phone: Yup.string().required(true),
    email: Yup.string().email(true).required(true),
  });
}
