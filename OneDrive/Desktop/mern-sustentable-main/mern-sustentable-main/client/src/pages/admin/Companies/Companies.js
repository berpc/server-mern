import React, { useState, useEffect } from "react";
import { Tab, Button } from "semantic-ui-react";
import { BasicModal } from "../../../components/Shared";
import { CompanyForm, ListCompanies } from "../../../components/Admin/Companies";
import "./Companies.scss";
import { useAuth } from "../../../hooks";
import { isAdmin, hasPermission, isMaster } from "../../../utils/checkPermission";
import { ErrorAccessDenied } from "../Error";
import { Permission } from "../../../api";

const permissionController = new Permission();

export function Companies() {
  const [showModal, setShowModal] = useState(false);
  const [reload, setReload] = useState(false);
  const {
    accessToken,
    user: { role },
  } = useAuth();

  const [permissionsByRole, setPermissionsByRole] = useState([]);
  const onOpenCloseModal = () => setShowModal((prevState) => !prevState);
  const onReload = () => setReload((prevState) => !prevState);

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

  const panes = [
    {
      menuItem: "Empresas activas",
      render: () => (
        <Tab.Pane attached={false}>
          <ListCompanies companiesActive={true} reload={reload} onReload={onReload} />
        </Tab.Pane>
      ),
    },
    {
      menuItem: "Empresas inactivas",
      render: () => (
        <Tab.Pane attached={false}>
          <ListCompanies companiesActive={false} reload={reload} onReload={onReload} />
        </Tab.Pane>
      ),
    },
  ];

  if (
    isAdmin(role) ||
    hasPermission(permissionsByRole, role._id, "companies", "view")
  ) {
    return (
      <>
        <div className="companies-page">
          {isAdmin(role) ||
          hasPermission(permissionsByRole, role._id, "companies", "create") ? (
            <Button
              className="users-page__add"
              primary
              onClick={onOpenCloseModal}
            >
              Nuevo Empresa
            </Button>
          ) : null}
          <Tab menu={{ secondary: true }} panes={panes} />
        </div>

        <BasicModal
          show={showModal}
          close={onOpenCloseModal}
          title="Crear nueva empresa"
        >
          <CompanyForm close={onOpenCloseModal} onReload={onReload} />
        </BasicModal>
      </>
    );
  } else {
    return <ErrorAccessDenied />;
  }
}
