export function convertActionsEngToEsp(a) {
  switch (a) {
    case "create":
      return "Crear";
    case "edit":
      return "Editar";
    case "delete":
      return "Eliminar";
    case "view":
      return "Ver";
    case "menu":
      return "Menu";
    default:
      return null;
  }
}

export function convertModulesEngToEsp(a) {
  switch (a) {
    case "users":
      return "Usuarios";
    case "roles":
      return "Roles";
    case "permissions":
      return "Permisos";
    case "configure":
      return "Configuracion";
    case "reports":
      return "Reportes";
    case "dashboard":
      return "Dashboard";
    case "companies":
      return "Empresas";
    case "sites":
      return "Sitios";
    case "siteform":
      return "Formulario de Sitio";
    case "energyform":
      return "Formulario de Energia";
    case "productionform":
      return "Formulario de Producción";
    case "effluentform":
      return "Formulario de Efluentes";
    case "waterform":
      return "Formulario de Agua";
    case "wasteform":
      return "Formulario de Residuos";
    case "kpisforms":
      return "Formulario de KPIs";
    case "dangerousform":
      return "Formulario de Peligrosos";
    case "data":
      return "Datos";
    default:
      return null;
  }
}


export function convertFormsEngToEsp(a) {
  switch (a) {
    case "siteform":
      return "Sitio";
    case "energyform":
      return "Energia";
    case "productionform":
      return "Producción";
    case "effluentform":
      return "Efluentes";
    case "waterform":
      return "Agua";
    case "wasteform":
      return "Residuos";
    case "kpisform":
      return "KPIs";
    case "dangerousform":
      return "Peligrosos";
    default:
      return null;
  }
}

export function convertPeriodsEngToEsp(a) {
  switch (a) {
    case "January":
      return "Enero";
    case "February":
      return "Febrero";
    case "March":
      return "Marzo";
    case "April":
      return "Abril";
    case "May":
      return "Mayo";
    case "June":
      return "Junio";
    case "July":
      return "Julio";
    case "August":
      return "Agosto";
    case "September":
      return "Septiembre";
    case "October":
      return "Octubre";
    case "November":
      return "Noviembre";
    case "December":
      return "Diciembre";
    default:
      return null;
  }
}

export function convertEffluentFieldsEngToEsp(a) {
  switch (a) {
    case "total_domestic_effluents":
      return "Total efluentes domésticos ";
    case "total_industrial_effluents":
      return "Total efluentes industriales";
    case "sludge_mud_sent_for_disposal_landfill":
      return "Lodos/ Barros ";
    case "total_effluents_per_unit_produced":
      return "Total efluentes";
    case "percentage_domestic_effluents":
      return "Costo de tratamiento de efluentes";
    case "percentage_industrial_effluents":
      return "Costo tratamiento de lodos";
    default:
      return null;
  }
}

export function convertWaterFieldsEngToEsp(a) {
  switch (a) {
    case "municipal_network_water":
      return "Agua de la red municipal";
    case "cost_of_water_from_the_municipal_network":
      return "Costo del agua de la red municipal";
    case "rainwater_harvesting":
      return "Recolección de agua de lluvia";
    case "groundwater":
      return "Agua subterránea";
    case "surface_water":
      return "Agua superficial";
    case "percentage_network_water":
      return "% agua de red";
    case "percentage_surface_water":
      return "% agua superficial";
    case "percentage_groundwater":
      return "% agua subterránea";
    case "total_water_consumed_per_unit_produced":
      return "Agua total consumida por unidad producida";
    default:
      return null;
  }
}

export function convertProductionFieldsEngToEsp(a) {
  switch (a) {
    case "production_volume":
      return "Volumen de producción";
    case "annual_average":
      return "Promedio anual o basado en los meses reportados";
    default:
      return null;
  }
}

