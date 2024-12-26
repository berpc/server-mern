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
  GridColumn,
  GridRow,
  Segment,
  Divider,
  Header,
  Label,
  TableRow,
  Modal,
  ModalActions,
  ModalContent,
  ModalHeader,
  List,
  Message,
} from "semantic-ui-react";
import { useDropzone } from "react-dropzone";
import { useFormik, Field, FieldArray, FormikProvider, getIn } from "formik";
import { Energyform } from "../../../../api";
import { useAuth } from "../../../../hooks";
import { ENV, PERIODS } from "../../../../utils";
import {
  formatDateView,
  formatDateHourCompleted,
} from "../../../../utils/formatDate";
import { BasicModal } from "../../../Shared";
import { initialValues, validationSchema } from "./EnergyForm.form";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { decrypt, encrypt } from "../../../../utils/cryptoUtils";
import "./SiteForm.scss";
import { useLanguage } from "../../../../contexts";

const energyFormController = new Energyform();

export function EnergyForm(props) {
  const { onClose, onReload, energyForm, site, siteSelected, year, period } =
    props;
  const { accessToken } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [titleModal, setTitleModal] = useState("");
  const [fieldName, setFieldName] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [listPeriods, setListPeriods] = useState([]);

  const [newFiles, setNewFiles] = useState([]);

  const { user } = useAuth();

  const location = useLocation();
  // const { siteSelected } = location.state || {};

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
    initialValues: initialValues(energyForm, period, year),
    validationSchema: validationSchema(),
    validateOnChange: false,
    onSubmit: async (formValue) => {
      try {
        if (!energyForm) {
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
            //   if (!energyForm) {
            //     const siteData = decrypt(siteSelected);
            //     formValue.site = siteData;
            //   }
            // }
          }
          await energyFormController.createEnergyForm(accessToken, formValue);
          //console.log(formValue);
        } else {
          await energyFormController.updateEnergyForm(
            accessToken,
            energyForm._id,
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
    navigate(`/admin/data/energyforms`, {
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
          await energyFormController.getPeriodsEnergyFormsBySiteAndYear(
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
    <Form className="energy-form" onSubmit={formik.handleSubmit}>
      {energyForm ? (
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
      {!energyForm ? (
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
          {/* Electricidad */}
          <Table.Row>
            <Table.Cell>
              <Label ribbon>Electricidad</Label>
            </Table.Cell>
            <Table.Cell></Table.Cell>
            <Table.Cell></Table.Cell>
            <Table.Cell></Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>
              <label className="label">
                {formik.values.electricity.electricity_standard.code}{" "}
              </label>
            </Table.Cell>
            <Table.Cell>
              <label className="label">{t("electricity_standard")}</label>
            </Table.Cell>
            <Table.Cell>
              <Form.Input
                onKeyPress={(event) => {
                  if (!/[0-9]/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
                onChange={formik.handleChange}
                name="electricity.electricity_standard.value"
                value={formik.values.electricity.electricity_standard.value}
                error={formik.errors.electricity}
              />
            </Table.Cell>
            <Table.Cell>
              <Form.Dropdown
                placeholder="MHW"
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
                    "electricity.electricity_standard.unit",
                    data.value
                  )
                }
                value={formik.values.electricity.electricity_standard.unit}
                error={formik.errors.electricity}
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
                    `electricity.electricity_standard.isApproved`,
                    data.value
                  )
                }
                value={
                  formik.values.electricity.electricity_standard.isApproved
                }
                error={formik.errors.electricity}
              />
              {/* {formik.values.electricity.electricity_standard.isApproved?  <Icon color="green" name='checkmark' /> : <Icon color="red" name='close' />} */}
            </Table.Cell>
            <Table.Cell>
              <Button
                icon
                type="button"
                primary
                onClick={() => {
                  openUpdateSite(
                    t("electricity_standard"),
                    `electricity.electricity_standard`
                  );
                }}
              >
                <Icon name="comment outline" />
              </Button>
              <FileUpload
                accessToken={accessToken}
                data={formik}
                field={"electricity.electricity_standard"}
                newFiles={newFiles}
                setNewFiles={setNewFiles}
                t={t}
              />
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>
              <label className="label">
                {formik.values.electricity.electricity_cost.code}{" "}
              </label>
            </Table.Cell>
            <Table.Cell>
              <label className="label">{t("electricity_cost")}</label>
            </Table.Cell>
            <Table.Cell>
              <Form.Input
                onKeyPress={(event) => {
                  if (!/[0-9]/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
                onChange={formik.handleChange}
                name="electricity.electricity_cost.value"
                value={formik.values.electricity.electricity_cost.value}
                error={formik.errors.electricity}
              />
            </Table.Cell>

            <Table.Cell>
              <Form.Dropdown
                placeholder={t("select")}
                options={[
                  { _id: "$ Arg", name: " $ Arg" },
                  { _id: "US$", name: "US$" },
                  { _id: "R$", name: "R$" },
                  { _id: "$ Mxn", name: "$ Mxn" },
                ].map((ds) => {
                  return {
                    key: ds._id,
                    text: ds.name,
                    value: ds._id,
                  };
                })}
                selection
                onChange={(_, data) =>
                  formik.setFieldValue(
                    "electricity.electricity_cost.unit",
                    data.value
                  )
                }
                value={formik.values.electricity.electricity_cost.unit}
                error={formik.errors.electricity}
              />
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
                    `electricity.electricity_cost.isApproved`,
                    data.value
                  )
                }
                value={formik.values.electricity.electricity_cost.isApproved}
                error={formik.errors.electricity}
              />
              {/* {formik.values.electricity.electricity_cost.isApproved?  <Icon color="green" name='checkmark' /> : <Icon color="red" name='close' />} */}
            </Table.Cell>

            <Table.Cell>
              <Button
                icon
                type="button"
                primary
                onClick={() => {
                  openUpdateSite(
                    t("electricity_cost"),
                    `electricity.electricity_cost`
                  );
                }}
              >
                <Icon name="comment outline" />
              </Button>
              <FileUpload
                accessToken={accessToken}
                data={formik}
                field={"electricity.electricity_cost"}
                newFiles={newFiles}
                setNewFiles={setNewFiles}
                t={t}
              />
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>
              <label className="label">
                {formik.values.electricity.renewable_energies.code}{" "}
              </label>
            </Table.Cell>
            <Table.Cell>
              <label className="label">{t("renewable_energies")}</label>
            </Table.Cell>
            <Table.Cell>
              <Form.Input
                onKeyPress={(event) => {
                  if (!/[0-9]/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
                onChange={formik.handleChange}
                name="electricity.renewable_energies.value"
                value={formik.values.electricity.renewable_energies.value}
                error={formik.errors.electricity}
              />
            </Table.Cell>
            <Table.Cell>
              <Form.Dropdown
                placeholder="MHW"
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
                    "electricity.renewable_energies.unit",
                    data.value
                  )
                }
                value={formik.values.electricity.renewable_energies.unit}
                error={formik.errors.electricity}
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
                    `electricity.renewable_energies.isApproved`,
                    data.value
                  )
                }
                value={formik.values.electricity.renewable_energies.isApproved}
                error={formik.errors.electricity}
              />
              {/* {formik.values.electricity.renewable_energies.isApproved?  <Icon color="green" name='checkmark' /> : <Icon color="red" name='close' />} */}
            </Table.Cell>
            <Table.Cell>
              <Button
                icon
                type="button"
                primary
                onClick={() => {
                  openUpdateSite(
                    t("renewable_energies"),
                    `electricity.renewable_energies`
                  );
                }}
              >
                <Icon name="comment outline" />
              </Button>
              <FileUpload
                accessToken={accessToken}
                data={formik}
                field={"electricity.renewable_energies"}
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
                  formik.values.electricity
                    .renewable_energies_produced_and_consumed_on_site.code
                }{" "}
              </label>
            </Table.Cell>
            <Table.Cell>
              <label className="label">
                {t("renewable_energies_produced_and_consumed_on_site")}
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
                name="electricity.renewable_energies_produced_and_consumed_on_site.value"
                value={
                  formik.values.electricity
                    .renewable_energies_produced_and_consumed_on_site.value
                }
                error={formik.errors.electricity}
              />
            </Table.Cell>

            <Table.Cell>
              <Form.Dropdown
                placeholder="MHW"
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
                    "electricity.renewable_energies_produced_and_consumed_on_site.unit",
                    data.value
                  )
                }
                value={
                  formik.values.electricity
                    .renewable_energies_produced_and_consumed_on_site.unit
                }
                error={formik.errors.electricity}
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
                    `electricity.renewable_energies_produced_and_consumed_on_site.isApproved`,
                    data.value
                  )
                }
                value={
                  formik.values.electricity
                    .renewable_energies_produced_and_consumed_on_site.isApproved
                }
                error={formik.errors.electricity}
              />
              {/* {formik.values.electricity.renewable_energies_produced_and_consumed_on_site.isApproved?  <Icon color="green" name='checkmark' /> : <Icon color="red" name='close' />} */}
            </Table.Cell>
            <Table.Cell>
              <Button
                icon
                type="button"
                primary
                onClick={() => {
                  openUpdateSite(
                    t("renewable_energies_produced_and_consumed_on_site"),
                    `electricity.renewable_energies_produced_and_consumed_on_site`
                  );
                }}
              >
                <Icon name="comment outline" />
              </Button>
              <FileUpload
                accessToken={accessToken}
                data={formik}
                field={
                  "electricity.renewable_energies_produced_and_consumed_on_site"
                }
                newFiles={newFiles}
                setNewFiles={setNewFiles}
                t={t}
              />
            </Table.Cell>
          </Table.Row>

          {/* Combustibles */}
          <Table.Row>
            <Table.Cell>
              <Label ribbon>{t("fuels")}</Label>
              {/* <label className="label">Combustibles</label> */}
            </Table.Cell>
            <Table.Cell></Table.Cell>
            <Table.Cell></Table.Cell>
            <Table.Cell></Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>
              <label className="label">{formik.values.fuels.steam.code} </label>
            </Table.Cell>
            <Table.Cell>
              <label className="label">{t("steam")}</label>
            </Table.Cell>
            <Table.Cell>
              <Form.Input
                onKeyPress={(event) => {
                  if (!/[0-9]/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
                onChange={formik.handleChange}
                name="fuels.steam.value"
                value={formik.values.fuels.steam.value}
                error={formik.errors.fuels}
              />
            </Table.Cell>
            <Table.Cell>
              <Form.Dropdown
                placeholder="KJ"
                options={[{ key: 1, value: true, name: "dato" }].map((ds) => {
                  return {
                    key: ds.key,
                    text: ds.name,
                    value: ds.value,
                  };
                })}
                selection
                onChange={(_, data) =>
                  formik.setFieldValue("fuels.steam.unit", data.value)
                }
                value={formik.values.fuels.steam.unit}
                error={formik.errors.fuels}
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
                  formik.setFieldValue(`fuels.steam.isApproved`, data.value)
                }
                value={formik.values.fuels.steam.isApproved}
                error={formik.errors.fuels}
              />
              {/* {formik.values.fuels.steam.isApproved?  <Icon color="green" name='checkmark' /> : <Icon color="red" name='close' />} */}
            </Table.Cell>
            <Table.Cell>
              <Button
                icon
                type="button"
                primary
                onClick={() => {
                  openUpdateSite(t("steam"), `fuels.steam}`);
                }}
              >
                <Icon name="comment outline" />
              </Button>
              <FileUpload
                accessToken={accessToken}
                data={formik}
                field={"fuels.steam"}
                newFiles={newFiles}
                setNewFiles={setNewFiles}
                t={t}
              />
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>
              <label className="label">
                {formik.values.fuels.steam_cost.code}{" "}
              </label>
            </Table.Cell>
            <Table.Cell>
              <label className="label">{t("steam_cost")}</label>
            </Table.Cell>
            <Table.Cell>
              <Form.Input
                onKeyPress={(event) => {
                  if (!/[0-9]/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
                onChange={formik.handleChange}
                name="fuels.steam_cost.value"
                value={formik.values.fuels.steam_cost.value}
                error={formik.errors.fuels}
              />
            </Table.Cell>
            <Table.Cell>
              <Form.Dropdown
                placeholder={t("select")}
                options={[
                  { _id: "$ Arg", name: " $ Arg" },
                  { _id: "US$", name: "US$" },
                  { _id: "R$", name: "R$" },
                  { _id: "$ Mxn", name: "$ Mxn" },
                ].map((ds) => {
                  return {
                    key: ds._id,
                    text: ds.name,
                    value: ds._id,
                  };
                })}
                selection
                onChange={(_, data) =>
                  formik.setFieldValue("fuels.steam_cost.unit", data.value)
                }
                value={formik.values.fuels.steam_cost.unit}
                error={formik.errors.fuels}
              />
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
                    `fuels.steam_cost.isApproved`,
                    data.value
                  )
                }
                value={formik.values.fuels.steam_cost.isApproved}
                error={formik.errors.fuels}
              />
              {/* {formik.values.fuels.steam_cost.isApproved?  <Icon color="green" name='checkmark' /> : <Icon color="red" name='close' />} */}
            </Table.Cell>
            <Table.Cell>
              <Button
                icon
                type="button"
                primary
                onClick={() => {
                  openUpdateSite(t("steam_cost"), `fuels.steam_cost}`);
                }}
              >
                <Icon name="comment outline" />
              </Button>
              <FileUpload
                accessToken={accessToken}
                data={formik}
                field={"fuels.steam_cost"}
                newFiles={newFiles}
                setNewFiles={setNewFiles}
                t={t}
              />
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>
              <label className="label">
                {formik.values.fuels.natural_gas.code}{" "}
              </label>
            </Table.Cell>
            <Table.Cell>
              <label className="label">{t("natural_gas")}</label>
            </Table.Cell>
            <Table.Cell>
              <Form.Input
                onKeyPress={(event) => {
                  if (!/[0-9]/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
                onChange={formik.handleChange}
                name="electricity.natural_gas.value"
                value={formik.values.fuels.natural_gas.value}
                error={formik.errors.fuels}
              />
            </Table.Cell>
            <Table.Cell>
              <Form.Dropdown
                placeholder="Dato fijo"
                options={[{ key: 1, value: true, name: "dato" }].map((ds) => {
                  return {
                    key: ds.key,
                    text: ds.name,
                    value: ds.value,
                  };
                })}
                selection
                onChange={(_, data) =>
                  formik.setFieldValue("fuels.natural_gas.unit", data.value)
                }
                value={formik.values.fuels.natural_gas.unit}
                error={formik.errors.fuels}
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
                    `fuels.natural_gas.isApproved`,
                    data.value
                  )
                }
                value={formik.values.fuels.natural_gas.isApproved}
                error={formik.errors.fuels}
              />
              {/* {formik.values.fuels.natural_gas.isApproved?  <Icon color="green" name='checkmark' /> : <Icon color="red" name='close' />} */}
            </Table.Cell>
            <Table.Cell>
              <Button
                icon
                type="button"
                primary
                onClick={() => {
                  openUpdateSite(t("natural_gas"), `fuels.natural_gas}`);
                }}
              >
                <Icon name="comment outline" />
              </Button>
              <FileUpload
                accessToken={accessToken}
                data={formik}
                field={"fuels.natural_gas"}
                newFiles={newFiles}
                setNewFiles={setNewFiles}
                t={t}
              />
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>
              <label className="label">
                {formik.values.fuels.natural_gas_cost.code}{" "}
              </label>
            </Table.Cell>
            <Table.Cell>
              <label className="label">{t("natural_gas_cost")}</label>
            </Table.Cell>
            <Table.Cell>
              <Form.Input
                onKeyPress={(event) => {
                  if (!/[0-9]/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
                onChange={formik.handleChange}
                name="fuels.natural_gas_cost.value"
                value={formik.values.fuels.natural_gas_cost.value}
                error={formik.errors.fuels}
              />
            </Table.Cell>

            <Table.Cell>
              <Form.Dropdown
                placeholder={t("select")}
                options={[
                  { _id: "$ Arg", name: " $ Arg" },
                  { _id: "US$", name: "US$" },
                  { _id: "R$", name: "R$" },
                  { _id: "$ Mxn", name: "$ Mxn" },
                ].map((ds) => {
                  return {
                    key: ds._id,
                    text: ds.name,
                    value: ds._id,
                  };
                })}
                selection
                onChange={(_, data) =>
                  formik.setFieldValue(
                    "fuels.natural_gas_cost.unit",
                    data.value
                  )
                }
                value={formik.values.fuels.natural_gas_cost.unit}
                error={formik.errors.fuels}
              />
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
                    `fuels.natural_gas_cost.isApproved`,
                    data.value
                  )
                }
                value={formik.values.fuels.natural_gas_cost.isApproved}
                error={formik.errors.fuels}
              />
              {/* {formik.values.fuels.natural_gas_cost.isApproved?  <Icon color="green" name='checkmark' /> : <Icon color="red" name='close' />} */}
            </Table.Cell>
            <Table.Cell>
              <Button
                icon
                type="button"
                primary
                onClick={() => {
                  openUpdateSite(
                    t("natural_gas_cost"),
                    `fuels.natural_gas_cost`
                  );
                }}
              >
                <Icon name="comment outline" />
              </Button>
              <FileUpload
                accessToken={accessToken}
                data={formik}
                field={"fuels.natural_gas_cost"}
                newFiles={newFiles}
                setNewFiles={setNewFiles}
                t={t}
              />
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>
              <label className="label">{formik.values.fuels.glp.code} </label>
            </Table.Cell>
            <Table.Cell>
              <label className="label">{t("glp")}</label>
            </Table.Cell>
            <Table.Cell>
              <Form.Input
                onKeyPress={(event) => {
                  if (!/[0-9]/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
                onChange={formik.handleChange}
                name="fuels.glp.value"
                value={formik.values.fuels.glp.value}
                error={formik.errors.fuels}
              />
            </Table.Cell>
            <Table.Cell>
              <Form.Dropdown
                placeholder="Dato fijo"
                options={[{ key: 1, value: true, name: "dato" }].map((ds) => {
                  return {
                    key: ds.key,
                    text: ds.name,
                    value: ds.value,
                  };
                })}
                selection
                onChange={(_, data) =>
                  formik.setFieldValue("fuels.glp.unit", data.value)
                }
                value={formik.values.fuels.glp.unit}
                error={formik.errors.fuels}
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
                  formik.setFieldValue(`fuels.glp.isApproved`, data.value)
                }
                value={formik.values.fuels.glp.isApproved}
                error={formik.errors.fuels}
              />
              {/* {formik.values.fuels.glp.isApproved?  <Icon color="green" name='checkmark' /> : <Icon color="red" name='close' />} */}
            </Table.Cell>
            <Table.Cell>
              <Button
                icon
                type="button"
                primary
                onClick={() => {
                  openUpdateSite(t("glp"), `fuels.glp`);
                }}
              >
                <Icon name="comment outline" />
              </Button>
              <FileUpload
                accessToken={accessToken}
                data={formik}
                field={"fuels.glp"}
                newFiles={newFiles}
                setNewFiles={setNewFiles}
                t={t}
              />
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>
              <label className="label">
                {formik.values.fuels.glp_cost.code}{" "}
              </label>
            </Table.Cell>
            <Table.Cell>
              <label className="label">{t("glp_cost")}</label>
            </Table.Cell>
            <Table.Cell>
              <Form.Input
                onKeyPress={(event) => {
                  if (!/[0-9]/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
                onChange={formik.handleChange}
                name="fuels.glp_cost.value"
                value={formik.values.fuels.glp_cost.value}
                error={formik.errors.fuels}
              />
            </Table.Cell>
            <Table.Cell>
              <Form.Dropdown
                placeholder={t("select")}
                options={[
                  { _id: "$ Arg", name: " $ Arg" },
                  { _id: "US$", name: "US$" },
                  { _id: "R$", name: "R$" },
                  { _id: "$ Mxn", name: "$ Mxn" },
                ].map((ds) => {
                  return {
                    key: ds._id,
                    text: ds.name,
                    value: ds._id,
                  };
                })}
                selection
                onChange={(_, data) =>
                  formik.setFieldValue("fuels.glp_cost.unit", data.value)
                }
                value={formik.values.fuels.glp_cost.unit}
                error={formik.errors.fuels}
              />
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
                  formik.setFieldValue(`fuels.glp_cost.isApproved`, data.value)
                }
                value={formik.values.fuels.glp_cost.isApproved}
                error={formik.errors.fuels}
              />
              {/* {formik.values.electricity.glp_cost.isApproved?  <Icon color="green" name='checkmark' /> : <Icon color="red" name='close' />} */}
            </Table.Cell>
            <Table.Cell>
              <Button
                icon
                type="button"
                primary
                onClick={() => {
                  openUpdateSite(t("glp_cost"), `fuels.glp_cost`);
                }}
              >
                <Icon name="comment outline" />
              </Button>
              <FileUpload
                accessToken={accessToken}
                data={formik}
                field={"fuels.glp_cost"}
                newFiles={newFiles}
                setNewFiles={setNewFiles}
                t={t}
              />
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>
              <label className="label">
                {formik.values.fuels.heavy_fuel_oil.code}{" "}
              </label>
            </Table.Cell>
            <Table.Cell>
              <label className="label">{t("heavy_fuel_oil")}</label>
            </Table.Cell>
            <Table.Cell>
              <Form.Input
                onKeyPress={(event) => {
                  if (!/[0-9]/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
                onChange={formik.handleChange}
                name="fuels.heavy_fuel_oil.value"
                value={formik.values.fuels.heavy_fuel_oil.value}
                error={formik.errors.fuels}
              />
            </Table.Cell>
            <Table.Cell>
              <Form.Dropdown
                placeholder="Dato fijo"
                options={[{ key: 1, value: true, name: "dato" }].map((ds) => {
                  return {
                    key: ds.key,
                    text: ds.name,
                    value: ds.value,
                  };
                })}
                selection
                onChange={(_, data) =>
                  formik.setFieldValue("fuels.heavy_fuel_oil.unit", data.value)
                }
                value={formik.values.fuels.heavy_fuel_oil.unit}
                error={formik.errors.fuels}
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
                    `fuels.heavy_fuel_oil.isApproved`,
                    data.value
                  )
                }
                value={formik.values.fuels.heavy_fuel_oil.isApproved}
                error={formik.errors.fuels}
              />
              {/* {formik.values.fuels.glp_cost.isApproved?  <Icon color="green" name='checkmark' /> : <Icon color="red" name='close' />} */}
            </Table.Cell>
            <Table.Cell>
              <Button
                icon
                type="button"
                primary
                onClick={() => {
                  openUpdateSite(t("heavy_fuel_oil"), `fuels.heavy_fuel_oil`);
                }}
              >
                <Icon name="comment outline" />
              </Button>
              <FileUpload
                accessToken={accessToken}
                data={formik}
                field={"fuels.heavy_fuel_oil"}
                newFiles={newFiles}
                setNewFiles={setNewFiles}
                t={t}
              />
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>
              <label className="label">
                {formik.values.fuels.cost_of_heavy_fuel_oil.code}{" "}
              </label>
            </Table.Cell>
            <Table.Cell>
              <label className="label">{t("cost_of_heavy_fuel_oil")}</label>
            </Table.Cell>
            <Table.Cell>
              <Form.Input
                onKeyPress={(event) => {
                  if (!/[0-9]/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
                onChange={formik.handleChange}
                name="fuels.cost_of_heavy_fuel_oil.value"
                value={formik.values.fuels.cost_of_heavy_fuel_oil.value}
                error={formik.errors.fuels}
              />
            </Table.Cell>
            <Table.Cell>
              <Form.Dropdown
                placeholder={t("select")}
                options={[
                  { _id: "$ Arg", name: " $ Arg" },
                  { _id: "US$", name: "US$" },
                  { _id: "R$", name: "R$" },
                  { _id: "$ Mxn", name: "$ Mxn" },
                ].map((ds) => {
                  return {
                    key: ds._id,
                    text: ds.name,
                    value: ds._id,
                  };
                })}
                selection
                onChange={(_, data) =>
                  formik.setFieldValue(
                    "fuels.cost_of_heavy_fuel_oil.unit",
                    data.value
                  )
                }
                value={formik.values.fuels.cost_of_heavy_fuel_oil.unit}
                error={formik.errors.fuels}
              />
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
                    `fuels.cost_of_heavy_fuel_oil.isApproved`,
                    data.value
                  )
                }
                value={formik.values.fuels.cost_of_heavy_fuel_oil.isApproved}
                error={formik.errors.fuels}
              />
              {/* {formik.values.fuels.glp_cost.isApproved?  <Icon color="green" name='checkmark' /> : <Icon color="red" name='close' />} */}
            </Table.Cell>
            <Table.Cell>
              <Button
                icon
                type="button"
                primary
                onClick={() => {
                  openUpdateSite(
                    t("cost_of_heavy_fuel_oil"),
                    `fuels.cost_of_heavy_fuel_oil`
                  );
                }}
              >
                <Icon name="comment outline" />
              </Button>
              <FileUpload
                accessToken={accessToken}
                data={formik}
                field={"fuels.cost_of_heavy_fuel_oil"}
                newFiles={newFiles}
                setNewFiles={setNewFiles}
                t={t}
              />
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>
              <label className="label">
                {formik.values.fuels.light_fuel_oil.code}{" "}
              </label>
            </Table.Cell>
            <Table.Cell>
              <label className="label">{t("light_fuel_oil")}</label>
            </Table.Cell>
            <Table.Cell>
              <Form.Input
                onKeyPress={(event) => {
                  if (!/[0-9]/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
                onChange={formik.handleChange}
                name="fuels.light_fuel_oil.value"
                value={formik.values.fuels.light_fuel_oil.value}
                error={formik.errors.fuels}
              />
            </Table.Cell>
            <Table.Cell>
              <Form.Dropdown
                placeholder="Dato fijo"
                options={[{ key: 1, value: true, name: "dato" }].map((ds) => {
                  return {
                    key: ds.key,
                    text: ds.name,
                    value: ds.value,
                  };
                })}
                selection
                onChange={(_, data) =>
                  formik.setFieldValue("fuels.light_fuel_oil.unit", data.value)
                }
                value={formik.values.fuels.light_fuel_oil.unit}
                error={formik.errors.fuels}
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
                    `fuels.light_fuel_oil.isApproved`,
                    data.value
                  )
                }
                value={formik.values.fuels.light_fuel_oil.isApproved}
                error={formik.errors.fuels}
              />
              {/* {formik.values.fuels.glp_cost.isApproved?  <Icon color="green" name='checkmark' /> : <Icon color="red" name='close' />} */}
            </Table.Cell>
            <Table.Cell>
              <Button
                icon
                type="button"
                primary
                onClick={() => {
                  openUpdateSite(t("light_fuel_oil"), `fuels.light_fuel_oil}`);
                }}
              >
                <Icon name="comment outline" />
              </Button>
              <FileUpload
                accessToken={accessToken}
                data={formik}
                field={"fuels.light_fuel_oil"}
                newFiles={newFiles}
                setNewFiles={setNewFiles}
                t={t}
              />
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>
              <label className="label">{formik.values.fuels.coal.code} </label>
            </Table.Cell>
            <Table.Cell>
              <label className="label">{t("coal")}</label>
            </Table.Cell>
            <Table.Cell>
              <Form.Input
                onKeyPress={(event) => {
                  if (!/[0-9]/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
                onChange={formik.handleChange}
                name="fuels.coal.value"
                value={formik.values.fuels.coal.value}
                error={formik.errors.fuels}
              />
            </Table.Cell>
            <Table.Cell>
              <Form.Dropdown
                placeholder="Dato fijo"
                options={[{ key: 1, value: true, name: "dato" }].map((ds) => {
                  return {
                    key: ds.key,
                    text: ds.name,
                    value: ds.value,
                  };
                })}
                selection
                onChange={(_, data) =>
                  formik.setFieldValue("fuels.coal.unit", data.value)
                }
                value={formik.values.fuels.coal.unit}
                error={formik.errors.fuels}
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
                  formik.setFieldValue(`fuels.coal.isApproved`, data.value)
                }
                value={formik.values.fuels.coal.isApproved}
                error={formik.errors.fuels}
              />
              {/* {formik.values.fuels.glp_cost.isApproved?  <Icon color="green" name='checkmark' /> : <Icon color="red" name='close' />} */}
            </Table.Cell>
            <Table.Cell>
              <Button
                icon
                type="button"
                primary
                onClick={() => {
                  openUpdateSite(t("coal"), `fuels.coal`);
                }}
              >
                <Icon name="comment outline" />
              </Button>
              <FileUpload
                accessToken={accessToken}
                data={formik}
                field={"fuels.coal"}
                newFiles={newFiles}
                setNewFiles={setNewFiles}
                t={t}
              />
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>
              <label className="label">
                {formik.values.fuels.coal_cost.code}{" "}
              </label>
            </Table.Cell>
            <Table.Cell>
              <label className="label">{t("coal_cost")}</label>
            </Table.Cell>
            <Table.Cell>
              <Form.Input
                onKeyPress={(event) => {
                  if (!/[0-9]/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
                onChange={formik.handleChange}
                name="fuels.coal_cost.value"
                value={formik.values.fuels.coal_cost.value}
                error={formik.errors.fuels}
              />
            </Table.Cell>
            <Table.Cell>
              <Form.Dropdown
                placeholder={t("select")}
                options={[
                  { _id: "$ Arg", name: " $ Arg" },
                  { _id: "US$", name: "US$" },
                  { _id: "R$", name: "R$" },
                  { _id: "$ Mxn", name: "$ Mxn" },
                ].map((ds) => {
                  return {
                    key: ds._id,
                    text: ds.name,
                    value: ds._id,
                  };
                })}
                selection
                onChange={(_, data) =>
                  formik.setFieldValue("fuels.coal_cost.unit", data.value)
                }
                value={formik.values.fuels.coal_cost.unit}
                error={formik.errors.coal}
              />
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
                  formik.setFieldValue(`fuels.coal_cost.isApproved`, data.value)
                }
                value={formik.values.fuels.coal_cost.isApproved}
                error={formik.errors.fuels}
              />
              {/* {formik.values.fuels.coal_cost.isApproved?  <Icon color="green" name='checkmark' /> : <Icon color="red" name='close' />} */}
            </Table.Cell>
            <Table.Cell>
              <Button
                icon
                type="button"
                primary
                onClick={() => {
                  openUpdateSite(t("coal_cost"), `fuels.coal_cost`);
                }}
              >
                <Icon name="comment outline" />
              </Button>
              <FileUpload
                accessToken={accessToken}
                data={formik}
                field={"fuels.coal_cost"}
                newFiles={newFiles}
                setNewFiles={setNewFiles}
                t={t}
              />
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>
              <label className="label">
                {formik.values.fuels.diesel.code}{" "}
              </label>
            </Table.Cell>
            <Table.Cell>
              <label className="label">{t("diesel")}</label>
            </Table.Cell>
            <Table.Cell>
              <Form.Input
                onKeyPress={(event) => {
                  if (!/[0-9]/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
                onChange={formik.handleChange}
                name="fuels.diesel.value"
                value={formik.values.fuels.diesel.value}
                error={formik.errors.fuels}
              />
            </Table.Cell>
            <Table.Cell>
              <Form.Dropdown
                placeholder="Dato fijo"
                options={[{ key: 1, value: true, name: "dato" }].map((ds) => {
                  return {
                    key: ds.key,
                    text: ds.name,
                    value: ds.value,
                  };
                })}
                selection
                onChange={(_, data) =>
                  formik.setFieldValue("fuels.diesel.unit", data.value)
                }
                value={formik.values.fuels.diesel.unit}
                error={formik.errors.fuels}
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
                  formik.setFieldValue(`fuels.diesel.isApproved`, data.value)
                }
                value={formik.values.fuels.diesel.isApproved}
                error={formik.errors.fuels}
              />
              {/* {formik.values.fuels.coal_cost.isApproved?  <Icon color="green" name='checkmark' /> : <Icon color="red" name='close' />} */}
            </Table.Cell>
            <Table.Cell>
              <Button
                icon
                type="button"
                primary
                onClick={() => {
                  openUpdateSite(t("diesel"), `fuels.diesel`);
                }}
              >
                <Icon name="comment outline" />
              </Button>
              <FileUpload
                accessToken={accessToken}
                data={formik}
                field={"fuels.diesel"}
                newFiles={newFiles}
                setNewFiles={setNewFiles}
                t={t}
              />
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>
              <label className="label">
                {formik.values.fuels.diesel_cost.code}{" "}
              </label>
            </Table.Cell>
            <Table.Cell>
              <label className="label">{t("diesel_cost")}</label>
            </Table.Cell>
            <Table.Cell>
              <Form.Input
                onKeyPress={(event) => {
                  if (!/[0-9]/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
                onChange={formik.handleChange}
                name="fuels.diesel_cost.value"
                value={formik.values.fuels.diesel_cost.value}
                error={formik.errors.fuels}
              />
            </Table.Cell>
            <Table.Cell>
              <Form.Dropdown
                placeholder={t("select")}
                options={[
                  { _id: "$ Arg", name: " $ Arg" },
                  { _id: "US$", name: "US$" },
                  { _id: "R$", name: "R$" },
                  { _id: "$ Mxn", name: "$ Mxn" },
                ].map((ds) => {
                  return {
                    key: ds._id,
                    text: ds.name,
                    value: ds._id,
                  };
                })}
                selection
                onChange={(_, data) =>
                  formik.setFieldValue("fuels.diesel_cost", data.value)
                }
                value={formik.values.fuels.diesel_cost.unit}
                error={formik.errors.fuels}
              />
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
                    `fuels.diesel_cost.isApproved`,
                    data.value
                  )
                }
                value={formik.values.fuels.diesel_cost.isApproved}
                error={formik.errors.fuels}
              />
              {/* {formik.values.fuels.diesel_cost.isApproved?  <Icon color="green" name='checkmark' /> : <Icon color="red" name='close' />} */}
            </Table.Cell>
            <Table.Cell>
              <Button
                icon
                type="button"
                primary
                onClick={() => {
                  openUpdateSite(t("diesel_cost"), `fuels.diesel_cost`);
                }}
              >
                <Icon name="comment outline" />
              </Button>
              <FileUpload
                accessToken={accessToken}
                data={formik}
                field={"fuels.diesel_cost"}
                newFiles={newFiles}
                setNewFiles={setNewFiles}
                t={t}
              />
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>
              <label className="label">
                {formik.values.fuels.gasoline_for_internal_vehicles.code}{" "}
              </label>
            </Table.Cell>
            <Table.Cell>
              <label className="label">
                {t("gasoline_for_internal_vehicles")}
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
                name="fuels.gasoline_for_internal_vehicles.value"
                value={formik.values.fuels.gasoline_for_internal_vehicles.value}
                error={formik.errors.fuels}
              />
            </Table.Cell>
            <Table.Cell>
              <Form.Dropdown
                placeholder="Dato fijo"
                options={[{ key: 1, value: true, name: "dato" }].map((ds) => {
                  return {
                    key: ds.key,
                    text: ds.name,
                    value: ds.value,
                  };
                })}
                selection
                onChange={(_, data) =>
                  formik.setFieldValue(
                    "fuels.gasoline_for_internal_vehicles.isApproved",
                    data.value
                  )
                }
                value={formik.values.fuels.gasoline_for_internal_vehicles.uniy}
                error={formik.errors.fuels}
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
                    `fuels.gasoline_for_internal_vehicles.isApproved`,
                    data.value
                  )
                }
                value={
                  formik.values.fuels.gasoline_for_internal_vehicles.isApproved
                }
                error={formik.errors.fuels}
              />
              {/* {formik.values.fuels.gasoline_for_internal_vehicles.isApproved?  <Icon color="green" name='checkmark' /> : <Icon color="red" name='close' />} */}
            </Table.Cell>
            <Table.Cell>
              <Button
                icon
                type="button"
                primary
                onClick={() => {
                  openUpdateSite(
                    t("gasoline_for_internal_vehicles"),
                    `fuels.gasoline_for_internal_vehicles}`
                  );
                }}
              >
                <Icon name="comment outline" />
              </Button>
              <FileUpload
                accessToken={accessToken}
                data={formik}
                field={"fuels.gasoline_for_internal_vehicles"}
                newFiles={newFiles}
                setNewFiles={setNewFiles}
                t={t}
              />
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>
              <label className="label">
                {formik.values.fuels.gasoline_cost_of_internal_vehicles.code}{" "}
              </label>
            </Table.Cell>
            <Table.Cell>
              <label className="label">
                {t("gasoline_cost_of_internal_vehicles")}
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
                name="fuels.gasoline_cost_of_internal_vehicles.value"
                value={
                  formik.values.fuels.gasoline_cost_of_internal_vehicles.value
                }
                error={formik.errors.fuels}
              />
            </Table.Cell>
            <Table.Cell>
              <Form.Dropdown
                placeholder={t("select")}
                options={[
                  { _id: "$ Arg", name: " $ Arg" },
                  { _id: "US$", name: "US$" },
                  { _id: "R$", name: "R$" },
                  { _id: "$ Mxn", name: "$ Mxn" },
                ].map((ds) => {
                  return {
                    key: ds._id,
                    text: ds.name,
                    value: ds._id,
                  };
                })}
                selection
                onChange={(_, data) =>
                  formik.setFieldValue(
                    "fuels.gasoline_cost_of_internal_vehicles",
                    data.value
                  )
                }
                value={
                  formik.values.fuels.gasoline_cost_of_internal_vehicles.unit
                }
                error={formik.errors.fuels}
              />
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
                    `fuels.gasoline_cost_of_internal_vehicles.isApproved`,
                    data.value
                  )
                }
                value={
                  formik.values.fuels.gasoline_cost_of_internal_vehicles
                    .isApproved
                }
                error={formik.errors.fuels}
              />
              {/* {formik.values.fuels.gasoline_cost_of_internal_vehicles.isApproved?  <Icon color="green" name='checkmark' /> : <Icon color="red" name='close' />} */}
            </Table.Cell>
            <Table.Cell>
              <Button
                icon
                type="button"
                primary
                onClick={() => {
                  openUpdateSite(
                    t("gasoline_cost_of_internal_vehicles"),
                    `fuels.gasoline_cost_of_internal_vehicles`
                  );
                }}
              >
                <Icon name="comment outline" />
              </Button>
              <FileUpload
                accessToken={accessToken}
                data={formik}
                field={"fuels.gasoline_cost_of_internal_vehicles"}
                newFiles={newFiles}
                setNewFiles={setNewFiles}
                t={t}
              />
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>
              <label className="label">
                {formik.values.fuels.biomass.code}{" "}
              </label>
            </Table.Cell>
            <Table.Cell>
              <label className="label">{t("biomass")}</label>
            </Table.Cell>
            <Table.Cell>
              <Form.Input
                onKeyPress={(event) => {
                  if (!/[0-9]/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
                onChange={formik.handleChange}
                name="fuels.biomass.value"
                value={formik.values.fuels.biomass.value}
                error={formik.errors.fuels}
              />
            </Table.Cell>
            <Table.Cell>
              <Form.Dropdown
                placeholder="Dato fijo"
                options={[{ key: 1, value: true, name: "dato" }].map((ds) => {
                  return {
                    key: ds.key,
                    text: ds.name,
                    value: ds.value,
                  };
                })}
                selection
                onChange={(_, data) =>
                  formik.setFieldValue("fuels.biomass.unit", data.value)
                }
                value={formik.values.fuels.biomass.unit}
                error={formik.errors.fuels}
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
                  formik.setFieldValue(`fuels.biomass.isApproved`, data.value)
                }
                value={formik.values.fuels.biomass.isApproved}
                error={formik.errors.fuels}
              />
              {/* {formik.values.fuels.biomass.isApproved?  <Icon color="green" name='checkmark' /> : <Icon color="red" name='close' />} */}
            </Table.Cell>
            <Table.Cell>
              <Button
                icon
                type="button"
                primary
                onClick={() => {
                  openUpdateSite(t("biomass"), `fuels.biomass`);
                }}
              >
                <Icon name="comment outline" />
              </Button>
              <FileUpload
                accessToken={accessToken}
                data={formik}
                field={"fuels.biomass"}
                newFiles={newFiles}
                setNewFiles={setNewFiles}
                t={t}
              />
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>
              <label className="label">
                {formik.values.fuels.biomass_cost.code}{" "}
              </label>
            </Table.Cell>
            <Table.Cell>
              <label className="label">{t("biomass_cost")}</label>
            </Table.Cell>
            <Table.Cell>
              <Form.Input
                onKeyPress={(event) => {
                  if (!/[0-9]/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
                onChange={formik.handleChange}
                name="fuels.biomass_cost.value"
                value={formik.values.fuels.biomass_cost.value}
                error={formik.errors.fuels}
              />
            </Table.Cell>
            <Table.Cell>
              <Form.Dropdown
                placeholder={t("select")}
                options={[
                  { _id: "$ Arg", name: " $ Arg" },
                  { _id: "US$", name: "US$" },
                  { _id: "R$", name: "R$" },
                  { _id: "$ Mxn", name: "$ Mxn" },
                ].map((ds) => {
                  return {
                    key: ds._id,
                    text: ds.name,
                    value: ds._id,
                  };
                })}
                selection
                onChange={(_, data) =>
                  formik.setFieldValue("fuels.biomass_cost", data.value)
                }
                value={formik.values.fuels.biomass_cost.unit}
                error={formik.errors.fuels}
              />
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
                    `fuels.biomass_cost.isApproved`,
                    data.value
                  )
                }
                value={formik.values.fuels.biomass_cost.isApproved}
                error={formik.errors.fuels}
              />
              {/* {formik.values.fuels.biomass_cost.isApproved?  <Icon color="green" name='checkmark' /> : <Icon color="red" name='close' />} */}
            </Table.Cell>
            <Table.Cell>
              <Button
                icon
                type="button"
                primary
                onClick={() => {
                  openUpdateSite(t("biomass_cost"), `fuels.biomass_cost`);
                }}
              >
                <Icon name="comment outline" />
              </Button>
              <FileUpload
                accessToken={accessToken}
                data={formik}
                field={"fuels.biomass_cost"}
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
          energyForm={energyForm}
          user={user}
          t={t}
        />
      </BasicModal>
      <Form.Group widths="2">
        <Form.Button type="submit" fluid primary loading={formik.isSubmitting}>
          {!energyForm ? t("save") : t("update")}
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
          const response = await energyFormController.getFileApi(
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
    const value = getValueByKey(data.values, field);
    if (value && value.files) {
      setFilesView(value.files); // Construye la URL del archivo
    }
  }, [data]);

  const getValueByKey = (json, key) => {
    const keys = key.split("."); // Divide la cadena en partes
    let value = json;

    // Itera sobre las claves para acceder al valor final
    for (const parte of keys) {
      value = value[parte]; // Accede a la propiedad correspondiente
      if (value === undefined) {
        return undefined; // Si alguna clave no existe, retorna undefined
      }
    }
    return value;
  };

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
      const response = await energyFormController.deleteFileApi(
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
