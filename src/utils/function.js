import moment from "moment";
import cookie from "react-cookies";
import { DATE_FORMAT1 } from "./Constants";

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

export const getMiddleDates = (start, end) => {
  var startDate = new Date(start);
  var endDate = new Date(end);
  var daysArr = new Array();
  var currentDate = startDate;
  while (currentDate <= endDate) {
    daysArr.push(moment(currentDate).format(DATE_FORMAT1));
    var date = moment(currentDate, DATE_FORMAT1)
      .add(1, "days")
      .format(DATE_FORMAT1);
    currentDate = new Date(date);
  }
  return daysArr;
};
