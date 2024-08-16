import React, { useState, useEffect } from "react";
import {
  Loader,
  Search,
  Grid,
  GridColumn,
  Divider,
  Dropdown,
  Input,
  Icon,
} from "semantic-ui-react";
import { size, map } from "lodash";
import { Permission, Company } from "../../../../api";
import { useAuth } from "../../../../hooks";
import { CompanyItem } from "../CompanyItem";
import { hasPermission, isAdmin, isMaster } from "../../../../utils/checkPermission";
import { ErrorAccessDenied } from "../../../../pages/admin/Error";
const _ = require("lodash");

const companyController = new Company();
const permissionController = new Permission();

export function ListCompanies(props) {
  const { companiesActive, reload, onReload } = props;
  const [ companies, setCompanies ] = useState(null);
  const [ companiesFilter, setCompaniesFilter ] = useState(null);

  const {
    accessToken,
    user: { role },
  } = useAuth();

  const [permissionByRole, setPermissionsByRole] = useState([]);

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
        setCompanies(null);
        setCompaniesFilter([]);
        const response = await companyController.getCompanies(
          accessToken,
          companiesActive
        );
        let result=response.map(s => ({ ...s, key: s._id }));
        setCompanies(result);
        setCompaniesFilter(result);
      } catch (error) {
        console.error(error);
      }
    })();
  }, [companiesActive, reload, accessToken]);

  if (!companies) return <Loader active inline="centered" />;
  if (size(companies) === 0) return "No hay ninguna empresa";

  return (
    <div>
      {isAdmin(role) ||
      hasPermission(permissionByRole, role._id, "companies", "view") ? (
        <div>
          <div>
            <SearchStandardCompany
              dataOrigin={companies}
              data={companiesFilter}
              setData={setCompaniesFilter}
            />
          </div>
          <Divider clearing />
          {map(companiesFilter, (company) => (
            <CompanyItem key={company._id} company={company} onReload={onReload} />
          ))}
        </div>
      ) : (
        <ErrorAccessDenied />
      )}
    </div>
  );
}

function SearchStandardCompany(props) {
  const { dataOrigin, data, setData } = props;
  const [state, setState] = useState({
    isLoading: false,
    results: [],
    value: "",
  });

  const [filter, setFilter] = useState("name");

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
      const re = new RegExp(_.escapeRegExp(value), "i");
      const isMatch = (result) => re.test(result[filter]);
      setState({
        isLoading: false,
        results: _.filter(data, isMatch),
      });
      setData(_.filter(data, isMatch));
    }, 300);
  };

  const options = [
    {
      key: 1,
      text: "Nombre",
      value: "name",
    },
    {
      key: 2,
      text: "CUIT",
      value: "cuit",
    },
    {
      key: 3,
      text: "Email",
      value: "email",
    },
  ];

  return (
    <Grid>
      <GridColumn width={4}>
      <Input
     icon='search'
     iconPosition='left'
    placeholder='Buscar...'
    onChange={_.debounce(handleSearchChange, 500, {
      leading: true,
    })}
    action={
      <Dropdown
            onChange={handleChange}
            options={options}
            value={filter}
            button basic floating
            />
    }
  />
      </GridColumn>
    </Grid>
  );
}
