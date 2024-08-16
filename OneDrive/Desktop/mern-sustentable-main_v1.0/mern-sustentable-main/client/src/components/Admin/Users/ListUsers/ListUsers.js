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
const _ = require("lodash");

const userController = new User();
const permissionController = new Permission();

export function ListUsers(props) {
  const { usersActive, reload, onReload } = props;
  const [users, setUsers] = useState(null);
  const [usersFilter, setUsersFilter] = useState(null);

  const {
    accessToken,
    user: { role },
  } = useAuth();

  const [permissionByRole, setPermissionsByRole] = useState([]);

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
        const response = await userController.getUsers(
          accessToken,
          usersActive
        );
        let result = response.map((s) => ({ ...s, key: s._id }));
        setUsers(result);
        setUsersFilter(result);
      } catch (error) {
        console.error(error);
      }
    })();
  }, [usersActive, reload, accessToken]);

  if (!users) return <Loader active inline="centered" />;
  if (size(users) === 0) return "No hay ningun usuario";

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
            />
          </div>
          <Divider clearing />

          <Table celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Nombre</Table.HeaderCell>
                <Table.HeaderCell>Apellido</Table.HeaderCell>
                <Table.HeaderCell>Email</Table.HeaderCell>
                <Table.HeaderCell>Rol</Table.HeaderCell>
                <Table.HeaderCell>Acciones</Table.HeaderCell>
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
  const { dataOrigin, data, setData } = props;
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
      const filteredData = dataOrigin.filter(item =>
        Object.values(item).some(v =>
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
          placeholder="Buscar..."
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
