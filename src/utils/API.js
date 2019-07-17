import axios from "axios";
import cookie from "react-cookies";

const headerConfig = {
  "Content-Type": "application/json"
};

const URL = "http://3afba4b2.ngrok.io";

export const signUp = async signupData => {
  return await axios.post(`${URL}/api/v1/sign_up`, signupData, headerConfig);
};

export const login = async loginData => {
  return await axios.post(`${URL}/api/v1/sign_in`, loginData);
};

export const logout = async () => {
  await cookie.remove("authToken", { path: "/" });
};
