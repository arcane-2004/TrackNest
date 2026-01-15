function getUTCRange(range = "Monthly") {
    const now = new Date();

    // ---- DAY ----
    const startOfDay = new Date(Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate()
    ));
    const endOfDay = new Date(Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate() + 1
    ));

    // ---- WEEK (Monday) ----
    const startOfWeek = new Date(startOfDay);
    startOfWeek.setUTCDate(startOfDay.getUTCDate() - (startOfDay.getUTCDay() || 7) + 1);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setUTCDate(startOfWeek.getUTCDate() + 7);

    // ---- MONTH ----
    const startOfMonth = new Date(Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        1
    ));
    const endOfMonth = new Date(Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth() + 1,
        1
    ));

    // ---- YEAR ----
    const startOfYear = new Date(Date.UTC(
        now.getUTCFullYear(),
        0,
        1
    ));
    const endOfYear = new Date(Date.UTC(
        now.getUTCFullYear() + 1,
        0,
        1
    ));

    switch (range) {
        case "All":
            return { start: new Date(0), end: new Date()};
        case "Daily":
            return { start: startOfDay, end: endOfDay };
        case "Weekly":
            return { start: startOfWeek, end: endOfWeek };
        case "Yearly":
            return { start: startOfYear, end: endOfYear };
        case "Monthly":
        default:
            return { start: startOfMonth, end: endOfMonth };
    }
}

module.exports = { getUTCRange };
