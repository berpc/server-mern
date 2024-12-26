const bcrypt = require("bcryptjs");
const Waste = require("../models/waste");
const { deleteCompany } = require("./company");
const fs = require("fs");
const path = require("path");

async function getWaste(req, res) {
  const { id } = req.params;

  const response = await Waste.findById(id);
  if (!response) {
    res.status(400).send({ msg: "No se ha encontrado el formulario de Agua" });
  } else {
    res.status(200).send(response);
  }
}

async function getWastes(req, res) {
  const { active } = req.query;
  let response = null;

  if (active === undefined) {
    response = await Waste.find();
  } else {
    response = await Waste.find({ active });
  }

  res.status(200).send(response);
}

async function createWaste(req, res) {
  const waste = new Waste({ ...req.body, active: true });

  waste.save((error, waterStored) => {
    if (error) {
      res.status(400).send({ msg: "Error al crear el formulario de residuos" });
    } else {
      res.status(200).send(waterStored);
    }
  });
}

async function updateWaste(req, res) {
  const { id } = req.params;
  const waterData = req.body;

  Waste.findByIdAndUpdate({ _id: id }, waterData, (error,response) => {
    if (error) {
      res.status(400).send({ msg: "Error al actualizar el formulario de residuos" });
    } else {
      res.status(200).send({ msg: "Actualizacion correcta" });
    }
  });
}

async function deleteWaste(req, res) {
 try {
     // t("search") el documento
     const { id } = req.params;
     const doc = await Waste.findById({_id:id});
 
     if (!doc) {
       console.log('Documento no encontrado');
       return;
     }
 
     // Recorrer todas las propiedades del documento
     for (let field in doc.toObject()) {
       const fieldValue = doc[field];
       
       // Verificar si el campo es un array de archivos (tiene 'files')
       if (Array.isArray(fieldValue)) {
         fieldValue.forEach(item => {
           if (item.files && Array.isArray(item.files)) {
             // Si el campo tiene archivos, eliminarlos
             item.files.forEach(file => {
               const filePath = path.join("uploads/files/waste", file.uniqueName); // Ruta completa del archivo
               fs.unlink(filePath, (err) => {
                 if (err) {
                   console.error(`Error al eliminar el archivo ${filePath}:`, err);
                 } else {
                   console.log(`Archivo eliminado: ${filePath}`);
                 }
               });
             });
           }
         });
       } else if (fieldValue && typeof fieldValue === 'object') {
         // Si el campo es un subdocumento (objeto), verificar si tiene archivos
         if (fieldValue.files && Array.isArray(fieldValue.files)) {
           fieldValue.files.forEach(file => {
             const filePath = path.join("uploads/files/waste", file.uniqueName); // Ruta completa del archivo
             fs.unlink(filePath, (err) => {
               if (err) {
                 console.error(`Error al eliminar el archivo ${filePath}:`, err);
               } else {
                 console.log(`Archivo eliminado: ${filePath}`);
               }
             });
           });
         }
       }
     }
 
     // Después de eliminar los archivos, eliminamos el documento
     await doc.deleteOne();
     //console.log('Documento eliminado correctamente');
     res.status(200).send({ msg: "Formulario eliminado" });
   } catch (error) {
     //console.error('Error al eliminar los archivos y el documento:', error);
     res.status(400).send({ msg: "Error al eliminar el formulario de Residuos" });
   }
}

async function existsWasteFormBySiteAndPeriodAndYear(req, res) {
  const { period, year, site } = req.params;

  Waste.find(
    { period: period, year: year, site: site },
    {},
    (error, wastes) => {
      if (error) {
        res
          .status(400)
          .send({ msg: "Error al obtener los formularios de residuos" });
      } else {
        if (wastes && wastes.length > 0) {
          res.status(200).send({ code: 200, exist: true });
        } else {
          res.status(200).send({ code: 200, exist: false });
        }
      }
    }
  );
}

