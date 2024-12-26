import React, { useState, useEffect } from "react";
import {
  Divider,
  Icon,
  Button,
  Dropdown,
  Segment,
  GridRow,
  GridColumn,
  Grid,
} from "semantic-ui-react";
import {
  Dangerousform,
  Effluentform,
  Energyform,
  KPIsform,
  Permission,
  Productionform,
  Site,
  Siteform,
  Wasteform,
  Waterform,
} from "../../../../api";
import { useAuth } from "../../../../hooks";
import {
  hasPermission,
  isAdmin,
  isMaster,
} from "../../../../utils/checkPermission";
import { ErrorAccessDenied } from "../../../../pages/admin/Error";
import { reportExcel } from "../ExcelReport";
import { reportPdfByYear } from "../PdfReport";
import { jsPDF } from "jspdf";
import { FORMS, MODULES } from "../../../../utils";
import { convertFormsEngToEsp } from "../../../../utils/converts";
import { useLocation } from "react-router-dom";
import "./ViewReport.scss";
import { useLanguage } from "../../../../contexts";
const _ = require("lodash");

const permissionController = new Permission();
const waterFormController = new Waterform();
const wasteFormController = new Wasteform();
const productionFormController = new Productionform();
const siteFormController = new Siteform();
const energyFormController = new Energyform();
const effluentController = new Effluentform();
const dangerousController = new Dangerousform();
const kpisController = new KPIsform();
const siteController = new Site();

