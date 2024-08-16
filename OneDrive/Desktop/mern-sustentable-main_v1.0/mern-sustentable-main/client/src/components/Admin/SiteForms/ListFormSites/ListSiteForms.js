import React, { useState, useEffect } from "react";
import { Loader, Pagination, Table, Grid, GridColumn, Input, Divider } from "semantic-ui-react";
import { size, map } from "lodash";
import { Siteform } from "../../../../api";
import { useAuth } from "../../../../hooks";
import { SiteFormItem } from "../SiteFormItem";
import {
  hasPermission,
  isAdmin,
  isMaster,
} from "../../../../utils/checkPermission";
import "./ListSiteForms.scss";
const _ = require("lodash");


const siteFormController = new Siteform();

export function ListSiteForms(props) {
  const { reload, onReload , siteSelected} = props;
  const [siteforms, setSiteForms] = useState(false);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState();
    // const [Role, setRole] = useState(null);
    const {
      user: { role, site },
      accessToken,
    } = useAuth();
  

  useEffect(() => {
    (async () => {
      try {
        let limit=50;
        let options={ page, limit };
        if(site){
          options.site=site?._id;
        }else if(siteSelected){
          options.site=siteSelected;
        }
        const response = await siteFormController.getSiteForms(accessToken,options);
        if(response.docs){
          setSiteForms(response.docs);
        }else{
          setSiteForms([]);
        }
        
        // setSites(response.docs);
        setPagination({
          limit: response.limit,
          page: response.current,
          pages: response.pages,
          total: response.total,
        });
      } catch (error) {
        console.error(error);
      }
    })();
  }, [page, reload]);

  const changePage = (_, data) => {
    setPage(data.activePage);
  };

  if (!siteforms) return <Loader active inline="centered" />;
  if (size(siteforms) === 0) return "No hay ningun formulario de sitio";

  return (
    <div className="list-sites">
      {/* {map(siteforms, (siteForm) => (
        <SiteFormItem key={siteForm._id} siteForm={siteForm} onReload={onReload} />
      ))} */}

      <div className="list-sites__pagination">
          {/* <SearchStandardPermission
            dataOrigin={siteforms}
            // data={permissionsFilter}
            // setData={setPermissionsFilter}
          /> */}
        </div>
        <Divider clearing/>

      <Table celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Estado</Table.HeaderCell>
                <Table.HeaderCell >Fecha</Table.HeaderCell>
                <Table.HeaderCell>Usuario Creador</Table.HeaderCell>
                <Table.HeaderCell>Acciones</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
            {map(siteforms, (siteForm) => (
        <SiteFormItem key={siteForm._id} siteForm={siteForm} onReload={onReload} />
      ))}
           </Table.Body>
           </Table>
        {/* <Pagination
          totalPages={pagination.pages}
          defaultActivePage={pagination.page}
          ellipsisItem={null}
          firstItem={null}
          lastItem={null}--
          onPageChange={changePage}
        /> */}
        <Pagination
        activePage={pagination.page}
        totalPages={pagination.pages}
        onPageChange={changePage}
      />
      </div>
  );
}


function SearchStandardPermission(props) {
  const { dataOrigin, data, setData } = props;
  const [state, setState] = useState({
    isLoading: false,
    results: [],
    value: "",
  });

  const handleSearchChange = (e, { value }) => {
    setState({ isLoading: true, value });

    setTimeout(() => {
      if (value && value.length < 1) {
        setState({ isLoading: false, results: [], value: "" })
        setData(dataOrigin);
        return true;
      } else if (value.length === 0) {
        setData(dataOrigin);
        setState({ isLoading: false, results: [], value: "" });
        return true;
      }
      const re = new RegExp(_.escapeRegExp(value), "i");
      const isMatch = (result) => re.test(result.role.name);
      setState({
        isLoading: false,
        results: _.filter(data, isMatch),
      });
      setData(_.filter(data, isMatch));
    }, 300);
  };


  return (
    <Grid>
      <GridColumn width={6}>
      <Input
       icon='search'
       iconPosition='left'
      placeholder='Buscar...'
    onChange={_.debounce(handleSearchChange, 500, {
      leading: true,
    })}
        />
      </GridColumn>
    </Grid>
  );
}