export function convertSiteFieldsEngToEsp(a) {
  switch (a) {
    case "installation_type":
      return "Tipo de instalación";
    case "product_category":
      return "Categoría de productos";
    case "days_month":
      return "Días trabajados en el mes";
    case "days_total":
      return "Días totales trabajados";
    case "hours_month":
      return "Horas trabajadas en el mes";
    case "hours_total":
      return "Horas totales trabajadas";
    case "temporary_workers":
      return "Cantidad de trabajadores temporales";
    case "permanent_production_workers":
      return "Cantidad de trabajadores de producción permanentes";
    case "permanent_administrative_workers":
      return "Cantidad de trabajadores administrativos permanentes";
    case "female_production_workers":
      return "Cantidad de trabajadoras de producción femeninas";
    case "male_production_workers":
      return "Cantidad de trabajadores de producción masculinos";
    case "female_administrative_workers":
      return "Cantidad de trabajadoras administrativas femeninas";
    case "male_administrative_workers":
      return "Cantidad de trabajadores administrativos masculinos";
    case "female_workers_leadership_positions":
      return "Cantidad de trabajadoras femeninas en posiciones de liderazgo";
    case "male_workers_leadership_positions":
      return "Cantidad de trabajadores masculinos en posiciones de liderazgo";
    case "average_total_workers":
      return "Cantidad promedio de trabajadores totales";
    case "average_female_workers":
      return "Promedio de trabajadoras femeninas";
    case "average_male_workers":
      return "Promedio de trabajadores masculinos";
    case "percentage_total_female":
      return "% de mujeres totales";
    case "percentage_total_male":
      return "% de hombres totales";
    case "percentage_female_leadership_positions":
      return "% de femeninas en posiciones de Liderazgo";
    case "percentage_male_leadership_positions":
      return "% de masculinos en posiciones de Liderazgo ";
    case "work_accidents_with_sick_days":
      return "Accidentes de trabajo con días de baja";
    case "first_aid_without_sick_days":
      return "Primeros auxilios sin días de baja";
    default:
      return null;
  }
}

export function convertWasteFieldsEngToEsp(a) {
  switch (a) {
    case "paper_and_cardboard_sent_to_recycling_or_reuse":
      return "Papel y cartón enviado a reciclar o reutilizar";
    case "plastic_sent_to_recycle_or_reuse":
      return "Plastico enviado a reciclar o reutilizar";
    case "fabric_sent_to_recycle_or_reuse":
      return "Tela enviada a reciclar o reutilizar";
    case "metal_sent_to_recycle_or_reuse":
      return "Metal enviado a reciclar o reutilizar";
    case "wood_sent_to_recycle_or_reuse":
      return "Madera enviada a reciclar o reutilizar";
    case "other_general_waste_sent_to_recycle_or_reuse":
      return "Otros residuos generales enviados a reutilizar o reciclar";
    case "leathers_sent_to_recycle_or_reuse":
      return "Cueros enviados a reutilizar o reciclar";
    case "rubber_sent_to_recycle_or_reuse":
      return "Goma/caucho (rubber) enviados a reutilizar o reciclar";
    case "food_scraps_sent_to_recycle_or_reuse":
      return "Restos de comida enviados a reutilizar o reciclar (compost)";
    case "paper_and_cardboard_sent_to_incineration":
      return "Papel y cartón enviado a incineración";
    case "plastic_sent_to_incineration":
      return "Plastico enviado a incineración";
    case "fabric_sent_to_incineration":
      return "Tela enviada a incineración";
    case "metal_sent_to_incineration":
      return "Metal enviado a incineración";
    case "wood_sent_to_incineration":
      return "Madera enviada a incineración";
    case "other_general_waste_sent_to_incineration":
      return "Otros residuos generales enviados a incineración";
    case "other_general_waste_sent_to_other_types_of_disposal":
      return "Otros residuos generales enviados a otro tipo de disposición";
    case "total_sent_to_landfill":
      return "Total enviado a relleno sanitario";
    case "total_sent_for_reuse_or_recycling":
      return "Total enviado a reutilización o reciclaje";
    case "total_sent_to_incineration":
      return "Total enviado a incineración";
    case "total_general_waste_sent_to_other_types_of_disposal":
      return "Total residuos generales enviados a otro tipo de disposición";
    case "total_non_hazardous_waste_unit_produced":
      return "Total residuos no peligrosos x unidad producida";
    default:
      return null;
  }
}

