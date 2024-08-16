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
        default:
            return null;
    }
};