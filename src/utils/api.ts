import axios from "axios";

const API = axios.create({
  baseURL: "https://boco-agency-recreation-backend-4.onrender.com/api", // Strapi backend
});

export default API;
