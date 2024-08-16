

export const extractDomain = (email) => {
    let domain="";
    // Expresión regular para extraer el dominio de un correo electrónico
    const regex = /@([^@\s]+\.[^@\s]+)/;
    const match = email.match(regex);

    if (match) {
        domain=match[1]; // match[1] contiene el dominio capturado por la expresión regular
    } else {
        //'No se pudo extraer el dominio. Asegúrate de ingresar una dirección de correo válida.'
        domain=false;
    }

    return domain;
  };
