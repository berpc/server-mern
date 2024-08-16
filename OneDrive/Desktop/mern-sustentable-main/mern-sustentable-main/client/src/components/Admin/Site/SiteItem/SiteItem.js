import React, { useState } from "react";
import { Image, Button, Icon, Confirm } from "semantic-ui-react";
import { BasicModal } from "../../../Shared";
import { ENV } from "../../../../utils";
import { Site } from "../../../../api";
import { useAuth } from "../../../../hooks";
import { SiteForm } from "../SiteForm";
import "./SiteItem.scss";

const siteController = new Site();

export function SiteItem(props) {
  const { site, onReload } = props;
  const [showModal, setShowModal] = useState(false);
  const [titleModal, setTitleModal] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const { accessToken } = useAuth();

  const onOpenCloseModal = () => setShowModal((prevState) => !prevState);
  const onOpenCloseConfirm = () => setShowConfirm((prevState) => !prevState);

  const openUpdateSite = () => {
    setTitleModal(`Actualizar ${site.title}`);
    onOpenCloseModal();
  };

  const onDelete = async () => {
    try {
      await siteController.deleteSite(accessToken, site._id);
      onReload();
      onOpenCloseConfirm();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="course-item">

        <div>
          <Button icon as="a" href={site.url} target="_blank">
            <Icon name="eye" />
          </Button>
          <Button icon primary onClick={openUpdateSite}>
            <Icon name="pencil" />
          </Button>
          <Button icon color="red" onClick={onOpenCloseConfirm}>
            <Icon name="trash" />
          </Button>
        </div>
      </div>

      <BasicModal show={showModal} close={onOpenCloseModal} title={titleModal}>
        <SiteForm
          onClose={onOpenCloseModal}
          onReload={onReload}
          site={site}
        />
      </BasicModal>

      <Confirm
        open={showConfirm}
        onCancel={onOpenCloseConfirm}
        onConfirm={onDelete}
        content={`Eliminar el formulario ${site.title}`}
        size="mini"
      />
    </>
  );
}
