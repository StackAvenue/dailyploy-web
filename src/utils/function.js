import moment from "moment";

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
  let nameSplit = nameArr.split(" ").slice(2);
  return textTitlize(nameSplit.join(" "));
};
