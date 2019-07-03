import axios from "axios";

export const headerConfig = {
  "Content-Type": "application/json"
};

export const URL = "https://5d1b281edd81710014e88430.mockapi.io/post";

export const signUp = async (signupData) =>{
  return await axios.post(URL,signupData,{ headerConfig });
};

export const login = async (loginData) =>{
  return await axios.post(URL,loginData);
};

export const logout = async () =>{
  await localStorage.removeItem("token");
  await localStorage.removeItem("name");
}
