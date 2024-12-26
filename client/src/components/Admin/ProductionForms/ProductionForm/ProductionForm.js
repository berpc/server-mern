import React, { useCallback, useRef, useState, useEffect } from "react";
import {
  Form,
  Label,
  Grid,
  Table,
  Icon,
  Button,
  Comment,
  CommentGroup,
  CommentMetadata,
  Segment,
  Divider,
  Header,
  GridColumn,
  GridRow,
  Modal,
  Image,
  ModalActions,
  ModalHeader,
  ModalContent,
  Message,
  List,
} from "semantic-ui-react";
import { useDropzone } from "react-dropzone";
import { useFormik, Field, FieldArray, FormikProvider, getIn } from "formik";
import { Productionform } from "../../../../api";
import { useAuth } from "../../../../hooks";
import { ENV, PERIODS } from "../../../../utils";
import {
  formatDateView,
  formatDateHourCompleted,
} from "../../../../utils/formatDate";
import { BasicModal } from "../../../Shared";
import { initialValues, validationSchema } from "./ProductionForm.form";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { decrypt, encrypt } from "../../../../utils/cryptoUtils";
import "./ProductionForm.scss";
import { useLanguage } from "../../../../contexts";

const productionFormController = new Productionform();

export function ProductionForm(props) {
  const {
    onClose,
    onReload,
    productionForm,
    production,
    siteSelected,
    period,
    year,
  } = props;
  const { accessToken } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [titleModal, setTitleModal] = useState("");
  const [fieldName, setFieldName] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [listPeriods, setListPeriods] = useState([]);
  const { user } = useAuth();

  const location = useLocation();
  const { productionSelected } = location.state || {};

  const { translations } = useLanguage();

  const t = (key) => translations[key] || key; // Función para obtener la traducción

  if (!productionSelected) {
    // // Manejo de caso donde no hay datos en state (por ejemplo, acceso directo a la URL)
    // return <div>No se encontraron detalles de producto.</div>;
  }

  const [data, setData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  //const [newFiles, setNewFiles] = useState("");

  const [newFiles, setNewFiles] = useState({});

  const navigate = useNavigate();

  const onOpenCloseModal = () => setShowModal((prevState) => !prevState);
  const onOpenCloseConfirm = () => setShowConfirm((prevState) => !prevState);

  const openUpdateSite = (data, name) => {
    setFieldName(name);
    setTitleModal(`${t("comments")} ${data}`);
    onOpenCloseModal();
  };

  const formik = useFormik({
    initialValues: initialValues(productionForm, period, year),
    validationSchema: validationSchema(),
    validateOnChange: false,
    onSubmit: async (formValue) => {
      try {
        if (!productionForm) {
          // if(data && Object.keys(data).length > 0){
          //   Object.entries(data).map(async ([d]) => {
          //     data[d].creator_user = user._id;
          //     data[d].date = new Date();
          //     if (user?.production) {
          //       data[d].site = user.production._id;
          //     } else {
          //       if (siteSelected) {
          //         data[d].site = siteSelected;
          //       }
          //     }
          //     await productionFormController.createProductionForm(accessToken, data[d]);
          //     return true;
          //     //console.log(formValue);
          // })

          // }else{
          formValue.creator_user = user._id;
          formValue.date = new Date();
          if (user?.production) {
            formValue.site = user.production._id;
          } else {
            if (siteSelected) {
              formValue.site = siteSelected;
            }
            // } else {
            //   // Desencriptar los datos recibidos
            //   if (!productionForm) {
            //     const productionData = decrypt(productionSelected);
            //     formValue.production = productionData;
            //   }
            // }
          }

          // Recorrer el JSON
          for (const clave in newFiles) {
            if (newFiles.hasOwnProperty(clave)) {
              let filesField = await uploadFiles(newFiles[clave]);

              // Combina los archivos nuevos con los existentes
              let finalFilesField = [...formValue[clave].files, ...filesField];

              formValue[clave].files = finalFilesField;
            }
          }

          await productionFormController.createProductionForm(
            accessToken,
            formValue
          );
          // }
        } else {
          // Recorrer el JSON
          for (const clave in newFiles) {
            if (newFiles.hasOwnProperty(clave)) {
              let filesField = await uploadFiles(newFiles[clave]);

              // Combina los archivos nuevos con los existentes
              let finalFilesField = [...formValue[clave].files, ...filesField];

              formValue[clave].files = finalFilesField;
            }
          }
          await productionFormController.updateProductionForm(
            accessToken,
            productionForm._id,
            formValue
          );
        }
        onReload();
        if (onClose) {
          onClose();
        } else {
          // Después de guardar exitosamente, navegamos hacia atrás
          goBack();
        }
      } catch (error) {
        console.error(error);
      }
    },
  });

  const uploadFiles = async (filesToUpload, formValue, field) => {
    const formData = new FormData();
    Array.from(filesToUpload).forEach((file) => {
      formData.append("files", file);
    });

    // Luego de preparar los datos, puedes hacer la solicitud POST
    if (filesToUpload.length === 0) {
      console.log("no hay archivos");
      //setErrorMessage("Por favor, selecciona al menos un archivo.");
      return;
    }

    try {
      // Realizar la solicitud POST al backend
      const response = await productionFormController.uploadFileApi(
        accessToken,
        formData
      );
      if (response.code && response.code === 200) {
        return response.files;
      }
      return [];
    } catch (error) {
      //error
    }
  };

  const goBack = () => {
    navigate(`/admin/data/productionforms`, {
      state: { productionSelected: productionSelected },
    });
  };

  // Generar una lista de años (por ejemplo, del 2000 al 2024)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  useEffect(() => {
    (async () => {
      try {
        const response =
          await productionFormController.getPeriodsProductionFormsBySiteAndYear(
            accessToken,
            siteSelected,
            formik.values.year
          );
        const periods = PERIODS.map((item) => item);
        const availablePeriods = periods
          .filter((period) => !response.periods.includes(period))
          .map((period) => period);

        setListPeriods(availablePeriods);
        console.log(availablePeriods);
      } catch (error) {
        console.error(error);
        setListPeriods([]);
      }
    })();
  }, [formik.values.year]);

  // const handleAdd = async () => {
  //   const validationErrors = await formik.validateForm();;
  //   console.log(Object.keys(validationErrors).length)
  //   if(Object.keys(validationErrors).length === 0){
  //     if (selectedMonth) {
  //       setData((prevData) => ({
  //         ...prevData,
  //         [selectedMonth]: formik.values,
  //       }));
  //       setSelectedMonth('');
  //     }
  //   }

  // };

  // useEffect(() => {
  //   (async () => {
  //     try {
  //       setSelectedMonth(formik.values.period)
  //     } catch (error) {
  //       console.error(error);
  //       setSelectedMonth("")
  //     }
  //   })();
  // }, [formik.values.period]);

  return (
    <Form className="production-form" onSubmit={formik.handleSubmit}>
      {productionForm ? (
        <Segment>
          <Header as="h4">
            {" "}
            {t("date")}: {formatDateView(formik.values.date)}
          </Header>
          <Header as="h4">
            {t("creator_user")}:{" "}
            {formik.values.creator_user
              ? formik.values.creator_user.lastname
                ? formik.values.creator_user.lastname +
                  " " +
                  formik.values.creator_user.firstname
                : formik.values.creator_user.email
              : null}{" "}
          </Header>
        </Segment>
      ) : null}
      {!productionForm ? (
        <>
          <Grid columns={2} divided>
            <GridRow>
              <GridColumn>
                <Form.Dropdown
                  label={t("year")}
                  placeholder={t("select")}
                  options={years.map((year) => {
                    return {
                      key: year,
                      text: year,
                      value: year,
                    };
                  })}
                  selection
                  onChange={(_, data) =>
                    formik.setFieldValue("year", data.value)
                  }
                  value={formik.values.year}
                  error={formik.errors.year}
                />
              </GridColumn>
              <GridColumn>
                <Form.Dropdown
                  label={t("period")}
                  placeholder={t("select")}
                  options={listPeriods.map((period) => {
                    return {
                      key: period,
                      text: t(period),
                      value: period,
                    };
                  })}
                  selection
                  onChange={(_, data) =>
                    formik.setFieldValue("period", data.value)
                  }
                  value={formik.values.period}
                  error={formik.errors.period}
                />
              </GridColumn>
            </GridRow>
          </Grid>
        </>
      ) : null}
      {/* {
        data ?
        <>
              {console.log(data)}
        {Object.entries(data).map(([month, val]) => (
            <Label key={month}>
              {console.log(month)}
              {convertPeriodsEngToEsp(month)}
            </Label>
        ))}
        </>
        : null
      } */}
      <Table size="small" celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell width="1">{t("code")}</Table.HeaderCell>
            <Table.HeaderCell width="6">{t("concept")}</Table.HeaderCell>
            <Table.HeaderCell width="2">{t("value")}</Table.HeaderCell>
            <Table.HeaderCell width="2">{t("unit")}</Table.HeaderCell>
            <Table.HeaderCell width="2">{t("state")}</Table.HeaderCell>
            <Table.HeaderCell>{t("actions")}</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>
              <label className="label">
                {formik.values.production_volume.code}{" "}
              </label>
            </Table.Cell>
            <Table.Cell>
              <label className="label">{t("production_volume")}</label>
            </Table.Cell>
            <Table.Cell>
              <Form.Input
                type="string"
                name="production_volume.value"
                onChange={formik.handleChange}
                value={formik.values.production_volume.value}
                error={
                  formik.errors.production_volume?.value
                    ? formik.errors.production_volume.value
                    : null
                }
              />
            </Table.Cell>

            <Table.Cell>
              <Form.Dropdown
                //placeholder="Celda datos fijos"
                options={[{ key: 1, value: true, name: "dato" }].map((ds) => {
                  return {
                    key: ds.key,
                    text: ds.name,
                    value: ds.value,
                  };
                })}
                selection
                onChange={(_, data) =>
                  formik.setFieldValue("production_volume.unit", data.value)
                }
                value={formik.values.production_volume.unit}
                error={
                  formik.errors.production_volume?.unit
                    ? formik.errors.production_volume.unit
                    : null
                }
              />
            </Table.Cell>

            <Table.Cell>
              <Form.Dropdown
                placeholder={t("select")}
                options={[
                  { key: 1, value: true, name: "aproveed" },
                  { key: 2, value: false, name: "not_aproveed" },
                ].map((ds) => {
                  return {
                    key: ds.key,
                    text: t(ds.name),
                    value: ds.value,
                  };
                })}
                selection
                onChange={(_, data) =>
                  formik.setFieldValue(
                    "production_volume.isApproved",
                    data.value
                  )
                }
                value={formik.values.production_volume.isApproved}
                error={
                  formik.errors.production_volume?.isApproved
                    ? formik.errors.production_volume.isApproved
                    : null
                }
              />
            </Table.Cell>
            <Table.Cell>
              <Button
                icon
                type="button"
                primary
                onClick={() => {
                  openUpdateSite(t("production_volume"), "production_volume");
                }}
              >
                <Icon name="comment outline" />
              </Button>
              <FileUpload
                accessToken={accessToken}
                data={formik}
                field={"production_volume"}
                newFiles={newFiles}
                setNewFiles={setNewFiles}
                t={t}
              />
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>
              <label className="label">
                {formik.values.annual_average.code}{" "}
              </label>
            </Table.Cell>
            <Table.Cell>
              <label className="label">{t("annual_average")}</label>
            </Table.Cell>
            <Table.Cell>
              <Form.Input
                type="number"
                name="annual_average.value"
                onChange={formik.handleChange}
                value={formik.values.annual_average.value}
                error={formik.errors.annual_average}
              />
            </Table.Cell>
            <Table.Cell>
              <Form.Dropdown
                //placeholder="Celda datos fijos"
                options={[{ key: 1, value: true, name: "dato" }].map((ds) => {
                  return {
                    key: ds.key,
                    text: ds.name,
                    value: ds.value,
                  };
                })}
                selection
                onChange={(_, data) =>
                  formik.setFieldValue("annual_average.unit", data.value)
                }
                value={formik.values.annual_average.unit}
                error={formik.errors.annual_average}
              />
            </Table.Cell>
            <Table.Cell>
              <Form.Dropdown
                placeholder={t("select")}
                options={[
                  { key: 1, value: true, name: "aproveed" },
                  { key: 2, value: false, name: "not_aproveed" },
                ].map((ds) => {
                  return {
                    key: ds.key,
                    text: t(ds.name),
                    value: ds.value,
                  };
                })}
                selection
                onChange={(_, data) =>
                  formik.setFieldValue("annual_average.isApproved", data.value)
                }
                value={formik.values.annual_average.isApproved}
                error={formik.errors.annual_average}
              />
            </Table.Cell>

            <Table.Cell>
              <Button
                icon
                type="button"
                primary
                onClick={() => {
                  openUpdateSite(t("annual_average"), "annual_average");
                }}
              >
                <Icon name="comment outline" />
              </Button>
              <FileUpload
                accessToken={accessToken}
                data={formik}
                field={"annual_average"}
                newFiles={newFiles}
                setNewFiles={setNewFiles}
                t={t}
              />
            </Table.Cell>
          </Table.Row>
        </Table.Body>

        {/* <TableFooter fullWidth>
      <TableRow>
        <TableHeaderCell />
        <TableHeaderCell colSpan='4'>
          <Button
            floated='right'
            labelPosition='left'
            secundary
            size='small'
          > Aprobar todos
          </Button>
        </TableHeaderCell>
      </TableRow>
    </TableFooter> */}
      </Table>

      <BasicModal show={showModal} close={onOpenCloseModal} title={titleModal}>
        <Comments
          formik={formik}
          fieldName={fieldName}
          onClose={onOpenCloseModal}
          onReload={onReload}
          productionForm={productionForm}
          user={user}
          t={t}
        />
      </BasicModal>
      <Form.Group widths="2">
        {/* <Form.Button type="button"    secondary
          fluid onClick={handleAdd}>Añadir
        </Form.Button> */}
        <Form.Button type="submit" fluid primary loading={formik.isSubmitting}>
          {!productionForm ? t("save") : t("update")}
        </Form.Button>
        <Form.Button
          type="button"
          color="red"
          secondary
          fluid
          onClick={() => {
            onClose ? onClose() : goBack();
          }}
        >
          {t("cancel")}
        </Form.Button>
      </Form.Group>
    </Form>
  );
}

