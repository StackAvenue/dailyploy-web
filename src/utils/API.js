import axios from "axios";
import cookie from "react-cookies";
import { SERVICE_URL, MOCK_URL } from "./Constants";

const headerConfig = {
  "Content-Type": "application/json"
};

const URL = SERVICE_URL;
const URL2 = MOCK_URL;

export const signUp = async signupData => {
  return await axios.post(`${URL}/api/v1/sign_up`, signupData, headerConfig);
};

export const login = async loginData => {
  return await axios.post(`${URL}/api/v1/sign_in`, loginData);
};

export const logout = async () => {
  await cookie.remove("authToken", { path: "/" });
};
