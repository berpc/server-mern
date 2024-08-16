import React, { useState } from "react";
import { Button, Icon, Confirm } from "semantic-ui-react";
import { Role } from "../../../../api";
import { useAuth } from "../../../../hooks";
import { BasicModal } from "../../../Shared";
import { RoleForm } from "../RoleForm";
import "./RoleItem.scss";

const roleController = new Role();

export function RoleItem(props) {
  const { role, onReload } = props;
  const { accessToken } = useAuth();

  const [showModal, setShowModal] = useState(false);
  const [titleModal, setTitleModal] = useState("");

  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [isDelete, setIsDelete] = useState(false);

  const onOpenCloseModal = () => setShowModal((prevState) => !prevState);
  const onOpenCloseConfirm = () => setShowConfirm((prevState) => !prevState);

  const openUpdateUser = () => {
    setTitleModal(`Actualizar ${role.name}`);
    onOpenCloseModal();
  };

  const openDesactivateActivateConfim = () => {
    setIsDelete(false);
    setConfirmMessage(
      role.active
        ? `Desactivar rol ${role.name}`
        : `Activar rol ${role.name}`
    );
    onOpenCloseConfirm();
  };

  const onActivateDesactivate = async () => {
    try {
      await roleController.updateRole(accessToken, role._id, {
        active: !role.active,
      });
      onReload();
      onOpenCloseConfirm();
    } catch (error) {
      console.error(error);
    }
  };

  const openDeleteConfirm = () => {
    setIsDelete(true);
    setConfirmMessage(`Eliminar el rol ${role.name}`);
    onOpenCloseConfirm();
  };

  const onDelete = async () => {
    try {
      await roleController.deleteRole(accessToken, role._id);
      onReload();
      onOpenCloseConfirm();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="role-item">
        <div className="role-item__info">
          <div>
              {role.name}        
          </div>
        </div>
        <div>
          <Button icon primary onClick={openUpdateUser}>
            <Icon name="pencil" />
          </Button>
          <Button
            icon
            color={role.active ? "orange" : "teal"}
            onClick={openDesactivateActivateConfim}
          >
            <Icon name={role.active ? "ban" : "check"} />
          </Button>
          <Button icon color="red" onClick={openDeleteConfirm}>
            <Icon name="trash" />
          </Button>
        </div>
      </div>

      <BasicModal show={showModal} close={onOpenCloseModal} title={titleModal}>
        <RoleForm close={onOpenCloseModal} onReload={onReload} role={role} />
      </BasicModal>

      <Confirm
        open={showConfirm}
        onCancel={onOpenCloseConfirm}
        onConfirm={isDelete ? onDelete : onActivateDesactivate}
        content={confirmMessage}
        size="mini"
      />
    </>
  );
}
