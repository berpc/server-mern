import React, { useState } from "react";
import { Form } from "semantic-ui-react";
import { useFormik } from "formik";
import { User } from "../../../../api";
import { useAuth } from "../../../../hooks";
import { inititalValues, validationSchema } from "./ResetPasswordForm.form";
import "./ResetPasswordForm.scss";

const userController = new User();

export function ResetPasswordForm() {
  const [error, setError] = useState("");

  const formik = useFormik({
    initialValues: inititalValues(),
    validationSchema: validationSchema(),
    validateOnChange: false,
    onSubmit: async (formValue) => {
      try {
        const response = await userController.updatePasswordByTokenApi(formValue);
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
       <Form.Item>
          <Form.Input
            name="email"
            placeholder="Correo electronico"
            onChange={formik.handleChange}
            value={formik.values.email}
            error={formik.errors.email}
          />
            </Form.Item>
            <Form.Item>
                <Form.Input
                    type="password"
                    name="password"
                    placeholder="Contraseña"
                    className="reset-form__input"
                    value={formik.values.password}
                    error={formik.errors.password}
                />
            </Form.Item>
            <Form.Item>
                <Form.Input
                    type="password"
                    name="repeatPassword"
                    placeholder="Repetir contraseña"
                    className="reset-form__input"
                    value={formik.values.repeatPassword}
                    error={formik.errors.repeatPassword}
                />
            </Form.Item>
            <Form.Item hidden="true">
                <Form.Input
                    type="text"
                    name="resetPasswordToken"
                    placeholder="resetPasswordToken"
                    className="reset-form__input"
                    value={formik.values.resetPasswordToken}
                    error={formik.errors.resetPasswordToken}
                />
            </Form.Item>
            <Form.Item hidden="true">
                <Form.Input
                    type="password"
                    name="resetPasswordExpires"
                    placeholder="resetPasswordExpires"
                    className="reset-form__input"
                    value={formik.values.resetPasswordToken}
                    error={formik.errors.resetPasswordToken}
                />
            </Form.Item>

      <Form.Button type="submit" primary fluid loading={formik.isSubmitting}>
        Actualizar contraseña
      </Form.Button>


      <p className="login-form__error">{error}</p> 
    </Form>
  );
}