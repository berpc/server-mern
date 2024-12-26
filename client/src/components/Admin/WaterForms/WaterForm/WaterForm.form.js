import * as Yup from "yup";
import { waterCodes } from "../../../../utils/codes";

export function initialValues(form, period, year) {
  return {
    date: form?.date || "",
    creator_user: form?.creator_user || "",
    period:form?.period || period,
    year:form?.year || year,
    state: form?.state || "",
    municipal_network_water: form?.municipal_network_water || {
      code:waterCodes["municipal_network_water"],
      unit:"",
      value:"",
      reviews:[
      ],
        isApproved:false, files:[]
    },
    cost_of_water_from_the_municipal_network: form?.cost_of_water_from_the_municipal_network || {
      code:waterCodes["cost_of_water_from_the_municipal_network"],
      unit:"",
      value:"",
      reviews:[
      ],
        isApproved:false, files:[]
    },
    rainwater_harvesting:form?.rainwater_harvesting || {
      code:waterCodes["rainwater_harvesting"],
      unit:"",
      value:"",
      reviews:[
      ],
        isApproved:false, files:[]
    },
    groundwater:form?.groundwater || {
      code:waterCodes["groundwater"],
      unit:"",
      value:"",
      reviews:[
      ],
        isApproved:false, files:[]
    },
    surface_water:form?.surface_water || {
      code:waterCodes["surface_water"],
      unit:"",
      value:"",
      reviews:[
      ],
        isApproved:false, files:[]
    },
    percentage_surface_water:form?.percentage_surface_water || {
      code:waterCodes["percentage_surface_water"],
      unit:"",
      value:"",
      reviews:[
      ],
        isApproved:false, files:[]
    },
    percentage_network_water:form?.percentage_network_water || {
      code:waterCodes["percentage_network_water"],
      unit:"",
      value:"",
      reviews:[
      ],
        isApproved:false, files:[]
    },
    percentage_groundwater:form?.percentage_groundwater || {
      code:waterCodes["percentage_groundwater"],
      unit:"",
      value:"",
      reviews:[
      ],
        isApproved:false, files:[]
    },
    total_water_consumed_per_unit_produced:form?.total_water_consumed_per_unit_produced || {
      code:waterCodes["total_water_consumed_per_unit_produced"],
      unit:"",
      value:"",
      reviews:[
      ],
        isApproved:false, files:[]
    },
  };
}

export function validationSchema() {
  return Yup.object({
    period: Yup.string("Dato requerido").required("El campo periodo es obligatorio"),
  });
}
