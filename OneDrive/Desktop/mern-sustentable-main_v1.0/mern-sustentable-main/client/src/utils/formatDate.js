import moment from 'moment';

export function formatDateView(d) {
    let date = moment(new Date(d));
    return date.utc().format("DD/MM/yyyy");
}

export function formatDateCalendar(d) {
    //console.log(formatCalendar1)
    let date = moment(new Date(d));
    return date.utc().format("yyyy-MM-DD");
}

export function formatDateCalendar2(d) {
    //console.log(formatCalendar2)
    let date = moment(d,"DD/MM/yyyy",true);
    return date.utc().format("yyyy-MM-DD");
}

export function formatDateHourCompleted(d) {
    let date = moment(new Date(d));
    return date.utcOffset('-0300').format("DD/MM/yyyy HH:mm:ss");
}

export function formatDateHour(d) {
    let date = moment(new Date(d));
    return date.utcOffset('-0300').format("DD/MM/yyyy HH:mm");
}

export function formatDateHourView(d) {
    let date = moment(d);
    return date;
}

export function getDateYear(d){
    let date = new Date(d);
    return date.getFullYear();
}

export function getDateYearActual() {
    let date = moment(new Date());
    return date.getFullYear;
}

export function formatDateYear(d) {
    let date = moment(d);
    return date;
}

export function convertToDate(dStr, format) {
  var now = new Date();
  if (format === "h:m") {
    if (typeof dStr === "string" && dStr.length > 0 && dStr !== "") {
      now.setHours(dStr.substr(0, dStr.indexOf(":")));
      now.setMinutes(dStr.substr(dStr.indexOf(":") + 1));
      now.setSeconds(0);
      now.setMilliseconds(0);
      return now;
    } else {
      return false;
    }
  } else return false;
}