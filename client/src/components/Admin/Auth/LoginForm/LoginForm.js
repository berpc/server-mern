import React, { useState } from "react";
import {
  Form,
  Segment,
  Grid,
  GridColumn,
  Divider,
  Image,
} from "semantic-ui-react";
import { useFormik } from "formik";
import { Auth } from "../../../../api";
import { useAuth } from "../../../../hooks";
import { inititalValues, validationSchema } from "./LoginForm.form";
import { Presentation } from "../Presentation";
import "./LoginForm.scss";
import { useLanguage } from "../../../../contexts";
//import ImageVacia from "../../../../utils/imagen-vacia.png";

const authController = new Auth();

export function LoginForm() {
  const { login } = useAuth();
  const [error, setError] = useState("");

  const { translations } = useLanguage();

  const t = (key) => translations[key] || key; // Función para obtener la traducción

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
    <Segment style={{ width: "100%" }}>
      <Grid centered columns={2}>
        <GridColumn floated="left" textAlign="center">
          <Presentation />
        </GridColumn>

        <GridColumn floated="rigth">
          <Grid centered columns={1} stackable>
            <GridColumn>
              <div style={{ display: "grid" }}>
                {/* <Image
                  src={ImageVacia}
                  size="tiny"
                  style={{
                    margin: "auto",
                  }}
                /> */}
                <div
                  style={{
                    margin: "auto",
                  }}
                >
                  {" "}
                  LOGO EMPRESA{" "}
                </div>
              </div>
            </GridColumn>
            <GridColumn>
              <Form onSubmit={formik.handleSubmit}>
                <Form.Input
                  name="email"
                  icon="user"
                  iconPosition="left"
                  size="large"
                  label={t("username")}
                  inline
                  placeholder="Correo electronico"
                  onChange={formik.handleChange}
                  value={formik.values.email}
                  error={formik.errors.email}
                  style={{ width: "100%" }}
                />
                <Form.Input
                  name="password"
                  type="password"
                  icon="lock"
                  iconPosition="left"
                  label={t("password")}
                  size="large"
                  placeholder="Contraseña"
                  onChange={formik.handleChange}
                  value={formik.values.password}
                  error={formik.errors.password}
                  style={{ width: "100%" }}
                />

                <Form.Button
                  type="submit"
                  primary
                  fluid
                  loading={formik.isSubmitting}
                >
                  {t("enter")}
                </Form.Button>

                <a onClick={recoverPassword}>{t("i_forgot_my_password")}</a>

                <p className="login-form__error">{error}</p>
              </Form>
            </GridColumn>
            <GridColumn>
              <div style={{ display: "grid" }}>
                {/* <Image
                  src={ImageVacia}
                  size="tiny"
                  style={{
                    margin: "auto",
                  }}
                /> */}
                <div
                  style={{
                    margin: "auto",
                  }}
                >
                  {" "}
                  LOGO SUSTEMIA{" "}
                </div>
              </div>
            </GridColumn>
          </Grid>
        </GridColumn>
      </Grid>

      <Divider vertical></Divider>
    </Segment>
  );
}
