import React, { useState, useEffect } from "react";
import { Image, Button, Icon, Confirm, Table } from "semantic-ui-react";
import { image } from "../../../../assets";
import { Permission, User } from "../../../../api";
import { useAuth } from "../../../../hooks";
import { BasicModal } from "../../../Shared";
import { ENV } from "../../../../utils";
import { UserForm } from "../UserForm";
import "./UserItem.scss";
import {
  hasPermission,
  isAdmin,
  isMaster,
} from "../../../../utils/checkPermission";
import { useLanguage } from "../../../../contexts";

const userController = new User();
const permissionController = new Permission();

export function UserItem(props) {
  const { user, onReload } = props;
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

  const openUpdateUser = () => {
    setTitleModal(`${t("update")} ${user.email}`);
    onOpenCloseModal();
  };

  const openDesactivateActivateConfim = () => {
    setIsDelete(false);
    setConfirmMessage(
      user.active
        ? `${t("inactive_user")} ${user.email}`
        : `${t("active_user")}  ${user.email}`
    );
    onOpenCloseConfirm();
  };

  const onActivateDesactivate = async () => {
    try {
      await userController.updateUser(accessToken, user._id, {
        active: !user.active,
      });
      onReload();
      onOpenCloseConfirm();
    } catch (error) {
      console.error(error);
    }
  };

  const openDeleteConfirm = () => {
    setIsDelete(true);
    setConfirmMessage(`${t("delete_user")} ${user.email}`);
    onOpenCloseConfirm();
  };

  const onDelete = async () => {
    try {
      await userController.deleteUser(accessToken, user._id);
      onReload();
      onOpenCloseConfirm();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Table.Row key={user._id}>
        <Table.Cell>
          {/* <input
            type="text"
            value={user.name}
            // onChange={e => handleEdit(item.id, 'name', e.target.value)}
          /> */}
          {user.firstname}
        </Table.Cell>
        <Table.Cell>{user.lastname}</Table.Cell>
        <Table.Cell>{user.email ? user.email : ""}</Table.Cell>
        <Table.Cell>{user.role ? user.role.name : ""}</Table.Cell>
        <Table.Cell>
          {isMaster(role) ||
          isAdmin(role) ||
          hasPermission(permissionsByRole, role._id, "users", "edit") ? (
            <Button icon primary onClick={openUpdateUser}>
              <Icon name="pencil" />
            </Button>
          ) : null}
          {isMaster(role) ||
          isAdmin(role) ||
          hasPermission(permissionsByRole, role._id, "users", "edit") ? (
            <Button
              icon
              color={user.active ? "orange" : "teal"}
              onClick={openDesactivateActivateConfim}
            >
              <Icon name={user.active ? "ban" : "check"} />
            </Button>
          ) : null}
          {isMaster(role) ||
          isAdmin(role) ||
          hasPermission(permissionsByRole, role._id, "users", "delete") ? (
            <Button icon color="red" onClick={openDeleteConfirm}>
              <Icon name="trash" />
            </Button>
          ) : null}
        </Table.Cell>
      </Table.Row>

      <BasicModal show={showModal} close={onOpenCloseModal} title={titleModal}>
        <UserForm close={onOpenCloseModal} onReload={onReload} user={user} />
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

// <>
// <div className="user-item">
//   <div className="user-item__info">
//     {/* <Image
//       avatar
//       src={
//         user.avatar ? `${ENV.BASE_PATH}/${user.avatar}` : image.noAvatar
//       }
//     /> */}
//     <div>
//       <p>
//         {user.firstname} {user.lastname}
//       </p>
//       <p>{user.email}</p>
//     </div>
//   </div>

//   <div>
//     {(isMaster(role) || isAdmin(role) || hasPermission(permissionsByRole, role._id, "users", "edit"))?(
//     <Button icon primary onClick={openUpdateUser}>
//       <Icon name="pencil" />
//     </Button>) : null}
//     {(isMaster(role) || isAdmin(role) || hasPermission(permissionsByRole, role._id, "users", "edit"))?(
//     <Button
//       icon
//       color={user.active ? "orange" : "teal"}
//       onClick={openDesactivateActivateConfim}
//     >
//       <Icon name={user.active ? "ban" : "check"} />
//     </Button> ):null}
//     {(isMaster(role) || isAdmin(role) || hasPermission(permissionsByRole, role._id, "users", "delete"))?(
//     <Button icon color="red" onClick={openDeleteConfirm}>
//       <Icon name="trash" />
//     </Button> ) : null }
//   </div>
// </div>

// <BasicModal show={showModal} close={onOpenCloseModal} title={titleModal}>
//   <UserForm close={onOpenCloseModal} onReload={onReload} user={user} />
// </BasicModal>

// <Confirm
//   open={showConfirm}
//   onCancel={onOpenCloseConfirm}
//   onConfirm={isDelete ? onDelete : onActivateDesactivate}
//   content={confirmMessage}
//   size="mini"
// />
// </>
