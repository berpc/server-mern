import React, { useCallback, useState, useEffect } from "react";
import { Form, Image } from "semantic-ui-react";
import { useFormik } from "formik";
import { Role, Company } from "../../../../api";
import { useAuth } from "../../../../hooks";
import { isAdmin, isMaster } from "../../../../utils/checkPermission";
import { initialValues, validationSchema } from "./CompanyForm.form";
import "./CompanyForm.scss";
import { extractDomain } from "../../../../utils/formatEmail";

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
    validationSchema: validationSchema(company),
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

  const handleChangeEmail= (e,formik)=>{
    console.log(e.target.value);
    formik.setFieldValue("email",  e.target.value)
    formik.setFieldValue("domain",  extractDomain(e.target.value))
  }


  return (
    <Form className="company-form" onSubmit={formik.handleSubmit}>

      <Form.Group widths="equal">
        <Form.Input
          label="Razón Social"
          name="name"
          // placeholder="Razon social"
          onChange={formik.handleChange}
          value={formik.values.name}
          error={formik.errors.name}
        />
        <Form.Input
          label="CUIT"
          name="cuit"
          // placeholder="cuit"
          onChange={formik.handleChange}
          value={formik.values.cuit}
          error={formik.errors.cuit}
        />
      </Form.Group>

      <Form.Group widths="equal">
        <Form.Input
          label="Teléfono"
          name="phone"
          // placeholder="Telefono"
          onChange={formik.handleChange}
          value={formik.values.phone}
          error={formik.errors.phone}
        />
        <Form.Input
          label="Dirección"
          name="address"
          // placeholder="Direccion"
          onChange={formik.handleChange}
          value={formik.values.address}
          error={formik.errors.address}
        />
      </Form.Group>
    
      <Form.Group widths="equal">
        <Form.Input
          label="Correo Electrónico"
          name="email"
          // placeholder="Correo electronico"
          onChange={formik.handleChange}
          // onChange={(e)=>{handleChangeEmail(e, formik)}}
          value={formik.values.email}
          error={formik.errors.email}
        />
      </Form.Group>

      {/* <Form.Group widths="equal">
        <Form.Input
          label="Dominio"
          name="domain"
          placeholder="Dominio"
          // onChange={formik.handleChange}
          value={formik.values.domain}
          error={formik.errors.domain}
        />
      </Form.Group> */}

      <Form.Button type="submit" primary fluid loading={formik.isSubmitting}>
        {company ? "Actualizar datos" : "Crear Empresa"}
      </Form.Button>
    </Form>
  );
}
