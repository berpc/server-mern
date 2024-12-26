import React, { useState, useEffect } from "react";
import { Loader, Search } from "semantic-ui-react";
import { size, map } from "lodash";
import { Role } from "../../../../api";
import { useAuth } from "../../../../hooks";
import { RoleItem } from "../RoleItem";
import { useLanguage } from "../../../../contexts";

const roleController = new Role();

export function ListRoles(props) {
  const { rolesActive, reload, onReload } = props;
  const [roles, setRoles] = useState([]);
  const { accessToken } = useAuth();

  const { translations } = useLanguage();

  const t = (key) => translations[key] || key; // Función para obtener la traducción
  //   const [
  //     filterText,
  //     setFilterText
  // ] = useState("");
  // const [usersActiveFilter, setUsersActiveFilter] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        setRoles(null);
        const response = await roleController.getRoles(
          accessToken,
          rolesActive
        );
        setRoles(response);
      } catch (error) {
        console.error(error);
      }
    })();
  }, [rolesActive, reload, accessToken]);

  if (!roles) return <Loader active inline="centered" />;
  if (size(roles) === 0) return t("there_is_no_role");

  return (
    <div>
      {map(roles, (role) => (
        <RoleItem key={role._id} role={role} onReload={onReload} />
      ))}
    </div>
  );
}
