import React, { useState, useEffect } from "react";
import {
  Loader,
  Pagination,
  Table,
  Grid,
  GridColumn,
  Input,
  Divider,
  Confirm,
  Modal,
  Dropdown,
  TableHeaderCell,
  TableRow,
} from "semantic-ui-react";
import { size, map } from "lodash";
import { Wasteform } from "../../../../api";
import { useAuth } from "../../../../hooks";
import { WasteFormItem } from "../WasteFormItem";
import {
  hasPermission,
  isAdmin,
  isMaster,
} from "../../../../utils/checkPermission";
import "./ListWasteForms.scss";
import { BasicModal } from "../../../Shared";
import { PERIODS } from "../../../../utils";
import { formatDateView } from "../../../../utils/formatDate";
import { WasteForm } from "../WasteForm";
import {
  convertPeriodsEngToEsp,
  convertWasteFieldsEngToEsp,
} from "../../../../utils/converts";
import { wasteCodes } from "../../../../utils/codes";
import { useLanguage } from "../../../../contexts";
const _ = require("lodash");

const wasteFormController = new Wasteform();

export function ListWasteForms(props) {
  const { reload, onReload, siteSelected, yearSelected } = props;
  const [wasteForms, setWasteForms] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState();
  // const [Role, setRole] = useState(null);
  const {
    user: { role, site },
    accessToken,
  } = useAuth();

  const { translations } = useLanguage();

  const t = (key) => translations[key] || key; // Función para obtener la traducción

  useEffect(() => {
    (async () => {
      if (yearSelected !== "" && siteSelected !== undefined)
        try {
          const response = await wasteFormController.getWasteFormsBySiteAndYear(
            accessToken,
            siteSelected,
            yearSelected
          );
          console.log(response);
          if (response.code === 200) {
            setWasteForms(response.wasteForms);
          } else {
            setWasteForms([]);
          }
        } catch (error) {
          console.error(error);
        }
    })();
  }, [yearSelected, siteSelected, reload]);

  const changePage = (_, data) => {
    setPage(data.activePage);
  };

  if (!wasteForms) return <Loader active inline="centered" />;
  //if (size(wasteForms) === 0) return "No hay resultados ";

  return (
    <div className="list-waste-forms">
      {/* {map(siteforms, (siteForm) => (
        <SiteFormItem key={siteForm._id} siteForm={siteForm} onReload={onReload} />
      ))} */}
      <TablePeriods
        data={wasteForms}
        onReload={onReload}
        accessToken={accessToken}
        year={yearSelected}
        site={siteSelected}
        t={t}
      />
    </div>
  );
}

function TablePeriods(props) {
  const { data, onReload, accessToken, year, site, t } = props;

  const [showModal, setShowModal] = useState(false);
  const [titleModal, setTitleModal] = useState("");
  const [modalContent, setModalContent] = useState("");
  const [confirmContent, setConfirmContent] = useState("");
  const [dataDeleted, setDataDelete] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const handleConfirm = (e) => setDataDelete(e);

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
      `${t("delete_dated_waste_form")} ${formatDateView(form.date)}`
    );
    setDataDelete(form);
    onOpenCloseConfirm();
  };

  const openUpdateEffluentForm = (period) => {
    //setFieldName(name);
    const form = data.find((item) => item.period === period);
    setTitleModal(
      `${t("update")} ${t("waste_form")}: ${t(form.period)}-${form.year}`
    );
    setModalContent(
      <WasteForm
        onClose={onOpenCloseModal}
        onReload={onReload}
        wasteForm={form}
      />
    );
    setShowModal(true);
  };

  const openNewEffluentForm = (period) => {
    setTitleModal(t("new_waste_form"));
    setModalContent(
      <WasteForm
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
      await wasteFormController.deleteEffluentForm(
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

    Object.keys(wasteCodes).forEach((key) => {
      fields.add(key);
    });

    return Array.from(fields);
  };

  // Retorna el código
  const hasCode = (field) => {
    return wasteCodes[field];
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
                <Table.Cell>{wasteCodes[field]}</Table.Cell>
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
