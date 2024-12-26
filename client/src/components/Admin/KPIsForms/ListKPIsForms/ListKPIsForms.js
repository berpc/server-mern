import React, { useState, useEffect } from "react";
import {
  Loader,
  Table,
  TableBody,
  TableCell,
  TableHeaderCell,
  TableRow,
  TableHeader,
  Divider,
  Dropdown,
  Confirm,
  Label,
} from "semantic-ui-react";
import { size, map } from "lodash";
import { KPIsform } from "../../../../api";
import { useAuth } from "../../../../hooks";
import {
  hasPermission,
  isAdmin,
  isMaster,
} from "../../../../utils/checkPermission";
import "./ListKPIsForms.scss";
import { KPIsForm } from "../KPIsForm";
import { BasicModal } from "../../../Shared";
import { PERIODS } from "../../../../utils";
import { kpisCodes } from "../../../../utils/codes";
import { formatDateView } from "../../../../utils/formatDate";
import { useLanguage } from "../../../../contexts";
const _ = require("lodash");

const kpisFormController = new KPIsform();

export function ListKPIsForms(props) {
  const { reload, onReload, siteSelected, yearSelected } = props;
  const [kpisForms, setKPIsForms] = useState([]);
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
          const response = await kpisFormController.getKPIsFormsBySiteAndYear(
            accessToken,
            siteSelected,
            yearSelected
          );
          if (response.code === 200) {
            setKPIsForms(response.kpisForms);
          } else {
            setKPIsForms([]);
          }
        } catch (error) {
          console.error(error);
        }
    })();
  }, [yearSelected, siteSelected, reload]);

  if (!kpisForms) return <Loader active inline="centered" />;
  //if (size(kpisForms) === 0) return "No hay ningun formulario de efluentes";
  //  if (size(kpisForms) === 0) return <TablePeriods data2={kpisForms}/>;

  return (
    <div className="list-kpis-forms">
      <TablePeriods
        data={kpisForms}
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
      `${t("delete_dated_kpis_form")} ${formatDateView(form.date)}`
    );
    setDataDelete(form);
    onOpenCloseConfirm();
  };

  const openUpdateKPIsForm = (period) => {
    //setFieldName(name);
    const form = data.find((item) => item.period === period);
    setTitleModal(
      `${t("update")} ${t("kpis_form")}: ${t(form.period)}-${form.year}`
    );
    setModalContent(
      <KPIsForm
        onClose={onOpenCloseModal}
        onReload={onReload}
        kpisForm={form}
      />
    );
    setShowModal(true);
  };

  const openNewKPIsForm = (period) => {
    setTitleModal(t("new_kpis_form"));
    setModalContent(
      <KPIsForm
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
      await kpisFormController.deleteKPIsForm(accessToken, dataDeleted._id);
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

    Object.keys(kpisCodes).forEach((key) => {
      fields.add(key);
    });

    return Array.from(fields);
  };

  const determineMainFields = () => {
    const fields = ["energy_indicators", "greenhouse_gas_indicators"];

    return fields;
  };

  const fieldsFinal = () => {
    const field = {
      energy_indicators: [
        "total_fuel_energy_consumption",
        "total_electrical_energy_consumption",
        "total_energy_consumption",
        "total_renewable_energy",
        "percentage_of_renewable_energy",
        "% de energías renovables",
        "percentage_energy_from_fossil_fuels",
        "total_energy_consumed_per_productive_unit",
        "total_cost_of_energy_consumed",
      ],
      greenhouse_gas_indicators: [
        "total_scope_1",
        "total_scope_2",
        "total_scope_3",
        "total_emissions_per_unit_produced",
        "total_emissions",
        "scope_percentage_1",
        "scope_percentage_2",
        "scope_percentage_3",
      ],
    };
    return field;
  };

  // Retorna el código
  const hasCode = (field) => {
    return kpisCodes[field];
  };

  const hasDataPeriod = (period) => {
    const existsPeriod = data.some((entry) => entry.period === period);
    return existsPeriod;
  };

  // Obtener todos los campos únicos
  const uniqueFields = fieldsFinal();
  // Obtener todos los campos únicos
  const mainFields = ["energy_indicators", "greenhouse_gas_indicators"];

  const calculateTotalAndAverage = (mainField, field) => {
    const values = data.map((item) => item[mainField][field]?.value || 0);
    const total = values.reduce((acc, val) => acc + val, 0);
    const average = values.length ? total / values.length : 0;
    return { total, average };
  };

  return (
    <>
      <Table celled={true} structured={true}>
        <TableHeader>
          <TableRow>
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
          </TableRow>
          <TableRow>
            {periods.map((period, index) => (
              <TableHeaderCell key={index}>
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
                          onClick={() => openUpdateKPIsForm(period)}
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
                          onClick={() => openNewKPIsForm(period)}
                        />
                      </Dropdown.Menu>
                    </Dropdown>
                  </>
                )}
              </TableHeaderCell>
            ))}
            <TableHeaderCell>{t("total")}</TableHeaderCell>
            <TableHeaderCell>{t("average")}</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mainFields.map((f) => (
            <>
              <React.Fragment key={f}>
                <TableRow key={f}>
                  <TableCell collapsing width={18}>
                    {" "}
                    <Label ribbon>{t(f)}</Label>
                  </TableCell>
                </TableRow>
              </React.Fragment>
              <SubFields
                f={f}
                listFields={uniqueFields}
                data={data}
                calculateTotalAndAverage={calculateTotalAndAverage}
                periods={periods}
                t={t}
              />
            </>
          ))}
        </TableBody>
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

function SubFields(props) {
  const { f, listFields, periods, data, calculateTotalAndAverage, t } = props;

  return listFields[f].map((field) => {
    return (
      <React.Fragment key={field}>
        <TableRow key={field}>
          <TableCell>{kpisCodes[field]}</TableCell>
          <TableCell>{t(field)}</TableCell>
          <TableCell>{"-"}</TableCell>
          {periods.map((period) => {
            const item = data.find((d) => d.period === period);
            return (
              <TableCell key={`${field}-${period}`}>
                {item && item[f][field] ? item[f][field].value : "-"}
              </TableCell>
            );
          })}
          <TableCell>{calculateTotalAndAverage(f, field).total}</TableCell>
          <TableCell>
            {calculateTotalAndAverage(f, field).average.toFixed(2)}
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
  });
}
