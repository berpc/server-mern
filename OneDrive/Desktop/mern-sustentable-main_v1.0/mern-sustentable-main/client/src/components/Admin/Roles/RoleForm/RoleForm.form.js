import * as Yup from "yup";

export function initialValues(role) {
  return {
    name: role?.name || "",
    description: role?.description || ""
  };
}

export function validationSchema(user) {
  return Yup.object({
    name: Yup.string().required(true)
  });
}
