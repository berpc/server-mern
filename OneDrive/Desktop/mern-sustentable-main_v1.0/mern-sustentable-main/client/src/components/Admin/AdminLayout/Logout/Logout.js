import React, { useState } from "react";
import { Button, Icon, Confirm } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../hooks";

export function Logout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [showConfirm, setShowConfirm] = useState(false);

  const onOpenCloseConfirm = () => setShowConfirm((prevState) => !prevState);

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
        content={`¿Está seguro que desea cerrar sesión?`}
        size="mini"
      />
    </>
  );
}
