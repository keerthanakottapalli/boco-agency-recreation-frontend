import axios from "axios";

const API = axios.create({
  baseURL: `${process.env.REACT_APP_STRAPI_URL}/api`, // Strapi backend
});

export default API;
