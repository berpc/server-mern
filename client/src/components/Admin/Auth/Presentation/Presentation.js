import React, { useState } from "react";
import {
  Container,
  Segment,
  Grid,
  GridColumn,
  Divider,
} from "semantic-ui-react";
import { useLanguage } from "../../../../contexts";
//import "./Presentation.scss";

export function Presentation() {
  const { translations } = useLanguage();

  const t = (key) => translations[key] || key; // Función para obtener la traducción

  return (
    <div style={{ width: "100%" }}>
      <Container
        style={{ marginTop: "50px", width: "80%" }}
        text
        textAlign="center"
      >
        <p style={styleText}>
          {t("your_ally_to_manage_and_reduce_the_impacts_of_your_processes")}
        </p>
        <p style={styleText}>{t("one_sustainable_step_at_a_time")}</p>
      </Container>
    </div>
  );
}

const styleText = {
  fontFamily: "Cambria",
  font: "bold",
  fontSize: "160%",
};
