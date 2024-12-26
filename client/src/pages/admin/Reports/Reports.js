import React, { useState } from "react";
import { Tab, Segment, Header } from "semantic-ui-react";
import { BasicModal } from "../../../components/Shared";
import { ListPost, PostForm } from "../../../components/Admin/Post";
import { ViewReports } from "../../../components/Admin/Reports/ViewReports/ViewReports";
import "./Reports.scss";
import { useLanguage } from "../../../contexts";

export function Reports() {
  const [showModal, setShowModal] = useState(false);
  const [reload, setReload] = useState(false);

  const onOpenCloseModal = () => setShowModal((prevState) => !prevState);
  const onReload = () => setReload((prevState) => !prevState);

  const { translations } = useLanguage();
    
    const t = (key) => translations[key] || key ; // Función para obtener la traducción

  const panes = [
    {
      render: () => (
        <Tab.Pane attached={false}>
          <ListPost reload={reload} onReload={onReload} />
        </Tab.Pane>
      ),
    },
  ];

  return (
    <>
       <Segment textAlign="center">
          {" "}
          <Header as="h1">{t("REPORTS")}</Header>
        </Segment>
    <ViewReports/>
      {/* <div className="blog-page">
        <div className="blog-page__add">
          <Button primary onClick={onOpenCloseModal}>
            Nuevo post
          </Button>
        </div>

        <Tab menu={{ secondary: true }} panes={panes} />
      </div>

      <BasicModal
        show={showModal}
        close={onOpenCloseModal}
        title="Crear nuevo post"
        size="large"
      >
        <PostForm onClose={onOpenCloseModal} onReload={onReload} />
      </BasicModal> */}
      
    </>
  );
}
