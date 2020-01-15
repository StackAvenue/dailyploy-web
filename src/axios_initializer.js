import axios from "axios";
import cookie from "react-cookies";
import { toast } from "react-toastify";
import { SERVICE_URL, AUTH_TOKEN } from "./utils/Constants";

const axiosInitializer = {
  config: () => {
    axios.defaults.baseURL = SERVICE_URL;
    axios.defaults.headers.common["Authorization"] = AUTH_TOKEN
      ? `Bearer ${AUTH_TOKEN}`
      : "";
    //Request Interceptor
    axios.interceptors.request.use(
      config => {
        return config;
      },
      error => {
        return Promise.reject(error);
      }
    );
    //Response Interceptor
    axios.interceptors.response.use(
      response => {
        if (response.data && response.data.message) {
          console.log("Props", this.props);
          toast.success(response.data.message);
        }
        return response;
      },
      error => {
        if (error.response.status == 401) {
          cookie.remove("accessToken", { path: "/" });
          cookie.remove("userRole", { path: "/" });
          cookie.remove("loggedInUser", { path: "/" });
          cookie.remove("workspaceId", { path: "/" });
          cookie.remove("workspaceName", { path: "/" });
          setTimeout((window.location.href = "/login"), 2000);
        } else {
          return Promise.reject(error);
        }
      }
    );
  }
};

export default axiosInitializer;
