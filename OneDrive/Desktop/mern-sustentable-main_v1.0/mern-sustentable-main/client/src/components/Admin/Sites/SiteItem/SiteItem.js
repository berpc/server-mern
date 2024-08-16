import React, { useState, useEffect } from "react";
import {
  Image,
  Button,
  Icon,
  Confirm,
  CommentAction,
  Table,
  TableCell,
} from "semantic-ui-react";
import { image } from "../../../../assets";
import { Permission, Site } from "../../../../api";
import { useAuth } from "../../../../hooks";
import { BasicModal } from "../../../Shared";
import { ENV } from "../../../../utils";
import { SiteForm } from "../SiteForm";
import "./SiteItem.scss";
import {
  hasPermission,
  isAdmin,
  isMaster,
} from "../../../../utils/checkPermission";

const siteController = new Site();
const permissionController = new Permission();

export function SiteItem(props) {
  const { site, onReload } = props;
  const {
    accessToken,
    user: { role },
  } = useAuth();

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

  const openUpdateSite = () => {
    setTitleModal(`Actualizar ${site.name ? site.name : ""}`);
    onOpenCloseModal();
  };

  const openDesactivateActivateConfim = () => {
    setIsDelete(false);
    setConfirmMessage(
      site.active
        ? `¿Está seguro que desea desactivar "${site.name ? site.name : ""}"?`
        : `¿Está seguro que desea activar "${site.name ? site.name : ""}"?`
    );
    onOpenCloseConfirm();
  };

  const onActivateDesactivate = async () => {
    try {
      await siteController.updateSite(accessToken, site._id, {
        active: !site.active,
      });
      onReload();
      onOpenCloseConfirm();
    } catch (error) {
      console.error(error);
    }
  };

  const openDeleteConfirm = () => {
    setIsDelete(true);
    setConfirmMessage(`¿Está seguro que desea eliminar "${site.name ? site.name : ""}"?`);
    onOpenCloseConfirm();
  };

  const onDelete = async () => {
    try {
      await siteController.deleteSite(accessToken, site._id);
      onReload();
      onOpenCloseConfirm();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Table.Row key={site._id}>
        <Table.Cell>{site.name ? site.name : ""}</Table.Cell>
        <Table.Cell>{site.email}</Table.Cell>
        <Table.Cell>
          { isMaster(role) || isAdmin(role) ||
          hasPermission(permissionsByRole, role._id, "sites", "edit") ? (
            <Button icon primary onClick={openUpdateSite}>
              <Icon name="pencil" />
            </Button>
          ) : null}
          {isMaster(role) || isAdmin(role) ||
          hasPermission(permissionsByRole, role._id, "sites", "edit") ? (
            <Button
              icon
              color={site.active ? "orange" : "teal"}
              onClick={openDesactivateActivateConfim}
            >
              <Icon name={site.active ? "ban" : "check"} />
            </Button>
          ) : null}
          {isMaster(role) || isAdmin(role) ||
          hasPermission(permissionsByRole, role._id, "sites", "delete") ? (
            <Button icon color="red" onClick={openDeleteConfirm}>
              <Icon name="trash" />
            </Button>
          ) : null}
        </Table.Cell>
      </Table.Row>

      <BasicModal show={showModal} close={onOpenCloseModal} title={titleModal}>
        <SiteForm close={onOpenCloseModal} onReload={onReload} site={site} />
      </BasicModal>

      <Confirm
        open={showConfirm}
        onCancel={onOpenCloseConfirm}
        onConfirm={isDelete ? onDelete : onActivateDesactivate}
        content={confirmMessage}
        size="tiny"
        cancelButton='Cancelar'
        confirmButton="Aceptar"
      />
    </>
  );
}
