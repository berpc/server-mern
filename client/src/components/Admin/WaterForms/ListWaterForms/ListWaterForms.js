import React, { useState, useEffect } from "react";
import { Loader, Pagination, Table, Grid, GridColumn, Input, Divider, Confirm, Modal, Dropdown, TableHeaderCell, TableRow } from "semantic-ui-react";
import { size, map } from "lodash";
import { Waterform } from "../../../../api";
import { useAuth } from "../../../../hooks";
import { WaterFormItem } from "../WaterFormItem";
import {
  hasPermission,
  isAdmin,
  isMaster,
} from "../../../../utils/checkPermission";
import "./ListWaterForms.scss";
import { BasicModal } from "../../../Shared";
import { PERIODS } from "../../../../utils";
import { formatDateView } from "../../../../utils/formatDate";
import { WaterForm}  from "../WaterForm/WaterForm";
import { convertPeriodsEngToEsp, convertWaterFieldsEngToEsp } from "../../../../utils/converts";
import { waterCodes } from "../../../../utils/codes";
import { useLanguage } from "../../../../contexts";
const _ = require("lodash");


const waterFormController = new Waterform();

export function ListWaterForms(props) {
  const { reload, onReload , siteSelected, yearSelected} = props;
  const [waterForms, setWaterForms] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState();
    // const [Role, setRole] = useState(null);
    const {
      user: { role, site },
      accessToken,
    } = useAuth();
  
  const { language, changeLanguage, translations } = useLanguage();

  const t = (key) => translations[key] || key; // Función para obtener la traducción

    useEffect(() => {
      (async () => {
        if(yearSelected!=="" && siteSelected!==undefined)
        try {
          const response = await waterFormController.getWaterFormsBySiteAndYear(
            accessToken,
            siteSelected,
            yearSelected
          );
          if (response.code ===200) {
            setWaterForms(response.waterForms);
          } else {
            setWaterForms([]);
          }
  
        } catch (error) {
          console.error(error);
        }
      })();
    }, [yearSelected,siteSelected, reload]);

  const changePage = (_, data) => {
    setPage(data.activePage);
  };

  if (!waterForms) return <Loader active inline="centered" />;
  //if (size(waterForms) === 0) return "No hay resultados ";

  return (
    <div className="list-water-forms">
      {/* {map(siteforms, (siteForm) => (
        <SiteFormItem key={siteForm._id} siteForm={siteForm} onReload={onReload} />
      ))} */}
       <TablePeriods
        data={waterForms}
        onReload={onReload}
        accessToken={accessToken}
        year={yearSelected}
        site={siteSelected}
        t={t}
      />

      <div className="list-water-forms__pagination">
          {/* <SearchStandardPermission
            dataOrigin={siteforms}
            // data={permissionsFilter}
            // setData={setPermissionsFilter}
          /> */}
        </div>
        {/* <Divider clearing/> */}

      {/* <Table celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Estado</Table.HeaderCell>
                <Table.HeaderCell >Fecha</Table.HeaderCell>
                <Table.HeaderCell>Usuario Creador</Table.HeaderCell>
                <Table.HeaderCell>Acciones</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
            {map(waterForms, (waterForm) => (
              //TODO:DESCOMENTAR CUANDO ESTE TODO COMPLETO
               <WaterFormItem key={waterForm._id} waterForm={waterForm} onReload={onReload} />
              ))
      }
           </Table.Body>
           </Table> */}
        {/* <Pagination
          totalPages={pagination.pages}
          defaultActivePage={pagination.page}
          ellipsisItem={null}
          firstItem={null}
          lastItem={null}--
          onPageChange={changePage}
        /> */}
        {/* <Pagination
        activePage={pagination.page}
        totalPages={pagination.pages}
        onPageChange={changePage}
      />   */}
      </div>
  );
}


function SearchStandardPermission(props) {
  const { dataOrigin, data, setData,t } = props;
  const [state, setState] = useState({
    isLoading: false,
    results: [],
    value: "",
  });

  const handleSearchChange = (e, { value }) => {
    setState({ isLoading: true, value });

    setTimeout(() => {
      if (value && value.length < 1) {
        setState({ isLoading: false, results: [], value: "" })
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
       icon='search'
       iconPosition='left'
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

  const { data, onReload, accessToken , year, site, t} = props;

  const [showModal, setShowModal] = useState(false);
  const [titleModal, setTitleModal] = useState("");
  const [modalContent, setModalContent] = useState("");
  const [confirmContent, setConfirmContent] = useState("");
  const [dataDeleted, setDataDelete] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const handleConfirm = (e) => setDataDelete(e)


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
      `${t("delete_dated_water_form")} ${formatDateView(
        form.date
      )}`
    );
    setDataDelete(form)
    onOpenCloseConfirm();
  };

  const openUpdateEffluentForm = (period) => {
    //setFieldName(name);
    const form = data.find((item) => item.period === period);
    setTitleModal(
      `${t("update")} ${t("water_form")}: ${t(form.period)}-${
        form.year
      }`
    );
    setModalContent(
      <WaterForm
        onClose={onOpenCloseModal}
        onReload={onReload}
        waterForm={form}
      />
    );
    setShowModal(true);
  };

  const openNewWaterForm = (period) => {
    setTitleModal(t("new_water_form"));
    setModalContent(
      <WaterForm onClose={onOpenCloseModal} onReload={onReload} period={period} year={year} siteSelected={site}/>
    );
    setShowModal(true);
  };

  const onDelete = async () => {
    try {
      //TODO: modificar por controlador correspondiente
      await waterFormController.deleteWaterForm(accessToken, dataDeleted._id);
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

    Object.keys(waterCodes).forEach((key) => {
      fields.add(key);
    });

    return Array.from(fields);
  };

  // Retorna el código
  const hasCode = (field) => {
    return waterCodes[field];
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
                          onClick={() => openNewWaterForm(period)}
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
                <Table.Cell>{waterCodes[field]}</Table.Cell>
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
        header={t("delete")}
        size="tiny"
        cancelButton={t("cancel")}
        confirmButton={t("accept")}
      />
    </>
  );
}