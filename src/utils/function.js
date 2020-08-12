import moment from "moment";
import cookie from "react-cookies";
import { DATE_FORMAT1, FULL_DATE } from "./Constants";
import { isSafari } from "react-device-detect";

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
  return text.replace(/(?:^|\s)\S/g, function (a) {
    return a.toUpperCase();
  });
};

export const debounce = (func, wait, immediate) => {
  var timeout;
  return function () {
    var context = this, args = arguments;
    var later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

export const workspaceNameSplit = name => {
  let nameArr = name;
  let nameSplit = nameArr.split(" ");
  return textTitlize(nameSplit.join(" "));
};

export const convertUTCToLocalDate = date => {
  var newdate = new Date(date.replace(/-/g, "/"));
  return new Date(newdate.getTime() + newdate.getTimezoneOffset() * 60 * 1000);
};

export const convertUTCDateToLocalDate = date => {
  // var newDate = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
  // var offset = date.getTimezoneOffset() / 60;
  // var hours = date.getHours();
  // newDate.setHours(hours - offset);
  // return newDate;

  //UTC time converted to Local time

  if (isSafari) {
    date = new Date(date);
  } else {
    date = new Date(date);
    var localOffset = date.getTimezoneOffset() * 60000;
    var localTime = date.getTime();
    date = localTime - localOffset;
    date = new Date(date);
  }
  return date;
};

export const getWorkspaceId = () => {
  return cookie.load("workspaceId");
};

// export const getMiddleDates = (start, end) => {
//   var startDate = convertUTCToLocalDate(moment(start).format(FULL_DATE));
//   var endDate = convertUTCToLocalDate(moment(end).format(FULL_DATE));
//   // var startDate = new Date(start);
//   // var endDate = new Date(end);
//   var daysArr = new Array();
//   var currentDate = startDate;
//   while (currentDate <= endDate) {
//     daysArr.push(moment(currentDate).format(DATE_FORMAT1));
//     var date = moment(currentDate, DATE_FORMAT1)
//       .add(1, "days")
//       .format(DATE_FORMAT1);
//     currentDate = convertUTCToLocalDate(date);
//   }
//   return daysArr;
// };

export const getMiddleDates = (start, end) => {
  var date1 = convertUTCToLocalDate(moment(start).format(FULL_DATE));
  var date2 = convertUTCToLocalDate(moment(end).format(FULL_DATE));
  var day = 1000 * 60 * 60 * 24;
  var daysArr = [];

  var diff = (date2.getTime() - date1.getTime()) / day;
  for (var i = 0; i <= diff; i++) {
    var xx = date1.getTime() + day * i;
    var yy = new Date(xx);
    daysArr.push(
      yy.getFullYear() + "-" + (yy.getMonth() + 1) + "-" + yy.getDate()
    );
  }
  return daysArr;
};

// export const getContrastColor = hexcolor => {
//   var hexcolor = hexcolor.split("#")[1];
//   return parseInt(hexcolor, 16) > 0xffffff / 2 ? "black" : "#dcdcdc";
// };

export const getContrastColor = hex => {
  /*
  From this W3C document: http://www.webmasterworld.com/r.cgi?f=88&d=9769&url=http://www.w3.org/TR/AERT#color-contrast
  
  Color brightness is determined by the following formula: 
  ((Red value X 299) + (Green value X 587) + (Blue value X 114)) / 1000
  
  I know this could be more compact, but I think this is easier to read/explain.
  
  */

  let threshold = 130; /* about half of 256. Lower threshold equals more dark text on dark background  */

  let hRed = hexToR(hex);
  let hGreen = hexToG(hex);
  let hBlue = hexToB(hex);
  function hexToR(h) {
    return parseInt(cutHex(h).substring(0, 2), 16);
  }
  function hexToG(h) {
    return parseInt(cutHex(h).substring(2, 4), 16);
  }
  function hexToB(h) {
    return parseInt(cutHex(h).substring(4, 6), 16);
  }
  function cutHex(h) {
    return h.charAt(0) == "#" ? h.substring(1, 7) : h;
  }

  let cBrightness = (hRed * 299 + hGreen * 587 + hBlue * 114) / 1000;
  if (cBrightness > threshold) {
    return "#000000";
  } else {
    return "rgba(255, 255, 255, 0.93)";
  }
};
