import React, { useState, useEffect } from "react";
import {
  Loader,
  Search,
  Grid,
  GridColumn,
  Divider,
  Input,
  Icon,
  Button,
  Table,
} from "semantic-ui-react";
import { size, map } from "lodash";
import { Permission, Role } from "../../../../api";
import { useAuth } from "../../../../hooks";
import {
  hasPermission,
  isAdmin,
  isMaster,
} from "../../../../utils/checkPermission";
import { ErrorAccessDenied } from "../../../../pages/admin/Error";
import { reportExcel } from "../ExcelReport";
import { jsPDF } from "jspdf";
const _ = require("lodash");

const permissionController = new Permission();

export function ViewReports(props) {
  const [permissions, setPermissions] = useState([]);

  // const [Role, setRole] = useState(null);
  const {
    user: { role },
    accessToken,
  } = useAuth();

  const [permissionsByRole, setPermissionsByRole] = useState([]);

  const [column, setColumn] = useState(null);
  const [data, setData] = useState(/* Your data array */);
  const [direction, setDirection] = useState(null);

  const handleSort = (clickedColumn) => () => {
    if (column !== clickedColumn) {
      setColumn(clickedColumn);
      setData(
        [...data].sort((a, b) => (a[clickedColumn] > b[clickedColumn] ? 1 : -1))
      );
      setDirection("ascending");
      return;
    }

    setData(data.reverse());
    setDirection(direction === "ascending" ? "descending" : "ascending");
  };

  const generatePdf = () => {
    const report=()=>{
        // Default export is a4 paper, portrait, using millimeters for units
        const doc = new jsPDF();
        doc.text("Hello world!", 10, 10);
        doc.save("a4.pdf");
        
        }
    return report();
  };

  const generateExcel = (data, fileName) => {
    return reportExcel(data, fileName);
  };

  const data2 = [
    { id: 1, name: "John Doe", age: 30, profession: "Developer" },
    { id: 2, name: "Jane Smith", age: 25, profession: "Designer" },
  ];

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

  if (
    isMaster(role) ||
    isAdmin(role) ||
    hasPermission(permissionsByRole, role._id, "permissions", "view")
  ) {
    // if (!listRoles) return <Loader active inline="centered" />;
    // if (size(listRoles) === 0) return "No hay ningun rol";
    return (
      <div>
        <div></div>
        <Divider clearing />
        <Button
          primary
          onClick={() => {
            generatePdf();
          }}
        >
          {" "}
          <Icon name="file pdf outline" />
          Descargar pdf
        </Button>
        <Divider clearing />
        <Button
          primary
          onClick={() => {
            generateExcel(data2, "prueba");
          }}
        >
          {" "}
          <Icon name="file excel outline" />
          Descargar xlsx
        </Button>
        <div></div>
      </div>
    );
  } else {
    return <ErrorAccessDenied />;
  }
}
