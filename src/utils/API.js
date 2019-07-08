import axios from "axios";
import cookie from 'react-cookies';

export const headerConfig = {
  "Content-Type": "application/json"
};

export const URL = "https://5d1b281edd81710014e88430.mockapi.io";

export const signUp = async (signupData) =>{
  return await axios.post(`${URL}/post`,signupData,{ headerConfig });
};

export const login = async (loginData) =>{
  return await axios.post(`http://5d1b281edd81710014e88430.mockapi.io/SignIn`,loginData);
};

export const logout = async () =>{
  // await localStorage.removeItem("authToken");
  // await localStorage.removeItem("refreshToken");
  await cookie.remove('authToken', { path: '/' });
  await cookie.remove('refreshToken', { path: '/' })
}
