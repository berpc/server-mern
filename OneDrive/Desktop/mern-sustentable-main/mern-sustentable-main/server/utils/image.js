function getFilePath(file) {
  // const filePath = file.path;
  // const fileSplit = filePath.split("//");

  // return `${fileSplit[1]}/${fileSplit[2]}`;
  let filePath = file.path;
  //console.log(filePath);
  let fileSplit = filePath.split("\\");
  //console.log(fileSplit);
  let fileName = fileSplit[2]; //define la posicion del path: 1 = img name
  //console.log(fileName);
  // let extSplit = fileName.split("."); //para extraer la extension de la img
  // //console.log(extSplit);

  // let fileExt = extSplit[1]; //es la segunda posicion xq parte de la ultima de fileName
  // //console.log(fileExt);
  // console.log(fileName)
  return fileName;

}

module.exports = {
  getFilePath,
};
