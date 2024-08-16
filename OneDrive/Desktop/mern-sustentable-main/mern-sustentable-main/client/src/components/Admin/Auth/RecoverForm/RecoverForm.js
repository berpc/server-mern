import React, { useState } from "react";
import { Form } from "semantic-ui-react";
import { useFormik } from "formik";
import { User } from "../../../../api";
import { inititalValues, validationSchema } from "./RecoverForm.form";
import "./RecoverForm.scss";

const userController = new User();

export function RecoverForm() {
  const [error, setError] = useState("");

  const formik = useFormik({
    initialValues: inititalValues(),
    validationSchema: validationSchema(),
    validateOnChange: false,
    onSubmit: async (formValue) => {
      try {
        const response = await userController.sendEmail(formValue);
        if(response && response.code === 200){
            // "Email enviado, revise su casilla de correo"
        }

      } catch (error) {
        console.error(error);
        setError(error.msg);
      }
    },
  });


  return (
      <Form onSubmit={formik.handleSubmit}>
        <label className="control-label">
            Ingrese su correo para enviarle un e-mail con un enlace para restablecer su contraseña
        </label>
      <Form.Input
        name="email"
        placeholder="Correo electronico"
        onChange={formik.handleChange}
        value={formik.values.email}
        error={formik.errors.email}
      />

      <Form.Button type="submit" primary fluid loading={formik.isSubmitting}>
        Enviar
      </Form.Button>


      <p className="login-form__error">{error}</p> 
    </Form>
  );
}