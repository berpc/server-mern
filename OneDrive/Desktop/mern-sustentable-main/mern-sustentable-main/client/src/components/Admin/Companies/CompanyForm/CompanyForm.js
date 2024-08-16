import React, { useCallback, useState, useEffect } from "react";
import { Form, Image } from "semantic-ui-react";
import { useFormik } from "formik";
import { Role, Company } from "../../../../api";
import { useAuth } from "../../../../hooks";
import { isAdmin, isMaster } from "../../../../utils/checkPermission";
import { initialValues, validationSchema } from "./CompanyForm.form";
import "./CompanyForm.scss";

const companyController = new Company();
const roleController = new Role();

export function CompanyForm(props) {
  const { close, onReload, company } = props;
  const {
    accessToken,
    user: { role },
  } = useAuth();
  const [listRoles, setListRoles] = useState([]);

  useEffect(() => {
    roleController.getRoles(accessToken, true).then((response) => {
      setListRoles(response);
    });
  }, []);

  const formik = useFormik({
    initialValues: initialValues(company),
    validationSchema: isMaster(role)? null:validationSchema(company),
    validateOnChange: false,
    onSubmit: async (formValue) => {
      try {
        if (!company) {
          const response = await companyController.createCompany(
            accessToken,
            formValue
          );
          if (response.code && response.code === 500) {
          }
        } else {
          await companyController.updateCompany(accessToken, company._id, formValue);
        }
        onReload(true);
        close();
      } catch (error) {
        // console.log(2)
        console.error(error);
      }
    },
  });


  return (
    <Form className="company-form" onSubmit={formik.handleSubmit}>

      <Form.Group widths="equal">
        <Form.Input
          label="Razon Social"
          name="name"
          placeholder="Razon social"
          onChange={formik.handleChange}
          value={formik.values.name}
          error={formik.errors.name}
        />
        <Form.Input
          label="CUIT"
          name="cuit"
          placeholder="cuit"
          onChange={formik.handleChange}
          value={formik.values.cuit}
          error={formik.errors.cuit}
        />
      </Form.Group>

      <Form.Group widths="equal">
        <Form.Input
          label="Telefono"
          name="phone"
          placeholder="Telefono"
          onChange={formik.handleChange}
          value={formik.values.phone}
          error={formik.errors.phone}
        />
        <Form.Input
          label="Direccion"
          name="address"
          placeholder="Direccion"
          onChange={formik.handleChange}
          value={formik.values.address}
          error={formik.errors.address}
        />
      </Form.Group>
    
      <Form.Group widths="equal">
        <Form.Input
          label="Correo Electronico"
          name="email"
          placeholder="Correo electronico"
          onChange={formik.handleChange}
          value={formik.values.email}
          error={formik.errors.email}
        />
      </Form.Group>

      <Form.Button type="submit" primary fluid loading={formik.isSubmitting}>
        {company ? "Actualizar datos" : "Crear Empresa"}
      </Form.Button>
    </Form>
  );
}
