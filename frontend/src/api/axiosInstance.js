import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://exercise6cc-leon-436215937980.us-central1.run.app", 
  withCredentials: true,
});

export default axiosInstance;