function Comments(props) {
  const { formik, user, fieldName, onClose, t } = props;
  const [comment, setComment] = useState("");

  const onChangeHandle = () => {
    if (comment && comment.length > 0) {
      let data = formik.values[fieldName].reviews;
      data.push({
        comment: comment,
        date: new Date(),
        reviewer_user: user ? user._id : null,
      });
      formik.setFieldValue(`${fieldName}.reviews`, data);
    }
    onClose();
  };

  const handleSaveComment = (id, editedContent) => {
    let data = formik.values[fieldName].reviews;
    data[id].comment = editedContent;
    data[id].date = new Date();
    formik.setFieldValue(`${fieldName}.reviews`, data);
  };

  return (
    <>
      <CommentGroup minimal>
        {formik.values[fieldName].reviews &&
        formik.values[fieldName].reviews.length > 0
          ? formik.values[fieldName].reviews.map((review, index) => (
              <>
                <EditableComment
                  id={index}
                  author={
                    review.reviewer_user
                      ? review.reviewer_user === user._id
                        ? user.firstname + " " + user.lastname
                        : review.reviewer_user.firstname +
                          " " +
                          review.reviewer_user.lastname
                      : ""
                  }
                  date={formatDateHourCompleted(review.date)}
                  content={review.comment}
                  onSave={handleSaveComment}
                  active={
                    review.reviewer_user
                      ? review.reviewer_user === user._id
                        ? true
                        : false
                      : false
                  }
                  t={t}
                />
                <Divider fitted />
              </>
            ))
          : null}
        <Form.TextArea
          //  name={[fieldName].reviews.comments}
          placeholder=""
          rows={3}
          style={{ minHeight: 100, width: "100%" }}
          // onChange={formik.handleChange}
          onChange={(_, data) => setComment(data.value)}
          value={formik.values[fieldName].reviews.comments}
          error={formik.errors[fieldName]}
        />
        <Form.Button
          type="button"
          icon="edit"
          content={t("add_comment")}
          primary
          fluid
          onClick={onChangeHandle}
        ></Form.Button>
      </CommentGroup>
    </>
  );
}

