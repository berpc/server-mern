import React, { useState } from "react";
import { Button, Icon, Confirm } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../hooks";
import { useLanguage } from "../../../../contexts";

export function Logout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [showConfirm, setShowConfirm] = useState(false);

  const onOpenCloseConfirm = () => setShowConfirm((prevState) => !prevState);

  const { translations } = useLanguage();

  const t = (key) => translations[key] || key; // Función para obtener la traducción

  const onLogout = () => {
    logout();
    navigate("/admin");
  };

  return (
    <>
      <Button
        icon
        basic
        circular={true}
        color="red"
        onClick={onOpenCloseConfirm}
      >
        <Icon name="power off" />
      </Button>

      <Confirm
        open={showConfirm}
        onConfirm={onLogout}
        onCancel={onOpenCloseConfirm}
        header={t("logout")}
        content={`${t("are_you_sure_you_want_to_log_out")}`}
        size="mini"
      />
    </>
  );
}
