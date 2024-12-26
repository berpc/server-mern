import React, { useState, useEffect } from "react";
import {
  Loader,
  Search,
  Grid,
  GridColumn,
  Divider,
  Dropdown,
  DropdownHeader,
  DropdownMenu,
  DropdownItem,
  Input,
  Icon,
  Table,
} from "semantic-ui-react";
import { size, map } from "lodash";
import { Permission, User } from "../../../../api";
import { useAuth } from "../../../../hooks";
import { UserItem } from "../UserItem";
import {
  hasPermission,
  isAdmin,
  isMaster,
} from "../../../../utils/checkPermission";
import { ErrorAccessDenied } from "../../../../pages/admin/Error";
import { useLanguage } from "../../../../contexts";
const _ = require("lodash");

const userController = new User();
const permissionController = new Permission();

export function ListUsers(props) {
  const { usersActive, reload, onReload } = props;
  const [users, setUsers] = useState(null);
  const [usersFilter, setUsersFilter] = useState(null);

  const {
    accessToken,
    user: { role, site, company },
  } = useAuth();

  const [permissionByRole, setPermissionsByRole] = useState([]);

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

  useEffect(() => {
    (async () => {
      try {
        setUsers(null);
        setUsersFilter([]);
        if (company && !site) {
          const response = await userController.getUsersByCompany(
            accessToken,
            company._id,
            usersActive
          );
          let result = response.map((s) => ({ ...s, key: s._id }));
          setUsers(result);
          setUsersFilter(result);
        } else if (site && company) {
          const response = await userController.getUsersBySite(
            accessToken,
            site._id,
            usersActive
          );
          let result = response.map((s) => ({ ...s, key: s._id }));
          setUsers(result);
          setUsersFilter(result);
        } else {
          if (isMaster(role)) {
            const response = await userController.getUsers(
              accessToken,
              usersActive
            );
            let result = response.map((s) => ({ ...s, key: s._id }));
            setUsers(result);
            setUsersFilter(result);
          }
        }
      } catch (error) {
        console.error(error);
      }
    })();
  }, [usersActive, reload, accessToken]);

  if (!users) return <Loader active inline="centered" />;
  if (size(users) === 0) return t("there_is_no_user");

  return (
    <div>
      {isMaster(role) ||
      isAdmin(role) ||
      hasPermission(permissionByRole, role._id, "users", "view") ? (
        <div>
          <div>
            <SearchStandardUser
              dataOrigin={users}
              data={usersFilter}
              setData={setUsersFilter}
              t={t}
            />
          </div>
          <Divider clearing />

          <Table celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>{t("name")}</Table.HeaderCell>
                <Table.HeaderCell>{t("lastname")}</Table.HeaderCell>
                <Table.HeaderCell>{t("email")}</Table.HeaderCell>
                <Table.HeaderCell>{t("role")}</Table.HeaderCell>
                <Table.HeaderCell>{t("actions")}</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {map(usersFilter, (user) => (
                <UserItem key={user._id} user={user} onReload={onReload} />
              ))}
            </Table.Body>
          </Table>
        </div>
      ) : (
        <ErrorAccessDenied />
      )}
    </div>
  );
}

function SearchStandardUser(props) {
  const { dataOrigin, data, setData, t } = props;
  const [state, setState] = useState({
    isLoading: false,
    results: [],
    value: "",
  });

  const [filter, setFilter] = useState("firstname");

  const handleChange = (e, { name, value }) => {
    setFilter(value);
    setData(dataOrigin);
    setState({ value: "" });
  };

  const handleSearchChange = (e, { value }) => {
    setState({ isLoading: true, value });

    setTimeout(() => {
      if (value && value.length < 1) {
        setState({ isLoading: false, results: [], value: "" });
        setData(dataOrigin);
        return true;
      } else if (value.length === 0) {
        setData(dataOrigin);
        setState({ isLoading: false, results: [], value: "" });
        return true;
      }
      const filteredData = dataOrigin.filter((item) =>
        Object.values(item).some((v) =>
          v.toString().toLowerCase().includes(value.toLowerCase())
        )
      );
      // const re = new RegExp(_.escapeRegExp(value), "i");
      // const isMatch = (result) => re.test(result[filter]);
      setState({
        isLoading: false,
        results: filteredData,
      });
      setData(filteredData);
    }, 300);
  };

  // const options = [
  //   {
  //     key: 1,
  //     text: "Nombre",
  //     value: "firstname",
  //   },
  //   {
  //     key: 2,
  //     text: "Apellido",
  //     value: "lastname",
  //   },
  //   {
  //     key: 3,
  //     text: "Email",
  //     value: "email",
  //   },
  // ];

  return (
    <Grid>
      <GridColumn width={4}>
        <Input
          icon="search"
          iconPosition="left"
          placeholder={t("search")}
          onChange={_.debounce(handleSearchChange, 500, {
            leading: true,
          })}
          // action={
          //   <Dropdown
          //     onChange={handleChange}
          //     options={options}
          //     value={filter}
          //     button
          //     basic
          //     floating
          //   />
          // }
        />
      </GridColumn>
    </Grid>
  );
}