const EditableComment = ({ id, author, date, content, onSave, active, t }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    onSave(id, editedContent); // Save edited content
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset edited content and toggle editing off
    setEditedContent(content);
    setIsEditing(false);
  };

  const handleChange = (e) => {
    setEditedContent(e.target.value);
  };

  return (
    <Comment>
      <Comment.Content>
        <Comment.Author>{author}</Comment.Author>
        <CommentMetadata>
          <div>{date}</div>
        </CommentMetadata>
        <Comment.Text>
          {isEditing ? (
            <Form reply>
              <Form.TextArea value={editedContent} onChange={handleChange} />
              <Button content={t("save")} onClick={handleSave} primary />
              <Button content={t("cancel")} onClick={handleCancel} secondary />
            </Form>
          ) : (
            <div>{editedContent}</div>
          )}
        </Comment.Text>
        {active ? (
          <Comment.Actions>
            <Comment.Action onClick={handleEdit}>{t("edit")}</Comment.Action>
          </Comment.Actions>
        ) : null}
      </Comment.Content>
    </Comment>
  );
};

// function FileUpload (props) {
//   const {accessToken, data, field}=props;
//   const [file, setFile] = useState(null);
//   const [fileName, setFileName] = useState(null);
//   const [message, setMessage] = useState('');

