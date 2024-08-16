import React, { useState } from "react";
import { Tab } from "semantic-ui-react";
import { RecoverForm } from "../../../components/Admin/Auth";
import { Icon } from "../../../assets";
import "./Recover.scss";

export function Recover() {
  const [activeIndex, setActiveIndex] = useState(0);

  const panes = [
    {
      menuItem: "Recuperar Contraseña",
      render: () => (
        <Tab.Pane>
          <RecoverForm />
        </Tab.Pane>
      ),
    },
  ];

  return (
    <div className="recover">
      {/* <Icon.LogoWhite className="logo" /> */}

      <Tab
      menu={{ attached: false }}
        panes={panes}
        className="recover__forms"
        activeIndex={activeIndex}
        onTabChange={(_, data) => setActiveIndex(data.activeIndex)}
      />
    </div>
  );
}