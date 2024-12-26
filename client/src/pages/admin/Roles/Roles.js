import React, { useState, useEffect } from "react";
import { Tab, Button, Icon } from "semantic-ui-react";
import { BasicModal } from "../../../components/Shared";
import { RoleForm, ListRoles } from "../../../components/Admin/Roles";
import "./Roles.scss";
import { useAuth } from "../../../hooks";
import { Permission } from "../../../api";
import {
  isAdmin,
  hasPermission,
  isMaster,
} from "../../../utils/checkPermission";
import { ErrorAccessDenied } from "../Error";
import { useLanguage } from "../../../contexts";

const permissionController = new Permission();

export function Roles() {
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

  const t = (key) => translations[key] || key; // Función para obtener la traducción

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
      menuItem: t("active_roles"),
      render: () => (
        <Tab.Pane attached={false}>
          <ListRoles rolesActive={true} reload={reload} onReload={onReload} />
        </Tab.Pane>
      ),
    },
    {
      menuItem: t("inactive_roles"),
      render: () => (
        <Tab.Pane attached={false}>
          <ListRoles rolesActive={false} reload={reload} onReload={onReload} />
        </Tab.Pane>
      ),
    },
  ];

  if (
    isMaster(role) ||
    isAdmin(role) ||
    hasPermission(permissionsByRole, role._id, "roles", "view")
  ) {
    return (
      <>
        <div className="roles-page">
          {isMaster(role) ||
          isAdmin(role) ||
          hasPermission(permissionsByRole, role._id, "roles", "create") ? (
            <Button
              className="roles-page__add"
              primary
              onClick={onOpenCloseModal}
            >
              <Icon name="plus" /> {t("new_role")}
            </Button>
          ) : null}
          <Tab menu={{ secondary: true }} panes={panes} />
        </div>

        <BasicModal
          show={showModal}
          close={onOpenCloseModal}
          title={t("create_new_role")}
        >
          <RoleForm close={onOpenCloseModal} onReload={onReload} />
        </BasicModal>
      </>
    );
  } else {
    <ErrorAccessDenied />;
  }
}
