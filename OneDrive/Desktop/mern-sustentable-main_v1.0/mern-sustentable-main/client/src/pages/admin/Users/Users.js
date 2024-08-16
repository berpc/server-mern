import React, { useState, useEffect } from "react";
import { Tab, Button } from "semantic-ui-react";
import { BasicModal } from "../../../components/Shared";
import { UserForm, ListUsers } from "../../../components/Admin/Users";
import "./Users.scss";
import { useAuth } from "../../../hooks";
import { isAdmin, hasPermission, isMaster } from "../../../utils/checkPermission";
import { ErrorAccessDenied } from "../Error";
import { Permission } from "../../../api";

const permissionController = new Permission();
export function Users() {
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
      menuItem: "Usuarios activos",
      render: () => (
        <Tab.Pane attached={false}>
          <ListUsers usersActive={true} reload={reload} onReload={onReload} />
        </Tab.Pane>
      ),
    },
    {
      menuItem: "Usuarios inactivos",
      render: () => (
        <Tab.Pane attached={false}>
          <ListUsers usersActive={false} reload={reload} onReload={onReload} />
        </Tab.Pane>
      ),
    },
  ];

  if (
    isMaster(role) ||
    isAdmin(role) ||
    hasPermission(permissionsByRole, role._id, "users", "view")
  ) {
    return (
      <>
        <div className="users-page">
          {isMaster(role) || isAdmin(role) ||
          hasPermission(permissionsByRole, role._id, "users", "create") ? (
            <Button
              className="users-page__add"
              primary
              onClick={onOpenCloseModal}
            >
              Nuevo usuario
            </Button>
          ) : null}
          <Tab menu={{ secondary: true }} panes={panes} />
        </div>

        <BasicModal
          show={showModal}
          close={onOpenCloseModal}
          title="Crear nuevo usuario"
        >
          <UserForm close={onOpenCloseModal} onReload={onReload} />
        </BasicModal>
      </>
    );
  } else {
    return <ErrorAccessDenied />;
  }
}
