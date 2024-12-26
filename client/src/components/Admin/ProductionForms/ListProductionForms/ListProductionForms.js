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
} from "semantic-ui-react";
import { size, map } from "lodash";
import { Productionform } from "../../../../api";
import { useAuth } from "../../../../hooks";
import { ProductionFormItem } from "../ProductionFormItem";
import {
  hasPermission,
  isAdmin,
  isMaster,
} from "../../../../utils/checkPermission";
import "./ListProductionForms.scss";
import { formatDateView } from "../../../../utils/formatDate";
import { ProductionForm } from "../ProductionForm";
import { PERIODS } from "../../../../utils";
import { BasicModal } from "../../../Shared";
import { productionCodes } from "../../../../utils/codes";
import { useLanguage } from "../../../../contexts";
const _ = require("lodash");

const productionFormController = new Productionform();

export function ListProductionForms(props) {
  const { reload, onReload, siteSelected, yearSelected } = props;
  const [forms, setForms] = useState([]);
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
            await productionFormController.getProductionFormsBySiteAndYear(
              accessToken,
              siteSelected,
              yearSelected
            );

          if (response.code === 200 && response.productionForms) {
            setForms(response.productionForms);
          } else {
            setForms([]);
          }
        } catch (error) {
          console.error(error);
          setForms([]);
        }
    })();
  }, [yearSelected, siteSelected, reload]);

  const changePage = (_, data) => {
    setPage(data.activePage);
  };

  if (!forms) return <Loader active inline="centered" />;
  // if (size(productionforms) === 0) return "No hay ningun formulario de produccón";

  return (
    <div className="list-production-forms">
      <TablePeriods
        data={forms}
        onReload={onReload}
        accessToken={accessToken}
        year={yearSelected}
        site={siteSelected}
        t={t}
      />
    </div>
  );
}

function SearchStandardPermission(props) {
  const { dataOrigin, data, setData, t } = props;
  const [state, setState] = useState({
    isLoading: false,
    results: [],
    value: "",
  });

  const handleSearchChange = (e, { value }) => {
    setState({ isLoading: true, value });

    setTimeout(() => {
      if (value && value.length < 1) {
        setState({ isLoading: false, results: [], value: "" });
        setData(dataOrigin);
        return true;
      } else if (value.length === 0) {
        setData(dataOrigin);
        setState({ isLoading: false, results: [], value: "" });
        return true;
      }
      const re = new RegExp(_.escapeRegExp(value), "i");
      const isMatch = (result) => re.test(result.role.name);
      setState({
        isLoading: false,
        results: _.filter(data, isMatch),
      });
      setData(_.filter(data, isMatch));
    }, 300);
  };

  return (
    <Grid>
      <GridColumn width={6}>
        <Input
          icon="search"
          iconPosition="left"
          placeholder={t("search")}
          onChange={_.debounce(handleSearchChange, 500, {
            leading: true,
          })}
        />
      </GridColumn>
    </Grid>
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
      `${t("delete_dated_production_form")} ${formatDateView(form.date)}`
    );
    setDataDelete(form);
    onOpenCloseConfirm();
  };

  const openUpdateProductionForm = (period) => {
    //setFieldName(name);
    const form = data.find((item) => item.period === period);
    setTitleModal(
      `${t("update")} ${t("production_form")}: ${t(form.period)}-${form.year}`
    );
    setModalContent(
      <ProductionForm
        onClose={onOpenCloseModal}
        onReload={onReload}
        productionForm={form}
        siteSelected={site}
      />
    );
    setShowModal(true);
  };

  const openNewEffluentForm = (period) => {
    setTitleModal(t("new_production_form"));
    setModalContent(
      <ProductionForm
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
      await productionFormController.deleteProductionForm(
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

    Object.keys(productionCodes).forEach((key) => {
      fields.add(key);
    });

    return Array.from(fields);
  };

  // Retorna el código
  const hasCode = (field) => {
    return productionCodes[field];
  };

  const hasDataPeriod = (period) => {
    if (data) {
      const existsPeriod = data.some((entry) => entry.period === period);
      return existsPeriod;
    }
    return false;
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
                          onClick={() => openUpdateProductionForm(period)}
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
                      //link={true}
                      icon="ellipsis vertical"
                      floating
                      size="tiny"
                      className="icon"
                      exact="true"
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
                <Table.Cell>{productionCodes[field]}</Table.Cell>
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
