import React, { createContext, useState, useContext, useEffect } from 'react';

// Creamos el contexto
const SiteContext = createContext();

// Proveedor del contexto
export const SiteProvider = (props) => {
  const { children } = props;
  const [site, setSite] = useState(() => {
    const storedSite = localStorage.getItem('site');
    return storedSite ? storedSite : '';
  }); // Estado inicial del idioma, por defecto '' 

  const changeSite = (newSite) => {
    setSite(newSite);
  };

  useEffect(() => {
    localStorage.setItem('site', site);
  }, [site]);

  return (
    <SiteContext.Provider value={{ site, changeSite }}>
      {children}
    </SiteContext.Provider>
  );
};

// Hook personalizado para consumir el contexto
export const useSite= () => {
  const context = useContext(SiteContext);
  if (!context) {
    throw new Error('useSitio debe ser usado dentro de un SitioProvider');
  }
  return context;
};
