import cookie from "react-cookies";

export const AUTH_TOKEN = cookie.load("accessToken");
export const WORKSPACE_ID = cookie.load("workspaceId");
export const SERVICE_URL = process.env.REACT_APP_DEVLOPMENT_URL;
// export const SERVICE_URL = process.env.REACT_APP_STAGING_URL;
export const WORKSPACE_NAME = cookie.load("workspaceName");
export const MOCK_URL = "http://5d1b281edd81710014e88430.mockapi.io/api/v1";
export const DATE_FORMAT1 = "YYYY-MM-DD"; // 2019-10-27
export const DATE_FORMAT2 = "DD MMM YYYY"; // 27 Oct 2019
export const HRMIN = "HH:mm"; // 27 Oct 2019
export const MONTH_FORMAT = "DD MMM"; // November 2019
