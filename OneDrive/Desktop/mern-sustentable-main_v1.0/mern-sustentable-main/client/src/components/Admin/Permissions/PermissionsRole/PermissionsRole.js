import React, { useState, useEffect } from "react";
import {
  Button,
  Icon,
  Confirm,
  Grid,
  GridRow,
  GridColumn,
  List,
  ListColumn,
  ListItem,
  ListContent,
  Checkbox,
  Segment,
  Header,
  Divider,
  SegmentGroup,
  Dropdown,
  Form,
  FormButton,
} from "semantic-ui-react";
import { Permission, Role } from "../../../../api";
import { useAuth } from "../../../../hooks";
import { useFormik } from "formik";
import { BasicModal } from "../../../Shared";
// import { PermissionForm } from "../PermissionForm";
import {
  convertModulesEngToEsp,
  convertActionsEngToEsp,
} from "../../../../utils/converts";
import { MODULES } from "../../../../utils/constants";
import "./PermissionsRole.scss";

const permissionController = new Permission();
const roleController = new Role();

export function PermissionsRole(props) {
  const { role, onReload } = props;
  const { accessToken } = useAuth();

  const [listPermissions, setListPermissions] = useState([]);
  const [listPermissionsFilter, setListPermissionsFilter] = useState([]);
  const [moduleData, setModuleData] = useState("users");

  useEffect(() => {
    if (role) {
      permissionController
        .getPermissionsByRoleId(accessToken, role._id)
        .then((response) => {
          if (response) {
            setListPermissions(response);
            // const info = Object.keys(result);
            // setModules(info);
          } else {
            setListPermissions([]);
          }
          //  console.log(listPermissions)
        });
    }
  }, [role]);

  useEffect(() => {
    if (moduleData !== "" && listPermissions) {
      //Agrupa por modulo
      const result = listPermissions.filter((i) => i.module === moduleData);
      setListPermissionsFilter(result);
    }
  }, [moduleData, listPermissions]);

  const [showModal, setShowModal] = useState(false);
  const [titleModal, setTitleModal] = useState("");

  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [isDelete, setIsDelete] = useState(false);

  const onOpenCloseModal = () => setShowModal((prevState) => !prevState);
  const onOpenCloseConfirm = () => setShowConfirm((prevState) => !prevState);

  const openUpdatePermission = (permission) => {
    setTitleModal(`Actualizar ${permission.action}`);
    onOpenCloseModal();
  };

  const openDesactivateActivateConfim = (permission) => {
    setIsDelete(false);
    setConfirmMessage(
      permission.active
        ? `Desactivar permiso ${permission.action}`
        : `Activar permiso ${permission.action}`
    );
    onOpenCloseConfirm();
  };

  const onActivateDesactivate = async (permission) => {
    try {
      await permissionController.updatePermission(accessToken, permission._id, {
        active: permission.active,
      });
      // setOnReloadModal(!onReloadModal);
      //onOpenCloseConfirm();
    } catch (error) {
      console.error(error);
    }
  };

  const confirmData = (e) => {
    listPermissionsFilter.map(async (i) => {
      return await onActivateDesactivate(i);
      // // setOnReloadModal(!onReloadModal);
    });
    onReload();
    //onOpenCloseConfirm();
  };

  const setActivateDesactivate = (checked, index) => {
    const newData = [...listPermissionsFilter];
    newData[index].active = checked;
    setListPermissionsFilter(newData);
  };

  const openDeleteConfirm = (permission) => {
    setIsDelete(true);
    setConfirmMessage(`Eliminar el permiso ${permission.action}`);
    onOpenCloseConfirm();
  };

  const onDelete = async (permission) => {
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
      <Form onSubmit={confirmData}>
        <div className="permissions-role-item">
          <div className="permissions-role-item__info">
            <div>
              <Divider horizontal>
                <Header as="h4">Módulo</Header>
              </Divider>
              <Dropdown
                label="Modulo"
                // placeholder="Selecciona un modulo"
                options={MODULES.map((ds) => {
                  return {
                    key: ds,
                    text: convertModulesEngToEsp(ds),
                    value: ds,
                  };
                })}
                selection
                onChange={(_, data) => setModuleData(data.value)}
                value={moduleData}
              />
            </div>
          </div>
          {listPermissionsFilter && listPermissionsFilter.length >= 0 ? (
            <div className="permissions-role-item__">
              <Divider horizontal>
                <Header as="h4">
                  {/* <Icon name='tag' /> */}
                  Permisos
                </Header>
              </Divider>
                {listPermissionsFilter.map((permission, index) => {
                  return (
                    <div>
                      <Grid celled>
                        <GridRow>
                          <GridColumn width={2}>
                            <Icon name={actionIcon(permission.action)} />
                          </GridColumn>
                          <GridColumn width={5}>
                            {convertActionsEngToEsp(permission.action)}
                          </GridColumn>
                          <GridColumn width={3}>
                            <Checkbox
                              toggle
                              checked={permission.active}
                              label={permission.active? 'Habilitado' : "deshabilitado"}
                              onChange={(e, { checked }) => {
                                setActivateDesactivate(checked, index);
                              }}
                            />
                          </GridColumn>
                        </GridRow>
                      </Grid>
                    </div>
                  );
                  //   </ListContent>
                  // </ListItem>
                })}
              {/* </List> */}
              {/* </List> */}
              {/* <div>
            <Grid divided="vertically" celled='internally'>
              <GridRow >
                <GridColumn width={6}>
                  <p>{role}</p>
                </GridColumn>
                <GridColumn width={6}>
                  <p>{convertModulesEngToEsp(permission.module)}</p>
                </GridColumn>
                <GridColumn>
                  <p>{convertActionsEngToEsp(permission.action)}</p>
                </GridColumn>
              </GridRow>
            </Grid>
          </div> */}
            </div>
          ) : null}
          {/* <div>
          <Button icon primary onClick={openUpdateUser}>
            <Icon name="pencil" />
          </Button>
          <Button
            icon
            color={permission.active ? "orange" : "teal"}
            onClick={openDesactivateActivateConfim}
          >
            <Icon name={permission.active ? "ban" : "check"} />
          </Button>
          <Button icon color="red" onClick={openDeleteConfirm}>
            <Icon name="trash" />
          </Button>
        </div> */}
        </div>

        <div>
          <FormButton type="submit" primary content={"Guardar"} />
        </div>

        <Confirm
          open={showConfirm}
          onCancel={onOpenCloseConfirm}
          onConfirm={isDelete ? onDelete : onActivateDesactivate}
          content={confirmMessage}
          size="mini"
        />
      </Form>
    </>
  );
}

