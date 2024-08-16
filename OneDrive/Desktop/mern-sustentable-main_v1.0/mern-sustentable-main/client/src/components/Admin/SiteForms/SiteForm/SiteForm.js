import React, { useCallback, useState } from "react";
import {
  Form,
  Image,
  Grid,
  Table,
  Icon,
  Button,
  Comment,
  CommentGroup,
  CommentContent,
  CommentMetadata,
  CommentText,
  CommentAuthor,
  TableFooter,
  TableHeaderCell,
  TableRow,
  Segment,
  Divider,
  Header,
} from "semantic-ui-react";
import { useDropzone } from "react-dropzone";
import { useFormik, Field, FieldArray, FormikProvider, getIn } from "formik";
import { Siteform } from "../../../../api";
import { useAuth } from "../../../../hooks";
import { ENV } from "../../../../utils";
import {
  formatDateView,
  formatDateHourCompleted,
} from "../../../../utils/formatDate";
import { BasicModal } from "../../../Shared";
import { initialValues, validationSchema } from "./SiteForm.form";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { decrypt, encrypt } from "../../../../utils/cryptoUtils";
import "./SiteForm.scss";

const siteFormController = new Siteform();

export function SiteForm(props) {
  const { onClose, onReload, siteForm, site } = props;
  const { accessToken } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [titleModal, setTitleModal] = useState("");
  const [fieldName, setFieldName] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const { user } = useAuth();

  const location = useLocation();
  const { siteSelected } = location.state || {};

  if (!siteSelected) {
    // // Manejo de caso donde no hay datos en state (por ejemplo, acceso directo a la URL)
    // return <div>No se encontraron detalles de producto.</div>;
  }

  const navigate = useNavigate();

  const onOpenCloseModal = () => setShowModal((prevState) => !prevState);
  const onOpenCloseConfirm = () => setShowConfirm((prevState) => !prevState);

  const openUpdateSite = (data, name) => {
    setFieldName(name);
    setTitleModal(`Comentarios ${data}`);
    onOpenCloseModal();
  };

  const formik = useFormik({
    initialValues: initialValues(siteForm),
    validationSchema: validationSchema(),
    validateOnChange: false,
    onSubmit: async (formValue) => {
      try {
        if (!siteForm) {
          formValue.creator_user = user._id;
          formValue.date = new Date();
          if (user?.site) {
            formValue.site = user.site._id;
          } else {
            if (site) {
              formValue.site = site;
            } else {
              // Desencriptar los datos recibidos
              if (!siteForm) {
                const siteData = decrypt(siteSelected);
                formValue.site = siteData;
              }
            }
          }
          await siteFormController.createSiteForm(accessToken, formValue);
          //console.log(formValue);
        } else {
          await siteFormController.updateSiteForm(
            accessToken,
            siteForm._id,
            formValue
          );
        }
        onReload();
        if (onClose) {
          onClose();
        } else {
          // Después de guardar exitosamente, navegamos hacia atrás
          goBack();
        }
      } catch (error) {
        console.error(error);
      }
    },
  });

  const goBack = () => {
    navigate(`/admin/data/siteforms`, {
      state: { siteSelected: siteSelected },
    });
  };

  return (
    <Form className="site-form" onSubmit={formik.handleSubmit}>
      {siteForm ? (
        <Segment>
          <Header as="h4"> Fecha: {formatDateView(formik.values.date)}</Header>
          <Header as="h4">
            Usuario creador:{" "}
            {formik.values.creator_user
              ? formik.values.creator_user.lastname
                ? formik.values.creator_user.lastname +
                  " " +
                  formik.values.creator_user.firstname
                : formik.values.creator_user.email
              : null}{" "}
          </Header>
        </Segment>
      ) : null}
      <Table size="small" celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell width="6">Concepto</Table.HeaderCell>
            <Table.HeaderCell width="3">Valor</Table.HeaderCell>
            <Table.HeaderCell width="2">Estado</Table.HeaderCell>
            <Table.HeaderCell>Acciones</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>
              <label className="label">Tipo de instalacion</label>
            </Table.Cell>
            <Table.Cell>
              <Form.Dropdown
                placeholder="Seleccione"
                options={[{ _id: "1", name: "tipo a" }].map((ds) => {
                  return {
                    key: ds._id,
                    text: ds.name,
                    value: ds._id,
                  };
                })}
                selection
                onChange={(_, data) =>
                  formik.setFieldValue("installation_type.value", data.value)
                }
                value={formik.values.installation_type.value}
                error={formik.errors.installation_type}
              />
            </Table.Cell>
            <Table.Cell>
              {/* <Form.Dropdown
                placeholder="Seleccione"
                options={[{value:true,name:"Aprobado"}, {value:false,name:"No aprobado"}].map((ds) => {
                  return {
                    key: ds.value,
                    text: ds.name,
                    value: ds.value,
                  };
                })}
                selection
                onChange={(_, data) =>
                  formik.setFieldValue("installation_type.isApproved", data.value)
                }
              /> */}
              <Form.Dropdown
                placeholder="Seleccione"
                options={[{key:1, value:true,name:"Aprobado"}, {key:2 , value:false,name:"No aprobado"}].map((ds) => {
                  return {
                    key: ds.key,
                    text: ds.name,
                    value: ds.value,
                  };
                })}
                selection
                onChange={(_, data) =>
                  formik.setFieldValue("installation_type.isApproved", data.value)
                }
                value={formik.values.installation_type.isApproved}
                error={formik.errors.installation_type}
              />
              {/* {formik.values.installation_type.isApproved?  <Icon color="green" name='checkmark' /> : <Icon color="red" name='close' />} */}
            </Table.Cell>
            <Table.Cell>
              <Button
                icon
                type="button"
                primary
                onClick={() => {
                  openUpdateSite("tipo de instalacion", "installation_type");
                }}
              >
                <Icon name="comment outline" />
              </Button>
              <Button
                icon
                onClick={() => {
                  // openUpdateSite("tipo de instalacion", "installation_type");
                }}
              >
                <Icon name="paperclip" />
              </Button>
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>
              <label className="label">Categoria de productos</label>
            </Table.Cell>
            <Table.Cell>
            <Form.Dropdown
                placeholder="Seleccione"
                options={[{_id:"1",name:"categoria a"}, {_id:"2",name:"categoria b"}].map((ds) => {
                  return {
                    key: ds._id,
                    text: ds.name,
                    value: ds._id,
                  };
                })}
                selection
                onChange={(_, data) =>
                  formik.setFieldValue("product_category.value", data.value)
                }
                value={formik.values.product_category.value}
                error={formik.errors.product_category}
              />
            </Table.Cell>
            <Table.Cell>
              {/* <Form.Checkbox
                toggle
                checked={formik.values.product_category.isApproved}
                label={
                  formik.values.product_category.isApproved
                    ? "Aprobado"
                    : "Aprobado"
                }
                onChange={(e, { checked }) => {
                  formik.setFieldValue("product_category.isApproved", checked);
                }}
              /> */}
              <Form.Dropdown
                placeholder="Seleccione"
                options={[{key:1, value:true,name:"Aprobado"}, {key:2 , value:false,name:"No aprobado"}].map((ds) => {
                  return {
                    key: ds.key,
                    text: ds.name,
                    value: ds.value,
                  };
                })}
                selection
                onChange={(_, data) =>
                  formik.setFieldValue("product_category.isApproved", data.value)
                }
                value={formik.values.product_category.isApproved}
                error={formik.errors.product_category}
              />
              {/* {formik.values.product_category.isApproved?  <Icon color="green" name='checkmark' /> : <Icon color="red" name='close' />} */}
            </Table.Cell>
            <Table.Cell>
              <Button
                icon
                primary
                type="button"
                onClick={() => {
                  openUpdateSite("Categoria de productos", "product_category");
                }}
              >
                <Icon name="comment outline" />
              </Button>
              <Button
                icon
                onClick={() => {
                  openUpdateSite("Categoria de productos", "product_category");
                }}
              >
                <Icon name="paperclip" />
              </Button>
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>
              <label className="label">Dias trabajados en el mes</label>
            </Table.Cell>
            <Table.Cell>
              <Form.Input
                type="number"
                name="days_month.value"
                onChange={formik.handleChange}
                value={formik.values.days_month.value}
                error={formik.errors.days_month}
              />
            </Table.Cell>
            <Table.Cell>
              {/* <Form.Checkbox
                toggle
                checked={formik.values.days_month.isApproved}
                label={
                  formik.values.days_month.isApproved ? "Aprobado" : "Aprobado"
                }
                onChange={(e, { checked }) => {
                  formik.setFieldValue("days_month.isApproved", checked);
                }}
              /> */}
              {/* <Form.Dropdown
                placeholder="Seleccione"
                options={["Aprobado", "No aprobado"].map((ds) => {
                  return {
                    key: ds,
                    text: ds,
                    value: ds,
                  };
                })}
                selection
                onChange={(_, data) =>
                  formik.setFieldValue("days_month.isApproved", data.value)
                }
                value={formik.values.days_month.isApproved}
                error={formik.errors.days_month}
              /> */}
              <Form.Dropdown
                placeholder="Seleccione"
                options={[{key:1, value:true,name:"Aprobado"}, {key:2 , value:false,name:"No aprobado"}].map((ds) => {
                  return {
                    key: ds.key,
                    text: ds.name,
                    value: ds.value,
                  };
                })}
                selection
                onChange={(_, data) =>
                  formik.setFieldValue("days_month.isApproved", data.value)
                }
                value={formik.values.days_month.isApproved}
                error={formik.errors.days_month}
              />
              {/* {formik.values.days_month.isApproved?  <Icon color="green" name='checkmark' /> : <Icon color="red" name='close' />} */}
            </Table.Cell>
            <Table.Cell>
              <Button
                icon
                type="button"
                primary
                onClick={() => {
                  openUpdateSite("Dias trabajados en el mes", "days_month");
                }}
              >
                <Icon name="comment outline" />
              </Button>
              <Button
                icon
                onClick={() => {
                  openUpdateSite("Categoria de productos");
                }}
              >
                <Icon name="paperclip" />
              </Button>
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>
              <label className="label">Dias totales trabajados</label>
            </Table.Cell>
            <Table.Cell>
              <Form.Input
                type="number"
                name="days_total.value"
                onChange={formik.handleChange}
                value={formik.values.days_total.value}
                error={formik.errors.days_total}
              />
            </Table.Cell>
            <Table.Cell>
              {/* <Form.Checkbox
                toggle
                checked={formik.values.days_total.isApproved}
                label={
                  formik.values.days_total.isApproved ? "Aprobado" : "Aprobado"
                }
                onChange={(e, { checked }) => {
                  formik.setFieldValue("days_total.isApproved", checked);
                }}
              /> */}
                 <Form.Dropdown
                placeholder="Seleccione"
                options={[{key:1, value:true,name:"Aprobado"}, {key:2 , value:false,name:"No aprobado"}].map((ds) => {
                  return {
                    key: ds.key,
                    text: ds.name,
                    value: ds.value,
                  };
                })}
                selection
                onChange={(_, data) =>
                  formik.setFieldValue("days_total.isApproved", data.value)
                }
                value={formik.values.days_total.isApproved}
                error={formik.errors.days_total}
              />
              {/* {formik.values.days_total.isApproved?  <Icon color="green" name='checkmark' /> : <Icon color="red" name='close' />} */}
            </Table.Cell>
            <Table.Cell>
              <Button
                icon
                type="button"
                primary
                onClick={() => {
                  openUpdateSite("Dias totales trabajados", "days_total");
                }}
              >
                <Icon name="comment outline" />
              </Button>
              <Button
                icon
                onClick={() => {
                  openUpdateSite("Categoria de productos");
                }}
              >
                <Icon name="paperclip" />
              </Button>
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>
              <label className="label">Horas trabajadas en el mes</label>
            </Table.Cell>
            <Table.Cell>
              <Form.Input
                type="number"
                name="hours_month.value"
                onChange={formik.handleChange}
                value={formik.values.hours_month.value}
                error={formik.errors.hours_month}
              />
            </Table.Cell>
            <Table.Cell>
              {/* <Form.Checkbox
                toggle
                checked={formik.values.hours_month.isApproved}
                label={
                  formik.values.hours_month.isApproved ? "Aprobado" : "Aprobado"
                }
                onChange={(e, { checked }) => {
                  formik.setFieldValue("hours_month.isApproved", checked);
                }}
              /> */}
                     <Form.Dropdown
                placeholder="Seleccione"
                options={[{key:1, value:true,name:"Aprobado"}, {key:2 , value:false,name:"No aprobado"}].map((ds) => {
                  return {
                    key: ds.key,
                    text: ds.name,
                    value: ds.value,
                  };
                })}
                selection
                onChange={(_, data) =>
                  formik.setFieldValue("hours_month.isApproved", data.value)
                }
                value={formik.values.hours_month.isApproved}
                error={formik.errors.hours_month}
              />
              {/* {formik.values.hours_month.isApproved?  <Icon color="green" name='checkmark' /> : <Icon color="red" name='close' />} */}
            </Table.Cell>
            <Table.Cell>
              <Button
                icon
                type="button"
                primary
                onClick={() => {
                  openUpdateSite("Horas trabajadas en el mes", "hours_month");
                }}
              >
                <Icon name="comment outline" />
              </Button>
              <Button
                icon
                onClick={() => {
                  openUpdateSite("Categoria de productos");
                }}
              >
                <Icon name="paperclip" />
              </Button>
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>
              <label className="label">Horas totales trabajadas</label>
            </Table.Cell>
            <Table.Cell>
              <Form.Input
                type="number"
                name="hours_total.value"
                disabled={true}
                onChange={formik.handleChange}
                value={formik.values.hours_total.value}
                error={formik.errors.hours_total}
              />
            </Table.Cell>
            <Table.Cell>
              {/* <Form.Checkbox
                toggle
                checked={formik.values.hours_total.isApproved}
                label={
                  formik.values.hours_total.isApproved ? "Aprobado" : "Aprobado"
                }
                onChange={(e, { checked }) => {
                  formik.setFieldValue("hours_total.isApproved", checked);
                }}
              /> */}
                         <Form.Dropdown
                placeholder="Seleccione"
                options={[{key:1, value:true,name:"Aprobado"}, {key:2 , value:false,name:"No aprobado"}].map((ds) => {
                  return {
                    key: ds.key,
                    text: ds.name,
                    value: ds.value,
                  };
                })}
                selection
                onChange={(_, data) =>
                  formik.setFieldValue("hours_total.isApproved", data.value)
                }
                value={formik.values.hours_total.isApproved}
                error={formik.errors.hours_total}
              />
              {/* {formik.values.hours_total.isApproved?  <Icon color="green" name='checkmark' /> : <Icon color="red" name='close' />} */}
            </Table.Cell>
            <Table.Cell>
              <Button
                icon
                type="button"
                primary
                onClick={() => {
                  openUpdateSite("Horas totales trabajadas", "hours_total");
                }}
              >
                <Icon name="comment outline" />
              </Button>
              <Button
                icon
                onClick={() => {
                  openUpdateSite("Categoria de productos");
                }}
              >
                <Icon name="paperclip" />
              </Button>
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>
              <label className="label">
                Cantidad de trabajadores temporales
              </label>
            </Table.Cell>
            <Table.Cell>
              <Form.Input
                type="number"
                name="temporary_workers.value"
                onChange={formik.handleChange}
                value={formik.values.temporary_workers.value}
                error={formik.errors.temporary_workers}
              />
            </Table.Cell>
            <Table.Cell>
              {/* <Form.Checkbox
                toggle
                checked={formik.values.temporary_workers.isApproved}
                label={
                  formik.values.temporary_workers.isApproved
                    ? "Aprobado"
                    : "Aprobado"
                }
                onChange={(e, { checked }) => {
                  formik.setFieldValue("temporary_workers.isApproved", checked);
                }}
              /> */}
                           <Form.Dropdown
                placeholder="Seleccione"
                options={[{key:1, value:true,name:"Aprobado"}, {key:2 , value:false,name:"No aprobado"}].map((ds) => {
                  return {
                    key: ds.key,
                    text: ds.name,
                    value: ds.value,
                  };
                })}
                selection
                onChange={(_, data) =>
                  formik.setFieldValue("temporary_workers.isApproved", data.value)
                }
                value={formik.values.temporary_workers.isApproved}
                error={formik.errors.temporary_workers}
              />
              {/* {formik.values.temporary_workers.isApproved?  <Icon color="green" name='checkmark' /> : <Icon color="red" name='close' />} */}
            </Table.Cell>
            <Table.Cell>
              <Button
                icon
                type="button"
                primary
                onClick={() => {
                  openUpdateSite(
                    "Cantidad de trabajadores temporales",
                    "temporary_workers"
                  );
                }}
              >
                <Icon name="comment outline" />
              </Button>
              <Button
                icon
                onClick={() => {
                  openUpdateSite("Categoria de productos");
                }}
              >
                <Icon name="paperclip" />
              </Button>
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>
              <label className="label">
                Cantidad de trabajadores de produccion permanentes
              </label>
            </Table.Cell>
            <Table.Cell>
              <Form.Input
                type="number"
                name="permanent_production_workers.value"
                onChange={formik.handleChange}
                value={formik.values.permanent_production_workers.value}
                error={formik.errors.permanent_production_workers}
              />
            </Table.Cell>
            <Table.Cell>
              {/* <Form.Checkbox
                toggle
                checked={formik.values.permanent_production_workers.isApproved}
                label={
                  formik.values.permanent_production_workers.isApproved
                    ? "Aprobado"
                    : "Aprobado"
                }
                onChange={(e, { checked }) => {
                  formik.setFieldValue(
                    "permanent_production_workers.isApproved",
                    checked
                  );
                }}
              /> */}
                               <Form.Dropdown
                placeholder="Seleccione"
                options={[{key:1, value:true,name:"Aprobado"}, {key:2 , value:false,name:"No aprobado"}].map((ds) => {
                  return {
                    key: ds.key,
                    text: ds.name,
                    value: ds.value,
                  };
                })}
                selection
                onChange={(_, data) =>
                  formik.setFieldValue("permanent_production_workers.isApproved", data.value)
                }
                value={formik.values.permanent_production_workers.isApproved}
                error={formik.errors.permanent_production_workers}
              />
              {/* {formik.values.permanent_production_workers.isApproved?  <Icon color="green" name='checkmark' /> : <Icon color="red" name='close' />} */}
            </Table.Cell>
            <Table.Cell>
              <Button
                icon
                type="button"
                primary
                onClick={() => {
                  openUpdateSite(
                    "Cantidad de trabajadores de produccion permanentes",
                    "permanent_production_workers"
                  );
                }}
              >
                <Icon name="comment outline" />
              </Button>
              <Button
                icon
                onClick={() => {
                  openUpdateSite("Categoria de productos");
                }}
              >
                <Icon name="paperclip" />
              </Button>
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>
              <label className="label">
                Cantidad de trabajadores administrativos permanentes
              </label>
            </Table.Cell>
            <Table.Cell>
              <Form.Input
                type="number"
                name="permanent_administrative_workers.value"
                onChange={formik.handleChange}
                value={formik.values.permanent_administrative_workers.value}
                error={formik.errors.permanent_administrative_workers}
              />
            </Table.Cell>
            <Table.Cell>
              {/* <Form.Checkbox
                toggle
                checked={
                  formik.values.permanent_administrative_workers.isApproved
                }
                label={
                  formik.values.permanent_administrative_workers.isApproved
                    ? "Aprobado"
                    : "Aprobado"
                }
                onChange={(e, { checked }) => {
                  formik.setFieldValue(
                    "permanent_administrative_workers.isApproved",
                    checked
                  );
                }}
              /> */}
                              <Form.Dropdown
                placeholder="Seleccione"
                options={[{key:1, value:true,name:"Aprobado"}, {key:2 , value:false,name:"No aprobado"}].map((ds) => {
                  return {
                    key: ds.key,
                    text: ds.name,
                    value: ds.value,
                  };
                })}
                selection
                onChange={(_, data) =>
                  formik.setFieldValue("permanent_administrative_workers.isApproved", data.value)
                }
                value={formik.values.permanent_administrative_workers.isApproved}
                error={formik.errors.permanent_administrative_workers}
              />
              {/* {formik.values.permanent_administrative_workers.isApproved?  <Icon color="green" name='checkmark' /> : <Icon color="red" name='close' />} */}
            </Table.Cell>
            <Table.Cell>
              <Button
                icon
                type="button"
                primary
                onClick={() => {
                  openUpdateSite(
                    "Cantidad de trabajadores administrativos permanentes",
                    "permanent_administrative_workers"
                  );
                }}
              >
                <Icon name="comment outline" />
              </Button>
              <Button
                icon
                onClick={() => {
                  openUpdateSite("Categoria de productos");
                }}
              >
                <Icon name="paperclip" />
              </Button>
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>
              <label className="label">
                Cantidad de trabajadoras de produccion femeninas
              </label>
            </Table.Cell>
            <Table.Cell>
              <Form.Input
                type="number"
                name="female_production_workers.value"
                onChange={formik.handleChange}
                value={formik.values.female_production_workers.value}
                error={formik.errors.female_production_workers}
              />
            </Table.Cell>
            <Table.Cell>
              {/* <Form.Checkbox
                toggle
                checked={formik.values.female_production_workers.isApproved}
                label={
                  formik.values.female_production_workers.isApproved
                    ? "Aprobado"
                    : "Aprobado"
                }
                onChange={(e, { checked }) => {
                  formik.setFieldValue(
                    "female_production_workers.isApproved",
                    checked
                  );
                }}
              /> */}
                                 <Form.Dropdown
                placeholder="Seleccione"
                options={[{key:1, value:true,name:"Aprobado"}, {key:2 , value:false,name:"No aprobado"}].map((ds) => {
                  return {
                    key: ds.key,
                    text: ds.name,
                    value: ds.value,
                  };
                })}
                selection
                onChange={(_, data) =>
                  formik.setFieldValue("female_production_workers.isApproved", data.value)
                }
                value={formik.values.female_production_workers.isApproved}
                error={formik.errors.female_production_workers}
              />
              {/* {formik.values.female_production_workers.isApproved?  <Icon color="green" name='checkmark' /> : <Icon color="red" name='close' />} */}
            </Table.Cell>
            <Table.Cell>
              <Button
                icon
                type="button"
                primary
                onClick={() => {
                  openUpdateSite(
                    "Cantidad de trabajadoras de produccion femeninas",
                    "female_production_workers"
                  );
                }}
              >
                <Icon name="comment outline" />
              </Button>
              <Button
                icon
                onClick={() => {
                  openUpdateSite("Categoria de productos");
                }}
              >
                <Icon name="paperclip" />
              </Button>
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>
              <label className="label">
                Cantidad de trabajadores de produccion masculinos
              </label>
            </Table.Cell>
            <Table.Cell>
              <Form.Input
                type="number"
                name="male_production_workers.value"
                onChange={formik.handleChange}
                value={formik.values.male_production_workers.value}
                error={formik.errors.male_production_workers}
              />
            </Table.Cell>
            <Table.Cell>
              {/* <Form.Checkbox
                toggle
                checked={formik.values.male_production_workers.isApproved}
                label={
                  formik.values.male_production_workers.isApproved
                    ? "Aprobado"
                    : "Aprobado"
                }
                onChange={(e, { checked }) => {
                  formik.setFieldValue(
                    "male_production_workers.isApproved",
                    checked
                  );
                }}
              /> */}
                                    <Form.Dropdown
                placeholder="Seleccione"
                options={[{key:1, value:true,name:"Aprobado"}, {key:2 , value:false,name:"No aprobado"}].map((ds) => {
                  return {
                    key: ds.key,
                    text: ds.name,
                    value: ds.value,
                  };
                })}
                selection
                onChange={(_, data) =>
                  formik.setFieldValue("male_production_workers.isApproved", data.value)
                }
                value={formik.values.male_production_workers.isApproved}
                error={formik.errors.male_production_workers}
              />
              {/* {formik.values.male_production_workers.isApproved?  <Icon color="green" name='checkmark' /> : <Icon color="red" name='close' />} */}
            </Table.Cell>
            <Table.Cell>
              <Button
                icon
                type="button"
                primary
                onClick={() => {
                  openUpdateSite(
                    "Cantidad de trabajadores de produccion masculinos",
                    "male_production_workers"
                  );
                }}
              >
                <Icon name="comment outline" />
              </Button>
              <Button
                icon
                onClick={() => {
                  openUpdateSite("Categoria de productos");
                }}
              >
                <Icon name="paperclip" />
              </Button>
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>
              <label className="label">
                Cantidad de trabajadoras administrativas femeninas
              </label>
            </Table.Cell>
            <Table.Cell>
              <Form.Input
                type="number"
                name="female_administrative_workers.value"
                onChange={formik.handleChange}
                value={formik.values.female_administrative_workers.value}
                error={formik.errors.female_administrative_workers}
              />
            </Table.Cell>
            <Table.Cell>
              {/* <Form.Checkbox
                toggle
                checked={formik.values.female_administrative_workers.isApproved}
                label={
                  formik.values.female_administrative_workers.isApproved
                    ? "Aprobado"
                    : "Aprobado"
                }
                onChange={(e, { checked }) => {
                  formik.setFieldValue(
                    "female_administrative_workers.isApproved",
                    checked
                  );
                }}
              /> */}
                                        <Form.Dropdown
                placeholder="Seleccione"
                options={[{key:1, value:true,name:"Aprobado"}, {key:2 , value:false,name:"No aprobado"}].map((ds) => {
                  return {
                    key: ds.key,
                    text: ds.name,
                    value: ds.value,
                  };
                })}
                selection
                onChange={(_, data) =>
                  formik.setFieldValue("female_administrative_workers.isApproved", data.value)
                }
                value={formik.values.female_administrative_workers.isApproved}
                error={formik.errors.female_administrative_workers}
              />
              {/* {formik.values.female_administrative_workers.isApproved?  <Icon color="green" name='checkmark' /> : <Icon color="red" name='close' />} */}
            </Table.Cell>
            <Table.Cell>
              <Button
                icon
                type="button"
                primary
                onClick={() => {
                  openUpdateSite(
                    "Cantidad de trabajadoras administrativas femeninas",
                    "female_administrative_workers"
                  );
                }}
              >
                <Icon name="comment outline" />
              </Button>
              <Button
                icon
                onClick={() => {
                  openUpdateSite("Categoria de productos");
                }}
              >
                <Icon name="paperclip" />
              </Button>
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>
              <label className="label">
                Cantidad de trabajadores administrativos masculinos
              </label>
            </Table.Cell>
            <Table.Cell>
              <Form.Input
                type="number"
                name="male_administrative_workers.value"
                onChange={formik.handleChange}
                value={formik.values.male_administrative_workers.value}
                error={formik.errors.male_administrative_workers}
              />
            </Table.Cell>
            <Table.Cell>
              {/* <Form.Checkbox
                toggle
                checked={formik.values.male_administrative_workers.isApproved}
                label={
                  formik.values.male_administrative_workers.isApproved
                    ? "Aprobado"
                    : "Aprobado"
                }
                onChange={(e, { checked }) => {
                  formik.setFieldValue(
                    "male_administrative_workers.isApproved",
                    checked
                  );
                }}
              /> */}
                                          <Form.Dropdown
                placeholder="Seleccione"
                options={[{key:1, value:true,name:"Aprobado"}, {key:2 , value:false,name:"No aprobado"}].map((ds) => {
                  return {
                    key: ds.key,
                    text: ds.name,
                    value: ds.value,
                  };
                })}
                selection
                onChange={(_, data) =>
                  formik.setFieldValue("male_administrative_workers.isApproved", data.value)
                }
                value={formik.values.male_administrative_workers.isApproved}
                error={formik.errors.male_administrative_workers}
              />
              {/* {formik.values.male_administrative_workers.isApproved?  <Icon color="green" name='checkmark' /> : <Icon color="red" name='close' />} */}
            </Table.Cell>
            <Table.Cell>
              <Button
                icon
                type="button"
                primary
                onClick={() => {
                  openUpdateSite(
                    "Cantidad de trabajadores administrativos masculinos",
                    "male_administrative_workers"
                  );
                }}
              >
                <Icon name="comment outline" />
              </Button>
              <Button
                icon
                onClick={() => {
                  openUpdateSite("Categoria de productos");
                }}
              >
                <Icon name="paperclip" />
              </Button>
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>
              <label className="label">
                Cantidad de trabajadoras femeninas en posiciones de liderazgo
              </label>
            </Table.Cell>
            <Table.Cell>
              <Form.Input
                type="number"
                name="female_workers_leadership_position.value"
                onChange={formik.handleChange}
                value={formik.values.female_workers_leadership_positions.value}
                error={formik.errors.female_workers_leadership_positions}
              />
            </Table.Cell>
            <Table.Cell>
              {/* <Form.Checkbox
                toggle
                checked={
                  formik.values.female_workers_leadership_positions.isApproved
                }
                label={
                  formik.values.female_workers_leadership_positions.isApproved
                    ? "Aprobado"
                    : "Aprobado"
                }
                onChange={(e, { checked }) => {
                  formik.setFieldValue(
                    "female_workers_leadership_positions.isApproved",
                    checked
                  );
                }}
              /> */}
                                       <Form.Dropdown
                placeholder="Seleccione"
                options={[{key:1, value:true,name:"Aprobado"}, {key:2 , value:false,name:"No aprobado"}].map((ds) => {
                  return {
                    key: ds.key,
                    text: ds.name,
                    value: ds.value,
                  };
                })}
                selection
                onChange={(_, data) =>
                  formik.setFieldValue("female_workers_leadership_positions.isApproved", data.value)
                }
                value={formik.values.female_workers_leadership_positions.isApproved}
                error={formik.errors.female_workers_leadership_positions}
              />
              {/* {formik.values.female_workers_leadership_positions.isApproved?  <Icon color="green" name='checkmark' /> : <Icon color="red" name='close' />} */}
            </Table.Cell>
            <Table.Cell>
              <Button
                icon
                type="button"
                primary
                onClick={() => {
                  openUpdateSite(
                    "Cantidad de trabajadoras femeninas en posiciones de liderazgo",
                    "female_workers_leadership_positions"
                  );
                }}
              >
                <Icon name="comment outline" />
              </Button>
              <Button
                icon
                onClick={() => {
                  openUpdateSite("Categoria de productos");
                }}
              >
                <Icon name="paperclip" />
              </Button>
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>
              <label className="label">
                Cantidad de trabajadores masculinos en posiciones de liderazgo
              </label>
            </Table.Cell>
            <Table.Cell>
              <Form.Input
                type="number"
                name="male_workers_leadership_positions.value"
                onChange={formik.handleChange}
                value={formik.values.male_workers_leadership_positions.value}
                error={formik.errors.male_workers_leadership_positions}
              />
            </Table.Cell>
            <Table.Cell>
              {/* <Form.Checkbox
                toggle
                checked={
                  formik.values.male_workers_leadership_positions.isApproved
                }
                label={
                  formik.values.male_workers_leadership_positions.isApproved
                    ? "Aprobado"
                    : "Aprobado"
                }
                onChange={(e, { checked }) => {
                  formik.setFieldValue(
                    "male_workers_leadership_positions.isApproved",
                    checked
                  );
                }}
              /> */}
              <Form.Dropdown
                placeholder="Seleccione"
                options={[{key:1, value:true,name:"Aprobado"}, {key:2 , value:false,name:"No aprobado"}].map((ds) => {
                  return {
                    key: ds.key,
                    text: ds.name,
                    value: ds.value,
                  };
                })}
                selection
                onChange={(_, data) =>
                  formik.setFieldValue("male_workers_leadership_positions.isApproved", data.value)
                }
                value={formik.values.male_workers_leadership_positions.isApproved}
                error={formik.errors.male_workers_leadership_positions}
              />
              {/* {formik.values.male_workers_leadership_positions.isApproved?  <Icon color="green" name='checkmark' /> : <Icon color="red" name='close' />} */}
            </Table.Cell>
            <Table.Cell>
              <Button
                icon
                type="button"
                primary
                onClick={() => {
                  openUpdateSite(
                    "Cantidad de trabajadores masculinos en posiciones de liderazgo",
                    "male_workers_leadership_positions"
                  );
                }}
              >
                <Icon name="comment outline" />
              </Button>
              <Button
                icon
                onClick={() => {
                  openUpdateSite("Categoria de productos");
                }}
              >
                <Icon name="paperclip" />
              </Button>
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>
              <label className="label">
                Cantidad promedio de trabajadores totales
              </label>
            </Table.Cell>
            <Table.Cell>
              <Form.Input
                type="number"
                name="average_total_workers.value"
                onChange={formik.handleChange}
                value={formik.values.average_total_workers.value}
                error={formik.errors.average_total_workers}
              />
            </Table.Cell>
            <Table.Cell>
              {/* <Form.Checkbox
                toggle
                checked={formik.values.average_total_workers.isApproved}
                label={
                  formik.values.average_total_workers.isApproved
                    ? "Aprobado"
                    : "Aprobado"
                }
                onChange={(e, { checked }) => {
                  formik.setFieldValue(
                    "average_total_workers.isApproved",
                    checked
                  );
                }}
              /> */}
              <Form.Dropdown
                placeholder="Seleccione"
                options={[{key:1, value:true,name:"Aprobado"}, {key:2 , value:false,name:"No aprobado"}].map((ds) => {
                  return {
                    key: ds.key,
                    text: ds.name,
                    value: ds.value,
                  };
                })}
                selection
                onChange={(_, data) =>
                  formik.setFieldValue("average_total_workers.isApproved", data.value)
                }
                value={formik.values.average_total_workers.isApproved}
                error={formik.errors.average_total_workers}
              />
              {/* {formik.values.average_total_workers.isApproved?  <Icon color="green" name='checkmark' /> : <Icon color="red" name='close' />} */}
            </Table.Cell>
            <Table.Cell>
              <Button
                icon
                type="button"
                primary
                onClick={() => {
                  openUpdateSite(
                    "Cantidad promedio de trabajadores totales",
                    "average_total_workers"
                  );
                }}
              >
                <Icon name="comment outline" />
              </Button>
              <Button
                icon
                onClick={() => {
                  openUpdateSite("Categoria de productos");
                }}
              >
                <Icon name="paperclip" />
              </Button>
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>
              <label className="label">
                Promedio de trabajadoras femeninas
              </label>
            </Table.Cell>
            <Table.Cell>
              <Form.Input
                type="number"
                name="average_female_workers.value"
                onChange={formik.handleChange}
                value={formik.values.average_female_workers.value}
                error={formik.errors.average_female_workers}
              />
            </Table.Cell>
            <Table.Cell>
              {/* <Form.Checkbox
                toggle
                checked={formik.values.average_female_workers.isApproved}
                label={
                  formik.values.average_female_workers.isApproved
                    ? "Aprobado"
                    : "Aprobado"
                }
                onChange={(e, { checked }) => {
                  formik.setFieldValue(
                    "average_female_workers.isApproved",
                    checked
                  );
                }}
              /> */}
               <Form.Dropdown
                placeholder="Seleccione"
                options={[{key:1, value:true,name:"Aprobado"}, {key:2 , value:false,name:"No aprobado"}].map((ds) => {
                  return {
                    key: ds.key,
                    text: ds.name,
                    value: ds.value,
                  };
                })}
                selection
                onChange={(_, data) =>
                  formik.setFieldValue("average_female_workers.isApproved", data.value)
                }
                value={formik.values.average_female_workers.isApproved}
                error={formik.errors.average_female_workers}
              />
              {/* {formik.values.average_female_workers.isApproved?  <Icon color="green" name='checkmark' /> : <Icon color="red" name='close' />} */}
            </Table.Cell>
            <Table.Cell>
              <Button
                icon
                type="button"
                primary
                onClick={() => {
                  openUpdateSite(
                    "Promedio de trabajadoras femeninas",
                    "average_female_workers"
                  );
                }}
              >
                <Icon name="comment outline" />
              </Button>
              <Button
                icon
                onClick={() => {
                  openUpdateSite("Categoria de productos");
                }}
              >
                <Icon name="paperclip" />
              </Button>
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>
              <label className="label">
                Promedio de trabajadores masculinos
              </label>
            </Table.Cell>
            <Table.Cell>
              <Form.Input
                type="number"
                name="average_male_workers.value"
                onChange={formik.handleChange}
                value={formik.values.average_male_workers.value}
                error={formik.errors.average_male_workers}
              />
            </Table.Cell>
            <Table.Cell>
              {/* <Form.Checkbox
                toggle
                checked={formik.values.average_male_workers.isApproved}
                label={
                  formik.values.average_male_workers.isApproved
                    ? "Aprobado"
                    : "Aprobado"
                }
                onChange={(e, { checked }) => {
                  formik.setFieldValue(
                    "average_male_workers.isApproved",
                    checked
                  );
                }}
              /> */}
                     <Form.Dropdown
                placeholder="Seleccione"
                options={[{key:1, value:true,name:"Aprobado"}, {key:2 , value:false,name:"No aprobado"}].map((ds) => {
                  return {
                    key: ds.key,
                    text: ds.name,
                    value: ds.value,
                  };
                })}
                selection
                onChange={(_, data) =>
                  formik.setFieldValue("average_male_workers.isApproved", data.value)
                }
                value={formik.values.average_male_workers.isApproved}
                error={formik.errors.average_male_workers}
              />
              {/* {formik.values.average_male_workers.isApproved?  <Icon color="green" name='checkmark' /> : <Icon color="red" name='close' />} */}
            </Table.Cell>
            <Table.Cell>
              <Button
                icon
                type="button"
                primary
                onClick={() => {
                  openUpdateSite(
                    "Promedio de trabajadores masculinos",
                    "average_male_workers"
                  );
                }}
              >
                <Icon name="comment outline" />
              </Button>
              <Button
                icon
                onClick={() => {
                  openUpdateSite("Categoria de productos");
                }}
              >
                <Icon name="paperclip" />
              </Button>
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>
              <label className="label">% de trabajadoras femeninas</label>
            </Table.Cell>
            <Table.Cell>
              <Form.Input
                type="number"
                name="percentage_female_workers.value"
                onChange={formik.handleChange}
                value={formik.values.percentage_female_workers.value}
                error={formik.errors.percentage_female_workers}
              />
            </Table.Cell>
            <Table.Cell>
              {/* <Form.Checkbox
                toggle
                checked={formik.values.percentage_female_workers.isApproved}
                label={
                  formik.values.percentage_female_workers.isApproved
                    ? "Aprobado"
                    : "Aprobado"
                }
                onChange={(e, { checked }) => {
                  formik.setFieldValue(
                    "percentage_female_workers.isApproved",
                    checked
                  );
                }}
              /> */}
              <Form.Dropdown
                placeholder="Seleccione"
                options={[{key:1, value:true,name:"Aprobado"}, {key:2 , value:false,name:"No aprobado"}].map((ds) => {
                  return {
                    key: ds.key,
                    text: ds.name,
                    value: ds.value,
                  };
                })}
                selection
                onChange={(_, data) =>
                  formik.setFieldValue("percentage_female_workers.isApproved", data.value)
                }
                value={formik.values.percentage_female_workers.isApproved}
                error={formik.errors.percentage_female_workers}
              />
              {/* {formik.values.percentage_female_workers.isApproved?  <Icon color="green" name='checkmark' /> : <Icon color="red" name='close' />} */}
            </Table.Cell>
            <Table.Cell>
              <Button
                icon
                type="button"
                primary
                onClick={() => {
                  openUpdateSite(
                    "% de trabajadoras femeninas",
                    "percentage_female_workers"
                  );
                }}
              >
                <Icon name="comment outline" />
              </Button>
              <Button
                icon
                onClick={() => {
                  openUpdateSite("Categoria de productos");
                }}
              >
                <Icon name="paperclip" />
              </Button>
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>
              <label className="label">% de trabajadores masculinos</label>
            </Table.Cell>
            <Table.Cell>
              <Form.Input
                type="number"
                name="percentage_female_workers.value"
                onChange={formik.handleChange}
                value={formik.values.percentage_male_workers.value}
                error={formik.errors.percentage_male_workers}
              />
            </Table.Cell>
            <Table.Cell>
              {/* <Form.Checkbox
                toggle
                checked={formik.values.percentage_male_workers.isApproved}
                label={
                  formik.values.percentage_male_workers.isApproved
                    ? "Aprobado"
                    : "Aprobado"
                }
                onChange={(e, { checked }) => {
                  formik.setFieldValue(
                    "percentage_male_workers.isApproved",
                    checked
                  );
                }}
              /> */}
               <Form.Dropdown
                placeholder="Seleccione"
                options={[{key:1, value:true,name:"Aprobado"}, {key:2 , value:false,name:"No aprobado"}].map((ds) => {
                  return {
                    key: ds.key,
                    text: ds.name,
                    value: ds.value,
                  };
                })}
                selection
                onChange={(_, data) =>
                  formik.setFieldValue("percentage_male_workers.isApproved", data.value)
                }
                value={formik.values.percentage_male_workers.isApproved}
                error={formik.errors.percentage_male_workers}
              />
              {/* {formik.values.percentage_male_workers.isApproved?  <Icon color="green" name='checkmark' /> : <Icon color="red" name='close' />} */}
            </Table.Cell>
            <Table.Cell>
              <Button
                icon
                type="button"
                primary
                onClick={() => {
                  openUpdateSite(
                    "% de trabajadores masculinos",
                    "percentage_male_workers"
                  );
                }}
              >
                <Icon name="comment outline" />
              </Button>
              <Button
                icon
                onClick={() => {
                  openUpdateSite("Categoria de productos");
                }}
              >
                <Icon name="paperclip" />
              </Button>
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>
              <label className="label">% de mujeres totales</label>
            </Table.Cell>
            <Table.Cell>
              <Form.Input
                type="number"
                name="percentage_total_female.value"
                onChange={formik.handleChange}
                value={formik.values.percentage_total_female.value}
                error={formik.errors.percentage_total_female}
              />
            </Table.Cell>
            <Table.Cell>
              {/* <Form.Checkbox
                toggle
                checked={formik.values.percentage_total_female.isApproved}
                label={
                  formik.values.percentage_total_female.isApproved
                    ? "Aprobado"
                    : "Aprobado"
                }
                onChange={(e, { checked }) => {
                  formik.setFieldValue(
                    "percentage_total_female.isApproved",
                    checked
                  );
                }}
              /> */}
               <Form.Dropdown
                placeholder="Seleccione"
                options={[{key:1, value:true,name:"Aprobado"}, {key:2 , value:false,name:"No aprobado"}].map((ds) => {
                  return {
                    key: ds.key,
                    text: ds.name,
                    value: ds.value,
                  };
                })}
                selection
                onChange={(_, data) =>
                  formik.setFieldValue("percentage_total_female.isApproved", data.value)
                }
                value={formik.values.percentage_total_female.isApproved}
                error={formik.errors.percentage_total_female}
              />
              {/* {formik.values.percentage_total_female.isApproved?  <Icon color="green" name='checkmark' /> : <Icon color="red" name='close' />} */}
            </Table.Cell>
            <Table.Cell>
              <Button
                icon
                type="button"
                primary
                onClick={() => {
                  openUpdateSite(
                    "% de mujeres totales",
                    "percentage_total_female"
                  );
                }}
              >
                <Icon name="comment outline" />
              </Button>
              <Button
                icon
                onClick={() => {
                  openUpdateSite("Categoria de productos");
                }}
              >
                <Icon name="paperclip" />
              </Button>
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>
              <label className="label">% de hombres totales</label>
            </Table.Cell>
            <Table.Cell>
              <Form.Input
                type="number"
                name="percentage_total_male.value"
                onChange={formik.handleChange}
                value={formik.values.percentage_total_male.value}
                error={formik.errors.percentage_total_male}
              />
            </Table.Cell>
            <Table.Cell>
              {/* <Form.Checkbox
                toggle
                checked={formik.values.percentage_total_male.isApproved}
                label={
                  formik.values.percentage_total_male.isApproved
                    ? "Aprobado"
                    : "Aprobado"
                }
                onChange={(e, { checked }) => {
                  formik.setFieldValue(
                    "percentage_total_male.isApproved",
                    checked
                  );
                }}
              /> */}
                    <Form.Dropdown
                placeholder="Seleccione"
                options={[{key:1, value:true,name:"Aprobado"}, {key:2 , value:false,name:"No aprobado"}].map((ds) => {
                  return {
                    key: ds.key,
                    text: ds.name,
                    value: ds.value,
                  };
                })}
                selection
                onChange={(_, data) =>
                  formik.setFieldValue("percentage_total_male.isApproved", data.value)
                }
                value={formik.values.percentage_total_male.isApproved}
                error={formik.errors.percentage_total_male}
              />
              {/* {formik.values.percentage_total_male.isApproved?  <Icon color="green" name='checkmark' /> : <Icon color="red" name='close' />} */}
            </Table.Cell>
            <Table.Cell>
              <Button
                icon
                type="button"
                primary
                onClick={() => {
                  openUpdateSite(
                    "% de hombres totales",
                    "percentage_total_male"
                  );
                }}
              >
                <Icon name="comment outline" />
              </Button>
              <Button
                icon
                onClick={() => {
                  openUpdateSite("Categoria de productos");
                }}
              >
                <Icon name="paperclip" />
              </Button>
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>
              <label className="label">
                % de femeninas en posicion de liderazgo
              </label>
            </Table.Cell>
            <Table.Cell>
              <Form.Input
                type="number"
                name="percentage_female_leadership_positions.value"
                onChange={formik.handleChange}
                value={
                  formik.values.percentage_female_leadership_positions.value
                }
                error={formik.errors.percentage_female_leadership_positions}
              />
            </Table.Cell>
            <Table.Cell>
              {/* <Form.Checkbox
                toggle
                checked={
                  formik.values.percentage_female_leadership_positions
                    .isApproved
                }
                label={
                  formik.values.percentage_female_leadership_positions
                    .isApproved
                    ? "Aprobado"
                    : "Aprobado"
                }
                onChange={(e, { checked }) => {
                  formik.setFieldValue(
                    "percentage_female_leadership_positions.isApproved",
                    checked
                  );
                }}
              /> */}
                         <Form.Dropdown
                placeholder="Seleccione"
                options={[{key:1, value:true,name:"Aprobado"}, {key:2 , value:false,name:"No aprobado"}].map((ds) => {
                  return {
                    key: ds.key,
                    text: ds.name,
                    value: ds.value,
                  };
                })}
                selection
                onChange={(_, data) =>
                  formik.setFieldValue("percentage_female_leadership_positions.isApproved", data.value)
                }
                value={formik.values.percentage_female_leadership_positions.isApproved}
                error={formik.errors.percentage_female_leadership_positions}
              />
              {/* {formik.values.percentage_female_leadership_positions.isApproved?  <Icon color="green" name='checkmark' /> : <Icon color="red" name='close' />} */}
            </Table.Cell>
            <Table.Cell>
              <Button
                icon
                type="button"
                primary
                onClick={() => {
                  openUpdateSite(
                    "% de femeninas en posicion de liderazgo",
                    "percentage_female_leadership_positions"
                  );
                }}
              >
                <Icon name="comment outline" />
              </Button>
              <Button
                icon
                onClick={() => {
                  openUpdateSite("Categoria de productos");
                }}
              >
                <Icon name="paperclip" />
              </Button>
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>
              <label className="label">
                % de masculinos en posicion de liderazgo
              </label>
            </Table.Cell>
            <Table.Cell>
              <Form.Input
                type="number"
                name="percentage_male_leadership_positions.value"
                onChange={formik.handleChange}
                value={formik.values.percentage_male_leadership_positions.value}
                error={formik.errors.percentage_male_leadership_positions}
              />
            </Table.Cell>
            <Table.Cell>
              {/* <Form.Checkbox
                toggle
                checked={
                  formik.values.percentage_male_leadership_positions.isApproved
                }
                label={
                  formik.values.percentage_male_leadership_positions.isApproved
                    ? "Aprobado"
                    : "Aprobado"
                }
                onChange={(e, { checked }) => {
                  formik.setFieldValue(
                    "percentage_male_leadership_positions.isApproved",
                    checked
                  );
                }}
              /> */}
                             <Form.Dropdown
                placeholder="Seleccione"
                options={[{key:1, value:true,name:"Aprobado"}, {key:2 , value:false,name:"No aprobado"}].map((ds) => {
                  return {
                    key: ds.key,
                    text: ds.name,
                    value: ds.value,
                  };
                })}
                selection
                onChange={(_, data) =>
                  formik.setFieldValue("percentage_male_leadership_positions.isApproved", data.value)
                }
                value={formik.values.percentage_male_leadership_positions.isApproved}
                error={formik.errors.percentage_male_leadership_positions}
              />
              {/* {formik.values.percentage_male_leadership_positions.isApproved?  <Icon color="green" name='checkmark' /> : <Icon color="red" name='close' />} */}
            </Table.Cell>
            <Table.Cell>
              <Button
                icon
                type="button"
                primary
                onClick={() => {
                  openUpdateSite(
                    "% de masculinos en posicion de liderazgo",
                    "percentage_male_leadership_positions"
                  );
                }}
              >
                <Icon name="comment outline" />
              </Button>
              <Button
                icon
                onClick={() => {
                  openUpdateSite("Categoria de productos");
                }}
              >
                <Icon name="paperclip" />
              </Button>
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>
              <label className="label">
                Accidentes de trabajo con dias de baja (+ de uno)
              </label>
            </Table.Cell>
            <Table.Cell>
              <Form.Input
                type="number"
                name="work_accidents_with_sick_days.value"
                onChange={formik.handleChange}
                value={formik.values.work_accidents_with_sick_days.value}
                error={formik.errors.work_accidents_with_sick_days}
              />
            </Table.Cell>
            <Table.Cell>
              {/* <Form.Checkbox
                toggle
                checked={formik.values.work_accidents_with_sick_days.isApproved}
                label={
                  formik.values.work_accidents_with_sick_days.isApproved
                    ? "Aprobado"
                    : "Aprobado"
                }
                onChange={(e, { checked }) => {
                  formik.setFieldValue(
                    "work_accidents_with_sick_days.isApproved",
                    checked
                  );
                }}
              /> */}
                            <Form.Dropdown
                placeholder="Seleccione"
                options={[{key:1, value:true,name:"Aprobado"}, {key:2 , value:false,name:"No aprobado"}].map((ds) => {
                  return {
                    key: ds.key,
                    text: ds.name,
                    value: ds.value,
                  };
                })}
                selection
                onChange={(_, data) =>
                  formik.setFieldValue("work_accidents_with_sick_days.isApproved", data.value)
                }
                value={formik.values.work_accidents_with_sick_days.isApproved}
                error={formik.errors.work_accidents_with_sick_days}
              />
              {/* {formik.values.work_accidents_with_sick_days.isApproved?  <Icon color="green" name='checkmark' /> : <Icon color="red" name='close' />} */}
            </Table.Cell>
            <Table.Cell>
              <Button
                icon
                type="button"
                primary
                onClick={() => {
                  openUpdateSite(
                    "Accidentes de trabajo con dias de baja (+ de uno)",
                    "work_accidents_with_sick_days"
                  );
                }}
              >
                <Icon name="comment outline" />
              </Button>
              <Button
                icon
                onClick={() => {
                  openUpdateSite("Categoria de productos");
                }}
              >
                <Icon name="paperclip" />
              </Button>
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>
              <label className="label">
                Primeros auxilios sin dias de baja (continua trabajando)
              </label>
            </Table.Cell>
            <Table.Cell>
              <Form.Input
                type="number"
                name="first_aid_without_sick_days.value"
                onChange={formik.handleChange}
                value={formik.values.first_aid_without_sick_days.value}
                error={formik.errors.first_aid_without_sick_days}
              />
            </Table.Cell>
            <Table.Cell>
              {/* <Form.Checkbox
                toggle
                checked={formik.values.first_aid_without_sick_days.isApproved}
                label={
                  formik.values.first_aid_without_sick_days.isApproved
                    ? "Aprobado"
                    : "Aprobado"
                }
                onChange={(e, { checked }) => {
                  formik.setFieldValue(
                    "first_aid_without_sick_days.isApproved",
                    checked
                  );
                }}
              /> */}
                        <Form.Dropdown
                placeholder="Seleccione"
                options={[{key:1, value:true,name:"Aprobado"}, {key:2 , value:false,name:"No aprobado"}].map((ds) => {
                  return {
                    key: ds.key,
                    text: ds.name,
                    value: ds.value,
                  };
                })}
                selection
                onChange={(_, data) =>
                  formik.setFieldValue("first_aid_without_sick_days.isApproved", data.value)
                }
                value={formik.values.first_aid_without_sick_days.isApproved}
                error={formik.errors.first_aid_without_sick_days}
              />
              {/* {formik.values.first_aid_without_sick_days.isApproved?  <Icon color="green" name='checkmark' /> : <Icon color="red" name='close' />} */}
            </Table.Cell>
            <Table.Cell>
              <Button
                icon
                type="button"
                primary
                onClick={() => {
                  openUpdateSite(
                    "Primeros auxilios sin dias de baja (continua trabajando)",
                    "first_aid_without_sick_days"
                  );
                }}
              >
                <Icon name="comment outline" />
              </Button>
              <Button
                icon
                onClick={() => {
                  openUpdateSite("Categoria de productos");
                }}
              >
                <Icon name="paperclip" />
              </Button>
            </Table.Cell>
          </Table.Row>
        </Table.Body>

        {/* <TableFooter fullWidth>
      <TableRow>
        <TableHeaderCell />
        <TableHeaderCell colSpan='4'>
          <Button
            floated='right'
            labelPosition='left'
            secundary
            size='small'
          > Aprobar todos
          </Button>
        </TableHeaderCell>
      </TableRow>
    </TableFooter> */}

      </Table>

      <BasicModal show={showModal} close={onOpenCloseModal} title={titleModal}>
        <Comments
          formik={formik}
          fieldName={fieldName}
          onClose={onOpenCloseModal}
          onReload={onReload}
          siteForm={siteForm}
          user={user}
        />
      </BasicModal>
      <Form.Group widths="2">
        <Form.Button type="submit" fluid primary loading={formik.isSubmitting}>
          {!siteForm ? "Guardar" : "Actualizar datos"}
        </Form.Button>
        <Form.Button
          type="button"
          color="red"
          secondary
          fluid
          onClick={() => {
            onClose ? onClose() : goBack();
          }}
        >
          {"Cancelar"}
        </Form.Button>
      </Form.Group>
    </Form>
  );
}

