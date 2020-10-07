import axios from "axios";
import cookie from "react-cookies";
import { toast } from "react-toastify";
import { SERVICE_URL, AUTH_TOKEN } from "./utils/Constants";
import { ERR_MODAL_ID } from "./utils/Constants";
// const openErrorModal = () => {
//   const ErrorModalContainer = document.getElementById(ERR_MODAL_ID);
//   ErrorModalContainer.classList.add("active");
// }
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
          //console.log("Props", this.props);
          //toast.success(response.data.message);
        }
        return response;
      },
      error => {
        if (error && error.response && error.response.status) {

          const urlSplit = error.response.config.url;
          const urlWithNoErrorModal = ['sign_up', 'sign_in', 'google_signin', 'google_auth', 'forgot_password'];
          if (!(error.response.status.toString().startsWith('5'))) {
            const isShowModal = urlWithNoErrorModal.find(noErrUrl => urlSplit.includes(noErrUrl));
            // if (!isShowModal) {
            //   openErrorModal();
            // }
          }
          if (error.response.status == 401) {

            if (!(urlSplit.includes('sign_in') || urlSplit.includes('sign_up'))) {
              cookie.remove("accessToken", { path: "/" });
              cookie.remove("userRole", { path: "/" });
              cookie.remove("loggedInUser", { path: "/" });
              cookie.remove("workspaceId", { path: "/" });
              cookie.remove("workspaceName", { path: "/" });
              setTimeout((window.location.href = "/login"), 2000);
              //openErrorModal();
            } else {
              return Promise.reject(error);
            }
          } else {
            return Promise.reject(error);
          }
        }
      }
    );
  }
};

export default axiosInitializer;
