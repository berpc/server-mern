const bcrypt = require("bcryptjs");
const KPIs = require("../models/kpis");
const fs = require("fs");
const path = require("path");

async function getKPIs(req, res) {
  const { id } = req.params;
        
  const response = await KPIs.findById(id);
  if (!response) {
    res.status(400).send({ msg: "No se ha encontrado el formulario de KPIs" });
  } else {
    res.status(200).send(response);
    
  }

}

async function getKPIsForms(req, res) {
  const { active } = req.query;
  let response = null;

  if (active === undefined) {
    response = await KPIs.find();
  } else {
    response = await KPIs.find({ active });
  }

  res.status(200).send(response);
}

async function createKPIs(req, res) {
  const kpis = new KPIs({ ...req.body, active: true });

  kpis.save((error, kpisStored) => {
    if (error) {
      res.status(400).send({ msg: "Error al crear el formulario de KPIs" });
    } else {
      res.status(200).send(kpisStored);
    }
  });
}

async function updateKPIs(req, res) {
  const { id } = req.params;
  const kpisData = req.body;

  KPIs.findByIdAndUpdate({ _id: id }, kpisData, (error,response) => {
    if (error) {
      res.status(400).send({ msg: "Error al actualizar el formulario de KPIs" });
    } else {
      res.status(200).send({ msg: "Actualizacion correcta" });
    }
  });
}

async function deleteKPIs(req, res) {
  try {
      // t("search") el documento
      const { id } = req.params;
      const doc = await KPIs.findById({_id:id});
  
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
                const filePath = path.join("uploads/files/kpis", file.uniqueName); // Ruta completa del archivo
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
              const filePath = path.join("uploads/files/kpis", file.uniqueName); // Ruta completa del archivo
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
      res.status(400).send({ msg: "Error al eliminar el formulario de KPIs" });
    }
}

async function existsKPIsFormBySiteAndPeriodAndYear(req, res) {
  const { period, year, site } = req.params;

  KPIs.find(
    { period: period, year: year, site: site },
    {},
    (error, energies) => {
      if (error) {
        res
          .status(400)
          .send({ msg: "Error al obtener los formularios de KPIs" });
      } else {
        if (energies && energies.length > 0) {
          res.status(200).send({ code: 200, exist: true });
        } else {
          res.status(200).send({ code: 200, exist: false });
        }
      }
    }
  );
}

async function getPeriodKPIsFormsBySiteAndYear(req, res) {
  const { year, site } = req.params;

  KPIs.find(
    { year: year, site: site },
    { _id: 0, period: 1 },
    (error, periods) => {
      if (error) {
        res
          .status(400)
          .send({
            msg: "Error al obtener los formularios de KPIs de acuerdo al año",
          });
      } else {
        const newData = periods.map((item) => item.period);
        res.status(200).send({ code: 200, periods: newData });
      }
    }
  );
}

async function getKPIsFormsBySiteAndYear(req, res) {
  const { year, site } = req.params;

  KPIs.find(
    {
      $and: [
        { year: { $exists: true, $eq: year } },
        { site: { $exists: true, $eq: site } },
      ],
    },
    {},
    (error, kpisForms) => {
      if (error) {
        res
          .status(400)
          .send({
            msg: "Error al obtener los formularios de KPIs de acuerdo al año",
          });
      } else {
        res.status(200).send({ code: 200, kpisForms: kpisForms });
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
      const filePath = path.join("uploads/files/kpis", fileName);

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
    const filePath = path.join("uploads/files/kpis", fileName);

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
    const filePath = "./uploads/files/kpis/" + fileName;
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
  const filePath = path.join("uploads/files/kpis", fileName);

  // Elimina el archivo
  fs.unlink(filePath, (err) => {
    if (err) {
      return res.status(500).json({ code: 500, message: 'Error al eliminar el archivo' });
    }
    res.status(200).json({ code:200, message: 'Archivo eliminado exitosamente' });
  });
}

module.exports = {
  getKPIs,
  getKPIsForms,
  createKPIs,
  updateKPIs,
  deleteKPIs,
  existsKPIsFormBySiteAndPeriodAndYear,
  getPeriodKPIsFormsBySiteAndYear,
  getKPIsFormsBySiteAndYear,
  uploadFile,
  getFile,
  deleteFile
};
