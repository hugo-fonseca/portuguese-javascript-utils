import 'core-js/modules/es6.array.find'
import HOLIDAYS from '../helpers/holidays'

function modifyXY(year) {
  let x = 22
  let y = 2
  let xOffset = 0
  let yOffset = 0

  if (year < 1800 && year > 1699) {
    xOffset = 1
    yOffset = 1
  } else if (year < 1900) {
    xOffset = 2
    yOffset = 2
  } else if (year < 2100) {
    xOffset = 2
    yOffset = 3
  } else if (year < 2200) {
    xOffset = 2
    yOffset = 4
  } else {
    xOffset = 3
    yOffset = 5
  }

  return {
    x: x + xOffset,
    y: y + yOffset
  }
}

function calculateEaster(year, x, y) {
  const a = year % 19
  const b = year % 4
  const c = year % 7
  const d = (19 * a + x) % 30
  const e = (2 * b + 4 * c + 6 * d + y) % 7

  const dayOffset = d + e > 9 ? -9 : 22
  const monthOffset = d + e > 9 ? 1 : 0
  let day = d + e + dayOffset
  let month = 3 + monthOffset

  // 2 exceptions occur to these calculations
  if (month == 4 && day == 26) {
    day = 19
  }

  if (month == 4 && day == 25 && d == 28 && a > 10) {
    day = 18
  }

  return new Date(year, month - 1, day)
}

function calculateHolidayFromEaster(easter, daysFromEaster) {
  const newDate = new Date(easter)
  newDate.setDate(easter.getDate() + daysFromEaster)

  return newDate
}

function getYearEaster(year) {
  const { x, y } = modifyXY(year)
  return calculateEaster(year, x, y)
}

function calculateMobileHolidays(year) {
  const easter = getYearEaster(year)
  const christsBody = calculateHolidayFromEaster(easter, 60)
  const holyFriday = calculateHolidayFromEaster(easter, -2)

  return [
    {
      day: easter.getDate(),
      month: easter.getMonth(),
      holiday: 'Páscoa'
    },
    {
      day: christsBody.getDate(),
      month: christsBody.getMonth(),
      holiday: 'Corpo de Deus'
    },
    {
      day: holyFriday.getDate(),
      month: holyFriday.getMonth(),
      holiday: 'Sexta-feira Santa'
    }
  ]
}

function checkDateValidity(date) {
  const isDate =
    date && Object.prototype.toString.call(date) === '[object Date]'
  if (!isDate) {
    return isDate
  } else if (isNaN(date.getTime())) {
    return false
  }

  return true
}

/**
 *
 * @param {Date} date
 * @param {Boolean} showHoliday
 */
export default function isHoliday(date, showHoliday) {
  if (!checkDateValidity(date)) return false

  const holidays = [...HOLIDAYS, ...calculateMobileHolidays(date.getFullYear())]

  const found = holidays.find(
    holiday =>
      holiday.day === date.getDate() && holiday.month === date.getMonth()
  )

  return showHoliday ? !!found && found.holiday : !!found
}
