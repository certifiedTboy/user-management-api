const moment = require("moment");

const dateTimeCalculator = (hours, minutes = 0) => {
  checkThatHourAndMinutesAreValid(hours, minutes);
  const calculatedDate = moment().add(hours, "hours");
  calculatedDate.add(minutes, "minutes");

  return calculatedDate.toDate();
};

const checkThatHourAndMinutesAreValid = (hours, minutes) => {
  if (hours < 0) {
    throw new Error("Hours cannot be negative");
  }
  if (minutes < 0) {
    throw new Error("Minutes cannot be negative");
  }
};

module.exports = dateTimeCalculator;
