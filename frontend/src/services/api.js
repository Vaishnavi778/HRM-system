import axios from "axios";

const API = axios.create({
  baseURL: "https://hrm-system-1-klrq.onrender.com"
});

export default API;
