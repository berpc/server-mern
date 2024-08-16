import React, { useState , useEffect} from "react";
import { Image, Button, Icon, Confirm, CommentAction, Table } from "semantic-ui-react";
import { image } from "../../../../assets";
import { Permission, Company } from "../../../../api";
import { useAuth } from "../../../../hooks";
import { BasicModal } from "../../../Shared";
import { ENV } from "../../../../utils";
import { CompanyForm } from "../CompanyForm";
import "./CompanyItem.scss";
import { hasPermission, isAdmin, isMaster } from "../../../../utils/checkPermission";

const companyController = new Company();
const permissionController = new Permission();

export function CompanyItem(props) {
  const { company, onReload } = props;
  const { accessToken, user: { role } } = useAuth();

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
          const response = await permissionController.getPermissionsByRole(accessToken, role._id, true);
          setPermissionsByRole(response);
        }
      } catch (error) {
        console.error(error);
        setPermissionsByRole([]);
      }
    })();
  }, [role]);

  const openUpdateCompany = () => {
    setTitleModal(`Actualizar ${company.name}`);
    onOpenCloseModal();
  };

  const openDesactivateActivateConfim = () => {
    setIsDelete(false);
    setConfirmMessage(
      company.active
        ? `¿Está seguro que desea desactivar "${company.name}"?`
        : `¿Está seguro que desea activar "${company.name}"?`
    );
    onOpenCloseConfirm();
  };

  const onActivateDesactivate = async () => {
    try {
      await companyController.updateCompany(accessToken, company._id, {
        active: !company.active,
      });
      onReload();
      onOpenCloseConfirm();
    } catch (error) {
      console.error(error);
    }
  };

  const openDeleteConfirm = () => {
    setIsDelete(true);
    setConfirmMessage(`¿Está seguro que desea eliminar "${company.name}"?`);
    onOpenCloseConfirm();
  };

  const onDelete = async () => {
    try {
      await companyController.deleteCompany(accessToken, company._id);
      onReload();
      onOpenCloseConfirm();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
        <Table.Row key={company._id}>
        <Table.Cell>{company.name ? company.name : ""}</Table.Cell>
        <Table.Cell>{company.email}</Table.Cell>
        <Table.Cell>
        {(isMaster(role) || hasPermission(permissionsByRole, role._id, "companies", "edit"))?(
          <Button icon primary onClick={openUpdateCompany}>
            <Icon name="pencil" />
          </Button>) : null}
          {(isMaster(role) || hasPermission(permissionsByRole, role._id, "companies", "edit"))?(
          <Button
            icon
            color={company.active ? "orange" : "teal"}
            onClick={openDesactivateActivateConfim}
          >
            <Icon name={company.active ? "ban" : "check"} />
          </Button> ):null}
          {(isMaster(role) || hasPermission(permissionsByRole, role._id, "companies", "delete"))?(
          <Button icon color="red" onClick={openDeleteConfirm}>
            <Icon name="trash" />
          </Button> ) : null }
        </Table.Cell>
      </Table.Row>

      <BasicModal show={showModal} close={onOpenCloseModal} title={titleModal}>
        <CompanyForm close={onOpenCloseModal} onReload={onReload} company={company} />
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
