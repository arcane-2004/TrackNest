const { formatInTimeZone } = require("date-fns-tz");

function formatPeriodForAI(startUTC, endUTC) {
  return {
    start: formatInTimeZone(startUTC, "Asia/Kolkata", "d MMM yyyy"),
    end: formatInTimeZone(endUTC, "Asia/Kolkata", "d MMM yyyy")
  };
}

module.exports = formatPeriodForAI;
