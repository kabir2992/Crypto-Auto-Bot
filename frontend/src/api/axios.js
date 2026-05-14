import axios from "axios";

const API = axios.create({
  baseURL: "http://56.228.15.68:5000/api"
  // baseURL: "http://localhost:5000/api"
});

export default API;