export function ViewReports(props) {
  const [permissions, setPermissions] = useState([]);
  const [moduleSelected, setModuleSelected] = useState(null);
  const [yearSelected, setYearSelected] = useState(new Date().getFullYear());
  const [siteSelected, setSiteSelected] = useState(null);
  const [listModules, setListModules] = useState([]);
  const [listSites, setListSites] = useState([]);
  const [data, setData] = useState([]);
  const [buttonAvailable, setButtonAvailable] = useState(true);

  // const [Role, setRole] = useState(null);
  const {
    user: { role, company, site },
    accessToken,
  } = useAuth();

  const { translations } = useLanguage();

  const t = (key) => translations[key] || key; // Función para obtener la traducción

  const [permissionsByRole, setPermissionsByRole] = useState([]);

  const [column, setColumn] = useState(null);
  //const [data, setData] = useState(/* Your data array */);
  const [direction, setDirection] = useState(null);
  const location = useLocation();

  useEffect(() => {
    (async () => {
      try {
        let newList = [];
        FORMS.map((form) => {
          newList.push(form);
          return true;
        });
        setListModules(newList);
      } catch (error) {
        // console.error(error);
        setPermissionsByRole([]);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        if (!site && !location.state?.siteSelected) {
          const response = await siteController.getSites(accessToken);
          setListSites(response);
        } else if (site) {
          setSiteSelected(site._id);
        }
      } catch (error) {
        // console.error(error);
        setListSites([]);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        setData([]);
        if (yearSelected && moduleSelected !== null && siteSelected !== null) {
          console.log(siteSelected);
          setButtonAvailable(true);
          moduleConsult(moduleSelected);
        }
      } catch (error) {
        // console.error(error);
        setPermissionsByRole([]);
      }
    })();
  }, [moduleSelected, yearSelected]);

  // Generar una lista de años (por ejemplo, del 2000 al 2024)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  const getWaterForm = async () => {
    const response = await waterFormController.getWaterFormsBySiteAndYear(
      accessToken,
      siteSelected,
      yearSelected
    );
    if (response.code === 200) {
      setData(response.waterForms);
      setButtonAvailable(false);
    } else {
      setData([]);
    }
  };

  const getProductionForm = async () => {
    const response =
      await productionFormController.getProductionFormsBySiteAndYear(
        accessToken,
        siteSelected,
        yearSelected
      );
    if (response.code === 200) {
      setData(response.productionForms);
      setButtonAvailable(false);
    } else {
      setData([]);
    }
  };

  const getSiteForm = async () => {
    const response = await siteFormController.getSiteFormsBySiteAndYear(
      accessToken,
      siteSelected,
      yearSelected
    );
    if (response.code === 200) {
      setData(response.siteForms);
      setButtonAvailable(false);
    } else {
      setData([]);
    }
  };

  const getEnergyForm = async () => {
    const response = await energyFormController.getEnergyFormsBySiteAndYear(
      accessToken,
      siteSelected,
      yearSelected
    );
    if (response.code === 200) {
      setData(response.energyForms);
      setButtonAvailable(false);
    } else {
      setData([]);
    }
  };

  const getDangerousForm = async () => {
    const response = await dangerousController.getDangerousFormsBySiteAndYear(
      accessToken,
      siteSelected,
      yearSelected
    );
    if (response.code === 200) {
      setData(response.dangerousForms);
      setButtonAvailable(false);
    } else {
      setData([]);
    }
  };

  const getEffluentForm = async () => {
    const response = await effluentController.getEffluentFormsBySiteAndYear(
      accessToken,
      siteSelected,
      yearSelected
    );
    if (response.code === 200) {
      setData(response.effluentForms);
      setButtonAvailable(false);
    } else {
      setData([]);
    }
  };

  const getKPIsForm = async () => {
    const response = await kpisController.getKPIsFormsBySiteAndYear(
      accessToken,
      siteSelected,
      yearSelected
    );
    if (response.code === 200) {
      setData(response.kpisForms);
      setButtonAvailable(false);
    } else {
      setData([]);
    }
  };

  const getWasteForm = async () => {
    const response = await wasteFormController.getWasteFormsBySiteAndYear(
      accessToken,
      siteSelected,
      yearSelected
    );
    if (response.code === 200) {
      setData(response.wasteForms);
      setButtonAvailable(false);
    } else {
      setData([]);
    }
  };

  const moduleConsult = (a) => {
    switch (a) {
      case "siteform":
        return getSiteForm();
      case "energyform":
        return getEnergyForm();
      case "productionform":
        return getProductionForm();
      case "effluentform":
        return getEffluentForm();
      case "waterform":
        return getWaterForm();
      case "wasteform":
        return getWasteForm();
      case "kpisform":
        return getKPIsForm();
      case "dangerousform":
        return getDangerousForm();
      default:
        return null;
    }
  };

  const handleSort = (clickedColumn) => () => {
    if (column !== clickedColumn) {
      setColumn(clickedColumn);
      setData(
        [...data].sort((a, b) => (a[clickedColumn] > b[clickedColumn] ? 1 : -1))
      );
      setDirection("ascending");
      return;
    }

    setData(data.reverse());
    setDirection(direction === "ascending" ? "descending" : "ascending");
  };

  const generateExcel = (data, fileName) => {
    return reportExcel(data, fileName);
  };

  const data2 = [
    { id: 1, name: "John Doe", age: 30, profession: "Developer" },
    { id: 2, name: "Jane Smith", age: 25, profession: "Designer" },
  ];

  useEffect(() => {
    (async () => {
      try {
        setPermissionsByRole([]);
        if (role) {
          const response = await permissionController.getPermissionsByRole(
            accessToken,
            role._id,
            true
          );
          setPermissionsByRole(response);
        }
      } catch (error) {
        console.error(error);
        setPermissionsByRole([]);
      }
    })();
  }, [role]);

  if (
    isMaster(role) ||
    isAdmin(role) ||
    hasPermission(permissionsByRole, role._id, "reports", "view")
  ) {
    // if (!listRoles) return <Loader active inline="centered" />;
    // if (size(listRoles) === 0) return "No hay ningun rol";
    return (
      <div className="form-report">
        <div></div>

        <Segment>
          {!site ? (
            <>
              <label> {t("site")} </label>
              <Dropdown
                placeholder={t("select")}
                options={listSites.map((ds) => {
                  return {
                    key: ds._id,
                    text: ds.name,
                    value: ds._id,
                  };
                })}
                selection
                onChange={(_, data) => setSiteSelected(data.value)}
                value={siteSelected}
              />
              <Divider clearing />{" "}
            </>
          ) : null}

          {siteSelected && siteSelected !== null ? (
            <>
              <Grid columns={2} className="grid-report">
                <GridRow>
                  <GridColumn>
                    <label> {t("data")} </label>
                    <Dropdown
                      placeholder={t("select")}
                      options={listModules.map((ds) => {
                        return {
                          key: ds,
                          text: convertFormsEngToEsp(ds),
                          value: ds,
                        };
                      })}
                      selection
                      onChange={(_, data) => setModuleSelected(data.value)}
                      value={moduleSelected}
                    />
                  </GridColumn>
                  <GridColumn>
                    <label> {t("year")} </label>
                    <Dropdown
                      placeholder={t("select")}
                      options={years.map((ds) => {
                        return {
                          key: ds,
                          text: ds,
                          value: ds,
                        };
                      })}
                      selection
                      onChange={(_, data) => setYearSelected(data.value)}
                      value={yearSelected}
                    />
                  </GridColumn>
                </GridRow>
              </Grid>
            </>
          ) : null}
          <Grid columns={2}>
            <GridRow>
              <GridColumn textAlign="center">
                <Button
                  primary
                  disabled={buttonAvailable}
                  onClick={() => {
                    reportPdfByYear(data, moduleSelected, yearSelected);
                  }}
                >
                  {" "}
                  <Icon name="file pdf outline" />
                  {t("download")} PDF
                </Button>
              </GridColumn>

              <GridColumn textAlign="center">
                {/* <Button
                  primary
                  onClick={() => {
                    generateExcel(data2, "prueba");
                  }}
                >
                  {" "}
                  <Icon name="file excel outline" />
                  Descargar xlsx
                </Button> */}
              </GridColumn>
            </GridRow>
          </Grid>
        </Segment>
        <div></div>
      </div>
    );
  } else {
    return <ErrorAccessDenied />;
  }
}
