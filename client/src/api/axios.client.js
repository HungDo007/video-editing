import axios from "axios";
import queryString from "query-string";
import Cookies from "js-cookie";

//set up default config here
const CancelToken = axios.CancelToken;
const source = CancelToken.source();

const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_BASE_API_URL,
  headers: {
    "content-type": "application/json",
  },
  paramsSerializer: (params) => queryString.stringify(params),
});
axiosClient.defaults.timeout = 0;
axiosClient.defaults.cancelToken = source.token;
axiosClient.interceptors.request.use(async (config) => {
  //handle token here
  const token = Cookies.get("Token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => {
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  (error) => {
    if (error.response.status == 401) {
      Cookies.remove("Token");
      window.location = "/login";
    }
    //return Promise.reject(error.response.data);
    return Promise.reject(error);
  }
);

export default axiosClient;
