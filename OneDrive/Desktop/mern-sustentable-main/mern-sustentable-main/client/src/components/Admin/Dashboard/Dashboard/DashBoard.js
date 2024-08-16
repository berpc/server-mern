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
import "./Dashboard.scss";
import { hasPermission, isAdmin } from "../../../../utils/checkPermission";

const permissionController = new Permission();

export function DashBoard() {
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
<></>
  );
}
