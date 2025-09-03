import CryptoJS from "crypto-js";

const key = import.meta.env.VITE_SECRET_KEY;
export const Storage = {
  saveToken: (token: string) => {
    const encryptedData = CryptoJS.AES.encrypt(token, key).toString();
    localStorage.setItem("token", encryptedData);
  },

  getToken: () => {
    const encryptedData = localStorage.getItem("token");
    if (encryptedData !== null) {
      const decryptedData = CryptoJS.AES.decrypt(encryptedData, key).toString(
        CryptoJS.enc.Utf8
      );
      return decryptedData;
    }
    return null;
  },
};
