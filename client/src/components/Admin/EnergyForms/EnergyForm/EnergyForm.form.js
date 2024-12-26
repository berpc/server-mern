import * as Yup from "yup";
import { energyCodes } from "../../../../utils/codes";

export function initialValues(energy, period, year) {
  return {
    date: energy?.date || "",
    creator_user: energy?.creator_user || "",
    state: energy?.state || "",
    period: energy?.period || period,
    year: energy?.year || year,
    electricity: energy?.electricity || {
      electricity_standard: energy?.electricity_standard || {
        code: energyCodes["electricity_standard"],
        unit: "",
        value: "",
        reviews: [],
        isApproved: false,
        files:[],
      },
      electricity_cost: energy?.electricity_cost || {
        code: energyCodes["electricity_cost"],
        unit: "",
        value: "",
        reviews: [],
        files:[],
      },
      renewable_energies: energy?.renewable_energies || {
        code: energyCodes["renewable_energies"],
        unit: "",
        value: "",
        reviews: [],
        isApproved: false,
        files:[],
      },
      renewable_energies_produced_and_consumed_on_site:
        energy?.renewable_energies_produced_and_consumed_on_site || {
          code: energyCodes["renewable_energies_produced_and_consumed_on_site"],
          unit: "",
          value: "",
          reviews: [],
          isApproved: false,
          files:[],
        },
    },
    fuels: energy?.fuels || {
      steam: energy?.steam || {
        code: energyCodes["steam"],
        unit: "",
        value: "",
        reviews: [],
        isApproved: false,
        files:[],
      },
      steam_cost: energy?.steam_cost || {
        code: energyCodes["steam_cost"],
        unit: "",
        value: "",
        reviews: [],
        isApproved: false,
        files:[],
      },
      natural_gas: energy?.natural_gas || {
        code: energyCodes["natural_gas"],
        unit: "",
        value: "",
        reviews: [],
        isApproved: false,
        files:[],
      },
      natural_gas_cost: energy?.natural_gas_cost || {
        code: energyCodes["natural_gas_cost"],
        unit: "",
        value: "",
        reviews: [],
        isApproved: false,
        files:[],
      },
      glp: energy?.glp || {
        code: energyCodes["glp"],
        unit: "",
        value: "",
        reviews: [],
        isApproved: false,
        files:[],
      },
      glp_cost: energy?.glp_cost || {
        code: energyCodes["glp_cost"],
        unit: "",
        value: "",
        reviews: [],
        isApproved: false,
        files:[],
      },
      heavy_fuel_oil: energy?.natural_gas || {
        code: energyCodes["natural_gas"],
        unit: "",
        value: "",
        reviews: [],
        isApproved: false,
        files:[],
      },
      cost_of_heavy_fuel_oil: energy?.natural_gas_cost || {
        code: energyCodes["natural_gas_cost"],
        unit: "",
        value: "",
        reviews: [],
        isApproved: false,
        files:[],
      },
      light_fuel_oil: energy?.light_fuel_oil || {
        code: energyCodes["light_fuel_oil"],
        unit: "",
        value: "",
        reviews: [],
        isApproved: false,
        files:[],
      },
      cost_of_light_fuel_oil: energy?.cost_of_light_fuel_oil || {
        code: energyCodes["cost_of_light_fuel_oil"],
        unit: "",
        value: "",
        reviews: [],
        isApproved: false,
        files:[],
      },
      coal: energy?.coal || {
        code: energyCodes["coal"],
        unit: "",
        value: "",
        reviews: [],
        isApproved: false,
        files:[],
      },
      coal_cost: energy?.coal_cost || {
        code: energyCodes["coal_cost"],
        unit: "",
        value: "",
        reviews: [],
        isApproved: false,
        files:[],
      },
      diesel: energy?.diesel || {
        code: energyCodes["diesel"],
        unit: "",
        value: "",
        reviews: [],
        isApproved: false,
        files:[],
      },
      diesel_cost: energy?.diesel_cost || {
        code: energyCodes["diesel_cost"],
        unit: "",
        value: "",
        reviews: [],
        isApproved: false,
        files:[],
      },
      gasoline_for_internal_vehicles:
        energy?.gasoline_for_internal_vehicles || {
          code: energyCodes["gasoline_for_internal_vehicles"],
          unit: "",
          value: "",
          reviews: [],
          isApproved: false,
          files:[],
        },
      gasoline_cost_of_internal_vehicles:
        energy?.gasoline_cost_of_internal_vehicles || {
          code: energyCodes[
            "electricity_gasoline_cost_of_internal_vehiclesstandard"
          ],
          unit: "",
          value: "",
          reviews: [],
          isApproved: false,
          files:[],
        },
      biomass: energy?.biomass || {
        code: energyCodes["biomass"],
        unit: "",
        value: "",
        reviews: [],
        isApproved: false,
        files:[],
      },
      biomass_cost: energy?.biomass_cost || {
        code: energyCodes["biomass_cost"],
        unit: "",
        value: "",
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