//   const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf',
//     //'application/vnd.ms-excel', // .xls
//     //'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' // .xlsx
//     ];

//   useEffect(() => {
//     if (data.values[field] && data.values[field].file!==null) {
//      setFileName(data.values[field].file);
//     }
//   }, [field]);

//    const handleFileChange = async (event) => {
//     const file = event.target.files[0];

//     if (file) {
//       if (!allowedTypes.includes(file.type)) {
//         console.log('Tipo de archivo no permitido. Debe ser JPG, PNG o PDF.');
//       } else {
//       setMessage(`Archivo seleccionado: ${file.name}`);

//       const formData = new FormData();
//       formData.append('file', file);

//       try {
//         const response = await productionFormController.uploadFileApi(accessToken,formData);
//         setMessage(response.msg);
//         if(response.status && response.status===200){
//           setFile(file);
//           setFileName(file.name);
//           data.setFieldValue(`${field}.file`, file.name)
//         }
//       } catch (error) {
//         setMessage('Error al subir el archivo');
//       }
//     }
//     }
//   };

//   const handleButtonClick = (event) => {
//     event.preventDefault(); // Evita que el formulario se envíe
//     const input = document.createElement('input');
//     input.type = 'file';
//     input.onchange = handleFileChange;
//     input.click();
//   };

