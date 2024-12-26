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
  CommentMetadata,
  Segment,
  Divider,
  Header,
  GridColumn,
  GridRow,
  Modal,
  ModalActions,
  ModalContent,
  ModalHeader,
  List,
  Message,
} from "semantic-ui-react";
import { useFormik } from "formik";
import { Wasteform } from "../../../../api";
import { useAuth } from "../../../../hooks";
import { ENV, PERIODS } from "../../../../utils";
import {
  formatDateView,
  formatDateHourCompleted,
} from "../../../../utils/formatDate";
import { BasicModal } from "../../../Shared";
import { initialValues, validationSchema } from "./WasteForm.form";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { decrypt, encrypt } from "../../../../utils/cryptoUtils";
import "./WasteForm.scss";
import { useLanguage } from "../../../../contexts";

const wasteFormController = new Wasteform();

export function WasteForm(props) {
  const { onClose, onReload, wasteForm, siteSelected, year, period } = props;
  const { accessToken } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [titleModal, setTitleModal] = useState("");
  const [fieldName, setFieldName] = useState("");
  const [listPeriods, setListPeriods] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const { user } = useAuth();

  const location = useLocation();

  const { translations } = useLanguage();

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
    initialValues: initialValues(wasteForm, period, year),
    validationSchema: validationSchema(),
    validateOnChange: false,
    onSubmit: async (formValue) => {
      try {
        if (!wasteForm) {
          formValue.creator_user = user._id;
          formValue.date = new Date();
          if (user?.site) {
            formValue.site = user.site._id;
          } else {
            if (siteSelected) {
              formValue.site = siteSelected;
            }
            // } else {
            //   // Desencriptar los datos recibidos
            //   // if (!wasteForm) {
            //   //   const siteData = decrypt(siteSelected);
            //   //   formValue.site = siteData;
            //   // }
            // }
          }
          // Recorrer el JSON
          for (const clave in newFiles) {
            if (newFiles.hasOwnProperty(clave)) {
              let filesField = await uploadFiles(newFiles[clave]);

              // Combina los archivos nuevos con los existentes
              let finalFilesField = [...formValue[clave].files, ...filesField];

              formValue[clave].files = finalFilesField;
            }
          }
          await wasteFormController.createWasteForm(accessToken, formValue);
          //console.log(formValue);
        } else {
          // Recorrer el JSON
          for (const clave in newFiles) {
            if (newFiles.hasOwnProperty(clave)) {
              let filesField = await uploadFiles(newFiles[clave]);

              // Combina los archivos nuevos con los existentes
              let finalFilesField = [...formValue[clave].files, ...filesField];

              formValue[clave].files = finalFilesField;
            }
          }
          await wasteFormController.updateWasteForm(
            accessToken,
            wasteForm._id,
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

  const uploadFiles = async (filesToUpload, formValue, field) => {
    const formData = new FormData();
    Array.from(filesToUpload).forEach((file) => {
      formData.append("files", file);
    });

    // Luego de preparar los datos, puedes hacer la solicitud POST
    if (filesToUpload.length === 0) {
      console.log("no hay archivos");
      //setErrorMessage("Por favor, selecciona al menos un archivo.");
      return;
    }

    try {
      // Realizar la solicitud POST al backend
      const response = await wasteFormController.uploadFileApi(
        accessToken,
        formData
      );
      if (response.code && response.code === 200) {
        return response.files;
      }
      return [];
    } catch (error) {
      //error
    }
  };

  const goBack = () => {
    navigate(`/admin/data/wasteforms`, {
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
          await wasteFormController.getPeriodsWasteFormsBySiteAndYear(
            accessToken,
            siteSelected,
            formik.values.year
          );
        console.log(response);
        const periods = PERIODS.map((item) => item);
        const availablePeriods = periods
          .filter((period) => !response.periods.includes(period))
          .map((period) => period);

        setListPeriods(availablePeriods);
        console.log(availablePeriods);
      } catch (error) {
        console.error(error);
        setListPeriods([]);
      }
    })();
  }, [formik.values.year]);

  return (
    <Form className="waste-form" onSubmit={formik.handleSubmit}>
      {wasteForm ? (
        <Segment>
          <Header as="h4">
            {" "}
            {t("date")}: {formatDateView(formik.values.date)}
          </Header>
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
      {!wasteForm ? (
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
            <Table.HeaderCell width="6">{t("concept")}</Table.HeaderCell>
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
                {
                  formik.values.paper_and_cardboard_sent_to_recycling_or_reuse
                    .code
                }{" "}
              </label>
            </Table.Cell>
            <Table.Cell>
              <label className="label">
                {t("paper_and_cardboard_sent_to_recycling_or_reuse")}
              </label>
            </Table.Cell>
            <Table.Cell>
              <Form.Input
                type="number"
                name="paper_and_cardboard_sent_to_recycling_or_reuse.value"
                onChange={formik.handleChange}
                value={
                  formik.values.paper_and_cardboard_sent_to_recycling_or_reuse
                    .value
                }
                error={
                  formik.errors.paper_and_cardboard_sent_to_recycling_or_reuse
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
                    "paper_and_cardboard_sent_to_recycling_or_reuse.unit",
                    data.value
                  )
                }
                value={
                  formik.values.paper_and_cardboard_sent_to_recycling_or_reuse
                    .unit
                }
                error={
                  formik.errors.paper_and_cardboard_sent_to_recycling_or_reuse
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
                    "paper_and_cardboard_sent_to_recycling_or_reuse.isApproved",
                    data.value
                  )
                }
                value={
                  formik.values.paper_and_cardboard_sent_to_recycling_or_reuse
                    .isApproved
                }
                error={
                  formik.errors.paper_and_cardboard_sent_to_recycling_or_reuse
                }
              />
              {/* {formik.values.paper_and_cardboard_sent_to_recycling_or_reuse.isApproved?  <Icon color="green" name='checkmark' /> : <Icon color="red" name='close' />} */}
            </Table.Cell>
            <Table.Cell>
              <Button
                icon
                type="button"
                primary
                onClick={() => {
                  openUpdateSite(
                    t("paper_and_cardboard_sent_to_recycling_or_reuse"),
                    "paper_and_cardboard_sent_to_recycling_or_reuse"
                  );
                }}
              >
                <Icon name="comment outline" />
              </Button>
              <FileUpload
                accessToken={accessToken}
                data={formik}
                field={"paper_and_cardboard_sent_to_recycling_or_reuse"}
                newFiles={newFiles}
                setNewFiles={setNewFiles}
                t={t}
              />
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>
              <label className="label">
                {formik.values.plastic_sent_to_recycle_or_reuse.code}{" "}
              </label>
            </Table.Cell>
            <Table.Cell>
              <label className="label">
                {t("plastic_sent_to_recycle_or_reuse")}
              </label>
            </Table.Cell>
            <Table.Cell>
              <Form.Input
                type="number"
                name="plastic_sent_to_recycle_or_reuse.value"
                onChange={formik.handleChange}
                value={formik.values.plastic_sent_to_recycle_or_reuse.value}
                error={formik.errors.plastic_sent_to_recycle_or_reuse}
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
                    "plastic_sent_to_recycle_or_reuse.unit",
                    data.value
                  )
                }
                value={formik.values.plastic_sent_to_recycle_or_reuse.unit}
                error={formik.errors.plastic_sent_to_recycle_or_reuse}
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
                    "plastic_sent_to_recycle_or_reuse.isApproved",
                    data.value
                  )
                }
                value={
                  formik.values.plastic_sent_to_recycle_or_reuse.isApproved
                }
                error={formik.errors.plastic_sent_to_recycle_or_reuse}
              />
              {/* {formik.values.plastic_sent_to_recycle_or_reuse.isApproved?  <Icon color="green" name='checkmark' /> : <Icon color="red" name='close' />} */}
            </Table.Cell>
            <Table.Cell>
              <Button
                icon
                primary
                type="button"
                onClick={() => {
                  openUpdateSite(
                    t("plastic_sent_to_recycle_or_reuse"),
                    "plastic_sent_to_recycle_or_reuse"
                  );
                }}
              >
                <Icon name="comment outline" />
              </Button>
              <FileUpload
                accessToken={accessToken}
                data={formik}
                field={"plastic_sent_to_recycle_or_reuse"}
                newFiles={newFiles}
                setNewFiles={setNewFiles}
                t={t}
              />
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>
              <label className="label">
                {formik.values.fabric_sent_to_recycle_or_reuse.code}{" "}
              </label>
            </Table.Cell>
            <Table.Cell>
              <label className="label">
                {t("fabric_sent_to_recycle_or_reuse")}
              </label>
            </Table.Cell>
            <Table.Cell>
              <Form.Input
                type="number"
                name="fabric_sent_to_recycle_or_reuse.value"
                onChange={formik.handleChange}
                value={formik.values.fabric_sent_to_recycle_or_reuse.value}
                error={formik.errors.fabric_sent_to_recycle_or_reuse}
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
                    "fabric_sent_to_recycle_or_reuse.unit",
                    data.value
                  )
                }
                value={formik.values.fabric_sent_to_recycle_or_reuse.unit}
                error={formik.errors.fabric_sent_to_recycle_or_reuse}
              />
              {/* {formik.values.days_total.isApproved?  <Icon color="green" name='checkmark' /> : <Icon color="red" name='close' />} */}
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
                placeholder={t("select")}
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
                    "fabric_sent_to_recycle_or_reuse.isApproved",
                    data.value
                  )
                }
                value={formik.values.fabric_sent_to_recycle_or_reuse.isApproved}
                error={formik.errors.fabric_sent_to_recycle_or_reuse}
              />
              {/* {formik.values.fabric_sent_to_recycle_or_reuse.isApproved?  <Icon color="green" name='checkmark' /> : <Icon color="red" name='close' />} */}
            </Table.Cell>
            <Table.Cell>
              <Button
                icon
                type="button"
                primary
                onClick={() => {
                  openUpdateSite(
                    t("fabric_sent_to_recycle_or_reuse"),
                    "fabric_sent_to_recycle_or_reuse"
                  );
                }}
              >
                <Icon name="comment outline" />
              </Button>
              <FileUpload
                accessToken={accessToken}
                data={formik}
                field={"fabric_sent_to_recycle_or_reuse"}
                newFiles={newFiles}
                setNewFiles={setNewFiles}
                t={t}
              />
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>
              <label className="label">
                {formik.values.metal_sent_to_recycle_or_reuse.code}{" "}
              </label>
            </Table.Cell>
            <Table.Cell>
              <label className="label">
                {t("metal_sent_to_recycle_or_reuse")}
              </label>
            </Table.Cell>
            <Table.Cell>
              <Form.Input
                type="number"
                name="metal_sent_to_recycle_or_reuse.value"
                onChange={formik.handleChange}
                value={formik.values.metal_sent_to_recycle_or_reuse.value}
                error={formik.errors.metal_sent_to_recycle_or_reuse}
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
                    "metal_sent_to_recycle_or_reuse.unit",
                    data.value
                  )
                }
                value={formik.values.metal_sent_to_recycle_or_reuse.unit}
                error={formik.errors.metal_sent_to_recycle_or_reuse}
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
                    "metal_sent_to_recycle_or_reuse.isApproved",
                    data.value
                  )
                }
                value={formik.values.metal_sent_to_recycle_or_reuse.isApproved}
                error={formik.errors.metal_sent_to_recycle_or_reuse}
              />
              {/* {formik.values.metal_sent_to_recycle_or_reuse.isApproved?  <Icon color="green" name='checkmark' /> : <Icon color="red" name='close' />} */}
            </Table.Cell>
            <Table.Cell>
              <Button
                icon
                type="button"
                primary
                onClick={() => {
                  openUpdateSite(
                    t("metal_sent_to_recycle_or_reuse"),
                    "metal_sent_to_recycle_or_reuse"
                  );
                }}
              >
                <Icon name="comment outline" />
              </Button>
              <FileUpload
                accessToken={accessToken}
                data={formik}
                field={"metal_sent_to_recycle_or_reuse"}
                newFiles={newFiles}
                setNewFiles={setNewFiles}
                t={t}
              />
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>
              <label className="label">
                {formik.values.wood_sent_to_recycle_or_reuse.code}{" "}
              </label>
            </Table.Cell>
            <Table.Cell>
              <label className="label">
                {t("wood_sent_to_recycle_or_reuse")}
              </label>
            </Table.Cell>
            <Table.Cell>
              <Form.Input
                type="number"
                name="wood_sent_to_recycle_or_reuse.value"
                onChange={formik.handleChange}
                value={formik.values.wood_sent_to_recycle_or_reuse.value}
                error={formik.errors.wood_sent_to_recycle_or_reuse}
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
                    "wood_sent_to_recycle_or_reuse.unit",
                    data.value
                  )
                }
                value={formik.values.wood_sent_to_recycle_or_reuse.unit}
                error={formik.errors.wood_sent_to_recycle_or_reuse}
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
                    "wood_sent_to_recycle_or_reuse.isApproved",
                    data.value
                  )
                }
                value={formik.values.wood_sent_to_recycle_or_reuse.isApproved}
                error={formik.errors.wood_sent_to_recycle_or_reuse}
              />
              {/* {formik.values.wood_sent_to_recycle_or_reuse.isApproved?  <Icon color="green" name='checkmark' /> : <Icon color="red" name='close' />} */}
            </Table.Cell>
            <Table.Cell>
              <Button
                icon
                type="button"
                primary
                onClick={() => {
                  openUpdateSite(
                    t("wood_sent_to_recycle_or_reuse"),
                    "wood_sent_to_recycle_or_reuse"
                  );
                }}
              >
                <Icon name="comment outline" />
              </Button>
              <FileUpload
                accessToken={accessToken}
                data={formik}
                field={"wood_sent_to_recycle_or_reuse"}
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
                  formik.values.other_general_waste_sent_to_recycle_or_reuse
                    .code
                }{" "}
              </label>
            </Table.Cell>
            <Table.Cell>
              <label className="label">
                {t("other_general_waste_sent_to_recycle_or_reuse")}
              </label>
            </Table.Cell>
            <Table.Cell>
              <Form.Input
                type="number"
                name="other_general_waste_sent_to_recycle_or_reuse.value"
                onChange={formik.handleChange}
                value={
                  formik.values.other_general_waste_sent_to_recycle_or_reuse
                    .value
                }
                error={
                  formik.errors.other_general_waste_sent_to_recycle_or_reuse
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
                    "other_general_waste_sent_to_recycle_or_reuse.unit",
                    data.value
                  )
                }
                value={
                  formik.values.other_general_waste_sent_to_recycle_or_reuse
                    .unit
                }
                error={
                  formik.errors.other_general_waste_sent_to_recycle_or_reuse
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
                    "other_general_waste_sent_to_recycle_or_reuse.isApproved",
                    data.value
                  )
                }
                value={
                  formik.values.other_general_waste_sent_to_recycle_or_reuse
                    .isApproved
                }
                error={
                  formik.errors.other_general_waste_sent_to_recycle_or_reuse
                }
              />
              {/* {formik.values.other_general_waste_sent_to_recycle_or_reuse.isApproved?  <Icon color="green" name='checkmark' /> : <Icon color="red" name='close' />} */}
            </Table.Cell>
            <Table.Cell>
              <Button
                icon
                type="button"
                primary
                onClick={() => {
                  openUpdateSite(
                    t("other_general_waste_sent_to_recycle_or_reuse"),
                    "other_general_waste_sent_to_recycle_or_reuse"
                  );
                }}
              >
                <Icon name="comment outline" />
              </Button>
              <FileUpload
                accessToken={accessToken}
                data={formik}
                field={"other_general_waste_sent_to_recycle_or_reuse"}
                newFiles={newFiles}
                setNewFiles={setNewFiles}
                t={t}
              />
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>
              <label className="label">
                {formik.values.leathers_sent_to_recycle_or_reuse.code}{" "}
              </label>
            </Table.Cell>
            <Table.Cell>
              <label className="label">
                {t("leathers_sent_to_recycle_or_reuse")}
              </label>
            </Table.Cell>
            <Table.Cell>
              <Form.Input
                type="number"
                name="leathers_sent_to_recycle_or_reuse.value"
                onChange={formik.handleChange}
                value={formik.values.leathers_sent_to_recycle_or_reuse.value}
                error={formik.errors.leathers_sent_to_recycle_or_reuse}
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
                    "leathers_sent_to_recycle_or_reuse.unit",
                    data.value
                  )
                }
                value={formik.values.leathers_sent_to_recycle_or_reuse.unit}
                error={formik.errors.leathers_sent_to_recycle_or_reuse}
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
                    "leathers_sent_to_recycle_or_reuse.isApproved",
                    data.value
                  )
                }
                value={
                  formik.values.leathers_sent_to_recycle_or_reuse.isApproved
                }
                error={formik.errors.leathers_sent_to_recycle_or_reuse}
              />
              {/* {formik.values.leathers_sent_to_recycle_or_reuse.isApproved?  <Icon color="green" name='checkmark' /> : <Icon color="red" name='close' />} */}
            </Table.Cell>
            <Table.Cell>
              <Button
                icon
                type="button"
                primary
                onClick={() => {
                  openUpdateSite(
                    t("leathers_sent_to_recycle_or_reuse"),
                    "leathers_sent_to_recycle_or_reuse"
                  );
                }}
              >
                <Icon name="comment outline" />
              </Button>
              <FileUpload
                accessToken={accessToken}
                data={formik}
                field={"leathers_sent_to_recycle_or_reuse"}
                newFiles={newFiles}
                setNewFiles={setNewFiles}
                t={t}
              />
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>
              <label className="label">
                {formik.values.rubber_sent_to_recycle_or_reuse.code}{" "}
              </label>
            </Table.Cell>
            <Table.Cell>
              <label className="label">
                {t("rubber_sent_to_recycle_or_reuse")}
              </label>
            </Table.Cell>
            <Table.Cell>
              <Form.Input
                type="number"
                name="rubber_sent_to_recycle_or_reuse.value"
                onChange={formik.handleChange}
                value={formik.values.rubber_sent_to_recycle_or_reuse.value}
                error={formik.errors.rubber_sent_to_recycle_or_reuse}
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
                    "rubber_sent_to_recycle_or_reuse.unit",
                    data.value
                  )
                }
                value={formik.values.rubber_sent_to_recycle_or_reuse.unit}
                error={formik.errors.rubber_sent_to_recycle_or_reuse}
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
                    "rubber_sent_to_recycle_or_reuse.isApproved",
                    data.value
                  )
                }
                value={formik.values.rubber_sent_to_recycle_or_reuse.isApproved}
                error={formik.errors.rubber_sent_to_recycle_or_reuse}
              />
              {/* {formik.values.rubber_sent_to_recycle_or_reuse.isApproved?  <Icon color="green" name='checkmark' /> : <Icon color="red" name='close' />} */}
            </Table.Cell>
            <Table.Cell>
              <Button
                icon
                type="button"
                primary
                onClick={() => {
                  openUpdateSite(
                    t("rubber_sent_to_recycle_or_reuse"),
                    "rubber_sent_to_recycle_or_reuse"
                  );
                }}
              >
                <Icon name="comment outline" />
              </Button>
              <FileUpload
                accessToken={accessToken}
                data={formik}
                field={"rubber_sent_to_recycle_or_reuse"}
                newFiles={newFiles}
                setNewFiles={setNewFiles}
                t={t}
              />
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>
              <label className="label">
                {formik.values.food_scraps_sent_to_recycle_or_reuse.code}{" "}
              </label>
            </Table.Cell>
            <Table.Cell>
              <label className="label">
                {t("food_scraps_sent_to_recycle_or_reuse")}
              </label>
            </Table.Cell>
            <Table.Cell>
              <Form.Input
                type="number"
                name="food_scraps_sent_to_recycle_or_reuse.value"
                onChange={formik.handleChange}
                value={formik.values.food_scraps_sent_to_recycle_or_reuse.value}
                error={formik.errors.food_scraps_sent_to_recycle_or_reuse}
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
                    "food_scraps_sent_to_recycle_or_reuse.unit",
                    data.value
                  )
                }
                value={formik.values.food_scraps_sent_to_recycle_or_reuse.unit}
                error={formik.errors.food_scraps_sent_to_recycle_or_reuse}
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
                    "food_scraps_sent_to_recycle_or_reuse.isApproved",
                    data.value
                  )
                }
                value={
                  formik.values.food_scraps_sent_to_recycle_or_reuse.isApproved
                }
                error={formik.errors.food_scraps_sent_to_recycle_or_reuse}
              />
              {/* {formik.values.food_scraps_sent_to_recycle_or_reuse.isApproved?  <Icon color="green" name='checkmark' /> : <Icon color="red" name='close' />} */}
            </Table.Cell>
            <Table.Cell>
              <Button
                icon
                type="button"
                primary
                onClick={() => {
                  openUpdateSite(
                    t("food_scraps_sent_to_recycle_or_reuse"),
                    "food_scraps_sent_to_recycle_or_reuse"
                  );
                }}
              >
                <Icon name="comment outline" />
              </Button>
              <FileUpload
                accessToken={accessToken}
                data={formik}
                field={"food_scraps_sent_to_recycle_or_reuse"}
                newFiles={newFiles}
                setNewFiles={setNewFiles}
                t={t}
              />
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>
              <label className="label">
                {formik.values.paper_and_cardboard_sent_to_incineration.code}{" "}
              </label>
            </Table.Cell>
            <Table.Cell>
              <label className="label">
                {t("paper_and_cardboard_sent_to_incineration")}
              </label>
            </Table.Cell>
            <Table.Cell>
              <Form.Input
                type="number"
                name="paper_and_cardboard_sent_to_incineration.value"
                onChange={formik.handleChange}
                value={
                  formik.values.paper_and_cardboard_sent_to_incineration.value
                }
                error={formik.errors.paper_and_cardboard_sent_to_incineration}
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
                    "paper_and_cardboard_sent_to_incineration.unit",
                    data.value
                  )
                }
                value={
                  formik.values.paper_and_cardboard_sent_to_incineration.unit
                }
                error={formik.errors.paper_and_cardboard_sent_to_incineration}
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
                    "paper_and_cardboard_sent_to_incineration.isApproved",
                    data.value
                  )
                }
                value={
                  formik.values.paper_and_cardboard_sent_to_incineration
                    .isApproved
                }
                error={formik.errors.paper_and_cardboard_sent_to_incineration}
              />
              {/* {formik.values.paper_and_cardboard_sent_to_incineration.isApproved?  <Icon color="green" name='checkmark' /> : <Icon color="red" name='close' />} */}
            </Table.Cell>
            <Table.Cell>
              <Button
                icon
                type="button"
                primary
                onClick={() => {
                  openUpdateSite(
                    t("paper_and_cardboard_sent_to_incineration"),
                    "paper_and_cardboard_sent_to_incineration"
                  );
                }}
              >
                <Icon name="comment outline" />
              </Button>
              <FileUpload
                accessToken={accessToken}
                data={formik}
                field={"paper_and_cardboard_sent_to_incineration"}
                newFiles={newFiles}
                setNewFiles={setNewFiles}
                t={t}
              />
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>
              <label className="label">
                {formik.values.plastic_sent_to_incineration.code}{" "}
              </label>
            </Table.Cell>
            <Table.Cell>
              <label className="label">
                {t("plastic_sent_to_incineration")}
              </label>
            </Table.Cell>
            <Table.Cell>
              <Form.Input
                type="number"
                name="plastic_sent_to_incineration.value"
                onChange={formik.handleChange}
                value={formik.values.plastic_sent_to_incineration.value}
                error={formik.errors.plastic_sent_to_incineration}
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
                    "plastic_sent_to_incineration.unit",
                    data.value
                  )
                }
                value={formik.values.plastic_sent_to_incineration.unit}
                error={formik.errors.plastic_sent_to_incineration}
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
                    "plastic_sent_to_incineration.isApproved",
                    data.value
                  )
                }
                value={formik.values.plastic_sent_to_incineration.isApproved}
                error={formik.errors.plastic_sent_to_incineration}
              />
              {/* {formik.values.plastic_sent_to_incineration.isApproved?  <Icon color="green" name='checkmark' /> : <Icon color="red" name='close' />} */}
            </Table.Cell>
            <Table.Cell>
              <Button
                icon
                type="button"
                primary
                onClick={() => {
                  openUpdateSite(
                    t("plastic_sent_to_incineration"),
                    "plastic_sent_to_incineration"
                  );
                }}
              >
                <Icon name="comment outline" />
              </Button>
              <FileUpload
                accessToken={accessToken}
                data={formik}
                field={"plastic_sent_to_incineration"}
                newFiles={newFiles}
                setNewFiles={setNewFiles}
                t={t}
              />
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>
              <label className="label">
                {formik.values.fabric_sent_to_incineration.code}{" "}
              </label>
            </Table.Cell>
            <Table.Cell>
              <label className="label">
                {t("fabric_sent_to_incineration")}
              </label>
            </Table.Cell>
            <Table.Cell>
              <Form.Input
                type="number"
                name="fabric_sent_to_incineration.value"
                onChange={formik.handleChange}
                value={formik.values.fabric_sent_to_incineration.value}
                error={formik.errors.fabric_sent_to_incineration}
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
                    "fabric_sent_to_incineration.unit",
                    data.value
                  )
                }
                value={formik.values.fabric_sent_to_incineration.unit}
                error={formik.errors.fabric_sent_to_incineration}
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
                    "fabric_sent_to_incineration.isApproved",
                    data.value
                  )
                }
                value={formik.values.fabric_sent_to_incineration.isApproved}
                error={formik.errors.fabric_sent_to_incineration}
              />
              {/* {formik.values.fabric_sent_to_incineration.isApproved?  <Icon color="green" name='checkmark' /> : <Icon color="red" name='close' />} */}
            </Table.Cell>
            <Table.Cell>
              <Button
                icon
                type="button"
                primary
                onClick={() => {
                  openUpdateSite(
                    t("fabric_sent_to_incineration"),
                    "fabric_sent_to_incineration"
                  );
                }}
              >
                <Icon name="comment outline" />
              </Button>
              <FileUpload
                accessToken={accessToken}
                data={formik}
                field={"fabric_sent_to_incineration"}
                newFiles={newFiles}
                setNewFiles={setNewFiles}
                t={t}
              />
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>
              <label className="label">
                {formik.values.metal_sent_to_incineration.code}{" "}
              </label>
            </Table.Cell>
            <Table.Cell>
              <label className="label">{t("metal_sent_to_incineration")}</label>
            </Table.Cell>
            <Table.Cell>
              <Form.Input
                type="number"
                name="metal_sent_to_incineration.value"
                onChange={formik.handleChange}
                value={formik.values.metal_sent_to_incineration.value}
                error={formik.errors.metal_sent_to_incineration}
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
                    "metal_sent_to_incineration.unit",
                    data.value
                  )
                }
                value={formik.values.metal_sent_to_incineration.unit}
                error={formik.errors.metal_sent_to_incineration}
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
                    "metal_sent_to_incineration.isApproved",
                    data.value
                  )
                }
                value={formik.values.metal_sent_to_incineration.isApproved}
                error={formik.errors.metal_sent_to_incineration}
              />
              {/* {formik.values.metal_sent_to_incineration.isApproved?  <Icon color="green" name='checkmark' /> : <Icon color="red" name='close' />} */}
            </Table.Cell>
            <Table.Cell>
              <Button
                icon
                type="button"
                primary
                onClick={() => {
                  openUpdateSite(
                    t("metal_sent_to_incineration"),
                    "metal_sent_to_incineration"
                  );
                }}
              >
                <Icon name="comment outline" />
              </Button>
              <FileUpload
                accessToken={accessToken}
                data={formik}
                field={"metal_sent_to_incineration"}
                newFiles={newFiles}
                setNewFiles={setNewFiles}
                t={t}
              />
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>
              <label className="label">
                {formik.values.wood_sent_to_incineration.code}{" "}
              </label>
            </Table.Cell>
            <Table.Cell>
              <label className="label">{t("wood_sent_to_incineration")}</label>
            </Table.Cell>
            <Table.Cell>
              <Form.Input
                type="number"
                name="wood_sent_to_incineration.value"
                onChange={formik.handleChange}
                value={formik.values.wood_sent_to_incineration.value}
                error={formik.errors.wood_sent_to_incineration}
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
                    "wood_sent_to_incineration.unit",
                    data.value
                  )
                }
                value={formik.values.wood_sent_to_incineration.unit}
                error={formik.errors.wood_sent_to_incineration}
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
                    "wood_sent_to_incineration.isApproved",
                    data.value
                  )
                }
                value={formik.values.wood_sent_to_incineration.isApproved}
                error={formik.errors.wood_sent_to_incineration}
              />
              {/* {formik.values.wood_sent_to_incineration.isApproved?  <Icon color="green" name='checkmark' /> : <Icon color="red" name='close' />} */}
            </Table.Cell>
            <Table.Cell>
              <Button
                icon
                type="button"
                primary
                onClick={() => {
                  openUpdateSite(
                    t("wood_sent_to_incineration"),
                    "wood_sent_to_incineration"
                  );
                }}
              >
                <Icon name="comment outline" />
              </Button>
              <FileUpload
                accessToken={accessToken}
                data={formik}
                field={"wood_sent_to_incineration"}
                newFiles={newFiles}
                setNewFiles={setNewFiles}
                t={t}
              />
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>
              <label className="label">
                {formik.values.other_general_waste_sent_to_incineration.code}{" "}
              </label>
            </Table.Cell>
            <Table.Cell>
              <label className="label">
                {t("other_general_waste_sent_to_incineration")}
              </label>
            </Table.Cell>
            <Table.Cell>
              <Form.Input
                type="number"
                name="other_general_waste_sent_to_incineration.value"
                onChange={formik.handleChange}
                value={
                  formik.values.other_general_waste_sent_to_incineration.value
                }
                error={formik.errors.other_general_waste_sent_to_incineration}
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
                    "other_general_waste_sent_to_incineration.unit",
                    data.value
                  )
                }
                value={
                  formik.values.other_general_waste_sent_to_incineration.unit
                }
                error={formik.errors.other_general_waste_sent_to_incineration}
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
                    "other_general_waste_sent_to_incineration.isApproved",
                    data.value
                  )
                }
                value={
                  formik.values.other_general_waste_sent_to_incineration
                    .isApproved
                }
                error={formik.errors.other_general_waste_sent_to_incineration}
              />
              {/* {formik.values.other_general_waste_sent_to_incineration.isApproved?  <Icon color="green" name='checkmark' /> : <Icon color="red" name='close' />} */}
            </Table.Cell>
            <Table.Cell>
              <Button
                icon
                type="button"
                primary
                onClick={() => {
                  openUpdateSite(
                    t("other_general_waste_sent_to_incineration"),
                    "other_general_waste_sent_to_incineration"
                  );
                }}
              >
                <Icon name="comment outline" />
              </Button>
              <FileUpload
                accessToken={accessToken}
                data={formik}
                field={"other_general_waste_sent_to_incineration"}
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
                  formik.values
                    .other_general_waste_sent_to_other_types_of_disposal.code
                }{" "}
              </label>
            </Table.Cell>
            <Table.Cell>
              <label className="label">
                {t("other_general_waste_sent_to_other_types_of_disposal")}
              </label>
            </Table.Cell>
            <Table.Cell>
              <Form.Input
                type="number"
                name="other_general_waste_sent_to_other_types_of_disposal.value"
                onChange={formik.handleChange}
                value={
                  formik.values
                    .other_general_waste_sent_to_other_types_of_disposal.value
                }
                error={
                  formik.errors
                    .other_general_waste_sent_to_other_types_of_disposal
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
                    "other_general_waste_sent_to_other_types_of_disposal.unit",
                    data.value
                  )
                }
                value={
                  formik.values
                    .other_general_waste_sent_to_other_types_of_disposal.unit
                }
                error={
                  formik.errors
                    .other_general_waste_sent_to_other_types_of_disposal
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
                    "other_general_waste_sent_to_other_types_of_disposal.isApproved",
                    data.value
                  )
                }
                value={
                  formik.values
                    .other_general_waste_sent_to_other_types_of_disposal
                    .isApproved
                }
                error={
                  formik.errors
                    .other_general_waste_sent_to_other_types_of_disposal
                }
              />
              {/* {formik.values.other_general_waste_sent_to_other_types_of_disposal.isApproved?  <Icon color="green" name='checkmark' /> : <Icon color="red" name='close' />} */}
            </Table.Cell>
            <Table.Cell>
              <Button
                icon
                type="button"
                primary
                onClick={() => {
                  openUpdateSite(
                    t("other_general_waste_sent_to_other_types_of_disposal"),
                    "other_general_waste_sent_to_other_types_of_disposal"
                  );
                }}
              >
                <Icon name="comment outline" />
              </Button>
              <FileUpload
                accessToken={accessToken}
                data={formik}
                field={"other_general_waste_sent_to_other_types_of_disposal"}
                newFiles={newFiles}
                setNewFiles={setNewFiles}
                t={t}
              />
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>
              <label className="label">
                {formik.values.total_sent_to_landfill.code}{" "}
              </label>
            </Table.Cell>
            <Table.Cell>
              <label className="label">{t("total_sent_to_landfill")}</label>
            </Table.Cell>
            <Table.Cell>
              <Form.Input
                type="number"
                name="total_sent_to_landfill.value"
                onChange={formik.handleChange}
                value={formik.values.total_sent_to_landfill.value}
                error={formik.errors.total_sent_to_landfill}
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
                    "total_sent_to_landfill.unit",
                    data.value
                  )
                }
                value={formik.values.total_sent_to_landfill.unit}
                error={formik.errors.total_sent_to_landfill}
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
                    "total_sent_to_landfill.isApproved",
                    data.value
                  )
                }
                value={formik.values.total_sent_to_landfill.isApproved}
                error={formik.errors.total_sent_to_landfill}
              />
              {/* {formik.values.total_sent_to_landfill.isApproved?  <Icon color="green" name='checkmark' /> : <Icon color="red" name='close' />} */}
            </Table.Cell>
            <Table.Cell>
              <Button
                icon
                type="button"
                primary
                onClick={() => {
                  openUpdateSite(
                    t("total_sent_to_landfill"),
                    "total_sent_to_landfill"
                  );
                }}
              >
                <Icon name="comment outline" />
              </Button>
              <FileUpload
                accessToken={accessToken}
                data={formik}
                field={"total_sent_to_landfill"}
                newFiles={newFiles}
                setNewFiles={setNewFiles}
                t={t}
              />
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>
              <label className="label">
                {formik.values.total_sent_for_reuse_or_recycling.code}{" "}
              </label>
            </Table.Cell>
            <Table.Cell>
              <label className="label">
                {t("total_sent_for_reuse_or_recycling")}
              </label>
            </Table.Cell>
            <Table.Cell>
              <Form.Input
                type="number"
                name="total_sent_for_reuse_or_recycling.value"
                onChange={formik.handleChange}
                value={formik.values.total_sent_for_reuse_or_recycling.value}
                error={formik.errors.total_sent_for_reuse_or_recycling}
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
                    "total_sent_for_reuse_or_recycling.unit",
                    data.value
                  )
                }
                value={formik.values.total_sent_for_reuse_or_recycling.unit}
                error={formik.errors.total_sent_for_reuse_or_recycling}
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
                    "total_sent_for_reuse_or_recycling.isApproved",
                    data.value
                  )
                }
                value={
                  formik.values.total_sent_for_reuse_or_recycling.isApproved
                }
                error={formik.errors.total_sent_for_reuse_or_recycling}
              />
              {/* {formik.values.total_sent_for_reuse_or_recycling.isApproved?  <Icon color="green" name='checkmark' /> : <Icon color="red" name='close' />} */}
            </Table.Cell>
            <Table.Cell>
              <Button
                icon
                type="button"
                primary
                onClick={() => {
                  openUpdateSite(
                    t("total_sent_for_reuse_or_recycling"),
                    "total_sent_for_reuse_or_recycling"
                  );
                }}
              >
                <Icon name="comment outline" />
              </Button>
              <FileUpload
                accessToken={accessToken}
                data={formik}
                field={"total_sent_for_reuse_or_recycling"}
                newFiles={newFiles}
                setNewFiles={setNewFiles}
                t={t}
              />
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>
              <label className="label">
                {formik.values.total_sent_to_incineration.code}{" "}
              </label>
            </Table.Cell>
            <Table.Cell>
              <label className="label">{t("total_sent_to_incineration")}</label>
            </Table.Cell>
            <Table.Cell>
              <Form.Input
                type="number"
                name="total_sent_to_incineration.value"
                onChange={formik.handleChange}
                value={formik.values.total_sent_to_incineration.value}
                error={formik.errors.total_sent_to_incineration}
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
                    "total_sent_to_incineration.unit",
                    data.value
                  )
                }
                value={
                  formik.values.paper_and_cardboard_sent_to_recycling_or_reuse
                    .unit
                }
                error={
                  formik.errors.paper_and_cardboard_sent_to_recycling_or_reuse
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
                    "total_sent_to_incineration.isApproved",
                    data.value
                  )
                }
                value={formik.values.total_sent_to_incineration.isApproved}
                error={formik.errors.total_sent_to_incineration}
              />
              {/* {formik.values.total_sent_to_incineration.isApproved?  <Icon color="green" name='checkmark' /> : <Icon color="red" name='close' />} */}
            </Table.Cell>
            <Table.Cell>
              <Button
                icon
                type="button"
                primary
                onClick={() => {
                  openUpdateSite(
                    t("total_sent_to_incineration"),
                    "total_sent_to_incineration"
                  );
                }}
              >
                <Icon name="comment outline" />
              </Button>
              <FileUpload
                accessToken={accessToken}
                data={formik}
                field={"total_sent_to_incineration"}
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
                  formik.values
                    .total_general_waste_sent_to_other_types_of_disposal.code
                }{" "}
              </label>
            </Table.Cell>
            <Table.Cell>
              <label className="label">
                {t("total_general_waste_sent_to_other_types_of_disposal")}
              </label>
            </Table.Cell>
            <Table.Cell>
              <Form.Input
                type="number"
                name="total_general_waste_sent_to_other_types_of_disposal.value"
                onChange={formik.handleChange}
                value={
                  formik.values
                    .total_general_waste_sent_to_other_types_of_disposal.value
                }
                error={
                  formik.errors
                    .total_general_waste_sent_to_other_types_of_disposal
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
                    "total_general_waste_sent_to_other_types_of_disposal.unit",
                    data.value
                  )
                }
                value={
                  formik.values.paper_and_cardboard_sent_to_recycling_or_reuse
                    .unit
                }
                error={
                  formik.errors.paper_and_cardboard_sent_to_recycling_or_reuse
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
                    "total_general_waste_sent_to_other_types_of_disposal.isApproved",
                    data.value
                  )
                }
                value={
                  formik.values
                    .total_general_waste_sent_to_other_types_of_disposal
                    .isApproved
                }
                error={
                  formik.errors
                    .total_general_waste_sent_to_other_types_of_disposal
                }
              />
              {/* {formik.values.total_general_waste_sent_to_other_types_of_disposal.isApproved?  <Icon color="green" name='checkmark' /> : <Icon color="red" name='close' />} */}
            </Table.Cell>
            <Table.Cell>
              <Button
                icon
                type="button"
                primary
                onClick={() => {
                  openUpdateSite(
                    t("total_general_waste_sent_to_other_types_of_disposal"),
                    "total_general_waste_sent_to_other_types_of_disposal"
                  );
                }}
              >
                <Icon name="comment outline" />
              </Button>
              <FileUpload
                accessToken={accessToken}
                data={formik}
                field={"total_general_waste_sent_to_other_types_of_disposal"}
                newFiles={newFiles}
                setNewFiles={setNewFiles}
                t={t}
              />
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>
              <label className="label">
                {formik.values.total_non_hazardous_waste_unit_produced.code}{" "}
              </label>
            </Table.Cell>
            <Table.Cell>
              <label className="label">
                {t("total_non_hazardous_waste_unit_produced")}
              </label>
            </Table.Cell>
            <Table.Cell>
              <Form.Input
                type="number"
                name="total_non_hazardous_waste_unit_produced.value"
                onChange={formik.handleChange}
                value={
                  formik.values.total_non_hazardous_waste_unit_produced.value
                }
                error={formik.errors.total_non_hazardous_waste_unit_produced}
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
                    "total_non_hazardous_waste_unit_produced.unit",
                    data.value
                  )
                }
                value={
                  formik.values.paper_and_cardboard_sent_to_recycling_or_reuse
                    .unit
                }
                error={
                  formik.errors.paper_and_cardboard_sent_to_recycling_or_reuse
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
                    "total_non_hazardous_waste_unit_produced.isApproved",
                    data.value
                  )
                }
                value={
                  formik.values.total_non_hazardous_waste_unit_produced
                    .isApproved
                }
                error={formik.errors.total_non_hazardous_waste_unit_produced}
              />
              {/* {formik.values.total_non_hazardous_waste_unit_produced.isApproved?  <Icon color="green" name='checkmark' /> : <Icon color="red" name='close' />} */}
            </Table.Cell>
            <Table.Cell>
              <Button
                icon
                type="button"
                primary
                onClick={() => {
                  openUpdateSite(
                    t("total_non_hazardous_waste_unit_produced"),
                    "total_non_hazardous_waste_unit_produced"
                  );
                }}
              >
                <Icon name="comment outline" />
              </Button>
              <FileUpload
                accessToken={accessToken}
                data={formik}
                field={"total_non_hazardous_waste_unit_produced"}
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
          wasteForm={wasteForm}
          user={user}
          t={t}
        />
      </BasicModal>
      <Form.Group widths="2">
        <Form.Button type="submit" fluid primary loading={formik.isSubmitting}>
          {!wasteForm ? t("save") : t("update")}
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

const EditableComment = ({ id, author, date, content, onSave, active, t }) => {
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

function FileViewer(props) {
  const { fileName, fileUniqueName, handleRemove, t } = props;
  const [fileUrl, setFileUrl] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    if (fileName) {
      setFileUrl(fileName); // Construye la URL del archivo
      (async () => {
        try {
          const response = await wasteFormController.getFileApi(fileUniqueName);
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
      const response = await wasteFormController.deleteFileApi(
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
