export const Storage = {
  saveToken: (token: string) => {
    try {
      if (!token) {
        console.error("Token is empty or null");
        return false;
      }

      localStorage.setItem("authToken", token);
      return true;
    } catch (error) {
      console.error("Error saving token:", error);
      return false;
    }
  },
  saveSocketChannel: (channel: any) => {
    localStorage.setItem("socketMainChannel", channel);
  },

  setPublisherId: (publisherId: any) => {
    localStorage.setItem("publisherId", publisherId);
  },

  getPublisherId: (publisherId: string) => {
    try {
      const stored = localStorage.getItem(publisherId);
      if (!stored) return null;

      return JSON.parse(stored); // works if you stored object or string
    } catch (error) {
      console.error("Failed to parse publisherId:", error);
      return null;
    }
  },

  // getListenerData: (listener: string) => {
  //   try {
  //     const encryptedData = localStorage.getItem(listener);
  //     if (!encryptedData) {
  //       return null;
  //     }

  //     return JSON.parse(encryptedData);
  //   } catch (error) {
  //     console.error(`Failed to parse data for listener "${listener}"`, error);
  //     return null;
  //   }
  // },

  getSocketChannel: () => {
    const encryptedData = localStorage.getItem("socketMainChannel");
    if (encryptedData !== null) {
      return encryptedData;
    }
    return null;
  },

  addListener: (listener: string, data: any) => {
    Storage.addListenerList(listener);
    localStorage.setItem(listener, data);
  },

  addListenerList: (listener: string) => {
    const encryptedData = localStorage.getItem("listenerList");

    if (encryptedData !== null) {
      const decryptedData = JSON.parse(encryptedData) as string[];
      if (!decryptedData.includes(listener)) {
        decryptedData.push(listener);

        localStorage.setItem("listenerList", encryptedData);
      }
    } else {
      const encryptedData = JSON.stringify([listener]);

      localStorage.setItem("listenerList", encryptedData);
    }
  },

  removeFromListenerList: (listener: string) => {
    const encryptedData = localStorage.getItem("listenerList");
    if (encryptedData !== null) {
      const decryptedData = JSON.parse(encryptedData);
      if (decryptedData.includes(listener)) {
        const filteredItems = decryptedData.filter(
          (element: any) => element != listener
        );

        const encryptedData = JSON.stringify(filteredItems);

        localStorage.setItem("listenerList", encryptedData);
      }
    }
  },

  getListenerList: (): string[] => {
    const encryptedData = localStorage.getItem("listenerList");
    if (encryptedData !== null) {
      const decryptedData = JSON.parse(encryptedData) as string[];
      return decryptedData;
    } else {
      return [];
    }
  },

  removeListener: (listener: string) => {
    Storage.removeFromListenerList(listener);
    localStorage.removeItem(listener);
  },

  clearListenerList: () => {
    const listeners = Storage.getListenerList();

    for (const listener of listeners) {
      Storage.removeListener(listener);
    }
  },

  getToken: () => {
    try {
      const token = localStorage.getItem("authToken");
      return token;
    } catch (error) {
      console.error("Error getting token:", error);
      return null;
    }
  },

  clearToken: () => {
    try {
      localStorage.removeItem("authToken");
      return true;
    } catch (error) {
      console.error("Error clearing authToken:", error);
      return false;
    }
  },

  // Debug method to check storage state
  debugToken: () => {
    console.log("=== Token Debug Info ===");
    const token = localStorage.getItem("authToken");
    console.log("Token exists:", !!token);
    console.log("Token length:", token?.length || 0);
    console.log("Token value:", token);
    console.log("========================");
  },
};
