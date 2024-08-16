import React, { useState, useEffect } from "react";
import { Button, Icon, Confirm } from "semantic-ui-react";
import { Role, Permission } from "../../../../api";
import { useAuth } from "../../../../hooks";
import { BasicModal } from "../../../Shared";
import { RoleForm } from "../../Roles/RoleForm";
import { PermissionsRole } from "../PermissionsRole/PermissionsRole";
import "./RoleItem.scss";
import { isAdmin , hasPermission, isMaster} from "../../../../utils/checkPermission";

const roleController = new Role();
const permissionController = new Permission();

export function RoleItem(props) {
  const { role, onReload } = props;
  const { accessToken } = useAuth();
  const roleUser = useAuth().user.role;

  const [showModal, setShowModal] = useState(false);
  const [titleModal, setTitleModal] = useState("");

  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [isDelete, setIsDelete] = useState(false);


  const [listPermissions, setListPermissions] = useState([]);
  const [permissionsByRole, setPermissionsByRole] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        setPermissionsByRole([]);
        if (roleUser) {
          const response = await permissionController.getPermissionsByRole(accessToken, roleUser._id, true);
          setPermissionsByRole(response);
        }
      } catch (error) {
        console.error(error);
        setPermissionsByRole([]);
      }
    })();
  }, [roleUser]);
  

  useEffect(() => {
    if(role){
      permissionController.getPermissionsByRoleId(accessToken, role._id, true).then((response) => {
        setListPermissions(response);
      });
    }
  }, [role]);


  const onOpenCloseModal = () => setShowModal((prevState) => !prevState);
  const onOpenCloseConfirm = () => setShowConfirm((prevState) => !prevState);

  const openUpdatePermission = () => {
    setTitleModal(`Actualizar ${role.name}`);
    onOpenCloseModal();
  };

  // const openDesactivateActivateConfim = () => {
  //   setIsDelete(false);
  //   setConfirmMessage(
  //     role.active
  //       ? `Desactivar rol ${role.name}`
  //       : `Activar rol ${role.name}`
  //   );
  //   onOpenCloseConfirm();
  // };

  // const onActivateDesactivate = async () => {
  //   try {
  //     await roleController.updateRole(accessToken, role._id, {
  //       active: !role.active,
  //     });
  //     onReload();
  //     onOpenCloseConfirm();
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  // const openDeleteConfirm = () => {
  //   setIsDelete(true);
  //   setConfirmMessage(`Eliminar el rol ${role.name}`);
  //   onOpenCloseConfirm();
  // };

  // const onDelete = async () => {
  //   try {
  //     await roleController.deleteRole(accessToken, role._id);
  //     onReload();
  //     onOpenCloseConfirm();
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  return (
    <>
      <div className="role-item">
        <div className="role-item__info">
          <div>
              {role.name}
          </div>
        </div>
        <div>
        {(isMaster(roleUser) || isAdmin(roleUser) || hasPermission(permissionsByRole, roleUser._id, "permissions", "edit"))?(
          <Button icon primary onClick={openUpdatePermission} disabled={isAdmin(role)}>
            <Icon name="pencil" />
          </Button>) : null}
        </div>
      </div>

      <BasicModal show={showModal} close={onOpenCloseModal} title={titleModal}  size={"tiny"}>
        <PermissionsRole close={onOpenCloseModal} onReload={onReload} role={role} />
      </BasicModal>

      <Confirm
        open={showConfirm}
        onCancel={onOpenCloseConfirm}
        // onConfirm={isDelete ? onDelete : onActivateDesactivate}
        content={confirmMessage}
        size="mini"
      />
    </>
  );
}
