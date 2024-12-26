import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  Loader,
  Table,
  Divider,
  Dropdown,
  Confirm,
  Segment,
} from "semantic-ui-react";
import { size, map } from "lodash";
import { Effluentform } from "../../../../api";
import { useAuth } from "../../../../hooks";
import {
  hasPermission,
  isAdmin,
  isMaster,
} from "../../../../utils/checkPermission";
import "./ListEffluentForms.scss";
import { EffluentForm } from "../EffluentForm";
import { BasicModal } from "../../../Shared";
import { PERIODS } from "../../../../utils";
import { effluentCodes } from "../../../../utils/codes";
import { formatDateView } from "../../../../utils/formatDate";
import { useLanguage } from "../../../../contexts";
const _ = require("lodash");

const effluentFormController = new Effluentform();

export function ListEffluentForms(props) {
  const { reload, onReload, siteSelected, yearSelected } = props;
  const [effluentForms, setEffluentForms] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState();
  // const [Role, setRole] = useState(null);
  const {
    user: { role, site },
    accessToken,
  } = useAuth();

  useEffect(() => {
    (async () => {
      if (yearSelected !== "" && siteSelected !== undefined)
        try {
          const response =
            await effluentFormController.getEffluentFormsBySiteAndYear(
              accessToken,
              siteSelected,
              yearSelected
            );
          if (response.code === 200) {
            setEffluentForms(response.effluentForms);
          } else {
            setEffluentForms([]);
          }
        } catch (error) {
          console.error(error);
        }
    })();
  }, [yearSelected, siteSelected, reload]);

  if (!effluentForms) return <Loader active inline="centered" />;
  //if (size(effluentForms) === 0) return "No hay ningun formulario de efluentes";
  //  if (size(effluentForms) === 0) return <TablePeriods data2={effluentForms}/>;

  return (
    <div className="list-effluent-forms">
      <TablePeriods
        data={effluentForms}
        onReload={onReload}
        accessToken={accessToken}
        year={yearSelected}
        site={siteSelected}
      />
    </div>
  );
}

