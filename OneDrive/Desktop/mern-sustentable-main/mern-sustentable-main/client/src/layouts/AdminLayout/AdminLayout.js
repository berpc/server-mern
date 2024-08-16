import React , { useState, useEffect } from "react";
import { Button, Icon as IconUI } from "semantic-ui-react";
import { Icon } from "../../assets";
import { AdminMenu, Logout } from "../../components/Admin/AdminLayout";
import "./AdminLayout.scss";
import { useAuth } from "../../hooks";
import { BasicModal } from "../../components/Shared";
import { UserForm } from "../../components/Admin/Users/UserForm";


export function AdminLayout(props) {
  const { children } = props;
  const { user } = useAuth();

  const [showModal, setShowModal] = useState(false);
  const [titleModal, setTitleModal] = useState("");

  const [reload, onReload] = useState(false);
  
  const onOpenCloseModal = () => setShowModal((prevState) => !prevState);

  const openUpdateUser = () => {
    setTitleModal(`Actualizar ${user.email}`);
    onOpenCloseModal();
  };


  useEffect(() => {
    if(reload){
      window.location.reload();
      onReload(false);
    }
  }, [reload]);


  return (
    <div className="admin-layout">
      <div className="admin-layout__left">
        {/* <Icon.LogoWhite className="logo" /> */}
        <div style={{marginTop:"50px"}}></div>
        <AdminMenu />
      </div>
      <div className="admin-layout__right">
        <div className="admin-layout__right-header">
        <Button icon primary circular={true} onClick={e=>{openUpdateUser()}}>
          <IconUI name='user' /> {user.email}
         </Button>
          <Logout />
        </div>
        <div className="admin-layout__right-content">{children}</div>
      </div>
      <BasicModal show={showModal} close={onOpenCloseModal} title={titleModal}>
        <UserForm close={onOpenCloseModal} onReload={onReload} user={user} />
      </BasicModal>
    </div>
  );
}