function Comments(props) {
  const { formik, user, fieldName, onClose } = props;
  const [comment, setComment] = useState("");
  console.log(user);

  const onChangeHandle = () => {
    if (comment && comment.length > 0) {
      let data = formik.values[fieldName].reviews;
      data.push({
        comment: comment,
        date: new Date(),
        reviewer_user: user ? user._id : null,
      });
      formik.setFieldValue(`${fieldName}.reviews`, data);
    }
    onClose();
  };

  const handleSaveComment = (id, editedContent) => {
    let data = formik.values[fieldName].reviews;
    data[id].comment = editedContent;
    data[id].date = new Date();
    formik.setFieldValue(`${fieldName}.reviews`, data);
  };

  return (
    <>
      <CommentGroup minimal>
        {formik.values[fieldName].reviews &&
        formik.values[fieldName].reviews.length > 0
          ? formik.values[fieldName].reviews.map((review, index) => (
              <>
                <EditableComment
                  id={index}
                  author={
                    review.reviewer_user
                      ? review.reviewer_user === user._id
                        ? user.firstname + " " + user.lastname
                        : review.reviewer_user.firstname +
                          " " +
                          review.reviewer_user.lastname
                      : ""
                  }
                  date={formatDateHourCompleted(review.date)}
                  content={review.comment}
                  onSave={handleSaveComment}
                  active={
                    review.reviewer_user
                      ? review.reviewer_user === user._id
                        ? true
                        : false
                      : false
                  }
                />
                <Divider fitted />
              </>
            ))
          : null}
        <Form.TextArea
          //  name={[fieldName].reviews.comments}
          placeholder=""
          rows={3}
          style={{ minHeight: 100, width: "100%" }}
          // onChange={formik.handleChange}
          onChange={(_, data) => setComment(data.value)}
          value={formik.values[fieldName].reviews.comments}
          error={formik.errors[fieldName]}
        />
        <Form.Button
          type="button"
          icon="edit"
          content={"Añadir comentario"}
          primary
          fluid
          onClick={onChangeHandle}
        ></Form.Button>
      </CommentGroup>
    </>
  );
}

