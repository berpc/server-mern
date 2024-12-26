import React, { useState, useEffect } from "react";
import { Tab } from "semantic-ui-react";
import { RegisterForm, LoginForm } from "../../../components/Admin/Auth";
import { Icon } from "../../../assets";
import "./Auth.scss";
import { useLanguage } from "../../../contexts";

export function Auth() {
  const [activeIndex, setActiveIndex] = useState(0);

  const openLogin = () => setActiveIndex(0);

  const { changeLanguage, translations } = useLanguage();

  const t = (key) => translations[key] || key; // Función para obtener la traducción

  useEffect(() => {
    // Detectar el idioma del navegador
    const idiomaNavegador = navigator.language || navigator.userLanguage;
    const idioma = idiomaNavegador.split("-")[0]; // Extraer la parte principal del idioma (ejemplo: "es" de "es-ES")

    // Establecer el idioma si es compatible
    if (["es", "en", "pt"].includes(idioma)) {
      changeLanguage(idioma);
    } else {
      changeLanguage("en"); // Fallback al español si el idioma no es compatible
    }
  }, []);

  const panes = [
    {
      menuItem: t("enter"),
      render: () => (
        <Tab.Pane>
          <LoginForm />
        </Tab.Pane>
      ),
    },
    {
      menuItem: t("new_user"),
      render: () => (
        <Tab.Pane>
          <RegisterForm openLogin={openLogin} />
        </Tab.Pane>
      ),
    },
  ];

  return (
    <div className="auth">
      {/* <Icon.LogoWhite className="logo" /> */}

      <Tab
        panes={panes}
        className="auth__forms"
        activeIndex={activeIndex}
        // menu={{ fluid: true, vertical: true }}
        // menuPosition="right"
        onTabChange={(_, data) => setActiveIndex(data.activeIndex)}
      />
    </div>
  );
}
