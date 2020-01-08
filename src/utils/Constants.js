import cookie from "react-cookies";

export const AUTH_TOKEN = cookie.load("accessToken");
export const WORKSPACE_ID = cookie.load("workspaceId");
// export const SERVICE_URL = process.env.REACT_APP_DEVLOPMENT_URL;
export const SERVICE_URL = process.env.REACT_APP_STAGING_URL;
export const WORKSPACE_NAME = cookie.load("workspaceName");
export const MOCK_URL = "http://5d1b281edd81710014e88430.mockapi.io/api/v1";
export const DATE_FORMAT1 = "YYYY-MM-DD"; // 2019-10-27
export const DATE_FORMAT2 = "DD MMM YYYY"; // 27 Oct 2019
export const DATE_FORMAT3 = "YYYY, DD MMM"; // 2019, 27 Oct
export const DATE_FORMAT4 = "YYYY, MMM DD"; // 2019, Oct 27
export const DATE_FORMAT5 = "MMM DD"; // Oct 27
export const DATE_FORMAT6 = "DD MMM"; // 27 Oct
export const YEAR = "YYYY"; // 2019
export const MONTH_FORMAT1 = "MMM"; // Oct
export const MONTH_FORMAT2 = "MMM YYYY"; // Oct 2019
export const HRMIN = "HH:mm"; // 27 Oct 2019
export const MONTH_FORMAT = "DD MMM"; // November 2019
export const CHART_COLOR = {
  capacity: "#e5e5e5",
  scheduled: "#aeb8bb",
  worked_0: "#7fa6ad",
  worked_1: "#e5edee",
  curr_worked_0: "#002329",
  curr_worked_1: "#ccdbde",
  ext_worked_0: "#270600",
  ext_worked_1: "#ebebeb",
  active_color: "#0075d9"
};