function TablePeriods(props) {
  const { data, onReload, accessToken, year, site } = props;

  const [showModal, setShowModal] = useState(false);
  const [titleModal, setTitleModal] = useState("");
  const [modalContent, setModalContent] = useState("");
  const [confirmContent, setConfirmContent] = useState("");
  const [dataDeleted, setDataDelete] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const handleConfirm = (e) => setDataDelete(e);

  const { translations } = useLanguage();

  const t = (key) => translations[key] || key; // Función para obtener la traducción

  // Estado para controlar el modal
  const [selectedPeriod, setSelectedPeriod] = useState(null);

  const onOpenCloseModal = () => setShowModal((prevState) => !prevState);
  const onOpenCloseConfirm = () => setShowConfirm((prevState) => !prevState);

  // Función para abrir el modal con datos del período seleccionado
  const handleOpenModal = (period) => {
    setSelectedPeriod(data.find((item) => item.period === period));
    //setModalOpen(true);
    onOpenCloseModal();
  };

  // Función para cerrar el modal
  const handleDeleteModal = (period) => {
    const form = data.find((item) => item.period === period);
    setConfirmContent(
      `${t("delete_dated_effluent_form")} ${formatDateView(form.date)}`
    );
    setDataDelete(form);
    onOpenCloseConfirm();
  };

  const openUpdateEffluentForm = (period) => {
    //setFieldName(name);
    const form = data.find((item) => item.period === period);
    setTitleModal(
      `${t("update")} ${t("effluent_form")}: ${t(form.period)}-${form.year}`
    );
    setModalContent(
      <EffluentForm
        onClose={onOpenCloseModal}
        onReload={onReload}
        effluentForm={form}
      />
    );
    setShowModal(true);
  };

  const openNewEffluentForm = (period) => {
    setTitleModal(t("new_effluent_form"));
    setModalContent(
      <EffluentForm
        onClose={onOpenCloseModal}
        onReload={onReload}
        period={period}
        year={year}
        siteSelected={site}
      />
    );
    setShowModal(true);
  };

  const onDelete = async () => {
    try {
      //TODO: modificar por controlador correspondiente
      await effluentFormController.deleteEffluentForm(
        accessToken,
        dataDeleted._id
      );
      setDataDelete("");
      onReload();
      onOpenCloseConfirm();
    } catch (error) {
      console.error(error);
    }
  };

  // Obtén los nombres de los períodos para las columnas
  const periods = PERIODS;

  // Determinar los campos únicos y si tienen código
  const determineFields = () => {
    const fields = new Set();

    Object.keys(effluentCodes).forEach((key) => {
      fields.add(key);
    });

    return Array.from(fields);
  };

  // Retorna el código
  const hasCode = (field) => {
    return effluentCodes[field];
  };

  const hasDataPeriod = (period) => {
    const existsPeriod = data.some((entry) => entry.period === period);
    return existsPeriod;
  };

  // Obtener todos los campos únicos
  const uniqueFields = determineFields();

  const calculateTotalAndAverage = (field) => {
    const values = data.map((item) => item[field]?.value || 0);
    const total = values.reduce((acc, val) => acc + val, 0);
    const average = values.length ? total / values.length : 0;
    return { total, average };
  };

  return (
    <>
      <Table celled structured>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell rowSpan="2" textAlign="center">
              {t("code")}
            </Table.HeaderCell>
            <Table.HeaderCell rowSpan="2" textAlign="center">
              {t("concept")}
            </Table.HeaderCell>
            <Table.HeaderCell rowSpan="2" textAlign="center">
              {t("units")}
            </Table.HeaderCell>
            <Table.HeaderCell colSpan="14" textAlign="center">
              {t("report_period")} {year}
            </Table.HeaderCell>
          </Table.Row>
          <Table.Row>
            {periods.map((period, index) => (
              <Table.HeaderCell key={index}>
                {t(period)}
                {hasDataPeriod(period) ? (
                  <>
                    <Dropdown
                      inline
                      size="tiny"
                      icon="ellipsis vertical"
                      floating
                      className="icon"
                    >
                      <Dropdown.Menu>
                        <Dropdown.Item
                          text={t("edit")}
                          icon="edit"
                          onClick={() => openUpdateEffluentForm(period)}
                        />
                        <Dropdown.Item
                          text={t("delete")}
                          icon="trash"
                          onClick={() => handleDeleteModal(period)}
                        />
                      </Dropdown.Menu>
                    </Dropdown>
                  </>
                ) : (
                  <>
                    <Dropdown
                      link
                      icon="ellipsis vertical"
                      floating
                      size="tiny"
                      className="icon"
                      // style={{ marginLeft: "10px" }}
                    >
                      <Dropdown.Menu>
                        <Dropdown.Item
                          text={t("load_data")}
                          icon="plus"
                          onClick={() => openNewEffluentForm(period)}
                        />
                      </Dropdown.Menu>
                    </Dropdown>
                  </>
                )}
              </Table.HeaderCell>
            ))}
            <Table.HeaderCell>{t("total")}</Table.HeaderCell>
            <Table.HeaderCell>{t("average")}</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {uniqueFields.map((field) => (
            <React.Fragment key={field}>
              <Table.Row>
                <Table.Cell>{effluentCodes[field]}</Table.Cell>
                <Table.Cell>{t(field)}</Table.Cell>
                <Table.Cell>{"-"}</Table.Cell>
                {periods.map((period) => {
                  const item = data.find((d) => d.period === period);
                  return (
                    <Table.Cell key={`${field}-${period}`}>
                      {item && item[field] ? item[field].value : "-"}
                    </Table.Cell>
                  );
                })}
                <Table.Cell>{calculateTotalAndAverage(field).total}</Table.Cell>
                <Table.Cell>
                  {calculateTotalAndAverage(field).average.toFixed(2)}
                </Table.Cell>
              </Table.Row>
            </React.Fragment>
          ))}
        </Table.Body>

        {/* <Table.Body>
      <Table.Row>
      <Table.Cell>      {codes.electricityCode}</Table.Cell>
        <Table.Cell>Electricidad</Table.Cell>
        {electricityValues.map((value, index) => (
          <Table.Cell key={index}>{value}</Table.Cell>
        ))}
                <Table.Cell>{totalElectricity}</Table.Cell>
                <Table.Cell>{averageElectricity.toFixed(2)}</Table.Cell>
      </Table.Row>
      <Table.Row>
      <Table.Cell>      {codes.waterCode}</Table.Cell>
        <Table.Cell>Agua</Table.Cell>
        {waterValues.map((value, index) => (
          <Table.Cell key={index}>{value}</Table.Cell>
        ))}
          <Table.Cell>{totalWater}</Table.Cell>
          <Table.Cell>{averageWater.toFixed(2)}</Table.Cell>
      </Table.Row>
    </Table.Body> */}
      </Table>
      {/* Modal para mostrar detalles del período seleccionado */}
      {showModal ? (
        <>
          <BasicModal
            show={showModal}
            close={onOpenCloseModal}
            title={titleModal}
            size={"fullscreen"}
          >
            {modalContent}
          </BasicModal>
        </>
      ) : null}
      <Confirm
        open={showConfirm}
        onCancel={onOpenCloseConfirm}
        onConfirm={onDelete}
        content={confirmContent}
        size="tiny"
        cancelButton={t("cancel")}
        confirmButton={t("accept")}
        header={t("delete")}
      />
    </>
  );
}
