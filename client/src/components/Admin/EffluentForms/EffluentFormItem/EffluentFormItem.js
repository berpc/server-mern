import React, { useState, useEffect } from "react";
import { Image, Button, Icon, Confirm, Table } from "semantic-ui-react";
import { BasicModal } from "../../../Shared";
import { ENV } from "../../../../utils";
import { Permission, Effluentform } from "../../../../api";
import { useAuth } from "../../../../hooks";
import { EffluentForm } from "../EffluentForm";
import {
  hasPermission,
  isAdmin,
  isMaster,
} from "../../../../utils/checkPermission";
import "./EffluentFormItem.scss";
import {
  formatDateHourCompleted,
  formatDateView,
} from "../../../../utils/formatDate";
import { useLanguage } from "../../../../contexts";

const effluentFormController = new Effluentform();
const permissionController = new Permission();

export function EffluentFormItem(props) {
  const { effluentForm, onReload } = props;
  const [showModal, setShowModal] = useState(false);
  const [titleModal, setTitleModal] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const {
    accessToken,
    user: { role },
  } = useAuth();

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
      await effluentFormController.deleteEffluentForm(
        accessToken,
        effluentForm._id
      );
      onReload();
      onOpenCloseConfirm();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Table.Row key={effluentForm._id}>
        <Table.Cell>
          <Icon color={effluentForm.active ? "green" : "red"} name="circle" />
        </Table.Cell>
        <Table.Cell>{formatDateView(effluentForm.date)}</Table.Cell>
        <Table.Cell>
          {effluentForm.creator_user
            ? effluentForm.creator_user.lastname
              ? effluentForm.creator_user.lastname +
                " " +
                effluentForm.creator_user.firstname
              : effluentForm.creator_user.email
            : null}
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

      <BasicModal
        show={showModal}
        close={onOpenCloseModal}
        title={titleModal}
        size={"fullscreen"}
      >
        <EffluentForm
          onClose={onOpenCloseModal}
          onReload={onReload}
          effluentForm={effluentForm}
        />
      </BasicModal>

      <Confirm
        open={showConfirm}
        onCancel={onOpenCloseConfirm}
        onConfirm={onDelete}
        content={`${t("delete_effluent_form_with_date")} ${formatDateView(
          effluentForm.date
        )}`}
        size="tiny"
        cancelButton={t("cancel")}
        confirmButton={t("accept")}
      />
    </>
  );
}
