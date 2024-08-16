import React, { useState, useEffect } from "react";
import { Image, Button, Icon, Confirm, Table } from "semantic-ui-react";
import { BasicModal } from "../../../Shared";
import { ENV } from "../../../../utils";
import { Permission, Energyform } from "../../../../api";
import { useAuth } from "../../../../hooks";
import { EnergyForm } from "../EnergyForm";
import {
  hasPermission,
  isAdmin,
  isMaster,
} from "../../../../utils/checkPermission";
import "./EnergyFormItem.scss";
import { formatDateHourCompleted, formatDateView } from "../../../../utils/formatDate";

const energyFormController = new Energyform();
const permissionController = new Permission();

export function EnergyFormItem(props) {
  const { energyForm, onReload } = props;
  const [showModal, setShowModal] = useState(false);
  const [titleModal, setTitleModal] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const { accessToken  , user: { role }, } = useAuth();

  const onOpenCloseModal = () => setShowModal((prevState) => !prevState);
  const onOpenCloseConfirm = () => setShowConfirm((prevState) => !prevState);

  const [permissionsByRole, setPermissionsByRole] = useState([]);

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
    setTitleModal(`Actualizar Formulario de Energia`);
    onOpenCloseModal();
  };

  const onDelete = async () => {
    try {
      //TODO: modificar por controlador correspondiente
      //await energyFormController.deleteEnergyForm(accessToken, energyForm._id);
      onReload();
      onOpenCloseConfirm();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>

        <Table.Row key={energyForm._id}>
        <Table.Cell>
          <Icon color={energyForm.active ? "green" : "red"} name="circle" />
        </Table.Cell>
        <Table.Cell>{formatDateView(energyForm.date)}</Table.Cell>
        <Table.Cell>
          {energyForm.creator_user? 
          energyForm.creator_user.lastname? energyForm.creator_user.lastname + " " + energyForm.creator_user.firstname
          : energyForm.creator_user.email : null}
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
        <EnergyForm
          onClose={onOpenCloseModal}
          onReload={onReload}
          energyForm={energyForm}
        />
      </BasicModal>

      <Confirm
        open={showConfirm}
        onCancel={onOpenCloseConfirm}
        onConfirm={onDelete}
        content={`Eliminar el formulario de energia con fecha ${formatDateView(energyForm.date)}`}
        size="mini"
      />
    </>
  );
}
