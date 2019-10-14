import cookie from "react-cookies";

export const AUTH_TOKEN = cookie.load("accessToken");
export const WORKSPACE_ID = cookie.load("workspaceId");
export const SERVICE_URL = "http://localhost:4000/api/v1";
// export const SERVICE_URL = "https://dailyploy.herokuapp.com/api/v1";
export const MOCK_URL = "http://5d1b281edd81710014e88430.mockapi.io/api/v1";
