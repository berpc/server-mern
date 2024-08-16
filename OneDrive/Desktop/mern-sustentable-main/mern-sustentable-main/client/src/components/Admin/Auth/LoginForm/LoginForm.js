import React, { useState } from "react";
import { Form } from "semantic-ui-react";
import { useFormik } from "formik";
import { Auth } from "../../../../api";
import { useAuth } from "../../../../hooks";
import { inititalValues, validationSchema } from "./LoginForm.form";
import "./LoginForm.scss";

const authController = new Auth();

export function LoginForm() {
  const { login } = useAuth();
  const [error, setError] = useState("");

  const formik = useFormik({
    initialValues: inititalValues(),
    validationSchema: validationSchema(),
    validateOnChange: false,
    onSubmit: async (formValue) => {
      try {
        const response = await authController.login(formValue);

        authController.setAccessToken(response.access);
        authController.setRefreshToken(response.refresh);

        login(response.access);
      } catch (error) {
        console.error(error);
        setError(error.msg);
      }
    },
  });

   const recoverPassword = (e) => {
   console.log("a vista recuperar contraseña");
   window.location.href = "/recover";
  };

  return (
    <Form onSubmit={formik.handleSubmit}>
      <Form.Input
        name="email"
        placeholder="Correo electronico"
        onChange={formik.handleChange}
        value={formik.values.email}
        error={formik.errors.email}
      />
      <Form.Input
        name="password"
        type="password"
        placeholder="Contraseña"
        onChange={formik.handleChange}
        value={formik.values.password}
        error={formik.errors.password}
      />

      <Form.Button type="submit" primary fluid loading={formik.isSubmitting}>
        Entrar
      </Form.Button>

    
      
                <a onClick={recoverPassword}>
                    Olvidé mi contraseña
                </a>

           

      <p className="login-form__error">{error}</p> 
    </Form>
  );
}