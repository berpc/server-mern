import React, { useCallback, useState } from "react";
import { Form, TextArea } from "semantic-ui-react";
import { useFormik } from "formik";
import { Role } from "../../../../api";
import { useAuth } from "../../../../hooks";
import { initialValues, validationSchema } from "./RoleForm.form";
import "./RoleForm.scss";

const roleController = new Role();

export function RoleForm(props) {
  const { close, onReload, role } = props;
  const { accessToken } = useAuth();

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
          label="Nombre"
          name="name"
          placeholder="Nombre"
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
          label="Descripcion"
          name="description"
          placeholder="Descripcion"
          onChange={formik.handleChange}
          value={formik.values.description}
          error={formik.errors.description}
        />
      </Form.Group>

      <Form.Button type="submit" primary fluid loading={formik.isSubmitting}>
        {role ? "Actualizar rol" : "Crear rol"}
      </Form.Button>
    </Form>
  );
}