//   const handleRemoveFile = async () => {
//     setFile(null); // Elimina el archivo
//     setFileName(null);
//     try {
//       const response = await productionFormController.deleteFileApi(accessToken,fileName);
//       setMessage(response.message);
//       removeFile();
//     } catch (error) {
//       setMessage('Error al elimianr el archivo');
//     }
//   };

//   const removeFile = async () => {
//     data.setFieldValue(`${field}.file`, null)
//   };

//   return (
//     <>

//       {fileName? (
//         <>
//           {/* <p>{file.name}</p> */}
//           <FileViewer fileName={fileName} handleRemove={handleRemoveFile}/>
//         </>
//       ):  <Button icon onClick={handleButtonClick}>
//                    <Icon name="paperclip" />
//     </Button>}
//     </>
//   );

// };

function FileViewer(props) {
  const { fileName, fileUniqueName, handleRemove, t } = props;
  const [fileUrl, setFileUrl] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    if (fileName) {
      setFileUrl(fileName); // Construye la URL del archivo
      (async () => {
        try {
          const response = await productionFormController.getFileApi(
            fileUniqueName
          );
          setFileUrl(response); // Construye la URL del archivo
          console.log(setFileUrl);
          //setMessage(response.message);
        } catch (error) {
          //setMessage('Error al elimianr el archivo');
        }
      })();
    }
  }, [fileName]);

  const handleOpenPreview = (event) => {
    event.preventDefault();
    setPreviewOpen(true);
  };

  const handleClosePreview = (event) => {
    event.preventDefault(); // Previene el comportamiento predeterminado
    setPreviewOpen(false);
  };

  return (
    <>
      <List.Content floated="left">{fileName}</List.Content>
      <List.Content floated="right">
        {" "}
        <Button
          color="red"
          onClick={() => handleRemove(fileUniqueName)}
          icon="trash alternate"
        />
      </List.Content>
      {/* //<Button onClick={handleOpenPreview}> {fileName}</Button> */}
      <List.Content floated="right">
        <Modal
          onClose={handleClosePreview}
          onOpen={handleOpenPreview}
          open={previewOpen}
          trigger={
            <Button primary icon>
              <Icon name="eye" />
            </Button>
          }
        >
          <ModalHeader>{fileName}</ModalHeader>
          <ModalContent>
            {fileName &&
              (fileName.endsWith(".jpg") ||
                fileName.endsWith(".png") ||
                fileName.endsWith(".jpeg")) && (
                <Image
                  src={fileUrl}
                  alt="Vista previa"
                  style={{ maxWidth: "100%" }}
                />
              )}
            {fileName && fileName.endsWith(".pdf") && (
              <iframe
                src={fileUrl}
                title={t("preview")}
                style={{ width: "100%", height: "500px" }}
              />
            )}
          </ModalContent>
          <ModalActions>
            {/* <Button color="red" onClick={() => handleRemove(fileName)}>
            <Icon disabled name="trash alternate" /> Eliminar
          </Button> */}
            <Button color="black" onClick={handleClosePreview}>
              <Icon disabled name="close" />
              {t("close")}
            </Button>
          </ModalActions>
        </Modal>
      </List.Content>
    </>
  );
}

