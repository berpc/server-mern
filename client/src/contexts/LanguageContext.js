// src/LanguageContext.js
import React, { createContext, useContext, useState, useEffect } from "react";

// Ruta donde se almacenan los archivos JSON de traducciones
// Importar los archivos JSON de traducción directamente
import enTranslations from "../translations/en.json";
import esTranslations from "../translations/es.json";
import frTranslations from "../translations/fr.json";
import ptTranslations from "../translations/pt.json";

// Mapeo de los idiomas a las traducciones
const translationsMap = {
  en: enTranslations,
  es: esTranslations,
  fr: frTranslations,
  pt: ptTranslations
};

const LanguageContext = createContext();

export const useLanguage = () => {
  return useContext(LanguageContext);
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("es"); // Idioma por defecto (español)
  const [translations, setTranslations] = useState({});
  
  useEffect(() => {
    // Cargar las traducciones desde el archivo JSON correspondiente
    const loadTranslations = async () => {
      try {
        setTranslations(translationsMap[language]); // Actualiza las traducciones al idioma seleccionado
        //const data = await response.json();
        //setTranslations(data);
        //console.log(response,data)
      } catch (error) {
        console.error("Error al cargar las traducciones:", error);
      }
    };

    loadTranslations();
  }, [language]);

  const changeLanguage = (lang) => {
    setLanguage(lang);
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, translations }}>
      {children}
    </LanguageContext.Provider>
  );
};
