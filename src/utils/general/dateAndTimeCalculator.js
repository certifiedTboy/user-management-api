const moment = require("moment");

/**
 * @method dateTimeCalculator
 * @param {Number} housrs
 * @param {Number} Minutes
 * @returns {Date}
 */
const dateTimeCalculator = (hours, minutes = 0) => {
  checkThatHourAndMinutesAreValid(hours, minutes);
  const calculatedDate = moment().add(hours, "hours");
  calculatedDate.add(minutes, "minutes");

  return calculatedDate.toDate();
};

/**
 * @method checkThatHourAndMinutesAreValid
 * @param {Number} hours
 * @param {Number} minutes
 * @returns {Void}
 */
const checkThatHourAndMinutesAreValid = (hours, minutes) => {
  if (hours < 0) {
    throw new Error("Hours cannot be negative");
  }
  if (minutes < 0) {
    throw new Error("Minutes cannot be negative");
  }
};

module.exports = dateTimeCalculator;
