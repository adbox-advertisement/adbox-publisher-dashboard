import axios from "axios";

const BASE_URL_V1 = import.meta.env.VITE_BASE_URL;
import { Storage } from "./local.storage";

const config: any = {
  headers: {
    "Content-Type": "application/json",
  },
};

//Axios Post
const post_api = (route: string, data: any) => {
  const token = Storage.getToken();
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return axios.post(BASE_URL_V1 + route, data, config);
};

//Axios Get
const get_api = (route: string) => {
  const token = Storage.getToken();
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return axios.get(BASE_URL_V1 + route, config);
};

const ApiService = {
  post_api,
  get_api,
};

export default ApiService;