const EditableComment = ({ id, author, date, content, onSave, active }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    onSave(id, editedContent); // Save edited content
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset edited content and toggle editing off
    setEditedContent(content);
    setIsEditing(false);
  };

  const handleChange = (e) => {
    setEditedContent(e.target.value);
  };

  return (
    <Comment>
      <Comment.Content>
        <Comment.Author>{author}</Comment.Author>
        <CommentMetadata>
          <div>{date}</div>
        </CommentMetadata>
        <Comment.Text>
          {isEditing ? (
            <Form reply>
              <Form.TextArea value={editedContent} onChange={handleChange} />
              <Button content="Guardar" onClick={handleSave} primary />
              <Button content="Cancelar" onClick={handleCancel} secondary />
            </Form>
          ) : (
            <div>{editedContent}</div>
          )}
        </Comment.Text>
        {active ? (
          <Comment.Actions>
            <Comment.Action onClick={handleEdit}>Editar</Comment.Action>
          </Comment.Actions>
        ) : null}
      </Comment.Content>
    </Comment>
  );
};

// function ModalComments() {
//   const [open, setOpen] = React.useState(false)

//   return (
//     <Modal
//       basic
//       onClose={() => setOpen(false)}
//       onOpen={() => setOpen(true)}
//       open={open}
//       size='small'
//       trigger={<Button>Basic Modal</Button>}
//     >
//       <Header icon>
//         <Icon name='archive' />
//         Archive Old Messages
//       </Header>
//       <ModalContent>
//         <p>
//           Your inbox is getting full, would you like us to enable automatic
//           archiving of old messages?
//         </p>
//       </ModalContent>
//       <ModalActions>
//         <Button basic color='red' inverted onClick={() => setOpen(false)}>
//           <Icon name='remove' /> No
//         </Button>
//         <Button color='green' inverted onClick={() => setOpen(false)}>
//           <Icon name='checkmark' /> Yes
//         </Button>
//       </ModalActions>
//     </Modal>
//   )
// }