function FileUpload(props) {
  const { accessToken, data, field, newFiles, setNewFiles, t } = props;
  const [files, setFiles] = useState([]);
  const [filesView, setFilesView] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [openModal, setOpenModal] = useState(false); // Para controlar el estado del modal

  useEffect(() => {
    if (data.values[field].files) {
      setFilesView(data.values[field].files); // Construye la URL del archivo
    }
  }, [data]);

  const handleButtonClick = (event) => {
    event.preventDefault(); // Evita que el formulario se envíe
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.onchange = handleFileChange;
    input.click();
  };

  // Maneja el cambio cuando se seleccionan archivos
  const handleFileChange = async (e) => {
    e.preventDefault(); // Evita que el formulario se envíe
    const selectedFiles = e.target.files;
    setNewFiles({ ...newFiles, [field]: Array.from(selectedFiles) });
    //data.setFieldValue(`${field}.files`,Array.from(selectedFiles))
    setFiles([...selectedFiles]);
  };

  // // Función para subir archivos
  // const uploadFiles = async (filesToUpload) => {
  //   const formData = new FormData();
  //   Array.from(filesToUpload).forEach((file) => {
  //     formData.append("files", file);
  //   });

  //   // Luego de preparar los datos, puedes hacer la solicitud POST
  //   // axios.post('url_del_backend', formData, { ... })
  //   setErrorMessage("");
  //   setSuccessMessage("");
  //   console.log(filesToUpload);
  //   if (filesToUpload.length === 0) {
  //     console.log("no hay archivos");
  //     setErrorMessage("Por favor, selecciona al menos un archivo.");
  //     return;
  //   }

  //   try {
  //     // Realizar la solicitud POST al backend
  //     const response = await productionFormController.uploadFileApi(
  //       accessToken,
  //       formData
  //     );
  //     console.log(response);
  //     if (response.code && response.code === 200) {
  //       console.log("aca", response.files);
  //       let data=[...uploadedFiles,...response.files]
  //       console.log("aca3",data)
  //       setUploadedFiles(data); // Suponiendo que el backend devuelve las rutas de los archivos subidos
  //       setSuccessMessage(response.msg);
  //       setErrorMessage("");
  //       data.setFieldValue(`${field}.files`, data);
  //       setFiles([]); // Limpiar los archivos seleccionados después de subir
  //     }
  //   } catch (error) {
  //     setErrorMessage("Hubo un error al subir los archivos.");
  //     setSuccessMessage("");
  //   }
  // };

  // Función para cerrar el modal
  const closeModal = (event) => {
    event.preventDefault();
    setOpenModal(!openModal);
  };

  const handleRemoveFile = async (file) => {
    try {
      const updatedFiles = filesView.filter((f) => f.uniqueName !== file);
      setFilesView(updatedFiles);
      const response = await productionFormController.deleteFileApi(
        accessToken,
        file
      );
      //setMessage(response.message);
      removeFile(updatedFiles);
    } catch (error) {
      // setMessage('Error al elimianr el archivo');
    }
  };

  const removeFile = async (updatedFiles) => {
    data.setFieldValue(`${field}.files`, updatedFiles);
  };

  return (
    <>
      {/* Input para seleccionar los archivos */}
      {/* <Input
        type="file"
        multiple
        icon={"paperclip"}
        onChange={handleFileUpload}
      /> */}

      <Button
        default
        onClick={handleButtonClick}
        icon="paperclip"
        style={{ marginTop: "10px" }}
        color={files.length > 0 ? "green" : "grey"}
      ></Button>

      {/* Mensajes de éxito o error */}
      {successMessage && (
        <Message success>
          <Message.Header>Éxito</Message.Header>
          <p>{successMessage}</p>
        </Message>
      )}

      {errorMessage && (
        <Message error>
          <Message.Header>Error</Message.Header>
          <p>{errorMessage}</p>
        </Message>
      )}

      <Button
        primary
        onClick={closeModal}
        style={{ marginTop: "10px" }}
        icon="eye"
      ></Button>
      {/* Modal para mostrar los archivos subidos */}
      <Modal open={openModal} onClose={closeModal} size="tiny">
        <Modal.Header>Archivos subidos</Modal.Header>
        <Modal.Content>
          {filesView.length > 0 ? (
            <List divided>
              {filesView.map((filePath, index) => (
                <List.Item key={index}>
                  {/* <a href={`/${filePath.url}`} target="_blank" rel="noopener noreferrer">
                      {filePath.url}
                    </a> */}

                  <FileViewer
                    fileName={filePath.name}
                    fileUniqueName={filePath.uniqueName}
                    handleRemove={handleRemoveFile}
                    t={t}
                  />
                </List.Item>
              ))}
            </List>
          ) : (
            <p>No se encontraron archivos subidos.</p>
          )}
        </Modal.Content>
        <Modal.Actions>
          <Button color="green" onClick={closeModal}>
            {t("close")}
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  );
}

// function ModalComments() {
//   const [open, setOpen] = React.useState(false)

//   return (
//     <Modal
//       basic
//       onClose={() => setOpen(false)}
//       onOpen={() => setOpen(true)}
//       open={open}
//       size='small'
//       trigger={<Button>Basic Modal</Button>}
//     >
//       <Header icon>
//         <Icon name='archive' />
//         Archive Old Messages
//       </Header>
//       <ModalContent>
//         <p>
//           Your inbox is getting full, would you like us to enable automatic
//           archiving of old messages?
//         </p>
//       </ModalContent>
//       <ModalActions>
//         <Button basic color='red' inverted onClick={() => setOpen(false)}>
//           <Icon name='remove' /> No
//         </Button>
//         <Button color='green' inverted onClick={() => setOpen(false)}>
//           <Icon name='checkmark' /> Yes
//         </Button>
//       </ModalActions>
//     </Modal>
//   )
// }
