import React, { useCallback, useState } from "react";
import { Form, TextArea } from "semantic-ui-react";
import { useFormik } from "formik";
import { Role } from "../../../../api";
import { useAuth } from "../../../../hooks";
import { initialValues, validationSchema } from "./RoleForm.form";
import "./RoleForm.scss";
import { useLanguage } from "../../../../contexts";

const roleController = new Role();

export function RoleForm(props) {
  const { close, onReload, role } = props;
  const { accessToken } = useAuth();

  const { translations } = useLanguage();

  const t = (key) => translations[key] || key; // Función para obtener la traducción

  const formik = useFormik({
    initialValues: initialValues(role),
    validationSchema: validationSchema(role),
    validateOnChange: false,
    onSubmit: async (formValue) => {
      try {
        if (!role) {
          const response = await roleController.createRole(
            accessToken,
            formValue
          );
          if (response.code && response.code === 500) {
          }
        } else {
          await roleController.updateRole(accessToken, role._id, formValue);
        }
        onReload();
        close();
      } catch (error) {
        console.error(error);
      }
    },
  });

  return (
    <Form className="role-form" onSubmit={formik.handleSubmit}>
      <Form.Group widths="equal">
        <Form.Input
          label={t("role")}
          name="name"
          placeholder={t("role")}
          onChange={formik.handleChange}
          value={formik.values.name}
          error={formik.errors.name}
        />
        {/* <Form.Input
          label="Descripción"
          name="description"
          placeholder="Descripcion"
          onChange={formik.handleChange}
          value={formik.values.description}
          error={formik.errors.description}
        /> */}
      </Form.Group>
      <Form.Group>
        <TextArea
          style={{ minHeight: 100 }}
          label={t("description")}
          name="description"
          placeholder={t("description")}
          onChange={formik.handleChange}
          value={formik.values.description}
          error={formik.errors.description}
        />
      </Form.Group>

      <Form.Button type="submit" primary fluid loading={formik.isSubmitting}>
        {role ? t("update") : t("create")}
      </Form.Button>
    </Form>
  );
}
