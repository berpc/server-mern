import React, { useState, useEffect } from "react";
import {
  Button,
  Icon,
  Confirm,
  Grid,
  GridRow,
  GridColumn,
  Segment,
  Table,
} from "semantic-ui-react";
import { Permission, Role } from "../../../../api";
import { useAuth } from "../../../../hooks";
import { BasicModal } from "../../../Shared";
import { PermissionForm } from "../PermissionForm";
import {
  convertModulesEngToEsp,
  convertActionsEngToEsp,
} from "../../../../utils/converts";
import {
  hasPermission,
  isAdmin,
  isMaster,
} from "../../../../utils/checkPermission";
import "./PermissionItem.scss";
import { useLanguage } from "../../../../contexts";

const permissionController = new Permission();
const roleController = new Role();

export function PermissionItem(props) {
  const { permission, onReload } = props;
  const {
    accessToken,
    user: { role },
  } = useAuth();

  const { translations } = useLanguage();
  
  const t = (key) => translations[key] || key ; // Función para obtener la traducción

  const [permissionsByRole, setPermissionsByRole] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [titleModal, setTitleModal] = useState("");

  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [isDelete, setIsDelete] = useState(false);

  const onOpenCloseModal = () => setShowModal((prevState) => !prevState);
  const onOpenCloseConfirm = () => setShowConfirm((prevState) => !prevState);

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

  const openUpdateUser = () => {
    setTitleModal(`${t("update")}: ${t(permission.role.name.toLowerCase())} / ${t(permission.module)} / ${t(permission.action)}`);
    onOpenCloseModal();
  };

  const openDesactivateActivateConfim = () => {
    setIsDelete(false);
    setConfirmMessage(
      permission.active
        ? `¿${t("question_inactive")} "${t(permission.role.name.toLowerCase())} / ${t(permission.module)} / ${t(permission.action)}"?`
        : `¿${t("question_active")} "${t(permission.role.name.toLowerCase())} / ${t(permission.module)} / ${t(permission.action)}"?`
    );
    onOpenCloseConfirm();
  };

  const onActivateDesactivate = async () => {
    try {
      await permissionController.updatePermission(accessToken, permission._id, {
        active: !permission.active,
      });
      onReload();
      onOpenCloseConfirm();
    } catch (error) {
      console.error(error);
    }
  };

  const openDeleteConfirm = () => {
    setIsDelete(true);
    setConfirmMessage(`${t("are_you_sure_you_want_to_remove_the_permission")} "${permission.role.name} / ${t(permission.module)} / ${t(permission.action)}"?`);
    onOpenCloseConfirm();
  };

  const onDelete = async () => {
    try {
      await permissionController.deletePermission(accessToken, permission._id);
      onReload();
      onOpenCloseConfirm();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Table.Row key={permission._id}>
        <Table.Cell>
          <Icon color={permission.active ? "green" : "red"} name="circle" />
        </Table.Cell>
        <Table.Cell>
          {permission.role && permission.role.name
            ? t(permission.role.name.toLowerCase())
            : null}
        </Table.Cell>
        <Table.Cell>{t(permission.module)}</Table.Cell>
        <Table.Cell>{t(permission.action)}</Table.Cell>
        <Table.Cell>
          {isMaster(role) ||
          isAdmin(role) ||
          hasPermission(permissionsByRole, role._id, "permissions", "edit") ? (
            <Button icon primary onClick={openUpdateUser}>
              <Icon name="pencil" />
            </Button>
          ) : null}
          {isMaster(role) ||
          isAdmin(role) ||
          hasPermission(permissionsByRole, role._id, "permissions", "edit") ? (
            <Button
              icon
              color={permission.active ? "orange" : "teal"}
              onClick={openDesactivateActivateConfim}
            >
              <Icon name={permission.active ? "ban" : "check"} />
            </Button>
          ) : null}
          {isMaster(role) ||
          isAdmin(role) ||
          hasPermission(
            permissionsByRole,
            role._id,
            "permissions",
            "delete"
          ) ? (
            <Button icon color="red" onClick={openDeleteConfirm}>
              <Icon name="trash" />
            </Button>
          ) : null}
        </Table.Cell>
      </Table.Row>

      <BasicModal show={showModal} close={onOpenCloseModal} title={titleModal}>
        <PermissionForm
          close={onOpenCloseModal}
          onReload={onReload}
          permission={permission}
        />
      </BasicModal>

      <Confirm
        open={showConfirm}
        onCancel={onOpenCloseConfirm}
        onConfirm={isDelete ? onDelete : onActivateDesactivate}
        content={confirmMessage}
        size="tiny"
        cancelButton={t("cancel")}
        confirmButton={t("accept")}
      />
    </>
  );
}
