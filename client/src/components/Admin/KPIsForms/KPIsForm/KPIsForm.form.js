import * as Yup from "yup";
import { kpisCodes } from "../../../../utils/codes";

const currentYear = new Date().getFullYear();
const valueMhW = "MhW";
const valuePercentage = "%";
const valueGEI = "GEI";

export function initialValues(form, period, year) {
  return {
    date: form?.date || "",
    period: form?.period || period,
    year: form?.year || year,
    creator_user: form?.creator_user || "",
    state: form?.state || "",
    energy_indicators: form?.energy_indicators || {
      total_fuel_energy_consumption: form?.total_fuel_energy_consumption || {
        code: kpisCodes["total_fuel_energy_consumption"],
        unit: valueMhW,
        value: 0,
        reviews: [],
        isApproved: false,
        files:[],
      },
      total_electrical_energy_consumption:
        form?.total_electrical_energy_consumption || {
          code: kpisCodes["total_electrical_energy_consumption"],
          unit: valueMhW,
          value: 0,
          reviews: [],
          isApproved: false,
          files:[],
        },
      total_energy_consumption: form?.total_energy_consumption || {
        code: kpisCodes["total_energy_consumption"],
        unit: valueMhW,
        value: 0,
        reviews: [],
        isApproved: false,
        files:[],
      },
      total_renewable_energy: form?.total_renewable_energy || {
        code: kpisCodes["total_renewable_energy"],
        unit: valueMhW,
        value: 0,
        reviews: [],
        isApproved: false,
        files:[],
      },
      percentage_of_renewable_energy: form?.percentage_of_renewable_energy || {
        code: kpisCodes["percentage_of_renewable_energy"],
        unit: valuePercentage,
        value: "",
        reviews: [],
        isApproved: false,
        files:[],
      },
      percentage_energy_from_fossil_fuels:
        form?.percentage_energy_from_fossil_fuels || {
          code: kpisCodes["percentage_energy_from_fossil_fuels"],
          unit: "",
          value: "",
          reviews: [],
          isApproved: false,
          files:[],
        },
      total_energy_consumed_per_productive_unit:
        form?.total_energy_consumed_per_productive_unit || {
          code: kpisCodes["total_energy_consumed_per_productive_unit"],
          unit: "kWh",
          value: 0,
          reviews: [],
          isApproved: false,
          files:[],
        },
      total_cost_of_energy_consumed: form?.total_cost_of_energy_consumed || {
        code: kpisCodes["total_cost_of_energy_consumed"],
        unit: "",
        value: 0,
        reviews: [],
        isApproved: false,
        files:[],
      },
    },
    greenhouse_gas_indicators: form?.greenhouse_gas_indicators || {
      total_scope_1: form?.total_scope_1 || {
        code: kpisCodes["total_fuel_entotal_scope_1ergy_consumption"],
        unit: valueGEI,
        value: 0,
        reviews: [],
        isApproved: false,
        files:[],
      },
      total_scope_2: form?.total_scope_2 || {
        code: kpisCodes["total_scope_2"],
        unit: valueGEI,
        value: 0,
        reviews: [],
        isApproved: false,
        files:[],
      },
      total_scope_3: form?.total_scope_3 || {
        code: kpisCodes["total_scope_3"],
        unit: valueGEI,
        value: 0,
        reviews: [],
        isApproved: false,
        files:[],
      },
      total_emissions_per_unit_produced:
        form?.total_emissions_per_unit_produced || {
          code: kpisCodes["total_emissions_per_unit_produced"],
          unit: valueGEI,
          value: 0,
          reviews: [],
          isApproved: false,
          files:[],
        },
      total_emissions: form?.total_emissions || {
        code: kpisCodes["total_emissions"],
        unit: valueGEI,
        value: "",
        reviews: [],
        isApproved: false,
        files:[],
      },
      scope_percentage_1: form?.scope_percentage_1 || {
        code: kpisCodes["scope_percentage_1"],
        unit: valuePercentage,
        value: "",
        reviews: [],
        isApproved: false,
        files:[],
      },
      scope_percentage_2: form?.scope_percentage_2 || {
        code: kpisCodes["scope_percentage_2"],
        unit: valuePercentage,
        value: 0,
        reviews: [],
        isApproved: false,
        files:[],
      },
      scope_percentage_3: form?.scope_percentage_3 || {
        code: kpisCodes["scope_percentage_3"],
        unit: valuePercentage,
        value: 0,
        reviews: [],
        isApproved: false,
        files:[],
      },
    },
  };
}

export function validationSchema() {
  return Yup.object({
    period: Yup.string("Dato requerido").required(
      "El campo periodo es obligatorio"
    ),
  });
}
