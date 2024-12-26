import React, { useState, useEffect } from "react";
import { Tab, Button, Segment, Header } from "semantic-ui-react";
import { BasicModal } from "../../../components/Shared";
import { SiteForm } from "../../../components/Admin/SiteForms";
import "./Sites.scss";
import { useAuth } from "../../../hooks";
import {
  isAdmin,
  hasPermission,
  isMaster,
} from "../../../utils/checkPermission";
import { ErrorAccessDenied } from "../Error";
import { Permission } from "../../../api";
import { Link } from "react-router-dom";
import { useLanguage } from "../../../contexts";

const permissionController = new Permission();

export function NewSiteForm() {
  const [showModal, setShowModal] = useState(false);
  const [reload, setReload] = useState(false);
  const {
    accessToken,
    user: { role },
  } = useAuth();

  const [permissionsByRole, setPermissionsByRole] = useState([]);
  const onOpenCloseModal = () => setShowModal((prevState) => !prevState);
  const onReload = () => setReload((prevState) => !prevState);

  const { translations } = useLanguage();
  
  const t = (key) => translations[key] || key ; // Función para obtener la traducción

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
    hasPermission(permissionsByRole, role._id, "sites", "view")
  ) {
    return (
      <>
        <div className="sites-page">
          <Header as="h3" attached="top">
          {t("new_site_form")}
          </Header>
          <Segment attached color='blue'>
            <SiteForm onReload={onReload} />
          </Segment>
        </div>
      </>
    );
  } else {
    return <ErrorAccessDenied />;
  }
}
