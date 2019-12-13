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
        .map(x => x[0])
        .join("")
    : null;
};

export const workspaceNameSplit = name => {
  let nameArr = name;
  let nameSplit = nameArr.split(" ").slice(2);
  return nameSplit.join(" ");
};
