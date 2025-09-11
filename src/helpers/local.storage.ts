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
