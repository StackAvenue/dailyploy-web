import moment from "moment";
import cookie from "react-cookies";

export const getWeekFisrtDate = date => {
  return moment(date)
    .startOf("week")
    .format("YYYY-MM-DD");
};

export const getFisrtDate = (date, type) => {
  return moment(date)
    .startOf(type)
    .format("YYYY-MM-DD");
};

export const firstTwoLetter = name => {
  return name
    ? name
        .split(" ")
        .slice(0, 2)
        .map(x => x[0])
        .join("")
        .toUpperCase()
    : null;
};

export const textTitlize = text => {
  return text.replace(/(?:^|\s)\S/g, function(a) {
    return a.toUpperCase();
  });
};

export const workspaceNameSplit = name => {
  let nameArr = name;
  let nameSplit = nameArr.split(" ");
  return textTitlize(nameSplit.join(" "));
};

export const convertUTCToLocalDate = date => {
  var date = new Date(date);
  return new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
};

export const getWorkspaceId = () => {
  return cookie.load("workspaceId");
};
