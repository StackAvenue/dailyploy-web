import cookie from "react-cookies";
export const WEBSITE_URL = "https://dailyploy.com";
export const AUTH_TOKEN = cookie.load("accessToken");
export const WORKSPACE_ID = cookie.load("workspaceId");
export const SERVICE_URL = process.env.REACT_APP_API_ENDPOINT;
export const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
export const WORKSPACE_NAME = cookie.load("workspaceName");
export const MOCK_URL = "http://5d1b281edd81710014e88430.mockapi.io/api/v1";
export const DATE_FORMAT1 = "YYYY-MM-DD"; // 2019-10-27
export const FULL_DATE = "YYYY-MM-DD HH:mm:ss"; // 2019-10-27
export const DATE_FORMAT2 = "DD MMM YYYY"; // 27 Oct 2019
export const DATE_FORMAT3 = "YYYY, DD MMM"; // 2019, 27 Oct
export const FULL_DATE_FORMAT3 = "YYYY, DD MMM HH:mm A"; // 2019, 27 Oct
export const DATE_FORMAT4 = "YYYY, MMM DD"; // 2019, Oct 27
export const DATE_FORMAT5 = "MMM DD"; // Oct 27
export const DATE_FORMAT6 = "DD MMM"; // 27 Oct
export const YEAR = "YYYY"; // 2019
export const MONTH_FORMAT1 = "MMM"; // Oct
export const MONTH_FORMAT2 = "MMM YYYY"; // Oct 2019
export const HRMIN = "HH:mm"; // 27:20:19
export const HHMMSS = "HH:mm:ss"; // 20:34:19
export const MONTH_FORMAT = "DD MMM"; // November 2019
export const CHART_COLOR = {
  capacity: "#e5e5e5",
  scheduled: "#e5e5e5",
  worked_0: "#7fa6ad",
  worked_1: "#e5edee",
  curr_worked_0: "#002329",
  curr_worked_1: "#ccdbde",
  ext_worked_0: "#ad867f",
  ext_worked_1: "#ebebeb",
  curr_ext_worked_0: "#270600",
  curr_ext_worked_1: "#ebebeb",
  active_color: "#0075d9"
};
export const PRIORITIES = [
  {
    name: "high",
    color_code: "#00A031",
    label: "high"
  },
  {
    name: "medium",
    color_code: "#FF7F00",
    label: "medium"
  },
  {
    name: "low",
    color_code: "#555555",
    label: "low"
  },
  {
    name: "no_priority",
    color_code: "#9B9B9B",
    label: "no priority"
  }
];
export const DEFAULT_PRIORITIE = {
  name: "no_priority",
  color_code: "#9B9B9B",
  label: "no priority"
};
export const PRIORITIES_MAP = new Map();
PRIORITIES_MAP.set("high", {
  name: "high",
  color_code: "#00A031",
  label: "high"
});
PRIORITIES_MAP.set("medium", {
  name: "medium",
  color_code: "#FF7F00",
  label: "medium"
});
PRIORITIES_MAP.set("low", {
  name: "low",
  color_code: "#555555",
  label: "low"
});
PRIORITIES_MAP.set("no_priority", {
  name: "no_priority",
  color_code: "#9B9B9B",
  label: "no priority"
});
