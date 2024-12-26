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
  Dropdown,
  Label,
} from "semantic-ui-react";
import { size, map } from "lodash";
import { Energyform } from "../../../../api";
import { useAuth } from "../../../../hooks";
import { EnergyFormItem } from "../EnergyFormItem";
import {
  hasPermission,
  isAdmin,
  isMaster,
} from "../../../../utils/checkPermission";
import "./ListEnergyForms.scss";
import { formatDateView } from "../../../../utils/formatDate";
import { EnergyForm } from "../EnergyForm";
import { PERIODS } from "../../../../utils";
import { BasicModal } from "../../../Shared";
import { energyCodes } from "../../../../utils/codes";
import { useLanguage } from "../../../../contexts";
const _ = require("lodash");

const energyFormController = new Energyform();

export function ListEnergyForms(props) {
  const { reload, onReload, siteSelected, yearSelected } = props;
  const [energyforms, setEnergyForms] = useState([]);
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
          const response =
            await energyFormController.getEnergyFormsBySiteAndYear(
              accessToken,
              siteSelected,
              yearSelected
            );
          console.log(response);
          if (response.code === 200) {
            setEnergyForms(response.energyForms);
          } else {
            setEnergyForms([]);
          }
        } catch (error) {
          console.error(error);
        }
    })();
  }, [yearSelected, siteSelected, reload]);

  const changePage = (_, data) => {
    setPage(data.activePage);
  };

  if (!energyforms) return <Loader active inline="centered" />;
  // if (size(energyforms) === 0) return "No hay ningun formulario de energia";

  return (
    <div className="list-energy-forms">
      <TablePeriods
        data={energyforms}
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
      `${t("delete_dated_energy_form")} ${formatDateView(form.date)}`
    );
    setDataDelete(form);
    onOpenCloseConfirm();
  };

  const openUpdateEffluentForm = (period) => {
    //setFieldName(name);
    const form = data.find((item) => item.period === period);
    setTitleModal(
      `${t("update")} ${t("energy_form")}: ${t(form.period)}-${form.year}`
    );
    setModalContent(
      <EnergyForm
        onClose={onOpenCloseModal}
        onReload={onReload}
        energyForm={form}
        siteSelected={site}
      />
    );
    setShowModal(true);
  };

  const openNewEnergyForm = (period) => {
    setTitleModal(t("new_energy_form"));
    setModalContent(
      <EnergyForm
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
      await energyFormController.deleteEnergyForm(accessToken, dataDeleted._id);
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

    Object.keys(energyCodes).forEach((key) => {
      fields.add(key);
    });

    return Array.from(fields);
  };

  // Retorna el código
  const hasCode = (field) => {
    return energyCodes[field];
  };

  const hasDataPeriod = (period) => {
    const existsPeriod = data.some((entry) => entry.period === period);
    return existsPeriod;
  };

  const fieldsFinal = () => {
    const field = {
      electricity: [
        "electricity_standard",
        "electricity_cost",
        "renewable_energies",
        "renewable_energies_produced_and_consumed_on_site",
      ],
      fuels: [
        "steam",
        "steam_cost",
        "total_scope_3",
        "natural_gas",
        "natural_gas_cost",
        "glp",
        "glp_cost",
        "heavy_fuel_oil",
        "cost_of_heavy_fuel_oil",
        "light_fuel_oil",
        "cost_of_light_fuel_oil",
        "coal",
        "coal_cost",
        "diesel",
        "diesel_cost",
        "gasoline_for_internal_vehicles",
        "gasoline_cost_of_internal_vehicles",
        "biomass",
        "biomass_cost",
      ],
    };
    return field;
  };

  // Obtener todos los campos únicos
  const uniqueFields = fieldsFinal();

  const mainFields = ["electricity", "fuels"];

  const calculateTotalAndAverage = (mainField, field) => {
    const values = data.map((item) => item[mainField][field]?.value || 0);
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
                          onClick={() => openNewEnergyForm(period)}
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
          {mainFields.map((f) => (
            <>
              <React.Fragment key={f}>
                <Table.Row>
                  <Table.Cell collapsing width={18}>
                    {" "}
                    <Label ribbon>{t(f)}</Label>
                  </Table.Cell>
                </Table.Row>
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

function SubFields(props) {
  const { f, listFields, periods, data, calculateTotalAndAverage, t } = props;

  return listFields[f].map((field) => {
    return (
      <React.Fragment key={field}>
        <Table.Row>
          <Table.Cell>{energyCodes[field]}</Table.Cell>
          <Table.Cell>{t(field)}</Table.Cell>
          <Table.Cell>{"-"}</Table.Cell>
          {periods.map((period) => {
            const item = data.find((d) => d.period === period);
            return (
              <Table.Cell key={`${field}-${period}`}>
                {item && item[f][field] ? item[f][field].value : "-"}
                {console.log(
                  item && item[f][field] ? item[f][field].value : "-"
                )}
              </Table.Cell>
            );
          })}
          <Table.Cell>{calculateTotalAndAverage(f, field).total}</Table.Cell>
          <Table.Cell>
            {calculateTotalAndAverage(f, field).average.toFixed(2)}
          </Table.Cell>
        </Table.Row>
      </React.Fragment>
    );
  });
}
