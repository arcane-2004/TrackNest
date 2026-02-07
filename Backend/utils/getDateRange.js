getDateRange = async function (period) {
    const IST_OFFSET_MINUTES = 5 * 60 + 30;

    const istToUtc = (date) => {
        return new Date(date.getTime() - IST_OFFSET_MINUTES * 60 * 1000);
    };

    const now = new Date();

    switch (period) {
        case "Daily": {
            const start = new Date(Date.UTC(
                now.getUTCFullYear(),
                now.getUTCMonth(),
                now.getUTCDate()
            ));
            const end = new Date(start);
            end.setUTCDate(start.getUTCDate() + 1);
            const utcStart = istToUtc(start)
            const utcEnd = istToUtc(end)
            return { utcStart, utcEnd };
        }

        case "Weekly": {
            const start = new Date(Date.UTC(
                now.getUTCFullYear(),
                now.getUTCMonth(),
                now.getUTCDate() - (now.getUTCDay() || 7) + 1
            ));
            const end = new Date(start);
            end.setUTCDate(start.getUTCDate() + 7);
            const utcStart = istToUtc(start)
            const utcEnd = istToUtc(end)
            return { utcStart, utcEnd };
        }

        case "Monthly": {
            const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
            const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));
            const utcStart = istToUtc(start)
            const utcEnd = istToUtc(end)
            return { utcStart, utcEnd };
        }

        case "Yearly": {
            const start = new Date(Date.UTC(now.getUTCFullYear(), 0, 1));
            const end = new Date(Date.UTC(now.getUTCFullYear() + 1, 0, 1));
            const utcStart = istToUtc(start)
            const utcEnd = istToUtc(end)
            return { utcStart, utcEnd };
        }
    }
}

module.exports = {getDateRange}
