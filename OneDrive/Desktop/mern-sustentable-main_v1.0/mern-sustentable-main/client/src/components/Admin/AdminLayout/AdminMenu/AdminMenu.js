import React, { useEffect, useState } from "react";
import {
  Menu,
  Icon,
  DropdownMenu,
  Dropdown,
  DropdownItem,
  DropdownHeader,
} from "semantic-ui-react";
import { Link, useLocation } from "react-router-dom";
import { Permission } from "../../../../api";
import { useAuth } from "../../../../hooks";
import "./AdminMenu.scss";
import { hasPermission, isAdmin, isMaster } from "../../../../utils/checkPermission";

const permissionController = new Permission();

export function AdminMenu() {
  const { pathname } = useLocation();
  const {
    user: { role },
    accessToken,
  } = useAuth();

  const [permissionActive, setPermissionsActive] = useState([]);

  // const isAdmin = (role? role.name : "") === "admin";

  const isCurrentPath = (path) => {
    if (path === pathname) return true;
    return false;
  };

  useEffect(() => {
    (async () => {
      try {
        setPermissionsActive([]);
        if (role) {
          const response = await permissionController.getPermissionsByRole(
            accessToken,
            role._id,
            true
          );
          setPermissionsActive(response);
        }
      } catch (error) {
        console.error(error);
        setPermissionsActive([]);
      }
    })();
  }, [role]);

  return (
    <Menu fluid vertical icon text className="admin-menu">
      {(
        <>
         {isMaster(role) || isAdmin(role) ||
          hasPermission(permissionActive, role._id, "dashboard", "menu") ? (
          <Menu.Item
            as={Link}
            to="/admin/dashboard"
            active={isCurrentPath("/admin/dashboard")}
          >
            <Icon name="table" />
            Dashboard
          </Menu.Item>):null}

          {isMaster(role) || isAdmin(role) ||
          hasPermission(permissionActive, role._id, "data", "menu") ? (
            <Dropdown trigger={<span style={{marginRight:"40%"}}><Icon name='upload'/>Datos</span>} floating labeled item>
              <DropdownMenu>
                {isMaster(role)|| isAdmin(role) ||
                hasPermission(permissionActive, role._id, "siteform", "menu") ? (
                  <DropdownItem
                    as={Link}
                    to="/admin/data/siteforms"
                    active={isCurrentPath("/admin/data/siteforms")}
                  >
                    <Icon name="file alternate" /> 
                    {"Sitio"}
                  </DropdownItem>
                ) : null} 
                    {isMaster(role)|| isAdmin(role) ||
                hasPermission(permissionActive, role._id, "productionform", "menu") ? (
                  <DropdownItem
                    as={Link}
                    to="/admin/data/productionforms"
                    active={isCurrentPath("/admin/data/productionforms")}
                  >
                    <Icon name="file alternate" /> 
                    {"Producción"}
                  </DropdownItem>
                ) : null} 
                    {isMaster(role)|| isAdmin(role) ||
                hasPermission(permissionActive, role._id, "energyform", "menu") ? (
                  <DropdownItem
                    as={Link}
                    to="/admin/data/energyforms"
                    active={isCurrentPath("/admin/data/energyforms")}
                  >
                    <Icon name="file alternate" /> 
                    {"Energia"}
                  </DropdownItem>
                ) : null} 
                    {isMaster(role)|| isAdmin(role) ||
                hasPermission(permissionActive, role._id, "waterform", "menu") ? (
                  <DropdownItem
                    as={Link}
                    to="/admin/data/waterforms"
                    active={isCurrentPath("/admin/data/waterforms")}
                  >
                    <Icon name="file alternate" /> 
                    {"Agua"}
                  </DropdownItem>
                ) : null} 
                      {isMaster(role)|| isAdmin(role) ||
                hasPermission(permissionActive, role._id, "effluentform", "menu") ? (
                  <DropdownItem
                    as={Link}
                    to="/admin/data/effluentforms"
                    active={isCurrentPath("/admin/data/effluentforms")}
                  >
                    <Icon name="file alternate" /> 
                    {"Efluentes"}
                  </DropdownItem>
                ) : null} 
                          {/* {isMaster(role)|| isAdmin(role) ||
                hasPermission(permissionActive, role._id, "sites", "menu") ? (
                  <DropdownItem
                    as={Link}
                    to="/admin/data/siteforms"
                    active={isCurrentPath("/admin/data/siteforms")}
                  >
                    <Icon name="file alternate" /> 
                    {"Residuos"}
                  </DropdownItem>
                ) : null} 
                          {isMaster(role)|| isAdmin(role) ||
                hasPermission(permissionActive, role._id, "sites", "menu") ? (
                  <DropdownItem
                    as={Link}
                    to="/admin/data/siteforms"
                    active={isCurrentPath("/admin/data/siteforms")}
                  >
                    <Icon name="file alternate" /> 
                    {"Residuos Peliigrosos"}
                  </DropdownItem>
                ) : null} 
                            {isMaster(role)|| isAdmin(role) ||
                hasPermission(permissionActive, role._id, "sites", "menu") ? (
                  <DropdownItem
                    as={Link}
                    to="/admin/data/siteforms"
                    active={isCurrentPath("/admin/data/siteforms")}
                  >
                    <Icon name="file alternate" /> 
                    {"Energia LB"}
                  </DropdownItem>
                ) : null} 
                          {isMaster(role)|| isAdmin(role) ||
                hasPermission(permissionActive, role._id, "sites", "menu") ? (
                  <DropdownItem
                    as={Link}
                    to="/admin/data/siteforms"
                    active={isCurrentPath("/admin/data/siteforms")}
                  >
                    <Icon name="file alternate" /> 
                    {"KPIs"}
                  </DropdownItem>
                ) : null}  */}
                {isMaster(role) || isAdmin(role) ||
                hasPermission(
                  permissionActive,
                  role._id,
                  "permissions",
                  "menu"
                ) ? (
                  <DropdownItem
                    as={Link}
                    to="/admin/config/permissions"
                    active={isCurrentPath("/admin/config/permissions")}
                  >
                    {" "}
                    {/* <Icon name="clipboard list" /> Permisos */}
                  </DropdownItem>
                ) : null}
              </DropdownMenu>
            </Dropdown>
          ) : null} 



          {isMaster(role) || isAdmin(role) ||
          hasPermission(permissionActive, role._id, "users", "menu") ? (
            <Menu.Item
              as={Link}
              to="/admin/users"
              active={isCurrentPath("/admin/users")}
            >
              <Icon name="users" />
              Usuarios
            </Menu.Item>
          ) : null}

          {/* <Menu.Item
            as={Link}
            to="/admin/menu"
            active={isCurrentPath("/admin/menu")}
          >
            <Icon name="bars" />
            Menu
          </Menu.Item> */}
          <Menu.Item
            as={Link}
            to="/admin/reports"
            active={isCurrentPath("/admin/reports")}
          >
            <Icon name="file outline" />
            Reportes
          </Menu.Item>
          {isMaster(role) || 
          hasPermission(permissionActive, role._id, "users", "menu") ? (
          <Menu.Item
            as={Link}
            to="/admin/companies"
            active={isCurrentPath("/admin/companies")}
          >
            <Icon name="building" />
            Empresas
          </Menu.Item>
          ): null}

          <Menu.Item
            as={Link}
            to="/admin/sites"
            active={isCurrentPath("/admin/sites")}
          >
            <Icon name="building" />
            Sitios
          </Menu.Item>

          {/* <Menu.Item
            as={Link}
            to="/admin/roles"
            active={isCurrentPath("/admin/roles")}
          >
            <Icon name="user" />
            Roles
          </Menu.Item> */}

          {/* <Menu.Item
            as={Link}
            to="/admin/config"
            active={isCurrentPath("/admin/config")}
          >
            <Icon name="configure" />
            Configuracion
          </Menu.Item> */}
          {isMaster(role) || isAdmin(role) ||
          hasPermission(permissionActive, role._id, "configure", "menu") ? (
            <Dropdown  item trigger={<span style={{marginRight:"10%"}}><Icon name='configure'/>Configuracion</span>} >
              <DropdownMenu>
                {isMaster(role)|| isAdmin(role) ||
                hasPermission(permissionActive, role._id, "roles", "menu") ? (
                  <DropdownItem
                    as={Link}
                    to="/admin/config/roles"
                    active={isCurrentPath("/admin/config/roles")}
                  >
                    {" "}
                    <Icon name="users" /> Roles
                  </DropdownItem>
                ) : null}
                {isMaster(role) || isAdmin(role) ||
                hasPermission(
                  permissionActive,
                  role._id,
                  "permissions",
                  "menu"
                ) ? (
                  <DropdownItem
                    as={Link}
                    to="/admin/config/permissions"
                    active={isCurrentPath("/admin/config/permissions")}
                  >
                    {" "}
                    <Icon name="clipboard list" /> Permisos
                  </DropdownItem>
                ) : null}
              </DropdownMenu>
            </Dropdown>
          ) : null}
        </>
      )}
    </Menu>
  );
}
