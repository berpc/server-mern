import React, { useCallback, useState, useEffect } from "react";
import {
  Form,
  Image,
  Grid,
  Table,
  Icon,
  Button,
  Comment,
  CommentGroup,
  GridColumn,
  CommentMetadata,
  GridRow,
  Modal,
  ModalContent,
  ModalHeader,
  ModalActions,
  Segment,
  Divider,
  Header,
  List,
  Message
} from "semantic-ui-react";
import { useDropzone } from "react-dropzone";
import { useFormik, Field, FieldArray, FormikProvider, getIn } from "formik";
import { Dangerousform } from "../../../../api";
import { useAuth } from "../../../../hooks";
import { ENV } from "../../../../utils";
import {
  formatDateView,
  formatDateHourCompleted,
} from "../../../../utils/formatDate";
import { BasicModal } from "../../../Shared";
import { initialValues, validationSchema } from "./DangerousForm.form";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { decrypt, encrypt } from "../../../../utils/cryptoUtils";
import { PERIODS } from "../../../../utils";
import "./DangerousForm.scss";
import { useLanguage } from "../../../../contexts";

const dangerousFormController = new Dangerousform();

export function DangerousForm(props) {
  const { onClose, onReload, dangerousForm, siteSelected, year, period } =
    props;
  const { accessToken } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [titleModal, setTitleModal] = useState("");
  const [fieldName, setFieldName] = useState("");
  const [listPeriods, setListPeriods] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);

  const [newFiles, setNewFiles] = useState([]);


  const { user } = useAuth();

  const location = useLocation();
  // const { siteSelected } = location.state || {};

  const { language, changeLanguage, translations } = useLanguage();

  const t = (key) => translations[key] || key; // Función para obtener la traducción

  if (!siteSelected) {
    // // Manejo de caso donde no hay datos en state (por ejemplo, acceso directo a la URL)
    // return <div>No se encontraron detalles de producto.</div>;
  }

  const navigate = useNavigate();

  const onOpenCloseModal = () => setShowModal((prevState) => !prevState);
  const onOpenCloseConfirm = () => setShowConfirm((prevState) => !prevState);

  const openUpdateSite = (data, name) => {
    setFieldName(name);
    setTitleModal(`${t("comments")} ${data}`);
    onOpenCloseModal();
  };

  const formik = useFormik({
    initialValues: initialValues(dangerousForm, period, year),
    validationSchema: validationSchema(),
    validateOnChange: false,
    onSubmit: async (formValue) => {
      try {
        if (!dangerousForm) {
          formValue.creator_user = user._id;
          formValue.date = new Date();
          if (user?.site) {
            formValue.site = user.site._id;
          } else {
            if (siteSelected) {
              formValue.site = siteSelected;
            }
            // else {
            //   // Desencriptar los datos recibidos
            //   if (!dangerousForm) {
            //     //const siteData = decrypt(siteSelected);
            //     //formValue.site = siteData;
            //     formValue.site = siteSelected;
            //   }
            // }
          }
          await dangerousFormController.createDangerousForm(
            accessToken,
            formValue
          );
          //console.log(formValue);
        } else {
          await dangerousFormController.updateDangerousForm(
            accessToken,
            dangerousForm._id,
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
    navigate(`/admin/data/dangerousforms`, {
      state: { siteSelected: siteSelected },
    });
  };

  // Generar una lista de años (por ejemplo, del 2000 al 2024)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  useEffect(() => {
    (async () => {
      try {
        const response =
          await dangerousFormController.getPeriodsDangerousFormsBySiteAndYear(
            accessToken,
            siteSelected,
            formik.values.year
          );
        const periods = PERIODS.map((item) => item);
        const availablePeriods = periods
          .filter((period) => !response.periods.includes(period))
          .map((period) => period);

        setListPeriods(availablePeriods);
      } catch (error) {
        console.error(error);
        setListPeriods([]);
      }
    })();
  }, [formik.values.year]);

  return (
    <Form className="dangerous-form" onSubmit={formik.handleSubmit}>
      {dangerousForm ? (
        <Segment>
          <Header as="h4"> {t("date")}: {formatDateView(formik.values.date)}</Header>
          <Header as="h4">
            {t("creator_user")}:{" "}
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
      {!dangerousForm ? (
        <>
          <Grid columns={2} divided>
            <GridRow>
              <GridColumn>
                <Form.Dropdown
                  label={t("year")}
                  placeholder={t("select")}
                  options={years.map((year) => {
                    return {
                      key: year,
                      text: year,
                      value: year,
                    };
                  })}
                  selection
                  onChange={(_, data) =>
                    formik.setFieldValue("year", data.value)
                  }
                  value={formik.values.year}
                  error={formik.errors.year}
                />
              </GridColumn>
              <GridColumn>
                <Form.Dropdown
                  label={t("period")}
                  placeholder={t("select")}
                  options={listPeriods.map((period) => {
                    return {
                      key: period,
                      text: t(period),
                      value: period,
                    };
                  })}
                  selection
                  onChange={(_, data) =>
                    formik.setFieldValue("period", data.value)
                  }
                  value={formik.values.period}
                  error={formik.errors.period}
                />
              </GridColumn>
            </GridRow>
          </Grid>
        </>
      ) : null}
      <Table size="small" celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell width="1">{t("code")}</Table.HeaderCell>
            {<Table.HeaderCell width="6">{t("concept")}</Table.HeaderCell>}{" "}
            <Table.HeaderCell width="2">{t("value")}</Table.HeaderCell>
            <Table.HeaderCell width="2">{t("unit")}</Table.HeaderCell>
            <Table.HeaderCell width="2">{t("state")}</Table.HeaderCell>
            <Table.HeaderCell>{t("actions")}</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>
              <label className="label">
                {formik.values.chemicals_sent_to_reuse_or_recycle.code}{" "}
              </label>
            </Table.Cell>
            <Table.Cell>
              <label className="label">
                {t("chemicals_sent_to_reuse_or_recycle")}
              </label>
            </Table.Cell>
            <Table.Cell>
              <Form.Input
                onKeyPress={(event) => {
                  if (!/[0-9]/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
                name="chemicals_sent_to_reuse_or_recycle.value"
                onChange={formik.handleChange}
                value={formik.values.chemicals_sent_to_reuse_or_recycle.value}
                error={formik.errors.chemicals_sent_to_reuse_or_recycle}
              />
            </Table.Cell>
            <Table.Cell>
              <Form.Dropdown
                placeholder="Kg"
                options={[{ key: 1, value: true, name: "" }].map((ds) => {
                  return {
                    key: ds.key,
                    text: ds.name,
                    value: ds.value,
                  };
                })}
                selection
                onChange={(_, data) =>
                  formik.setFieldValue(
                    "chemicals_sent_to_reuse_or_recycle.unit",
                    data.value
                  )
                }
                value={formik.values.chemicals_sent_to_reuse_or_recycle.unit}
                error={formik.errors.chemicals_sent_to_reuse_or_recycle}
              />
              {/* {formik.values.days_total.isApproved?  <Icon color="green" name='checkmark' /> : <Icon color="red" name='close' />} */}
            </Table.Cell>

            <Table.Cell>
              <Form.Dropdown
                placeholder={t("select")}
                options={[
                  { key: 1, value: true, name: "aproveed" },
                  { key: 2, value: false, name: "not_aproveed" },
                ].map((ds) => {
                  return {
                    key: ds.key,
                    text: t(ds.name),
                    value: ds.value,
                  };
                })}
                selection
                onChange={(_, data) =>
                  formik.setFieldValue(
                    "chemicals_sent_to_reuse_or_recycle.isApproved",
                    data.value
                  )
                }
                value={
                  formik.values.chemicals_sent_to_reuse_or_recycle.isApproved
                }
                error={formik.errors.chemicals_sent_to_reuse_or_recycle}
              />
              {/* {formik.values.chemicals_sent_to_reuse_or_recycle.isApproved?  <Icon color="green" name='checkmark' /> : <Icon color="red" name='close' />} */}
            </Table.Cell>
            <Table.Cell>
              <Button
                icon
                type="button"
                primary
                onClick={() => {
                  openUpdateSite(
                    t("chemicals_sent_to_reuse_or_recycle"),
                    "chemicals_sent_to_reuse_or_recycle"
                  );
                }}
              >
                <Icon name="comment outline" />
              </Button>
              <FileUpload
                accessToken={accessToken}
                data={formik}
                field={"chemicals_sent_to_reuse_or_recycle"}
                newFiles={newFiles}
                setNewFiles={setNewFiles}
                t={t}
                
              />
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>
              <label className="label">
                {formik.values.lubricants_sent_to_reuse_or_recycle.code}{" "}
              </label>
            </Table.Cell>
            <Table.Cell>
              <label className="label">
                {t("lubricants_sent_to_reuse_or_recycle")}
              </label>
            </Table.Cell>
            <Table.Cell>
              <Form.Input
                onKeyPress={(event) => {
                  if (!/[0-9]/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
                onChange={formik.handleChange}
                name="lubricants_sent_to_reuse_or_recycle.value"
                value={formik.values.lubricants_sent_to_reuse_or_recycle.value}
                error={formik.errors.lubricants_sent_to_reuse_or_recycle}
              />
            </Table.Cell>
            <Table.Cell>
              <Form.Dropdown
                placeholder="Kg"
                options={[{ key: 1, value: true, name: "" }].map((ds) => {
                  return {
                    key: ds.key,
                    text: ds.name,
                    value: ds.value,
                  };
                })}
                selection
                onChange={(_, data) =>
                  formik.setFieldValue(
                    "lubricants_sent_to_reuse_or_recycle.unit",
                    data.value
                  )
                }
                value={formik.values.lubricants_sent_to_reuse_or_recycle.unit}
                error={formik.errors.lubricants_sent_to_reuse_or_recycle}
              />
              {/* {formik.values.days_total.isApproved?  <Icon color="green" name='checkmark' /> : <Icon color="red" name='close' />} */}
            </Table.Cell>
            <Table.Cell>
              <Form.Dropdown
                placeholder={t("select")}
                options={[
                  { key: 1, value: true, name: "aproveed" },
                  { key: 2, value: false, name: "not_aproveed" },
                ].map((ds) => {
                  return {
                    key: ds.key,
                    text: t(ds.name),
                    value: ds.value,
                  };
                })}
                selection
                onChange={(_, data) =>
                  formik.setFieldValue(
                    "lubricants_sent_to_reuse_or_recycle.isApproved",
                    data.value
                  )
                }
                value={
                  formik.values.lubricants_sent_to_reuse_or_recycle.isApproved
                }
                error={formik.errors.lubricants_sent_to_reuse_or_recycle}
              />
              {/* {formik.values.lubricants_sent_to_reuse_or_recycle.isApproved?  <Icon color="green" name='checkmark' /> : <Icon color="red" name='close' />} */}
            </Table.Cell>
            <Table.Cell>
              <Button
                icon
                primary
                type="button"
                onClick={() => {
                  openUpdateSite(
                    t("lubricants_sent_to_reuse_or_recycle"),
                    "lubricants_sent_to_reuse_or_recycle"
                  );
                }}
              >
                <Icon name="comment outline" />
              </Button>
              <FileUpload
                accessToken={accessToken}
                data={formik}
                field={"lubricants_sent_to_reuse_or_recycle"}
                newFiles={newFiles}
                setNewFiles={setNewFiles}
                t={t}
              />
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>
              <label className="label">
                {formik.values.oils_sent_to_reuse_or_recycle.code}{" "}
              </label>
            </Table.Cell>

            <Table.Cell>
              <label className="label">
                {t("oils_sent_to_reuse_or_recycle")}
              </label>
            </Table.Cell>
            <Table.Cell>
              <Form.Input
                onKeyPress={(event) => {
                  if (!/[0-9]/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
                onChange={formik.handleChange}
                name="oils_sent_to_reuse_or_recycle.value"
                value={formik.values.oils_sent_to_reuse_or_recycle.value}
                error={formik.errors.oils_sent_to_reuse_or_recycle}
              />
            </Table.Cell>
            <Table.Cell>
              <Form.Dropdown
                placeholder="Kg"
                options={[{ key: 1, value: true, name: "" }].map((ds) => {
                  return {
                    key: ds.key,
                    text: ds.name,
                    value: ds.value,
                  };
                })}
                selection
                onChange={(_, data) =>
                  formik.setFieldValue(
                    "oils_sent_to_reuse_or_recycle.unit",
                    data.value
                  )
                }
                value={formik.values.oils_sent_to_reuse_or_recycle.unit}
                error={formik.errors.oils_sent_to_reuse_or_recycle}
              />
              {/* {formik.values.days_total.isApproved?  <Icon color="green" name='checkmark' /> : <Icon color="red" name='close' />} */}
            </Table.Cell>
            <Table.Cell>
              <Form.Dropdown
                placeholder={t("select")}
                options={[
                  { key: 1, value: true, name: "aproveed" },
                  { key: 2, value: false, name: "not_aproveed" },
                ].map((ds) => {
                  return {
                    key: ds.key,
                    text: t(ds.name),
                    value: ds.value,
                  };
                })}
                selection
                onChange={(_, data) =>
                  formik.setFieldValue(
                    "oils_sent_to_reuse_or_recycle.isApproved",
                    data.value
                  )
                }
                value={formik.values.oils_sent_to_reuse_or_recycle.isApproved}
                error={formik.errors.oils_sent_to_reuse_or_recycle}
              />
              {/* {formik.values.product_category.isApproved?  <Icon color="green" name='checkmark' /> : <Icon color="red" name='close' />} */}
            </Table.Cell>
            <Table.Cell>
              <Button
                icon
                primary
                type="button"
                onClick={() => {
                  openUpdateSite(
                    t("oils_sent_to_reuse_or_recycle"),
                    "oils_sent_to_reuse_or_recycle"
                  );
                }}
              >
                <Icon name="comment outline" />
              </Button>
              <FileUpload
                accessToken={accessToken}
                data={formik}
                field={"oils_sent_to_reuse_or_recycle"}
                newFiles={newFiles}
                setNewFiles={setNewFiles}
                t={t}
              />
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>
              <label className="label">
                {
                  formik.values.machines_and_equipment_sent_to_reuse_or_recycle
                    .code
                }{" "}
              </label>
            </Table.Cell>
            <Table.Cell>
              <label className="label">
                {t("machines_and_equipment_sent_to_reuse_or_recycle")}
              </label>
            </Table.Cell>
            <Table.Cell>
              <Form.Input
                onKeyPress={(event) => {
                  if (!/[0-9]/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
                onChange={formik.handleChange}
                name="machines_and_equipment_sent_to_reuse_or_recycle.value"
                value={
                  formik.values.machines_and_equipment_sent_to_reuse_or_recycle
                    .value
                }
                error={
                  formik.errors.machines_and_equipment_sent_to_reuse_or_recycle
                }
              />
            </Table.Cell>
            <Table.Cell>
              <Form.Dropdown
                placeholder="Kg"
                options={[{ key: 1, value: true, name: "" }].map((ds) => {
                  return {
                    key: ds.key,
                    text: ds.name,
                    value: ds.value,
                  };
                })}
                selection
                onChange={(_, data) =>
                  formik.setFieldValue(
                    "machines_and_equipment_sent_to_reuse_or_recycle",
                    data.value
                  )
                }
                value={
                  formik.values.machines_and_equipment_sent_to_reuse_or_recycle
                    .isApproved
                }
                error={
                  formik.errors.machines_and_equipment_sent_to_reuse_or_recycle
                }
              />
              {/* {formik.values.days_total.isApproved?  <Icon color="green" name='checkmark' /> : <Icon color="red" name='close' />} */}
            </Table.Cell>

            <Table.Cell>
              <Form.Dropdown
                placeholder={t("select")}
                options={[
                  { key: 1, value: true, name: "aproveed" },
                  { key: 2, value: false, name: "not_aproveed" },
                ].map((ds) => {
                  return {
                    key: ds.key,
                    text: t(ds.name),
                    value: ds.value,
                  };
                })}
                selection
                onChange={(_, data) =>
                  formik.setFieldValue(
                    "machines_and_equipment_sent_to_reuse_or_recycle.isApproved",
                    data.value
                  )
                }
                value={
                  formik.values.machines_and_equipment_sent_to_reuse_or_recycle
                    .isApproved
                }
                error={
                  formik.errors.machines_and_equipment_sent_to_reuse_or_recycle
                }
              />
              {/* {formik.values.machines_and_equipment_sent_to_reuse_or_recycle.isApproved?  <Icon color="green" name='checkmark' /> : <Icon color="red" name='close' />} */}
            </Table.Cell>
            <Table.Cell>
              <Button
                icon
                primary
                type="button"
                onClick={() => {
                  openUpdateSite(
                    t("machines_and_equipment_sent_to_reuse_or_recycle"),
                    "machines_and_equipment_sent_to_reuse_or_recycle"
                  );
                }}
              >
                <Icon name="comment outline" />
              </Button>
              <FileUpload
                accessToken={accessToken}
                data={formik}
                field={"machines_and_equipment_sent_to_reuse_or_recycle"}
                newFiles={newFiles}
                setNewFiles={setNewFiles}
                t={t}
              />
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>
              <label className="label">
                {formik.values.electronic_waste_sent_to_reuse_or_recycle.code}{" "}
              </label>
            </Table.Cell>
            <Table.Cell>
              <label className="label">
                {t("electronic_waste_sent_to_reuse_or_recycle")}
              </label>
            </Table.Cell>
            <Table.Cell>
              <Form.Input
                onKeyPress={(event) => {
                  if (!/[0-9]/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
                onChange={formik.handleChange}
                name="electronic_waste_sent_to_reuse_or_recycle.value"
                value={
                  formik.values.electronic_waste_sent_to_reuse_or_recycle.value
                }
                error={formik.errors.electronic_waste_sent_to_reuse_or_recycle}
              />
            </Table.Cell>
            <Table.Cell>
              <Form.Dropdown
                placeholder="Kg"
                options={[{ key: 1, value: true, name: "" }].map((ds) => {
                  return {
                    key: ds.key,
                    text: ds.name,
                    value: ds.value,
                  };
                })}
                selection
                onChange={(_, data) =>
                  formik.setFieldValue(
                    "electronic_waste_sent_to_reuse_or_recycle.unit",
                    data.value
                  )
                }
                value={
                  formik.values.electronic_waste_sent_to_reuse_or_recycle.unit
                }
                error={formik.errors.electronic_waste_sent_to_reuse_or_recycle}
              />
              {/* {formik.values.days_total.isApproved?  <Icon color="green" name='checkmark' /> : <Icon color="red" name='close' />} */}
            </Table.Cell>

            <Table.Cell>
              <Form.Dropdown
                placeholder={t("select")}
                options={[
                  { key: 1, value: true, name: "aproveed" },
                  { key: 2, value: false, name: "not_aproveed" },
                ].map((ds) => {
                  return {
                    key: ds.key,
                    text: t(ds.name),
                    value: ds.value,
                  };
                })}
                selection
                onChange={(_, data) =>
                  formik.setFieldValue(
                    "electronic_waste_sent_to_reuse_or_recycle.isApproved",
                    data.value
                  )
                }
                value={
                  formik.values.electronic_waste_sent_to_reuse_or_recycle
                    .isApproved
                }
                error={formik.errors.electronic_waste_sent_to_reuse_or_recycle}
              />
              {/* {formik.values.product_category.isApproved?  <Icon color="green" name='checkmark' /> : <Icon color="red" name='close' />} */}
            </Table.Cell>
            <Table.Cell>
              <Button
                icon
                primary
                type="button"
                onClick={() => {
                  openUpdateSite(
                    t("electronic_waste_sent_to_reuse_or_recycle"),
                    "electronic_waste_sent_to_reuse_or_recycle"
                  );
                }}
              >
                <Icon name="comment outline" />
              </Button>
              <FileUpload
                accessToken={accessToken}
                data={formik}
                field={"electronic_waste_sent_to_reuse_or_recycle"}
                newFiles={newFiles}
                setNewFiles={setNewFiles}
                t={t}
              />
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>
              <label className="label">
                {
                  formik.values.other_dangerous_wastes_sent_to_reuse_or_recycle
                    .code
                }{" "}
              </label>
            </Table.Cell>
            <Table.Cell>
              <label className="label">
                {t("other_dangerous_wastes_sent_to_reuse_or_recycle")}
              </label>
            </Table.Cell>
            <Table.Cell>
              <Form.Input
                onKeyPress={(event) => {
                  if (!/[0-9]/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
                onChange={formik.handleChange}
                name="other_dangerous_wastes_sent_to_reuse_or_recycle.value"
                value={
                  formik.values.other_dangerous_wastes_sent_to_reuse_or_recycle
                    .value
                }
                error={
                  formik.errors.other_dangerous_wastes_sent_to_reuse_or_recycle
                }
              />
            </Table.Cell>
            <Table.Cell>
              <Form.Dropdown
                placeholder="Kg"
                options={[{ key: 1, value: true, name: "" }].map((ds) => {
                  return {
                    key: ds.key,
                    text: ds.name,
                    value: ds.value,
                  };
                })}
                selection
                onChange={(_, data) =>
                  formik.setFieldValue(
                    "other_dangerous_wastes_sent_to_reuse_or_recycle.isApproved",
                    data.value
                  )
                }
                value={
                  formik.values.other_dangerous_wastes_sent_to_reuse_or_recycle
                    .isApproved
                }
                error={
                  formik.errors.other_dangerous_wastes_sent_to_reuse_or_recycle
                }
              />
              {/* {formik.values.days_total.isApproved?  <Icon color="green" name='checkmark' /> : <Icon color="red" name='close' />} */}
            </Table.Cell>

            <Table.Cell>
              <Form.Dropdown
                placeholder={t("select")}
                options={[
                  { key: 1, value: true, name: "aproveed" },
                  { key: 2, value: false, name: "not_aproveed" },
                ].map((ds) => {
                  return {
                    key: ds.key,
                    text: t(ds.name),
                    value: ds.value,
                  };
                })}
                selection
                onChange={(_, data) =>
                  formik.setFieldValue(
                    "other_dangerous_wastes_sent_to_reuse_or_recycle.isApproved",
                    data.value
                  )
                }
                value={
                  formik.values.other_dangerous_wastes_sent_to_reuse_or_recycle
                    .isApproved
                }
                error={
                  formik.errors.other_dangerous_wastes_sent_to_reuse_or_recycle
                }
              />
              {/* {formik.values.other_dangerous_wastes_sent_to_reuse_or_recycle.isApproved?  <Icon color="green" name='checkmark' /> : <Icon color="red" name='close' />} */}
            </Table.Cell>
            <Table.Cell>
              <Button
                icon
                primary
                type="button"
                onClick={() => {
                  openUpdateSite(
                    t("other_dangerous_wastes_sent_to_reuse_or_recycle"),
                    "other_dangerous_wastes_sent_to_reuse_or_recycle"
                  );
                }}
              >
                <Icon name="comment outline" />
              </Button>
              <FileUpload
                accessToken={accessToken}
                data={formik}
                field={"other_dangerous_wastes_sent_to_reuse_or_recycle"}
                newFiles={newFiles}
                setNewFiles={setNewFiles}
                t={t}
              />
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>
              <label className="label">
                {formik.values.chemicals_sent_to_incineration.code}{" "}
              </label>
            </Table.Cell>
            <Table.Cell>
              <label className="label">
                {t("chemicals_sent_to_incineration")}
              </label>
            </Table.Cell>
            <Table.Cell>
              <Form.Input
                onKeyPress={(event) => {
                  if (!/[0-9]/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
                onChange={formik.handleChange}
                name="chemicals_sent_to_incineration.value"
                value={formik.values.chemicals_sent_to_incineration.value}
                error={formik.errors.chemicals_sent_to_incineration}
              />
            </Table.Cell>
            <Table.Cell>
              <Form.Dropdown
                placeholder="Kg"
                options={[{ key: 1, value: true, name: "" }].map((ds) => {
                  return {
                    key: ds.key,
                    text: ds.name,
                    value: ds.value,
                  };
                })}
                selection
                onChange={(_, data) =>
                  formik.setFieldValue(
                    "chemicals_sent_to_incineration.unit",
                    data.value
                  )
                }
                value={formik.values.chemicals_sent_to_incineration.unit}
                error={formik.errors.chemicals_sent_to_incineration}
              />
              {/* {formik.values.days_total.isApproved?  <Icon color="green" name='checkmark' /> : <Icon color="red" name='close' />} */}
            </Table.Cell>

            <Table.Cell>
              <Form.Dropdown
                placeholder={t("select")}
                options={[
                  { key: 1, value: true, name: "aproveed" },
                  { key: 2, value: false, name: "not_aproveed" },
                ].map((ds) => {
                  return {
                    key: ds.key,
                    text: t(ds.name),
                    value: ds.value,
                  };
                })}
                selection
                onChange={(_, data) =>
                  formik.setFieldValue(
                    "chemicals_sent_to_incineration.isApproved",
                    data.value
                  )
                }
                value={formik.values.chemicals_sent_to_incineration.isApproved}
                error={formik.errors.chemicals_sent_to_incineration}
              />
              {/* {formik.values.chemicals_sent_to_incineration.isApproved?  <Icon color="green" name='checkmark' /> : <Icon color="red" name='close' />} */}
            </Table.Cell>
            <Table.Cell>
              <Button
                icon
                primary
                type="button"
                onClick={() => {
                  openUpdateSite(
                    t("chemicals_sent_to_incineration"),
                    "chemicals_sent_to_incineration"
                  );
                }}
              >
                <Icon name="comment outline" />
              </Button>
              <FileUpload
                accessToken={accessToken}
                data={formik}
                field={"chemicals_sent_to_incineration"}
                newFiles={newFiles}
                setNewFiles={setNewFiles}
                t={t}
              />
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>
              <label className="label">
                {formik.values.lubricants_sent_to_incineration.code}{" "}
              </label>
            </Table.Cell>
            <Table.Cell>
              <label className="label">
                {t("lubricants_sent_to_incineration")}
              </label>
            </Table.Cell>
            <Table.Cell>
              <Form.Input
                onKeyPress={(event) => {
                  if (!/[0-9]/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
                onChange={formik.handleChange}
                name="lubricants_sent_to_incineration.value"
                value={formik.values.lubricants_sent_to_incineration.value}
                error={formik.errors.lubricants_sent_to_incineration}
              />
            </Table.Cell>
            <Table.Cell>
              <Form.Dropdown
                placeholder="Kg"
                options={[{ key: 1, value: true, name: "" }].map((ds) => {
                  return {
                    key: ds.key,
                    text: ds.name,
                    value: ds.value,
                  };
                })}
                selection
                onChange={(_, data) =>
                  formik.setFieldValue(
                    "lubricants_sent_to_incineration.unit",
                    data.value
                  )
                }
                value={formik.values.lubricants_sent_to_incineration.unit}
                error={formik.errors.lubricants_sent_to_incineration}
              />
              {/* {formik.values.days_total.isApproved?  <Icon color="green" name='checkmark' /> : <Icon color="red" name='close' />} */}
            </Table.Cell>

            <Table.Cell>
              <Form.Dropdown
                placeholder={t("select")}
                options={[
                  { key: 1, value: true, name: "aproveed" },
                  { key: 2, value: false, name: "not_aproveed" },
                ].map((ds) => {
                  return {
                    key: ds.key,
                    text: t(ds.name),
                    value: ds.value,
                  };
                })}
                selection
                onChange={(_, data) =>
                  formik.setFieldValue(
                    "lubricants_sent_to_incineration.isApproved",
                    data.value
                  )
                }
                value={formik.values.lubricants_sent_to_incineration.isApproved}
                error={formik.errors.lubricants_sent_to_incineration}
              />
              {/* {formik.values.lubricants_sent_to_incineration.isApproved?  <Icon color="green" name='checkmark' /> : <Icon color="red" name='close' />} */}
            </Table.Cell>
            <Table.Cell>
              <Button
                icon
                primary
                type="button"
                onClick={() => {
                  openUpdateSite(
                    t("lubricants_sent_to_incineration"),
                    "lubricants_sent_to_incineration"
                  );
                }}
              >
                <Icon name="comment outline" />
              </Button>
              <FileUpload
                accessToken={accessToken}
                data={formik}
                field={"lubricants_sent_to_incineration"}
                newFiles={newFiles}
                setNewFiles={setNewFiles}
                t={t}
              />
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>
              <label className="label">
                {formik.values.oils_sent_to_incineration.code}{" "}
              </label>
            </Table.Cell>
            <Table.Cell>
              <label className="label">{t("oils_sent_to_incineration")}</label>
            </Table.Cell>
            <Table.Cell>
              <Form.Input
                onKeyPress={(event) => {
                  if (!/[0-9]/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
                onChange={formik.handleChange}
                name="oils_sent_to_incineration.value"
                value={formik.values.oils_sent_to_incineration.value}
                error={formik.errors.oils_sent_to_incineration}
              />
            </Table.Cell>
            <Table.Cell>
              <Form.Dropdown
                placeholder="Kg"
                options={[{ key: 1, value: true, name: "" }].map((ds) => {
                  return {
                    key: ds.key,
                    text: ds.name,
                    value: ds.value,
                  };
                })}
                selection
                onChange={(_, data) =>
                  formik.setFieldValue(
                    "oils_sent_to_incineration.unit",
                    data.value
                  )
                }
                value={formik.values.oils_sent_to_incineration.unit}
                error={formik.errors.oils_sent_to_incineration}
              />
              {/* {formik.values.days_total.isApproved?  <Icon color="green" name='checkmark' /> : <Icon color="red" name='close' />} */}
            </Table.Cell>
            <Table.Cell>
              <Form.Dropdown
                placeholder={t("select")}
                options={[
                  { key: 1, value: true, name: "aproveed" },
                  { key: 2, value: false, name: "not_aproveed" },
                ].map((ds) => {
                  return {
                    key: ds.key,
                    text: t(ds.name),
                    value: ds.value,
                  };
                })}
                selection
                onChange={(_, data) =>
                  formik.setFieldValue(
                    "oils_sent_to_incineration.isApproved",
                    data.value
                  )
                }
                value={formik.values.oils_sent_to_incineration.isApproved}
                error={formik.errors.oils_sent_to_incineration}
              />
              {/* {formik.values.oils_sent_to_incineration.isApproved?  <Icon color="green" name='checkmark' /> : <Icon color="red" name='close' />} */}
            </Table.Cell>
            <Table.Cell>
              <Button
                icon
                primary
                type="button"
                onClick={() => {
                  openUpdateSite(
                    t("oils_sent_to_incineration"),
                    "oils_sent_to_incineration"
                  );
                }}
              >
                <Icon name="comment outline" />
              </Button>
              <FileUpload
                accessToken={accessToken}
                data={formik}
                field={"oils_sent_to_incineration"}
                newFiles={newFiles}
                setNewFiles={setNewFiles}
                t={t}
              />
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>
              <label className="label">
                {formik.values.machines_and_equipment_sent_to_incineration.code}{" "}
              </label>
            </Table.Cell>
            <Table.Cell>
              <label className="label">
                {t("machines_and_equipment_sent_to_incineration")}
              </label>
            </Table.Cell>
            <Table.Cell>
              <Form.Input
                onKeyPress={(event) => {
                  if (!/[0-9]/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
                onChange={formik.handleChange}
                name="machines_and_equipment_sent_to_incineration.value"
                value={
                  formik.values.machines_and_equipment_sent_to_incineration
                    .value
                }
                error={
                  formik.errors.machines_and_equipment_sent_to_incineration
                }
              />
            </Table.Cell>
            <Table.Cell>
              <Form.Dropdown
                placeholder="Kg"
                options={[{ key: 1, value: true, name: "" }].map((ds) => {
                  return {
                    key: ds.key,
                    text: ds.name,
                    value: ds.value,
                  };
                })}
                selection
                onChange={(_, data) =>
                  formik.setFieldValue(
                    "machines_and_equipment_sent_to_incineration.isApproved",
                    data.value
                  )
                }
                value={
                  formik.values.machines_and_equipment_sent_to_incineration
                    .isApproved
                }
                error={
                  formik.errors.machines_and_equipment_sent_to_incineration
                }
              />
              {/* {formik.values.days_total.isApproved?  <Icon color="green" name='checkmark' /> : <Icon color="red" name='close' />} */}
            </Table.Cell>
            <Table.Cell>
              <Form.Dropdown
                placeholder={t("select")}
                options={[
                  { key: 1, value: true, name: "aproveed" },
                  { key: 2, value: false, name: "not_aproveed" },
                ].map((ds) => {
                  return {
                    key: ds.key,
                    text: t(ds.name),
                    value: ds.value,
                  };
                })}
                selection
                onChange={(_, data) =>
                  formik.setFieldValue(
                    "machines_and_equipment_sent_to_incineration.isApproved",
                    data.value
                  )
                }
                value={
                  formik.values.machines_and_equipment_sent_to_incineration
                    .isApproved
                }
                error={
                  formik.errors.machines_and_equipment_sent_to_incineration
                }
              />
              {/* {formik.values.machines_and_equipment_sent_to_incineration.isApproved?  <Icon color="green" name='checkmark' /> : <Icon color="red" name='close' />} */}
            </Table.Cell>
            <Table.Cell>
              <Button
                icon
                primary
                type="button"
                onClick={() => {
                  openUpdateSite(
                    t("machines_and_equipment_sent_to_incineration"),
                    "machines_and_equipment_sent_to_incineration"
                  );
                }}
              >
                <Icon name="comment outline" />
              </Button>
              <FileUpload
                accessToken={accessToken}
                data={formik}
                field={"machines_and_equipment_sent_to_incineration"}
                newFiles={newFiles}
                setNewFiles={setNewFiles}
                t={t}
              />
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>
              <label className="label">
                {formik.values.electronic_waste_sent_to_incineration.code}{" "}
              </label>
            </Table.Cell>
            <Table.Cell>
              <label className="label">
                {t("electronic_waste_sent_to_incineration")}
              </label>
            </Table.Cell>
            <Table.Cell>
              <Form.Input
                onKeyPress={(event) => {
                  if (!/[0-9]/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
                onChange={formik.handleChange}
                name="electronic_waste_sent_to_incineration.value"
                value={
                  formik.values.electronic_waste_sent_to_incineration.value
                }
                error={formik.errors.electronic_waste_sent_to_incineration}
              />
            </Table.Cell>
            <Table.Cell>
              <Form.Dropdown
                placeholder="Kg"
                options={[{ key: 1, value: true, name: "" }].map((ds) => {
                  return {
                    key: ds.key,
                    text: ds.name,
                    value: ds.value,
                  };
                })}
                selection
                onChange={(_, data) =>
                  formik.setFieldValue(
                    "electronic_waste_sent_to_incineration.unit",
                    data.value
                  )
                }
                value={formik.values.electronic_waste_sent_to_incineration.unit}
                error={formik.errors.electronic_waste_sent_to_incineration}
              />
              {/* {formik.values.days_total.isApproved?  <Icon color="green" name='checkmark' /> : <Icon color="red" name='close' />} */}
            </Table.Cell>
            <Table.Cell>
              <Form.Dropdown
                placeholder={t("select")}
                options={[
                  { key: 1, value: true, name: "aproveed" },
                  { key: 2, value: false, name: "not_aproveed" },
                ].map((ds) => {
                  return {
                    key: ds.key,
                    text: t(ds.name),
                    value: ds.value,
                  };
                })}
                selection
                onChange={(_, data) =>
                  formik.setFieldValue(
                    "electronic_waste_sent_to_incineration.isApproved",
                    data.value
                  )
                }
                value={
                  formik.values.electronic_waste_sent_to_incineration.isApproved
                }
                error={formik.errors.electronic_waste_sent_to_incineration}
              />
              {/* {formik.values.electronic_waste_sent_to_incineration.isApproved?  <Icon color="green" name='checkmark' /> : <Icon color="red" name='close' />} */}
            </Table.Cell>
            <Table.Cell>
              <Button
                icon
                primary
                type="button"
                onClick={() => {
                  openUpdateSite(
                    t("electronic_waste_sent_to_incineration"),
                    "electronic_waste_sent_to_incineration"
                  );
                }}
              >
                <Icon name="comment outline" />
              </Button>
              <FileUpload
                accessToken={accessToken}
                data={formik}
                field={"electronic_waste_sent_to_incineration"}
                newFiles={newFiles}
                setNewFiles={setNewFiles}
                t={t}
              />
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>
              <label className="label">
                {formik.values.other_dangerous_wastes_sent_to_incineration.code}{" "}
              </label>
            </Table.Cell>
            <Table.Cell>
              <label className="label">
                {t("other_dangerous_wastes_sent_to_incineration")}
              </label>
            </Table.Cell>
            <Table.Cell>
              <Form.Input
                onKeyPress={(event) => {
                  if (!/[0-9]/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
                onChange={formik.handleChange}
                name="other_dangerous_wastes_sent_to_incineration.value"
                value={
                  formik.values.other_dangerous_wastes_sent_to_incineration
                    .value
                }
                error={
                  formik.errors.other_dangerous_wastes_sent_to_incineration
                }
              />
            </Table.Cell>
            <Table.Cell>
              <Form.Dropdown
                placeholder="Kg"
                options={[{ key: 1, value: true, name: "" }].map((ds) => {
                  return {
                    key: ds.key,
                    text: ds.name,
                    value: ds.value,
                  };
                })}
                selection
                onChange={(_, data) =>
                  formik.setFieldValue(
                    "other_dangerous_wastes_sent_to_incineration.isApproved",
                    data.value
                  )
                }
                value={
                  formik.values.other_dangerous_wastes_sent_to_incineration
                    .isApproved
                }
                error={
                  formik.errors.other_dangerous_wastes_sent_to_incineration
                }
              />
              {/* {formik.values.days_total.isApproved?  <Icon color="green" name='checkmark' /> : <Icon color="red" name='close' />} */}
            </Table.Cell>
            <Table.Cell>
              <Form.Dropdown
                placeholder={t("select")}
                options={[
                  { key: 1, value: true, name: "aproveed" },
                  { key: 2, value: false, name: "not_aproveed" },
                ].map((ds) => {
                  return {
                    key: ds.key,
                    text: t(ds.name),
                    value: ds.value,
                  };
                })}
                selection
                onChange={(_, data) =>
                  formik.setFieldValue(
                    "other_dangerous_wastes_sent_to_incineration.isApproved",
                    data.value
                  )
                }
                value={
                  formik.values.other_dangerous_wastes_sent_to_incineration
                    .isApproved
                }
                error={
                  formik.errors.other_dangerous_wastes_sent_to_incineration
                }
              />
              {/* {formik.values.other_dangerous_wastes_sent_to_incineration.isApproved?  <Icon color="green" name='checkmark' /> : <Icon color="red" name='close' />} */}
            </Table.Cell>
            <Table.Cell>
              <Button
                icon
                primary
                type="button"
                onClick={() => {
                  openUpdateSite(
                    t("other_dangerous_wastes_sent_to_incineration"),
                    "other_dangerous_wastes_sent_to_incineration"
                  );
                }}
              >
                <Icon name="comment outline" />
              </Button>
              <FileUpload
                accessToken={accessToken}
                data={formik}
                field={"other_dangerous_wastes_sent_to_incineration"}
                newFiles={newFiles}
                setNewFiles={setNewFiles}
                t={t}
              />
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>
              <label className="label">
                {formik.values.chemicals_sent_to_landfill.code}{" "}
              </label>
            </Table.Cell>
            <Table.Cell>
              <label className="label">{t("chemicals_sent_to_landfill")}</label>
            </Table.Cell>
            <Table.Cell>
              <Form.Input
                onKeyPress={(event) => {
                  if (!/[0-9]/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
                onChange={formik.handleChange}
                name="chemicals_sent_to_landfill.value"
                value={formik.values.chemicals_sent_to_landfill.value}
                error={formik.errors.chemicals_sent_to_landfill}
              />
            </Table.Cell>
            <Table.Cell>
              <Form.Dropdown
                placeholder="Kg"
                options={[{ key: 1, value: true, name: "" }].map((ds) => {
                  return {
                    key: ds.key,
                    text: ds.name,
                    value: ds.value,
                  };
                })}
                selection
                onChange={(_, data) =>
                  formik.setFieldValue(
                    "chemicals_sent_to_landfill.unit",
                    data.value
                  )
                }
                value={formik.values.chemicals_sent_to_landfill.unit}
                error={formik.errors.chemicals_sent_to_landfill}
              />
              {/* {formik.values.days_total.isApproved?  <Icon color="green" name='checkmark' /> : <Icon color="red" name='close' />} */}
            </Table.Cell>
            <Table.Cell>
              <Form.Dropdown
                placeholder={t("select")}
                options={[
                  { key: 1, value: true, name: "aproveed" },
                  { key: 2, value: false, name: "not_aproveed" },
                ].map((ds) => {
                  return {
                    key: ds.key,
                    text: t(ds.name),
                    value: ds.value,
                  };
                })}
                selection
                onChange={(_, data) =>
                  formik.setFieldValue(
                    "chemicals_sent_to_landfill.isApproved",
                    data.value
                  )
                }
                value={formik.values.chemicals_sent_to_landfill.isApproved}
                error={formik.errors.chemicals_sent_to_landfill}
              />
              {/* {formik.values.chemicals_sent_to_landfill.isApproved?  <Icon color="green" name='checkmark' /> : <Icon color="red" name='close' />} */}
            </Table.Cell>
            <Table.Cell>
              <Button
                icon
                primary
                type="button"
                onClick={() => {
                  openUpdateSite(
                    t("chemicals_sent_to_landfill"),
                    "chemicals_sent_to_landfill"
                  );
                }}
              >
                <Icon name="comment outline" />
              </Button>
              <FileUpload
                accessToken={accessToken}
                data={formik}
                field={"chemicals_sent_to_landfill"}
                newFiles={newFiles}
                setNewFiles={setNewFiles}
                t={t}
              />
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>
              <label className="label">
                {formik.values.lubricants_sent_to_landfill.code}{" "}
              </label>
            </Table.Cell>
            <Table.Cell>
              <label className="label">
                {t("lubricants_sent_to_landfill")}
              </label>
            </Table.Cell>
            <Table.Cell>
              <Form.Input
                onKeyPress={(event) => {
                  if (!/[0-9]/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
                onChange={formik.handleChange}
                name="lubricants_sent_to_landfill.value"
                value={formik.values.lubricants_sent_to_landfill.value}
                error={formik.errors.lubricants_sent_to_landfill}
              />
            </Table.Cell>
            <Table.Cell>
              <Form.Dropdown
                placeholder="Kg"
                options={[{ key: 1, value: true, name: "" }].map((ds) => {
                  return {
                    key: ds.key,
                    text: ds.name,
                    value: ds.value,
                  };
                })}
                selection
                onChange={(_, data) =>
                  formik.setFieldValue(
                    "lubricants_sent_to_landfill.unit",
                    data.value
                  )
                }
                value={formik.values.lubricants_sent_to_landfill.unit}
                error={formik.errors.lubricants_sent_to_landfill}
              />
              {/* {formik.values.days_total.isApproved?  <Icon color="green" name='checkmark' /> : <Icon color="red" name='close' />} */}
            </Table.Cell>
            <Table.Cell>
              <Form.Dropdown
                placeholder={t("select")}
                options={[
                  { key: 1, value: true, name: "aproveed" },
                  { key: 2, value: false, name: "not_aproveed" },
                ].map((ds) => {
                  return {
                    key: ds.key,
                    text: t(ds.name),
                    value: ds.value,
                  };
                })}
                selection
                onChange={(_, data) =>
                  formik.setFieldValue(
                    "lubricants_sent_to_landfill.isApproved",
                    data.value
                  )
                }
                value={formik.values.lubricants_sent_to_landfill.isApproved}
                error={formik.errors.lubricants_sent_to_landfill}
              />
              {/* {formik.values.chemicals_sent_to_landfill.isApproved?  <Icon color="green" name='checkmark' /> : <Icon color="red" name='close' />} */}
            </Table.Cell>
            <Table.Cell>
              <Button
                icon
                primary
                type="button"
                onClick={() => {
                  openUpdateSite(
                    t("lubricants_sent_to_landfill"),
                    "lubricants_sent_to_landfill"
                  );
                }}
              >
                <Icon name="comment outline" />
              </Button>
              <FileUpload
                accessToken={accessToken}
                data={formik}
                field={"lubricants_sent_to_landfill"}
                newFiles={newFiles}
                setNewFiles={setNewFiles}
                t={t}
              />
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
          dangerousForm={dangerousForm}
          user={user}
          t={t}
        />
      </BasicModal>
      <Form.Group widths="2">
        <Form.Button type="submit" fluid primary loading={formik.isSubmitting}>
          {!dangerousForm ? t("save") : t("update")}
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
        {t("cancel")}
        </Form.Button>
      </Form.Group>
    </Form>
  );
}

function Comments(props) {
  const { formik, user, fieldName, onClose, t } = props;
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
t={t}
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
          content={t("add_comment")}
          primary
          fluid
          onClick={onChangeHandle}
        ></Form.Button>
      </CommentGroup>
    </>
  );
}

const EditableComment = ({ id, author, date, content, onSave, active,t }) => {
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
              <Button content={t("save")} onClick={handleSave} primary />
              <Button content={t("cancel")} onClick={handleCancel} secondary />
            </Form>
          ) : (
            <div>{editedContent}</div>
          )}
        </Comment.Text>
        {active ? (
          <Comment.Actions>
            <Comment.Action onClick={handleEdit}>{t("edit")}</Comment.Action>
          </Comment.Actions>
        ) : null}
      </Comment.Content>
    </Comment>
  );
};

function FileViewer(props) {
  const { fileName, fileUniqueName, handleRemove, t } = props;
  const [fileUrl, setFileUrl] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    if (fileName) {
      setFileUrl(fileName); // Construye la URL del archivo
      (async () => {
        try {
          const response = await dangerousFormController.getFileApi(
            fileUniqueName
          );
          setFileUrl(response); // Construye la URL del archivo
          console.log(setFileUrl);
          //setMessage(response.message);
        } catch (error) {
          //setMessage('Error al elimianr el archivo');
        }
      })();
    }
  }, [fileName]);

  const handleOpenPreview = (event) => {
    event.preventDefault();
    setPreviewOpen(true);
  };

  const handleClosePreview = (event) => {
    event.preventDefault(); // Previene el comportamiento predeterminado
    setPreviewOpen(false);
  };

  return (
    <>
      <List.Content floated="left">{fileName}</List.Content>
      <List.Content floated="right">
        {" "}
        <Button
          color="red"
          onClick={() => handleRemove(fileUniqueName)}
          icon="trash alternate"
        />
      </List.Content>
      {/* //<Button onClick={handleOpenPreview}> {fileName}</Button> */}
      <List.Content floated="right">
        <Modal
          onClose={handleClosePreview}
          onOpen={handleOpenPreview}
          open={previewOpen}
          trigger={
            <Button primary icon>
              <Icon name="eye" />
            </Button>
          }
        >
          <ModalHeader>{fileName}</ModalHeader>
          <ModalContent>
            {fileName &&
              (fileName.endsWith(".jpg") ||
                fileName.endsWith(".png") ||
                fileName.endsWith(".jpeg")) && (
                <Image
                  src={fileUrl}
                  alt="Vista previa"
                  style={{ maxWidth: "100%" }}
                />
              )}
            {fileName && fileName.endsWith(".pdf") && (
              <iframe
                src={fileUrl}
                title={t("preview")}
                style={{ width: "100%", height: "500px" }}
              />
            )}
          </ModalContent>
          <ModalActions>
            {/* <Button color="red" onClick={() => handleRemove(fileName)}>
            <Icon disabled name="trash alternate" /> Eliminar
          </Button> */}
            <Button color="black" onClick={handleClosePreview}>
              <Icon disabled name="close" />
              {t("close")}
            </Button>
          </ModalActions>
        </Modal>
      </List.Content>
    </>
  );
}

function FileUpload(props) {
  const { accessToken, data, field, newFiles, setNewFiles, t } = props;
  const [files, setFiles] = useState([]);
  const [filesView, setFilesView] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [openModal, setOpenModal] = useState(false); // Para controlar el estado del modal

  useEffect(() => {
    if (data.values[field].files) {
      setFilesView(data.values[field].files); // Construye la URL del archivo
    }
  }, [data]);

  const handleButtonClick = (event) => {
    event.preventDefault(); // Evita que el formulario se envíe
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.onchange = handleFileChange;
    input.click();
  };

  // Maneja el cambio cuando se seleccionan archivos
  const handleFileChange = async (e) => {
    e.preventDefault(); // Evita que el formulario se envíe
    const selectedFiles = e.target.files;
    setNewFiles({ ...newFiles, [field]: Array.from(selectedFiles) });
    //data.setFieldValue(`${field}.files`,Array.from(selectedFiles))
    setFiles([...selectedFiles]);
  };

  // Función para cerrar el modal
  const closeModal = (event) => {
    event.preventDefault();
    setOpenModal(!openModal);
  };

  const handleRemoveFile = async (file) => {
    try {
      const updatedFiles = filesView.filter((f) => f.uniqueName !== file);
      setFilesView(updatedFiles);
      const response = await dangerousFormController.deleteFileApi(
        accessToken,
        file
      );
      //setMessage(response.message);
      removeFile(updatedFiles);
    } catch (error) {
      // setMessage('Error al elimianr el archivo');
    }
  };

  const removeFile = async (updatedFiles) => {
    data.setFieldValue(`${field}.files`, updatedFiles);
  };

  return (
    <>
      {/* Input para seleccionar los archivos */}
      {/* <Input
        type="file"
        multiple
        icon={"paperclip"}
        onChange={handleFileUpload}
      /> */}

      <Button
        default
        onClick={handleButtonClick}
        icon="paperclip"
        style={{ marginTop: "10px" }}
        color={files.length > 0 ? "green" : "grey"}
      ></Button>

      {/* Mensajes de éxito o error */}
      {successMessage && (
        <Message success>
          <Message.Header>Éxito</Message.Header>
          <p>{successMessage}</p>
        </Message>
      )}

      {errorMessage && (
        <Message error>
          <Message.Header>Error</Message.Header>
          <p>{errorMessage}</p>
        </Message>
      )}

      <Button
        primary
        onClick={closeModal}
        style={{ marginTop: "10px" }}
        icon="eye"
      ></Button>
      {/* Modal para mostrar los archivos subidos */}
      <Modal open={openModal} onClose={closeModal} size="tiny">
        <Modal.Header>Archivos subidos</Modal.Header>
        <Modal.Content>
          {filesView.length > 0 ? (
            <List divided>
              {filesView.map((filePath, index) => (
                <List.Item key={index}>
                  {/* <a href={`/${filePath.url}`} target="_blank" rel="noopener noreferrer">
                      {filePath.url}
                    </a> */}

                  <FileViewer
                    fileName={filePath.name}
                    fileUniqueName={filePath.uniqueName}
                    handleRemove={handleRemoveFile}
                    t={t}
                  />
                </List.Item>
              ))}
            </List>
          ) : (
            <p>No se encontraron archivos subidos.</p>
          )}
        </Modal.Content>
        <Modal.Actions>
          <Button color="green" onClick={closeModal}>
            {t("close")}
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  );
}
