import React, { useState, useEffect } from "react";
import {
  Button,
  Icon as IconUI,
  Dropdown,
  Header,
  HeaderContent,
} from "semantic-ui-react";
import { Icon } from "../../assets";
import { AdminMenu, Logout } from "../../components/Admin/AdminLayout";
import "./AdminLayout.scss";
import { useAuth } from "../../hooks";
import { BasicModal } from "../../components/Shared";
import { UserForm } from "../../components/Admin/Users/UserForm";
import { Site } from "../../api";

import { useSite } from "../../contexts/SiteContext";

const siteController = new Site();

export function AdminLayout(props) {
  const { children } = props;
  const { user } = useAuth();

  // const { site } = useSite();

  const [showModal, setShowModal] = useState(false);
  const [titleModal, setTitleModal] = useState("");

  const [reload, onReload] = useState(false);

  const onOpenCloseModal = () => setShowModal((prevState) => !prevState);

  const openUpdateUser = () => {
    setTitleModal(`Actualizar ${user.email}`);
    onOpenCloseModal();
  };

  useEffect(() => {
    if (reload) {
      window.location.reload();
      onReload(false);
    }
  }, [reload]);

  return (
    <div className="admin-layout">
      <div className="admin-layout__left">
        {/* <Icon.LogoWhite className="logo" /> */}
        <div style={{ marginTop: "50px" }}></div>
        <AdminMenu />
      </div>
      <div className="admin-layout__right">
        <div className="admin-layout__right-header">
          {/* <SiteSelector /> */}
          <Button
            icon
            primary
            circular={true}
            onClick={(e) => {
              openUpdateUser();
            }}
          >
            <IconUI name="user" /> {user.email}
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

const SiteSelector = () => {
  const [listSites, setListSites] = useState([]);
  const { site, changeSite } = useSite();
  const handleChange = (event, data) => {
    changeSite(data.value);
  };
  const { accessToken } = useAuth();

  useEffect(() => {
    (async () => {
      const response = await siteController.getSites(accessToken);
      if (response) {
        setListSites(response);
      } else {
        setListSites([]);
      }
    })();
  }, [listSites]);

  return (
    <div style={{ background: "white" }}>
      <span>
        Sitio{" "}
        <Dropdown
          // placeholder='Selecciona una opción'
          // text='Sitio'
          //button
          //className='icon'
          floating
          labeled
          //icon='world'
          search
          options={listSites.map((option) => ({
            key: option._id,
            text: option.name,
            value: option._id,
          }))}
          onChange={handleChange}
          value={site}
        />
      </span>
    </div>
  );
};

export default SiteSelector;
