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
            <Icon name="home" />
            Dashboard
          </Menu.Item>):null}

          {/* {isMaster(role) || isAdmin(role) ||
          hasPermission(permissionActive, role._id, "data", "menu") ? (
            <Dropdown floating labeled item text="Datos">
              <DropdownMenu>
                {isMaster(role)|| isAdmin(role) ||
                hasPermission(permissionActive, role._id, "sites", "menu") ? (
                  <DropdownItem
                    as={Link}
                    to="/admin/data/sites"
                    active={isCurrentPath("/admin/data/sites")}
                  >
                    {" "}
                    <Icon name="users" /> Site
                  </DropdownItem>
                ) : null} */}
                {/* {isMaster(role) || isAdmin(role) ||
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
                ) : null} */}
              {/* </DropdownMenu>
            </Dropdown>
          ) : null} */}


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
            <Icon name="archive" />
            Reportes
          </Menu.Item>
          <Menu.Item
            as={Link}
            to="/admin/companies"
            active={isCurrentPath("/admin/companies")}
          >
            <Icon name="building" />
            Empresas
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
            <Dropdown floating labeled item text="Configuracion">
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