export function convertDangerousFieldsEngToEsp(a) {
  switch (a) {
    case "chemicals_sent_to_reuse_or_recycle":
      return "Quimicos enviados a reutilizar o reciclar";
    case "lubricants_sent_to_reuse_or_recycle":
      return "Lubricantes enviados a reutilizar o reciclar";
    case "oils_sent_to_reuse_or_recycle":
      return "Aceites enviados a reutilizar o reciclar";
    case "machines_and_equipment_sent_to_reuse_or_recycle":
      return "Maquinas y equipos enviados a reutilizar o reciclar";
    case "electronic_waste_sent_to_reuse_or_recycle":
      return "Residuos electronicos enviados a reutilizar o reciclar";
    case "other_dangerous_wastes_sent_to_reuse_or_recycle":
      return "Otros residuos peligrosos enviados a reutilizar o reciclar";
    case "chemicals_sent_to_incineration":
      return "Quimicos enviados a incineracion";
    case "lubricants_sent_to_incineration":
      return "Lubricantes enviados a incineracion";
    case "oils_sent_to_incineration":
      return "Aceites enviados a incineracion";
    case "machines_and_equipment_sent_to_incineration":
      return "Máquinas y equipos enviados a incineración";
    case "electronic_waste_sent_to_incineration":
      return "Residuos electrónicos enviados a incineracion";
    case "other_dangerous_wastes_sent_to_incineration":
      return "Otros residuos peligrosos enviados a incineración";
    case "chemicals_sent_to_landfill":
      return "Quimicos enviados a relleno sanitario";
    case "lubricants_sent_to_landfill":
      return "Lubricantes enviados a relleno sanitario";
    default:
      return null;
  }
}

export function convertEnergyFieldsEngToEsp(a) {
  switch (a) {
    case "electricity":
      return "Electricidad ";
    case "fuels":
      return "Combustibles";
    case "electricity_standard":
      return "Electricidad standard en MHW";
    case "electricity_cost":
      return "Costo electricidad ";
    case "renewable_energies":
      return "Energías Renovables (PPA o compra) en MHW";
    case "renewable_energies_produced_and_consumed_on_site":
      return "Energías renovables producidas y consumidas en el sitio en MHW";
    case "steam":
      return "Vapor";
    case "steam_cost":
      return "Costo del vapor";
    case "natural_gas":
      return "Gas Natural";
    case "natural_gas_cost":
      return "Costo Gas Natural";
    case "glp":
      return "GLP (gas licuado de petróleo)";
    case "glp_cost":
      return "Costo del GLP";
    case "heavy_fuel_oil":
      return "Heavy Fuel Oil (aceite combustible pesado)";
    case "cost_of_heavy_fuel_oil":
      return "Costo del Heavy fuel Oil (aceite combustible pesado)";
    case "light_fuel_oil":
      return "Light fuel oil (aceite combustible)";
    case "cost_of_light_fuel_oil":
      return "Costo del Light fuel oil (aceite combustible)";
    case "coal":
      return "Carbón";
    case "coal_cost":
      return "Costo del carbón";
    case "diesel":
      return "Diesel";
    case "diesel_cost":
      return "Costo del Diesel";
    case "gasoline_for_internal_vehicles":
      return "Gasolina para los vehículos internos (autoelevadores)";
    case "gasoline_cost_of_internal_vehicles":
      return "Costo de Gasolina de los vehículos internos";
    case "biomass":
      return "Biomasa";
    case "biomass_cost":
      return "Costo de Biomasa ";
    default:
      return null;
  }
}

export function convertKPIsFieldsEngToEsp(a) {
  switch (a) {
    case "energy_indicators":
      return "Indicadores de Energia";
    case "total_fuel_energy_consumption":
      return "Total consumo de energía de combustibles ";
    case "total_electrical_energy_consumption":
      return "Total consumo de energía eléctrica";
    case "total_energy_consumption":
      return "Total consumo de energía ";
    case "total_renewable_energy":
      return "Total de energías renovables";
    case "percentage_of_renewable_energy":
      return "% de energías renovables";
    case "percentage_energy_from_fossil_fuels":
      return "% energía de combustibles fósiles";
    case "total_energy_consumed_per_productive_unit":
      return "Energía total consumida por unidad productiva";
    case "total_cost_of_energy_consumed":
      return "Costo total de energía consumida ";
    case "greenhouse_gas_indicators":
      return "Indicadores de GEI (gases de efecto invernadero)";
    case "total_scope_1":
      return "Total Alcance 1 (GEI)";
    case "total_scope_2":
      return "Total Alcance 2 (GEI)";
    case "total_scope_3":
      return "Total Alcance 3 (GEI)";
    case "total_emissions_per_unit_produced":
      return "Total emisiones por unidad producida";
    case "total_emissions":
      return "Total emisiones";
    case "scope_percentage_1":
      return "% Alcance 1";
    case "scope_percentage_2":
      return "% Alcance 2";
    case "scope_percentage_3":
      return "% Alcance 3";
    default:
      return null;
  }
}
