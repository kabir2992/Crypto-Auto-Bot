import axios from "axios";

const API = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL_MCX,
    // import.meta.env.VITE_LIVE_API_URL_MCX,
    // "http://localhost:5000/mcx/api",
    withCredentials: true
});

export default API;