// function PermissionRoleItem(props) {
//   const { module, permissions, listPermissions, setListPermissions } = props;

//   const setActivateDesactivate = (checked, index) => {
//     const newData = { ...listPermissions };
//     newData[module][index].active = checked;
//     setListPermissions(newData);
//   };

//   return permissions.map((permission, index) => {
//     return (
//       <div>
//         <Grid divided="vertically" celled="internally">
//           <GridRow>
//           <GridColumn>
//           <Icon name={actionIcon(permission.action)} />
//           </GridColumn>
//             <GridColumn width={10}>
//               <p>{convertActionsEngToEsp(permission.action)}</p>
//             </GridColumn>
//             <GridColumn width={4}>
//               <Checkbox
//                 toggle
//                 checked={permission.active}
//                 onChange={(e) => {
//                   setActivateDesactivate(e.checked, index);
//                 }}
//               />
//             </GridColumn>
//           </GridRow>
//         </Grid>
//       </div>
//     );
//   });
// }

function actionIcon(a) {
  switch (a) {
    case "edit":
      return "edit";
    case "delete":
      return "trash alternate outline";
    case "create":
      return "add circle";
    case "update":
      return "pencil alternate";
    case "view":
      return "eye";
    case "menu":
      return "th list";
    default:
      return null;
  }
}
