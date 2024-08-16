import React, { useState, useEffect } from "react";
import { Loader, Pagination } from "semantic-ui-react";
import { size, map } from "lodash";
import { Site } from "../../../../api";
import { SiteItem } from "../SiteItem";
import "./ListSites.scss";

const siteController = new Site();

export function ListSites(props) {
  const { reload, onReload } = props;
  const [sites, setSites] = useState(false);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState();

  useEffect(() => {
    (async () => {
      try {
        const response = await siteController.getSites({ page });
        if(response.docs){
          setSites(response.docs);
        }else{
          setSites([]);
        }
        
        // setSites(response.docs);
        // setPagination({
        //   limit: response.limit,
        //   page: response.page,
        //   pages: response.pages,
        //   total: response.total,
        // });
      } catch (error) {
        console.error(error);
      }
    })();
  }, [page, reload]);

  const changePage = (_, data) => {
    setPage(data.activePage);
  };

  if (!sites) return <Loader active inline="centered" />;
  if (size(sites) === 0) return "No hay ningun formulario de sitio";

  return (
    <div className="list-sites">
      {map(sites, (site) => (
        <SiteItem key={site._id} site={site} onReload={onReload} />
      ))}

      <div className="list-sites__pagination">
        {/* <Pagination
          totalPages={pagination.pages}
          defaultActivePage={pagination.page}
          ellipsisItem={null}
          firstItem={null}
          lastItem={null}
          onPageChange={changePage}
        /> */}
      </div>
    </div>
  );
}
