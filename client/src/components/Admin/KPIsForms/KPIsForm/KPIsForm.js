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
  Label,
  Modal,
  ModalActions,
  ModalContent,
  ModalHeader,
  Segment,
  Divider,
  Header,
} from "semantic-ui-react";
import { useDropzone } from "react-dropzone";
import { useFormik,} from "formik";
import { KPIsform } from "../../../../api";
import { useAuth } from "../../../../hooks";
import { ENV } from "../../../../utils";
import {
  formatDateView,
  formatDateHourCompleted,
} from "../../../../utils/formatDate";
import { BasicModal } from "../../../Shared";
import { initialValues, validationSchema } from "./KPIsForm.form";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { decrypt, encrypt } from "../../../../utils/cryptoUtils";
import { PERIODS } from "../../../../utils";
import "./KPIsForm.scss";
import { kpisCodes } from "../../../../utils/codes";
import { useLanguage } from "../../../../contexts";

const kpisFormController = new KPIsform();

export function KPIsForm(props) {
  const { onClose, onReload, kpisForm, siteSelected, year, period } = props;
  const { accessToken } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [titleModal, setTitleModal] = useState("");
  const [fieldName, setFieldName] = useState("");
  const [listPeriods, setListPeriods] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
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
    initialValues: initialValues(kpisForm, period, year),
    validationSchema: validationSchema(),
    validateOnChange: false,
    onSubmit: async (formValue) => {
      try {
        if (!kpisForm) {
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
            //   if (!kpisForm) {
            //     //const siteData = decrypt(siteSelected);
            //     //formValue.site = siteData;
            //     formValue.site = siteSelected;
            //   }
            // }
          }
          await kpisFormController.createKPIsForm(accessToken, formValue);
          //console.log(formValue);
        } else {
          await kpisFormController.updateKPIsForm(
            accessToken,
            kpisForm._id,
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
    navigate(`/admin/data/kpisforms`, {
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
          await kpisFormController.getPeriodsKPIsFormsBySiteAndYear(
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
    <Form className="kpis-form" onSubmit={formik.handleSubmit}>
      {kpisForm ? (
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
      {!kpisForm ? (
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
              <Label ribbon>{t("energy_indicators")}</Label>
            </Table.Cell>
            <Table.Cell></Table.Cell>
            <Table.Cell></Table.Cell>
            <Table.Cell></Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>
              <label className="label">
                {
                  formik.values.energy_indicators.total_fuel_energy_consumption
                    .code
                }
              </label>
            </Table.Cell>
            <Table.Cell>
              <label className="label">
                {t("total_fuel_energy_consumption")}
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
                name="energy_indicators.total_fuel_energy_consumption.value"
                value={
                  formik.values.energy_indicators.total_fuel_energy_consumption
                    .value
                }
                error={formik.errors.energy_indicators}
              />
            </Table.Cell>
            <Table.Cell>
              <Form.Dropdown
                placeholder="MhW"
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
                    "energy_indicators.total_fuel_energy_consumption.unit",
                    data.value
                  )
                }
                value={
                  formik.values.energy_indicators.total_fuel_energy_consumption
                    .unit
                }
                error={formik.errors.energy_indicators}
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
                    `energy_indicators.total_fuel_energy_consumption.isApproved`,
                    data.value
                  )
                }
                value={
                  formik.values.energy_indicators.total_fuel_energy_consumption
                    .isApproved
                }
                error={formik.errors.energy_indicators}
              />
              {/* {formik.values.energy_indicators.total_fuel_energy_consumption.isApproved?  <Icon color="green" name='checkmark' /> : <Icon color="red" name='close' />} */}
            </Table.Cell>

            <Table.Cell>
              <Button
                icon
                type="button"
                primary
                onClick={() => {
                  openUpdateSite(
                    t("total_fuel_energy_consumption"),
                    `energy_indicators.total_fuel_energy_consumption}`
                  );
                }}
              >
                <Icon name="comment outline" />
              </Button>
              <FileUpload
                accessToken={accessToken}
                data={formik}
                field={"energy_indicators.total_fuel_energy_consumption"}
              />
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>
              <label className="label">
                {
                  formik.values.energy_indicators
                    .total_electrical_energy_consumption.code
                }
              </label>
            </Table.Cell>
            <Table.Cell>
              <label className="label">
                {t("total_electrical_energy_consumption")}
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
                name="energy_indicators.total_electrical_energy_consumption.value"
                value={
                  formik.values.energy_indicators
                    .total_electrical_energy_consumption.value
                }
                error={formik.errors.energy_indicators}
              />
            </Table.Cell>
            <Table.Cell>
              <Form.Dropdown
                placeholder="MhW"
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
                    "energy_indicators.total_electrical_energy_consumption.unit",
                    data.value
                  )
                }
                value={
                  formik.values.energy_indicators
                    .total_electrical_energy_consumption.unit
                }
                error={formik.errors.energy_indicators}
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
                    `energy_indicators.total_electrical_energy_consumption.isApproved`,
                    data.value
                  )
                }
                value={
                  formik.values.energy_indicators
                    .total_electrical_energy_consumption.isApproved
                }
                error={formik.errors.energy_indicators}
              />
              {/* {formik.values.energy_indicators.total_electrical_energy_consumption.isApproved?  <Icon color="green" name='checkmark' /> : <Icon color="red" name='close' />} */}
            </Table.Cell>
            <Table.Cell>
              <Button
                icon
                type="button"
                primary
                onClick={() => {
                  openUpdateSite(
                    t("total_electrical_energy_consumption"),
                    `energy_indicators.total_electrical_energy_consumption}`
                  );
                }}
              >
                <Icon name="comment outline" />
              </Button>
              <FileUpload
                accessToken={accessToken}
                data={formik}
                field={"energy_indicators.total_electrical_energy_consumption"}
              />
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>
              <label className="label">
                {formik.values.energy_indicators.total_energy_consumption.code}
              </label>
            </Table.Cell>
            <Table.Cell>
              <label className="label">{t("total_energy_consumption")}</label>
            </Table.Cell>
            <Table.Cell>
              <Form.Input
                onKeyPress={(event) => {
                  if (!/[0-9]/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
                onChange={formik.handleChange}
                name="energy_indicators.total_energy_consumption.value"
                value={
                  formik.values.energy_indicators.total_energy_consumption.value
                }
                error={formik.errors.energy_indicators}
              />
            </Table.Cell>
            <Table.Cell>
              <Form.Dropdown
                placeholder="MhW"
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
                    "energy_indicators.total_energy_consumption.unit",
                    data.value
                  )
                }
                value={
                  formik.values.energy_indicators.total_energy_consumption.unit
                }
                error={formik.errors.energy_indicators}
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
                    `energy_indicators.total_energy_consumption.isApproved`,
                    data.value
                  )
                }
                value={
                  formik.values.energy_indicators.total_energy_consumption
                    .isApproved
                }
                error={formik.errors.energy_indicators}
              />
            </Table.Cell>
            <Table.Cell>
              <Button
                icon
                type="button"
                primary
                onClick={() => {
                  openUpdateSite(
                    t("total_energy_consumption"),
                    `energy_indicators.total_energy_consumption}`
                  );
                }}
              >
                <Icon name="comment outline" />
              </Button>
              <FileUpload
                accessToken={accessToken}
                data={formik}
                field={"energy_indicators.total_energy_consumption"}
              />
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>
              <label className="label">
                {formik.values.energy_indicators.total_renewable_energy.code}
              </label>
            </Table.Cell>
            <Table.Cell>
              <label className="label">{t("total_renewable_energy")}</label>
            </Table.Cell>
            <Table.Cell>
              <Form.Input
                onKeyPress={(event) => {
                  if (!/[0-9]/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
                onChange={formik.handleChange}
                name="energy_indicators.total_renewable_energy.value"
                value={
                  formik.values.energy_indicators.total_renewable_energy.value
                }
                error={formik.errors.energy_indicators}
              />
            </Table.Cell>
            <Table.Cell>
              <Form.Dropdown
                placeholder="MhW"
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
                    "energy_indicators.total_energy_consumption.unit",
                    data.value
                  )
                }
                value={
                  formik.values.energy_indicators.total_energy_consumption.unit
                }
                error={formik.errors.energy_indicators}
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
                    `energy_indicators.total_renewable_energy.isApproved`,
                    data.value
                  )
                }
                value={
                  formik.values.energy_indicators.total_renewable_energy
                    .isApproved
                }
                error={formik.errors.energy_indicators}
              />
              {/* {formik.values.energy_indicators.total_renewable_energy.isApproved?  <Icon color="green" name='checkmark' /> : <Icon color="red" name='close' />} */}
            </Table.Cell>
            <Table.Cell>
              <Button
                icon
                type="button"
                primary
                onClick={() => {
                  openUpdateSite(
                    t("total_renewable_energy"),
                    `energy_indicators.total_renewable_energy}`
                  );
                }}
              >
                <Icon name="comment outline" />
              </Button>
              <FileUpload
                accessToken={accessToken}
                data={formik}
                field={"energy_indicators.total_renewable_energy"}
              />
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>
              <label className="label">
                {
                  formik.values.energy_indicators.percentage_of_renewable_energy
                    .code
                }
              </label>
            </Table.Cell>
            <Table.Cell>
              <label className="label">
                {t("percentage_of_renewable_energy")}
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
                name="energy_indicators.percentage_of_renewable_energy.value"
                value={
                  formik.values.energy_indicators.percentage_of_renewable_energy
                    .value
                }
                error={formik.errors.energy_indicators}
              />
            </Table.Cell>
            <Table.Cell>
              <Form.Dropdown
                placeholder="%"
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
                    "energy_indicators.percentage_of_renewable_energy.unit",
                    data.value
                  )
                }
                value={
                  formik.values.energy_indicators.percentage_of_renewable_energy
                    .unit
                }
                error={formik.errors.energy_indicators}
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
                    `energy_indicators.percentage_of_renewable_energy.isApproved`,
                    data.value
                  )
                }
                value={
                  formik.values.energy_indicators.percentage_of_renewable_energy
                    .isApproved
                }
                error={formik.errors.energy_indicators}
              />
              {/* {formik.values.energy_indicators.percentage_of_renewable_energy.isApproved?  <Icon color="green" name='checkmark' /> : <Icon color="red" name='close' />} */}
            </Table.Cell>
            <Table.Cell>
              <Button
                icon
                type="button"
                primary
                onClick={() => {
                  openUpdateSite(
                    t("percentage_of_renewable_energy"),
                    `energy_indicators.percentage_of_renewable_energy}`
                  );
                }}
              >
                <Icon name="comment outline" />
              </Button>
              <FileUpload
                accessToken={accessToken}
                data={formik}
                field={"energy_indicators.percentage_of_renewable_energy"}
              />
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>
              <label className="label">
                {
                  formik.values.energy_indicators
                    .percentage_energy_from_fossil_fuels.code
                }
              </label>
            </Table.Cell>
            <Table.Cell>
              <label className="label">
                {t("percentage_energy_from_fossil_fuels")}
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
                name="energy_indicators.percentage_energy_from_fossil_fuels.value"
                value={
                  formik.values.energy_indicators
                    .percentage_energy_from_fossil_fuels.value
                }
                error={formik.errors.energy_indicators}
              />
            </Table.Cell>
            <Table.Cell>
              <Form.Dropdown
                placeholder="mhw/un"
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
                    "energy_indicators.percentage_energy_from_fossil_fuels.unit",
                    data.value
                  )
                }
                value={
                  formik.values.energy_indicators
                    .percentage_energy_from_fossil_fuels.unit
                }
                error={formik.errors.energy_indicators}
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
                    `energy_indicators.percentage_energy_from_fossil_fuels.isApproved`,
                    data.value
                  )
                }
                value={
                  formik.values.energy_indicators
                    .percentage_energy_from_fossil_fuels.isApproved
                }
                error={formik.errors.energy_indicators}
              />
              {/* {formik.values.energy_indicators.percentage_energy_from_fossil_fuels.isApproved?  <Icon color="green" name='checkmark' /> : <Icon color="red" name='close' />} */}
            </Table.Cell>

            <Table.Cell>
              <Button
                icon
                type="button"
                primary
                onClick={() => {
                  openUpdateSite(
                    t("percentage_energy_from_fossil_fuels"),
                    `energy_indicators.percentage_energy_from_fossil_fuels`
                  );
                }}
              >
                <Icon name="comment outline" />
              </Button>
              <FileUpload
                accessToken={accessToken}
                data={formik}
                field={"energy_indicators.percentage_energy_from_fossil_fuels"}
              />
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>
              <label className="label">
                {
                  formik.values.energy_indicators
                    .total_energy_consumed_per_productive_unit.code
                }
              </label>
            </Table.Cell>
            <Table.Cell>
              <label className="label">
                {t("total_energy_consumed_per_productive_unit")}
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
                name="energy_indicators.total_energy_consumed_per_productive_unit.value"
                value={
                  formik.values.energy_indicators
                    .total_energy_consumed_per_productive_unit.value
                }
                error={formik.errors.energy_indicators}
              />
            </Table.Cell>
            <Table.Cell>
              <Form.Dropdown
                placeholder=""
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
                    "energy_indicators.total_energy_consumed_per_productive_unit.unit",
                    data.value
                  )
                }
                value={
                  formik.values.energy_indicators.total_fuel_energy_consumption
                    .unit
                }
                error={formik.errors.energy_indicators}
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
                    `energy_indicators.total_energy_consumed_per_productive_unit.isApproved`,
                    data.value
                  )
                }
                value={
                  formik.values.energy_indicators
                    .total_energy_consumed_per_productive_unit.isApproved
                }
                error={formik.errors.energy_indicators}
              />
              {/* {formik.values.energy_indicators.total_energy_consumed_per_productive_unit.isApproved?  <Icon color="green" name='checkmark' /> : <Icon color="red" name='close' />} */}
            </Table.Cell>

            <Table.Cell>
              <Button
                icon
                type="button"
                primary
                onClick={() => {
                  openUpdateSite(
                    t("total_energy_consumed_per_productive_unit"),
                    `energy_indicators.total_energy_consumed_per_productive_unit`
                  );
                }}
              >
                <Icon name="comment outline" />
              </Button>
              <FileUpload
                accessToken={accessToken}
                data={formik}
                field={
                  "energy_indicators.total_energy_consumed_per_productive_unit"
                }
              />
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>
              <label className="label">
                {
                  formik.values.energy_indicators.total_cost_of_energy_consumed
                    .code
                }
              </label>
            </Table.Cell>
            <Table.Cell>
              <label className="label">
                {t("total_cost_of_energy_consumed")}
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
                name="energy_indicators.total_cost_of_energy_consumed.value"
                value={
                  formik.values.energy_indicators.total_cost_of_energy_consumed
                    .value
                }
                error={formik.errors.energy_indicators}
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
                    "energy_indicators.total_cost_of_energy_consumed.unit",
                    data.value
                  )
                }
                value={
                  formik.values.energy_indicators.total_cost_of_energy_consumed
                    .unit
                }
                error={formik.errors.energy_indicators}
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
                    `energy_indicators.total_cost_of_energy_consumed.isApproved`,
                    data.value
                  )
                }
                value={
                  formik.values.energy_indicators.total_cost_of_energy_consumed
                    .isApproved
                }
                error={formik.errors.energy_indicators}
              />
              {/* {formik.values.energy_indicators.total_cost_of_energy_consumed.isApproved?  <Icon color="green" name='checkmark' /> : <Icon color="red" name='close' />} */}
            </Table.Cell>

            <Table.Cell>
              <Button
                icon
                type="button"
                primary
                onClick={() => {
                  openUpdateSite(
                    t("total_cost_of_energy_consumed"),
                    `energy_indicators.total_cost_of_energy_consumed`
                  );
                }}
              >
                <Icon name="comment outline" />
              </Button>
              <FileUpload
                accessToken={accessToken}
                data={formik}
                field={"energy_indicators.total_cost_of_energy_consumed"}
              />
            </Table.Cell>
          </Table.Row>
          {/* INDICADOR DE GASES DE EFECTO INVERNADERO GEI */}

          <Table.Row>
            <Table.Cell>
              <label className="label">
                {formik.values.greenhouse_gas_indicators.total_scope_1.code}
              </label>
            </Table.Cell>
            <Table.Cell>
              <label className="label">{t("total_scope_1")}</label>
            </Table.Cell>
            <Table.Cell>
              <Form.Input
                onKeyPress={(event) => {
                  if (!/[0-9]/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
                onChange={formik.handleChange}
                name="greenhouse_gas_indicators.total_scope_1.value"
                value={
                  formik.values.greenhouse_gas_indicators.total_scope_1.value
                }
                error={formik.errors.greenhouse_gas_indicators}
              />
            </Table.Cell>
            <Table.Cell>
              <Form.Dropdown
                placeholder=" GEI "
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
                    "greenhouse_gas_indicators.total_scope_1.unit",
                    data.value
                  )
                }
                value={
                  formik.values.greenhouse_gas_indicators.total_scope_1.unit
                }
                error={formik.errors.greenhouse_gas_indicators}
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
                    `energy_indicators.total_cost_of_energy_consumed.isApproved`,
                    data.value
                  )
                }
                value={
                  formik.values.energy_indicators.total_cost_of_energy_consumed
                    .isApproved
                }
                error={formik.errors.energy_indicators}
              />
              {/* {formik.values.energy_indicators.total_cost_of_energy_consumed.isApproved?  <Icon color="green" name='checkmark' /> : <Icon color="red" name='close' />} */}
            </Table.Cell>

            <Table.Cell>
              <Button
                icon
                type="button"
                primary
                onClick={() => {
                  openUpdateSite(
                    t("total_scope_1"),
                    `greenhouse_gas_indicators.total_scope_1}`
                  );
                }}
              >
                <Icon name="comment outline" />
              </Button>
              <FileUpload
                accessToken={accessToken}
                data={formik}
                field={"greenhouse_gas_indicators.total_scope_1"}
              />
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>
              <label className="label">
                {formik.values.greenhouse_gas_indicators.total_scope_2.code}
              </label>
            </Table.Cell>
            <Table.Cell>
              <label className="label">{t("total_scope_2")}</label>
            </Table.Cell>
            <Table.Cell>
              <Form.Input
                onKeyPress={(event) => {
                  if (!/[0-9]/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
                onChange={formik.handleChange}
                name="greenhouse_gas_indicators.total_scope_2.value"
                value={
                  formik.values.greenhouse_gas_indicators.total_scope_2.value
                }
                error={formik.errors.greenhouse_gas_indicators}
              />
            </Table.Cell>
            <Table.Cell>
              <Form.Dropdown
                placeholder="GEI"
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
                    "greenhouse_gas_indicators.total_scope_2.unit",
                    data.value
                  )
                }
                value={
                  formik.values.greenhouse_gas_indicators.total_scope_2.unit
                }
                error={formik.errors.greenhouse_gas_indicators}
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
                    `greenhouse_gas_indicators.total_scope_2.isApproved`,
                    data.value
                  )
                }
                value={
                  formik.values.greenhouse_gas_indicators.total_scope_2
                    .isApproved
                }
                error={formik.errors.greenhouse_gas_indicators}
              />
              {/* {formik.values.greenhouse_gas_indicators.total_scope_1.isApproved?  <Icon color="green" name='checkmark' /> : <Icon color="red" name='close' />} */}
            </Table.Cell>
            <Table.Cell>
              <Button
                icon
                type="button"
                primary
                onClick={() => {
                  openUpdateSite(
                    t("total_scope_2"),
                    `greenhouse_gas_indicators.total_scope_2}`
                  );
                }}
              >
                <Icon name="comment outline" />
              </Button>
              <FileUpload
                accessToken={accessToken}
                data={formik}
                field={"greenhouse_gas_indicators.total_scope_2"}
              />
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>
              <label className="label">
                {formik.values.greenhouse_gas_indicators.total_scope_3.code}
              </label>
            </Table.Cell>
            <Table.Cell>
              <label className="label">{t("total_scope_3")}</label>
            </Table.Cell>
            <Table.Cell>
              <Form.Input
                onKeyPress={(event) => {
                  if (!/[0-9]/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
                onChange={formik.handleChange}
                name="greenhouse_gas_indicators.total_scope_3.value"
                value={
                  formik.values.greenhouse_gas_indicators.total_scope_3.value
                }
                error={formik.errors.greenhouse_gas_indicators}
              />
            </Table.Cell>
            <Table.Cell>
              <Form.Dropdown
                placeholder="GEI"
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
                    "greenhouse_gas_indicators.total_scope_3.unit",
                    data.value
                  )
                }
                value={
                  formik.values.greenhouse_gas_indicators.total_scope_3.unit
                }
                error={formik.errors.greenhouse_gas_indicators}
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
                    `greenhouse_gas_indicators.total_scope_3.isApproved`,
                    data.value
                  )
                }
                value={
                  formik.values.greenhouse_gas_indicators.total_scope_3
                    .isApproved
                }
                error={formik.errors.greenhouse_gas_indicators}
              />
              {/* {formik.values.greenhouse_gas_indicators.total_scope_3.isApproved?  <Icon color="green" name='checkmark' /> : <Icon color="red" name='close' />} */}
            </Table.Cell>
            <Table.Cell>
              <Button
                icon
                type="button"
                primary
                onClick={() => {
                  openUpdateSite(
                    t("total_scope_3"),
                    `greenhouse_gas_indicators.total_scope_3}`
                  );
                }}
              >
                <Icon name="comment outline" />
              </Button>
              <FileUpload
                accessToken={accessToken}
                data={formik}
                field={"greenhouse_gas_indicators.total_scope_3"}
              />
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>
              <label className="label">
                {
                  formik.values.greenhouse_gas_indicators
                    .total_emissions_per_unit_produced.code
                }
              </label>
            </Table.Cell>
            <Table.Cell>
              <label className="label">
                {t("total_emissions_per_unit_produced")}
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
                name="greenhouse_gas_indicators.total_emissions_per_unit_produced.value"
                value={
                  formik.values.greenhouse_gas_indicators
                    .total_emissions_per_unit_produced.value
                }
                error={formik.errors.greenhouse_gas_indicators}
              />
            </Table.Cell>
            <Table.Cell>
              <Form.Dropdown
                placeholder="GEI"
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
                    "greenhouse_gas_indicators.total_emissions_per_unit_produced.unit",
                    data.value
                  )
                }
                value={
                  formik.values.greenhouse_gas_indicators
                    .total_emissions_per_unit_produced.unit
                }
                error={formik.errors.greenhouse_gas_indicators}
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
                    `greenhouse_gas_indicators.total_emissions_per_unit_produced.isApproved`,
                    data.value
                  )
                }
                value={
                  formik.values.greenhouse_gas_indicators
                    .total_emissions_per_unit_produced.isApproved
                }
                error={formik.errors.greenhouse_gas_indicators}
              />
              {/* {formik.values.greenhouse_gas_indicators.total_scope_3.isApproved?  <Icon color="green" name='checkmark' /> : <Icon color="red" name='close' />} */}
            </Table.Cell>
            <Table.Cell>
              <Button
                icon
                type="button"
                primary
                onClick={() => {
                  openUpdateSite(
                    t("total_emissions_per_unit_produced"),
                    `greenhouse_gas_indicators.total_emissions_per_unit_produced}`
                  );
                }}
              >
                <Icon name="comment outline" />
              </Button>
              <FileUpload
                accessToken={accessToken}
                data={formik}
                field={
                  "greenhouse_gas_indicators.total_emissions_per_unit_produced"
                }
              />
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>
              <label className="label">
                {formik.values.greenhouse_gas_indicators.total_emissions.code}
              </label>
            </Table.Cell>
            <Table.Cell>
              <label className="label">{t("total_emissions")}</label>
            </Table.Cell>
            <Table.Cell>
              <Form.Input
                onKeyPress={(event) => {
                  if (!/[0-9]/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
                onChange={formik.handleChange}
                name="greenhouse_gas_indicators.total_emissions.value"
                value={
                  formik.values.greenhouse_gas_indicators.total_emissions.value
                }
                error={formik.errors.greenhouse_gas_indicators}
              />
            </Table.Cell>
            <Table.Cell>
              <Form.Dropdown
                placeholder="GEI"
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
                    "greenhouse_gas_indicators.total_emissions.unit",
                    data.value
                  )
                }
                value={
                  formik.values.greenhouse_gas_indicators.total_emissions.unit
                }
                error={formik.errors.greenhouse_gas_indicators}
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
                    `greenhouse_gas_indicators.total_emissions.isApproved`,
                    data.value
                  )
                }
                value={
                  formik.values.greenhouse_gas_indicators.total_emissions
                    .isApproved
                }
                error={formik.errors.greenhouse_gas_indicators}
              />
              {/* {formik.values.greenhouse_gas_indicators.total_emissions.isApproved?  <Icon color="green" name='checkmark' /> : <Icon color="red" name='close' />} */}
            </Table.Cell>
            <Table.Cell>
              <Button
                icon
                type="button"
                primary
                onClick={() => {
                  openUpdateSite(
                    t("total_emissions"),
                    `greenhouse_gas_indicators.total_emissions}`
                  );
                }}
              >
                <Icon name="comment outline" />
              </Button>
              <FileUpload
                accessToken={accessToken}
                data={formik}
                field={"greenhouse_gas_indicators.total_emissions"}
              />
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>
              <label className="label">
                {
                  formik.values.greenhouse_gas_indicators.scope_percentage_1
                    .code
                }
              </label>
            </Table.Cell>
            <Table.Cell>
              <label className="label">{t("scope_percentage_1")}</label>
            </Table.Cell>
            <Table.Cell>
              <Form.Input
                onKeyPress={(event) => {
                  if (!/[0-9]/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
                onChange={formik.handleChange}
                name="greenhouse_gas_indicators.scope_percentage_1.value"
                value={
                  formik.values.greenhouse_gas_indicators.scope_percentage_1
                    .value
                }
                error={formik.errors.greenhouse_gas_indicators}
              />
            </Table.Cell>
            <Table.Cell>
              <Form.Dropdown
                placeholder=" % "
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
                    "greenhouse_gas_indicators.scope_percentage_1.unit",
                    data.value
                  )
                }
                value={
                  formik.values.greenhouse_gas_indicators.scope_percentage_1
                    .unit
                }
                error={formik.errors.greenhouse_gas_indicators}
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
                    `greenhouse_gas_indicators.scope_percentage_1.isApproved`,
                    data.value
                  )
                }
                value={
                  formik.values.greenhouse_gas_indicators.scope_percentage_1
                    .isApproved
                }
                error={formik.errors.greenhouse_gas_indicators}
              />
              {/* {formik.values.greenhouse_gas_indicators.scope_percentage_1.isApproved?  <Icon color="green" name='checkmark' /> : <Icon color="red" name='close' />} */}
            </Table.Cell>
            <Table.Cell>
              <Button
                icon
                type="button"
                primary
                onClick={() => {
                  openUpdateSite(
                    t("scope_percentage_1"),
                    `greenhouse_gas_indicators.scope_percentage_1}`
                  );
                }}
              >
                <Icon name="comment outline" />
              </Button>
              <FileUpload
                accessToken={accessToken}
                data={formik}
                field={"greenhouse_gas_indicators.scope_percentage_1"}
              />
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>
              <label className="label">
                {
                  formik.values.greenhouse_gas_indicators.scope_percentage_2
                    .code
                }
              </label>
            </Table.Cell>
            <Table.Cell>
              <label className="label">{t("scope_percentage_2")}</label>
            </Table.Cell>
            <Table.Cell>
              <Form.Input
                onKeyPress={(event) => {
                  if (!/[0-9]/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
                onChange={formik.handleChange}
                name="greenhouse_gas_indicators.scope_percentage_2.value"
                value={
                  formik.values.greenhouse_gas_indicators.scope_percentage_2
                    .value
                }
                error={formik.errors.greenhouse_gas_indicators}
              />
            </Table.Cell>
            <Table.Cell>
              <Form.Dropdown
                placeholder="%"
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
                    "greenhouse_gas_indicators.scope_percentage_2.unit",
                    data.value
                  )
                }
                value={
                  formik.values.greenhouse_gas_indicators.scope_percentage_2
                    .unit
                }
                error={formik.errors.greenhouse_gas_indicators}
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
                    `greenhouse_gas_indicators.scope_percentage_2.isApproved`,
                    data.value
                  )
                }
                value={
                  formik.values.greenhouse_gas_indicators.scope_percentage_2
                    .isApproved
                }
                error={formik.errors.greenhouse_gas_indicators}
              />
              {/* {formik.values.greenhouse_gas_indicators.scope_percentage_2.isApproved?  <Icon color="green" name='checkmark' /> : <Icon color="red" name='close' />} */}
            </Table.Cell>
            <Table.Cell>
              <Button
                icon
                type="button"
                primary
                onClick={() => {
                  openUpdateSite(
                    t("scope_percentage_2"),
                    `greenhouse_gas_indicators.scope_percentage_2}`
                  );
                }}
              >
                <Icon name="comment outline" />
              </Button>
              <FileUpload
                accessToken={accessToken}
                data={formik}
                field={"greenhouse_gas_indicators.scope_percentage_2"}
              />
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>
              <label className="label">
                {
                  formik.values.greenhouse_gas_indicators.scope_percentage_3
                    .code
                }
              </label>
            </Table.Cell>
            <Table.Cell>
              <label className="label">{t("scope_percentage_3")}</label>
            </Table.Cell>
            <Table.Cell>
              <Form.Input
                onKeyPress={(event) => {
                  if (!/[0-9]/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
                onChange={formik.handleChange}
                name="greenhouse_gas_indicators.scope_percentage_3.value"
                value={
                  formik.values.greenhouse_gas_indicators.scope_percentage_3
                    .value
                }
                error={formik.errors.greenhouse_gas_indicators}
              />
            </Table.Cell>
            <Table.Cell>
              <Form.Dropdown
                placeholder="%"
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
                    "greenhouse_gas_indicators.scope_percentage_3.unit",
                    data.value
                  )
                }
                value={
                  formik.values.greenhouse_gas_indicators.scope_percentage_3
                    .unit
                }
                error={formik.errors.greenhouse_gas_indicators}
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
                    `greenhouse_gas_indicators.scope_percentage_3.isApproved`,
                    data.value
                  )
                }
                value={
                  formik.values.greenhouse_gas_indicators.scope_percentage_3
                    .isApproved
                }
                error={formik.errors.greenhouse_gas_indicators}
              />
              {/* {formik.values.greenhouse_gas_indicators.scope_percentage_2.isApproved?  <Icon color="green" name='checkmark' /> : <Icon color="red" name='close' />} */}
            </Table.Cell>
            <Table.Cell>
              <Button
                icon
                type="button"
                primary
                onClick={() => {
                  openUpdateSite(
                    t("scope_percentage_3"),
                    `greenhouse_gas_indicators.scope_percentage_3}`
                  );
                }}
              >
                <Icon name="comment outline" />
              </Button>
              <FileUpload
                accessToken={accessToken}
                data={formik}
                field={"greenhouse_gas_indicators.scope_percentage_3"}
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
          kpisForm={kpisForm}
          user={user}
          t={t}
        />
      </BasicModal>
      <Form.Group widths="2">
        <Form.Button type="submit" fluid primary loading={formik.isSubmitting}>
          {!kpisForm ? t("save") : t("update")}
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