async function getPeriodWasteFormsBySiteAndYear(req, res) {
  const { year, site } = req.params;

  Waste.find(
    { year: year, site: site },
    { _id: 0, period: 1 },
    (error, periods) => {
      if (error) {
        res
          .status(400)
          .send({
            msg: "Error al obtener los formularios de residuos de acuerdo al año",
          });
      } else {
        const newData = periods.map((item) => item.period);
        res.status(200).send({ code: 200, periods: newData });
      }
    }
  );
}

async function getWasteFormsBySiteAndYear(req, res) {
  const { year, site } = req.params;

  Waste.find(
    {
      $and: [
        { year: { $exists: true, $eq: year } },
        { site: { $exists: true, $eq: site } },
      ],
    },
    {},
    (error, wasteForms) => {
      if (error) {
        res
          .status(400)
          .send({
            msg: "Error al obtener los formularios de residuos de acuerdo al año",
          });
      } else {
        res.status(200).send({ code: 200, wasteForms: wasteForms });
      }
    }
  );
}

function uploadFile(req, res) {

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send({ code: 400, msg: 'No se subieron archivos.' });
  }

  // Crear un array para guardar las rutas de los archivos procesados
  const uploadedFiles = [];

  // Recorrer todos los archivos subidos
  const files = req.files.files; // Si se usan varios archivos, 'files' es el nombre del campo del formulario

  if (Array.isArray(files)) {
    // Si se subieron múltiples archivos
    files.forEach((file, index) => {
      const fileName = `${Date.now()}-${file.name}`; // Crear un nombre único
      const filePath = path.join("uploads/files/waste", fileName);

      // Mover el archivo a la carpeta destino
      fs.rename(file.path, filePath, (err) => {
        if (err) {
          return res.status(500).send("Failed to upload file.");
        }

        // Guardar la ruta del archivo procesado
        uploadedFiles.push({url:filePath, name: file.name, uniqueName:fileName});

        // Si todos los archivos se han procesado, responder
        if (uploadedFiles.length === files.length) {
          return res.status(200).send({
            code: 200,
            msg: 'Archivos subidos y procesados correctamente',
            files: uploadedFiles
          });
        }
      });
    });
  } else {
    // Si solo se subió un archivo
    const file = files;
    const fileName = `${Date.now()}-${file.name}`; // Crear un nombre único
    const filePath = path.join("uploads/files/waste", fileName);

    // Mover el archivo a la carpeta destino
    fs.rename(file.path, filePath, (err) => {
      if (err) {
        return res.status(500).send("Failed to upload file.");
      }

      // Responder con la ruta del archivo procesado
      res.status(200).send({
        code: 200,
        msg: 'Archivo subido y procesado correctamente',
        files: [{url:filePath, name:file.name, uniqueName:fileName}]
      });
    });
  }
}

function getFile(req, res) {
    const fileName = req.params.fileName;
    const filePath = "./uploads/files/waste/" + fileName;
    fs.exists(filePath, (exists) => {
      if (!exists) {
        res.status(404).send({ message: "El archivo que buscás no existe" });
      } else {
        res.sendFile(path.resolve(filePath));
      }
    });
}

function deleteFile(req, res) {
  const { fileName } = req.body;

  if (!fileName) {
    return res.status(400).json({ message: 'Se requiere el nombre del archivo' });
  }

  // Define la ruta del archivo
  const filePath = path.join("uploads/files/waste", fileName);

  // Elimina el archivo
  fs.unlink(filePath, (err) => {
    if (err) {
      return res.status(500).json({ code: 500, message: 'Error al eliminar el archivo' });
    }
    res.status(200).json({ code:200, message: 'Archivo eliminado exitosamente' });
  });
}

module.exports = {
  getWaste,
  getWastes,
  createWaste,
  updateWaste,
  deleteWaste,
  existsWasteFormBySiteAndPeriodAndYear,
  getPeriodWasteFormsBySiteAndYear,
  getWasteFormsBySiteAndYear,
  uploadFile,
  getFile,
  deleteFile
};