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
  ModalActions,
  ModalContent,
  ModalHeader,
  Segment,
  Divider,
  Header,
  List,
  Message,
} from "semantic-ui-react";
import { useDropzone } from "react-dropzone";
import { useFormik, Field, FieldArray, FormikProvider, getIn } from "formik";
import { Effluentform } from "../../../../api";
import { useAuth } from "../../../../hooks";
import { ENV } from "../../../../utils";
import {
  formatDateView,
  formatDateHourCompleted,
} from "../../../../utils/formatDate";
import { BasicModal } from "../../../Shared";
import { initialValues, validationSchema } from "./EffluentForm.form";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { decrypt, encrypt } from "../../../../utils/cryptoUtils";
import { PERIODS } from "../../../../utils";
import {
  convertEffluentFieldsEngToEsp,
  convertPeriodsEngToEsp,
} from "../../../../utils/converts";
import "./EffluentForm.scss";
import { useLanguage } from "../../../../contexts";

const effluentFormController = new Effluentform();

export function EffluentForm(props) {
  const { onClose, onReload, effluentForm, siteSelected, year, period } = props;
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
    setTitleModal(`${t("comments")}  ${data}`);
    onOpenCloseModal();
  };

  const formik = useFormik({
    initialValues: initialValues(effluentForm, period, year),
    validationSchema: validationSchema(),
    validateOnChange: false,
    onSubmit: async (formValue) => {
      try {
        if (!effluentForm) {
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
            //   if (!effluentForm) {
            //     //const siteData = decrypt(siteSelected);
            //     //formValue.site = siteData;
            //     formValue.site = siteSelected;
            //   }
            // }
          }
          await effluentFormController.createEffluentForm(
            accessToken,
            formValue
          );
          //console.log(formValue);
        } else {
          await effluentFormController.updateEffluentForm(
            accessToken,
            effluentForm._id,
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
    navigate(`/admin/data/effluentforms`, {
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
          await effluentFormController.getPeriodsEffluentFormsBySiteAndYear(
            accessToken,
            siteSelected,
            formik.values.year
          );
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
    <Form className="effluent-form" onSubmit={formik.handleSubmit}>
      {effluentForm ? (
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
      {!effluentForm ? (
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
                      text: convertPeriodsEngToEsp(period),
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
                {formik.values.total_domestic_effluents.code}{" "}
              </label>
            </Table.Cell>
            <Table.Cell>
              <label className="label">
                {" "}
                {convertEffluentFieldsEngToEsp("total_domestic_effluents")}
              </label>
            </Table.Cell>
            <Table.Cell>
              <Form.Input
                onKeyPress={(event) => {
                  if (!/[0-9]/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
                name="total_domestic_effluents.value"
                onChange={formik.handleChange}
                // onChange={(e, { name, value })=>
                //   formik.setFieldValue("total_domestic_effluents", value)
                // }
                value={formik.values.total_domestic_effluents.value}
                error={formik.errors.total_domestic_effluents}
              />
            </Table.Cell>
            <Table.Cell>
              <Form.Dropdown
                placeholder="m3"
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
                    "total_domestic_effluents.unit",
                    data.value
                  )
                }
                value={formik.values.total_domestic_effluents.unit}
                error={formik.errors.total_domestic_effluents}
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
                    "total_domestic_effluents.isApproved",
                    data.value
                  )
                }
                value={formik.values.total_domestic_effluents.isApproved}
                error={formik.errors.total_domestic_effluents}
              />
              {/* {formik.values.installation_type.isApproved?  <Icon color="green" name='checkmark' /> : <Icon color="red" name='close' />} */}
            </Table.Cell>
            <Table.Cell>
              <Button
                icon
                type="button"
                primary
                onClick={() => {
                  openUpdateSite(
                    convertEffluentFieldsEngToEsp("total_domestic_effluents"),
                    "total_domestic_effluents"
                  );
                }}
              >
                <Icon name="comment outline" />
              </Button>
              <FileUpload
                accessToken={accessToken}
                data={formik}
                field={"total_domestic_effluents"}
                newFiles={newFiles}
                setNewFiles={setNewFiles}
                t={t}
              />
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>
              <label className="label">
                {formik.values.total_industrial_effluents.code}{" "}
              </label>
            </Table.Cell>
            <Table.Cell>
              <label className="label">
                {convertEffluentFieldsEngToEsp("total_industrial_effluents")}
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
                name="total_industrial_effluents.value"
                value={formik.values.total_industrial_effluents.value}
                error={formik.errors.total_industrial_effluents}
              />
            </Table.Cell>
            <Table.Cell>
              <Form.Dropdown
                placeholder="m3"
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
                    "total_industrial_effluents.isApproved",
                    data.value
                  )
                }
                value={formik.values.total_industrial_effluents.isApproved}
                error={formik.errors.total_industrial_effluents}
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
                    "total_industrial_effluents.isApproved",
                    data.value
                  )
                }
                value={formik.values.total_industrial_effluents.isApproved}
                error={formik.errors.total_industrial_effluents}
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
                    convertEffluentFieldsEngToEsp("total_industrial_effluents"),
                    "total_industrial_effluents"
                  );
                }}
              >
                <Icon name="comment outline" />
              </Button>
              <FileUpload
                accessToken={accessToken}
                data={formik}
                field={"total_industrial_effluents"}
                newFiles={newFiles}
                setNewFiles={setNewFiles}
                t={t}
              />
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>
              <label className="label">
                {formik.values.sludge_mud_sent_for_disposal_landfill.code}{" "}
              </label>
            </Table.Cell>

            <Table.Cell>
              <label className="label">
                {convertEffluentFieldsEngToEsp(
                  "sludge_mud_sent_for_disposal_landfill"
                )}
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
                name="sludge_mud_sent_for_disposal_landfill.value"
                value={
                  formik.values.sludge_mud_sent_for_disposal_landfill.value
                }
                error={formik.errors.sludge_mud_sent_for_disposal_landfill}
              />
            </Table.Cell>
            <Table.Cell>
              <Form.Dropdown
                placeholder="m3"
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
                    "sludge_mud_sent_for_disposal_landfill.unit",
                    data.value
                  )
                }
                value={formik.values.sludge_mud_sent_for_disposal_landfill.unit}
                error={formik.errors.sludge_mud_sent_for_disposal_landfill}
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
                    "sludge_mud_sent_for_disposal_landfill.isApproved",
                    data.value
                  )
                }
                value={
                  formik.values.sludge_mud_sent_for_disposal_landfill.isApproved
                }
                error={formik.errors.sludge_mud_sent_for_disposal_landfill}
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
                    convertEffluentFieldsEngToEsp(
                      "sludge_mud_sent_for_disposal_landfill"
                    ),
                    "sludge_mud_sent_for_disposal_landfill"
                  );
                }}
              >
                <Icon name="comment outline" />
              </Button>
              <FileUpload
                accessToken={accessToken}
                data={formik}
                field={"sludge_mud_sent_for_disposal_landfill"}
                newFiles={newFiles}
                setNewFiles={setNewFiles}
                t={t}
              />
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>
              <label className="label">
                {formik.values.total_effluents_per_unit_produced.code}{" "}
              </label>
            </Table.Cell>
            <Table.Cell>
              <label className="label">
                {convertEffluentFieldsEngToEsp(
                  "total_effluents_per_unit_produced"
                )}
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
                name="total_effluents_per_unit_produced.value"
                value={formik.values.total_effluents_per_unit_produced.value}
                error={formik.errors.total_effluents_per_unit_produced}
              />
            </Table.Cell>
            <Table.Cell>
              <Form.Dropdown
                placeholder="m3/un"
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
                    "total_effluents_per_unit_produced.unit",
                    data.value
                  )
                }
                value={formik.values.total_effluents_per_unit_produced.unit}
                error={formik.errors.total_effluents_per_unit_produced}
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
                    "total_effluents_per_unit_produced.isApproved",
                    data.value
                  )
                }
                value={
                  formik.values.total_effluents_per_unit_produced.isApproved
                }
                error={formik.errors.total_effluents_per_unit_produced}
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
                    convertEffluentFieldsEngToEsp(
                      "total_effluents_per_unit_produced"
                    ),
                    "total_effluents_per_unit_produced"
                  );
                }}
              >
                <Icon name="comment outline" />
              </Button>
              <FileUpload
                accessToken={accessToken}
                data={formik}
                field={"total_effluents_per_unit_produced"}
                newFiles={newFiles}
                setNewFiles={setNewFiles}
                t={t}
              />
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>
              <label className="label">
                {formik.values.percentage_domestic_effluents.code}{" "}
              </label>
            </Table.Cell>
            <Table.Cell>
              <label className="label">
                {convertEffluentFieldsEngToEsp("percentage_domestic_effluents")}
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
                name="percentage_domestic_effluents.value"
                value={formik.values.percentage_domestic_effluents.value}
                error={formik.errors.percentage_domestic_effluents}
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
                    "percentage_domestic_effluents.unit",
                    data.value
                  )
                }
                value={formik.values.percentage_domestic_effluents.unit}
                error={formik.errors.percentage_domestic_effluents}
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
                    "percentage_domestic_effluents.isApproved",
                    data.value
                  )
                }
                value={formik.values.percentage_domestic_effluents.isApproved}
                error={formik.errors.percentage_domestic_effluents}
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
                    convertEffluentFieldsEngToEsp(
                      "percentage_domestic_effluents"
                    ),
                    "percentage_domestic_effluents"
                  );
                }}
              >
                <Icon name="comment outline" />
              </Button>
              <FileUpload
                accessToken={accessToken}
                data={formik}
                field={"percentage_domestic_effluents"}
                newFiles={newFiles}
                setNewFiles={setNewFiles}
                t={t}
              />
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>
              <label className="label">
                {formik.values.percentage_industrial_effluents.code}{" "}
              </label>
            </Table.Cell>
            <Table.Cell>
              <label className="label">
                {convertEffluentFieldsEngToEsp(
                  "percentage_industrial_effluents"
                )}
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
                name="percentage_industrial_effluents.value"
                value={formik.values.percentage_industrial_effluents.value}
                error={formik.errors.percentage_industrial_effluents}
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
                    "percentage_industrial_effluents.unit",
                    data.value
                  )
                }
                value={formik.values.percentage_industrial_effluents.unit}
                error={formik.errors.percentage_industrial_effluents}
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
                    "percentage_industrial_effluents.isApproved",
                    data.value
                  )
                }
                value={formik.values.percentage_industrial_effluents.isApproved}
                error={formik.errors.percentage_industrial_effluents}
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
                    convertEffluentFieldsEngToEsp(
                      "percentage_industrial_effluents"
                    ),
                    "percentage_industrial_effluents"
                  );
                }}
              >
                <Icon name="comment outline" />
              </Button>
              <FileUpload
                accessToken={accessToken}
                data={formik}
                field={"percentage_industrial_effluents"}
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
          effluentForm={effluentForm}
          user={user}
          t={t}
        />
      </BasicModal>
      <Form.Group widths="2">
        <Form.Button type="submit" fluid primary loading={formik.isSubmitting}>
          {!effluentForm ? t("save") : t("update")}
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

function FileViewer(props) {
  const { fileName, fileUniqueName, handleRemove, t } = props;
  const [fileUrl, setFileUrl] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    if (fileName) {
      setFileUrl(fileName); // Construye la URL del archivo
      (async () => {
        try {
          const response = await effluentFormController.getFileApi(
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
      const response = await effluentFormController.deleteFileApi(
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
