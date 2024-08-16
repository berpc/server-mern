//PERMISOS EN USO
export function isAdmin(actualRole){
    if (actualRole.name.toLowerCase() === "admin" || actualRole.name.toLowerCase() === "administrador"){
      return true;
    }
    return false
  }

  export function isMaster(actualRole){
    if (actualRole.name.toLowerCase() === "master"){
      return true;
    }
    return false
  }
  
  
  //PERMISOS EN USO
  export function hasPermission(permissionsActive, roleId, module, action) { 
    let founded = false;
    if (permissionsActive){
      permissionsActive.forEach((i) => {
        if (roleId === i.role && module === i.module && action === i.action ){
          founded = true;
          return;
        }
      });
      if (founded === true) {
        return true;
      }
    } else {
      return false;
    }
  }