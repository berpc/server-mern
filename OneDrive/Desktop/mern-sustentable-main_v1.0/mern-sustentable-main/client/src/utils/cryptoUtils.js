import { Base64 } from 'js-base64';

const secretKey = 'miClaveSecreta123'; // Clave secreta para encriptación (¡cámbiala por una más segura!)

export const encrypt = (data) => {
  const jsonString = JSON.stringify(data);
  const encrypted = Base64.fromUint8Array(new TextEncoder().encode(jsonString));
  return encrypted;
};

export const decrypt = (encryptedData) => {
  const decryptedUint8Array = Base64.toUint8Array(encryptedData);
  const decryptedString = new TextDecoder().decode(decryptedUint8Array);
  return JSON.parse(decryptedString);
};
