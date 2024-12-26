import React, { useCallback, useState, useEffect } from "react";
import { Form, Image } from "semantic-ui-react";
import { useFormik } from "formik";
import { Role, Site } from "../../../../api";
import { useAuth } from "../../../../hooks";
import { isAdmin, isMaster } from "../../../../utils/checkPermission";
import { initialValues, validationSchema } from "./SiteForm.form";
import { useNavigate  } from 'react-router-dom';
import "./SiteForm.scss";
import { useLanguage } from "../../../../contexts";

const siteController = new Site();
const roleController = new Role();

export function SiteForm(props) {
  const { close, onReload, site } = props;
  const {
    accessToken,
    user: { role },
  } = useAuth();
  const [listRoles, setListRoles] = useState([]);

      const { language, changeLanguage, translations } = useLanguage();
    
      const t = (key) => translations[key] || key; // Función para obtener la traducción


  useEffect(() => {
    roleController.getRoles(accessToken, true).then((response) => {
      setListRoles(response);
    });
  }, []);

  const formik = useFormik({
    initialValues: initialValues(site),
    validationSchema: validationSchema(site),
    validateOnChange: false,
    onSubmit: async (formValue) => {
      try {
        if (!site) {
          const response = await siteController.createSite(
            accessToken,
            formValue
          );
          if (response.code && response.code === 500) {
          }
        } else {
          await siteController.updateSite(accessToken, site._id, formValue);
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
          // placeholder="Correo electrónico"
          onChange={formik.handleChange}
          value={formik.values.email}
          error={formik.errors.email}
        />
      </Form.Group>

      <Form.Button type="submit" primary fluid loading={formik.isSubmitting}>
        {site ? t("update") : t("create") }
      </Form.Button>
    </Form>
  );
}
