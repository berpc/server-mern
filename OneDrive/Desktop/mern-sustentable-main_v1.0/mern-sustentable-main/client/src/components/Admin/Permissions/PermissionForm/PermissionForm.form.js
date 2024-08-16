import * as Yup from "yup";

export function initialValues(permission) {
  return {
    description: permission?.description || "",
    module: permission?.module || "",
    action: permission?.action || "",
    role: permission?.role._id || null
  };
}

export function validationSchema(user) {
  return Yup.object({
     role: Yup.string().required(true),
     module: Yup.string().required(true),
     action: Yup.string().required(true),
  });
}
