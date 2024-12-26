import React, { useState, useEffect } from "react";
import { Tab, Button , Table, Divider, Icon, Segment, Header, Dropdown} from "semantic-ui-react";
import { BasicModal } from "../../../components/Shared";
import {SiteForm, ListSiteForms } from "../../../components/Admin/SiteForms";
import { Link } from "react-router-dom";
import "./Sites.scss";
import { useAuth } from "../../../hooks";
import { Site } from "../../../api";
import { encrypt,decrypt } from '../../../utils/cryptoUtils'; 
import { useNavigate  } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { hasPermission, isAdmin, isMaster } from "../../../utils/checkPermission";
import { useLanguage } from "../../../contexts";

const siteController= new Site();

export function SiteForms() {
  const [showModal, setShowModal] = useState(false);
  const [reload, setReload] = useState(false);
  const {
    accessToken,
    user: { role, site },
  } = useAuth();
  const [sitesFilter, setSitesFilter] = useState([]);
  const [siteSelected, setSiteSelected] = useState(null);
  const [yearSelected, setYearSelected] = useState(new Date().getFullYear());

  const onOpenCloseModal = () => setShowModal((prevState) => !prevState);
  const onReload = () => setReload((prevState) => !prevState);

  const location = useLocation();

  const { language, changeLanguage, translations } = useLanguage();
      
  const t = (key) => translations[key] || key; // Función para obtener la traducción
      

  useEffect(() => {
    (async () => {
      try {
        if (!site && !location.state?.siteSelected) {
          const response = await siteController.getSites(accessToken);
          setSitesFilter(response);
        }
      } catch (error) {
        console.error(error);
        setSitesFilter([]);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        if (location.state?.siteSelected) {
          setSiteSelected(decrypt(location.state.siteSelected));
        }
      } catch (error) {
        console.error(error);
      }
    })();
  }, [location]);

  const handleSelected = (idSite) => {
    setSiteSelected(idSite._id);
  };

  const panes = [
    {
      render: () => (
        <Tab.Pane attached={false}>
          {siteSelected === null &&
          (isMaster(role) || (isAdmin(role) && !site)) ? (
            <SelectedListSites
              sitesFilter={sitesFilter}
              handleSelected={handleSelected}
              t={t}
            />
          ) : !site && siteSelected !== null ? (
            <ListSiteForms
              reload={reload}
              onReload={onReload}
              siteSelected={siteSelected}
              yearSelected={yearSelected}
            />
          ) : (
            <ListSiteForms
              reload={reload}
              onReload={onReload}
              siteSelected={site?._id || null}
              yearSelected={yearSelected}
            />
          )}
        </Tab.Pane>
      ),
    },
  ];

  // Generar una lista de años (por ejemplo, del 2000 al 2024)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  return (
    <>
      <div className="site-forms-page">
        <Segment textAlign="center">
          {" "}
          <Header as="h1">{t("SITE")}</Header>
        </Segment>
        <div className="site-forms-page__add">
          {siteSelected !== null || site ? (
            //      <Link to={"/admin/effluentforms/neweffluentform"} state= {{siteSelected: encrypt(siteSelected) }}
            // >
            <Button primary onClick={onOpenCloseModal}>
              <Icon name="plus" /> {t("new_site_form")}
            </Button>
          ) : // </Link>
          null}
        </div>
        <>
        {siteSelected !== null || site ? (
          <Dropdown
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
            onChange={(_, data) => setYearSelected(data.value)}
            value={yearSelected}
          />) : null}
        </>

        <Tab menu={{ secondary: true }} panes={panes} />
      </div>

      <BasicModal
        show={showModal}
        close={onOpenCloseModal}
        title={t("site_form")}
        size={"fullscreen"}
      >
        <SiteForm
          onClose={onOpenCloseModal}
          onReload={onReload}
          year={yearSelected}
          siteSelected={siteSelected}
        />
      </BasicModal>
    </>
  );
}

function SelectedListSites(props) {
  const { sitesFilter, role, permissionByRole, handleSelected, t } = props;

  return (
    <div>
      {/* { isMaster(role) || isAdmin(role) ||
      hasPermission(permissionByRole, role._id, "sites", "view") ? ( */}
      <div>
        <Divider clearing />

        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>{t("company_name")}</Table.HeaderCell>
              <Table.HeaderCell>{t("email")}</Table.HeaderCell>
              <Table.HeaderCell>{t("actions")}</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {sitesFilter.map((site) => (
              <Table.Row key={site._id}>
                <Table.Cell>{site.name ? site.name : ""}</Table.Cell>
                <Table.Cell>{site.email}</Table.Cell>
                <Table.Cell>
                  {
                    // isMaster(role) || isAdmin(role) ||
                    // hasPermission(permissionsByRole, role._id, "sites", "edit") ? (
                    <Button
                      icon
                      primary
                      onClick={() => {
                        handleSelected(site);
                      }}
                    >
                      <Icon name="angle double right" />
                    </Button>
                    // ) : null
                  }
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
      {/* ) : (
        // <ErrorAccessDenied />
        <></>
      )} */}
    </div>
  );
}
