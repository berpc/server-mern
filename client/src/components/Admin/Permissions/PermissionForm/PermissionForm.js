import React, { useCallback, useEffect, useState } from "react";
import { Form, TextArea } from "semantic-ui-react";
import { useFormik } from "formik";
import { Permission, Role } from "../../../../api";
import { useAuth } from "../../../../hooks";
import { initialValues, validationSchema } from "./PermissionForm.form";
import { MODULES, ACTIONS } from "../../../../utils/constants";
import {
  convertModulesEngToEsp,
  convertActionsEngToEsp,
} from "../../../../utils/converts";
import "./PermissionForm.scss";
import { useLanguage } from "../../../../contexts";

const permissionController = new Permission();
const roleController = new Role();

export function PermissionForm(props) {
  const { close, onReload, permission } = props;
  const { accessToken } = useAuth();
  const [listRoles, setListRoles] = useState([]);
  const [listActionPermissions, setListActionPermissions] = useState([]);
  const [listActions, setListActions] = useState([]);

  const { translations } = useLanguage();
  
  const t = (key) => translations[key.toLowerCase()] || key ; // Función para obtener la traducción

  useEffect(() => {
    roleController.getRoles(accessToken, true).then((response) => {
      setListRoles(response);
    });
  }, []);

  const formik = useFormik({
    initialValues: initialValues(permission),
    validationSchema: validationSchema(permission),
    validateOnChange: false,
    onSubmit: async (formValue) => {
      try {
        if (!permission) {
          const response = await permissionController.createPermission(
            accessToken,
            formValue
          );
          if (response.code && response.code === 500) {
          }
        } else {
          await permissionController.updatePermission(
            accessToken,
            permission._id,
            formValue
          );
        }
        onReload();
        close();
      } catch (error) {
        console.error(error);
      }
    },
  });

  useEffect(() => {
    if (formik.values.module && formik.values.role) {
      permissionController
        .getPermissionsByRoleAndModule(
          accessToken,
          formik.values.role,
          formik.values.module
        )
        .then((response) => {
          let list = response.response.map((i) => {
            return i.action;
          });
          setListActionPermissions(list);
        });
    }
  }, [formik.values.module, formik.values.role]);

  useEffect(() => {
    if (listActionPermissions && listActionPermissions.length > 0) {
      let newList = ACTIONS.filter((i) => !listActionPermissions.includes(i));
      if(formik && formik.values.action){
        newList.push(formik.values.action);
      }
      setListActions(newList);
    } else {
      setListActions(ACTIONS);
    }
  }, [listActionPermissions]);

  return (
    <Form className="permission-form" onSubmit={formik.handleSubmit}>
      <Form.Group widths="equal">
        <Form.Dropdown
          label={t("role")}
          //placeholder="Selecciona un rol"
          options={listRoles.map((ds) => {
            return {
              key: ds._id,
              text: t(ds.name),
              value: ds._id,
            };
          })}
          selection
          onChange={(_, data) => formik.setFieldValue("role", data.value)}
          value={formik.values.role}
          error={formik.errors.role}
        />
      </Form.Group>
      <Form.Group widths="equal">
        <Form.Dropdown
          label={t("module")}
          //placeholder="Selecciona un módulo"
          options={MODULES.map((ds) => {
            return {
              key: ds,
              text: t(ds),
              value: ds,
            };
          })}
          selection
          onChange={(_, data) => formik.setFieldValue("module", data.value)}
          value={formik.values.module}
          error={formik.errors.module}
        />
        <Form.Dropdown
          label={t("action")}
          placeholder={
            listActions && listActions.length > 0
              ? "Selecciona una acción"
              : " No hay acciones para elegir"
          }
          options={listActions.map((ds) => {
            return {
              key: ds,
              text: t(ds),
              value: ds,
            };
          })}
          selection
          onChange={(_, data) => formik.setFieldValue("action", data.value)}
          value={formik.values.action}
          error={formik.errors.action}
        />
      </Form.Group>
      <Form.Group>
        <TextArea
          style={{ minHeight: 100 }}
          label="Descripción"
          name="description"
          // placeholder="Descripcion"
          onChange={formik.handleChange}
          value={formik.values.description}
          error={formik.errors.description}
        />
      </Form.Group>

      <Form.Button type="submit" primary fluid loading={formik.isSubmitting}>
        {permission ? t("update") : t("create")}
      </Form.Button>
    </Form>
  );
}
