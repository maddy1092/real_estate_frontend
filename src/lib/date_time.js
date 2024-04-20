import moment from "moment";

export const SERVER_TIMEZONE = "Asia/Kuwait";

export function getMonthLabels(locale = "en-us") {
  return new Array(12).fill(0).map((_, i) => {
    let date = new Date(0);
    date.setMonth(i);
    return date.toLocaleString(locale, { month: "short" });
  });
}

export function formatTime(val) {
  return moment(val, ["HH:mm:ss"]).format("hh:mm A");
}