function FileUpload(props) {
  const { accessToken, data, field } = props;
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [message, setMessage] = useState("");

  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "application/pdf",
    //'application/vnd.ms-excel', // .xls
    //'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' // .xlsx
  ];

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

  useEffect(() => {
    const value = getValueByKey(data.values, field);
    if (value && value.file !== null) {
      setFileName(value.file);
    }
  }, [field]);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];

    if (file) {
      if (!allowedTypes.includes(file.type)) {
        console.log("Tipo de archivo no permitido. Debe ser JPG, PNG o PDF.");
      } else {
        setMessage(`Archivo seleccionado: ${file.name}`);

        const formData = new FormData();
        formData.append("file", file);

        try {
          const response = await kpisFormController.uploadFileApi(
            accessToken,
            formData
          );
          setMessage(response.msg);
          if (response.status && response.status === 200) {
            setFile(file);
            setFileName(file.name);
            data.setFieldValue(`${field}.file`, file.name);
          }
        } catch (error) {
          setMessage("Error al subir el archivo");
        }
      }
    }
  };

  const handleButtonClick = (event) => {
    event.preventDefault(); // Evita que el formulario se envíe
    const input = document.createElement("input");
    input.type = "file";
    input.onchange = handleFileChange;
    input.click();
  };

  const handleRemoveFile = async () => {
    setFile(null); // Elimina el archivo
    setFileName(null);
    try {
      const response = await kpisFormController.deleteFileApi(
        accessToken,
        fileName
      );
      setMessage(response.message);
      removeFile();
    } catch (error) {
      setMessage("Error al elimianr el archivo");
    }
  };

  const removeFile = async () => {
    data.setFieldValue(`${field}.file`, null);
  };

  return (
    <>
      {fileName ? (
        <>
          {/* <p>{file.name}</p> */}
          <FileViewer fileName={fileName} handleRemove={handleRemoveFile} />
        </>
      ) : (
        <Button icon onClick={handleButtonClick}>
          <Icon name="paperclip" />
        </Button>
      )}
    </>
  );
}

function FileViewer(props) {
  const { fileName, handleRemove, t } = props;
  const [fileUrl, setFileUrl] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    if (fileName) {
      setFileUrl(fileName); // Construye la URL del archivo
      (async () => {
        try {
          const response = await kpisFormController.getFileApi(fileName);
          setFileUrl(response); // Construye la URL del archivo
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
      {/* //<Button onClick={handleOpenPreview}> {fileName}</Button> */}

      <Modal
        onClose={handleClosePreview}
        onOpen={handleOpenPreview}
        open={previewOpen}
        trigger={
          <Button primary icon>
            <Icon name="file alternate" />
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
          <Button color="red" onClick={handleRemove}>
            <Icon disabled name="trash alternate" /> {t("delete")}
          </Button>
          <Button color="black" onClick={handleClosePreview}>
            <Icon disabled name="close" />
            {t("close")}
          </Button>
        </ModalActions>
      </Modal>
    </>
  );
}
