// utils/calendar.js
export function getMonthGrid(year, month) {
  const first = new Date(year, month, 1)
  const last = new Date(year, month + 1, 0)

  const startDay = (first.getDay() + 6) % 7 // Monday start
  const totalDays = last.getDate()

  const days = []

  // Prev month fillers
  for (let i = startDay - 1; i >= 0; i--) {
    days.push({
      date: new Date(year, month, -i),
      currentMonth: false,
    })
  }

  // Current month
  for (let d = 1; d <= totalDays; d++) {
    days.push({
      date: new Date(year, month, d),
      currentMonth: true,
    })
  }

  // Next month fillers
  while (days.length % 7 !== 0) {
    days.push({
      date: new Date(year, month, totalDays + (days.length - startDay) + 1),
      currentMonth: false,
    })
  }

  return days
}
