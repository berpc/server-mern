export function convertActionsEngToEsp (a) {
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
};

export function convertModulesEngToEsp (a) {
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
        default:
            return null;
    }
};