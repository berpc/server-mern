import React, { useState, useEffect } from "react";
import { Image, Button, Icon, Confirm, Table } from "semantic-ui-react";
import { BasicModal } from "../../../Shared";
import { ENV } from "../../../../utils";
import { Permission, Dangerousform } from "../../../../api";
import { useAuth } from "../../../../hooks";
import { DangerousForm } from "../DangerousForm";
import {
  hasPermission,
  isAdmin,
  isMaster,
} from "../../../../utils/checkPermission";
import "./DangerousFormItem.scss";
import { formatDateHourCompleted, formatDateView } from "../../../../utils/formatDate";
import { useLanguage } from "../../../../contexts";

const dangerousFormController = new Dangerousform();
const permissionController = new Permission();

export function DangerousFormItem(props) {
  const { dangerousForm, onReload } = props;
  const [showModal, setShowModal] = useState(false);
  const [titleModal, setTitleModal] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const { accessToken  , user: { role }, } = useAuth();

  const onOpenCloseModal = () => setShowModal((prevState) => !prevState);
  const onOpenCloseConfirm = () => setShowConfirm((prevState) => !prevState);

  const [permissionsByRole, setPermissionsByRole] = useState([]);

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

  const openUpdateSite = () => {
    setTitleModal(`${t("update")} ${t("effluent_form")}`);
    onOpenCloseModal();
  };

  const onDelete = async () => {
    try {
      //TODO: modificar por controlador correspondiente
      await dangerousFormController.deleteDangerousForm(accessToken, dangerousForm._id);
      onReload();
      onOpenCloseConfirm();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>

        <Table.Row key={dangerousForm._id}>
        <Table.Cell>
          <Icon color={dangerousForm.active ? "green" : "red"} name="circle" />
        </Table.Cell>
        <Table.Cell>{formatDateView(dangerousForm.date)}</Table.Cell>
        <Table.Cell>
          {dangerousForm.creator_user? 
          dangerousForm.creator_user.lastname? dangerousForm.creator_user.lastname + " " + dangerousForm.creator_user.firstname
          : dangerousForm.creator_user.email : null}
        </Table.Cell>
        <Table.Cell>
          {isMaster(role) ||
          isAdmin(role) ||
          hasPermission(permissionsByRole, role._id, "permissions", "edit") ? (
            <Button icon primary onClick={openUpdateSite}>
              <Icon name="pencil" />
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
            <Button icon color="red" onClick={onOpenCloseConfirm}>
              <Icon name="trash" />
            </Button>
          ) : null}
        </Table.Cell>
      </Table.Row>
          {/* <Button icon as="a" href={siteForm.url} target="_blank">
            <Icon name="eye" />
          </Button>
          <Button icon primary onClick={openUpdateSite}>
            <Icon name="pencil" />
          </Button>
          <Button icon color="red" onClick={onOpenCloseConfirm}>
            <Icon name="trash" />
          </Button> */}

      <BasicModal show={showModal} close={onOpenCloseModal} title={titleModal} size={'fullscreen'}>
        <DangerousForm
          onClose={onOpenCloseModal}
          onReload={onReload}
          dangerousForm={dangerousForm}
        />
      </BasicModal>

      <Confirm
        open={showConfirm}
        onCancel={onOpenCloseConfirm}
        onConfirm={onDelete}
        header={t("delete")}
        content={`${t("delete_dangerous_form_with_date")} ${formatDateView(dangerousForm.date)}`}
        size="tiny"
        cancelButton={t("cancel")}
        confirmButton={t("accept")}
      />
    </>
  );
}
