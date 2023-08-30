import {
  startOfDay,
  endOfDay,
  format,
  subDays,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  subWeeks,
  subMonths,
  subYears,
} from 'date-fns'

type DateTimeFormat =
  | 'date-range'
  | 'datetime-range'
  | 'datetime-range-with-seconds'

export const DYNAMIC_DATE_PREFIX = 'd_'
export const DEFAULT_DATE_RANGE = 'last_30_days'
export const DATETIME_FORMATS: Record<DateTimeFormat, string> = {
  'date-range': 'yyyy-MM-dd',
  'datetime-range': 'yyyy-MM-dd HH:mm',
  'datetime-range-with-seconds': 'yyyy-MM-dd HH:mm:ss',
}

export const isDynamicDateRangePeriod = (value: string): boolean => {
  const re = new RegExp(`${DYNAMIC_DATE_PREFIX}[0-9a-z_]+`, 'i')

  return (
    re.test(value) &&
    !!Object.keys(DYNAMIC_DATE_RANGES).includes(
      value.substring(DYNAMIC_DATE_PREFIX.length)
    )
  )
}

export const getDynamicDateRangePeriod = (
  value: string,
  type: DateTimeFormat = 'date-range'
): { start: string | null; end: string | null } => {
  const range =
    DYNAMIC_DATE_RANGES[value.substring(DYNAMIC_DATE_PREFIX.length)].value()

  return {
    start: getFormattedDate(range.start, type) || null,
    end: getFormattedDate(range.end, type) || null,
  }
}

const getFormattedDate = (
  moment = new Date(),
  dateTimeType: DateTimeFormat = 'date-range'
): string => {
  return format(moment, DATETIME_FORMATS[dateTimeType])
}

export const DYNAMIC_DATE_RANGES: Record<
  string,
  { name: string; value: () => { start: Date; end: Date } }
> = {
  // today: {
  //   name: 'Today',
  //   value: () => {
  //     const moment = new Date()

  //     return {
  //       start: startOfDay(moment),
  //       end: endOfDay(moment),
  //     }
  //   },
  // },
  // yesterday: {
  //   name: 'Yesterday',
  //   value: () => {
  //     const moment = subDays(new Date(), 1)

  //     return {
  //       start: startOfDay(moment)),
  //       end: endOfDay(moment)),
  //     }
  //   },
  // },
  this_week: {
    name: 'This week',
    value: () => {
      const moment = new Date()

      return {
        start: startOfWeek(moment),
        end: endOfWeek(moment),
      }
    },
  },
  this_month: {
    name: 'This month',
    value: () => {
      const moment = new Date()

      return {
        start: startOfMonth(moment),
        end: endOfMonth(moment),
      }
    },
  },
  this_year: {
    name: 'This year',
    value: () => {
      const moment = new Date()

      return {
        start: startOfYear(moment),
        end: endOfYear(moment),
      }
    },
  },
  last_week: {
    name: 'Last week',
    value: () => {
      const moment = subWeeks(new Date(), 1)

      return {
        start: startOfWeek(moment),
        end: endOfWeek(moment),
      }
    },
  },
  last_month: {
    name: 'Last month',
    value: () => {
      const moment = subMonths(new Date(), 1)

      return {
        start: startOfMonth(moment),
        end: endOfMonth(moment),
      }
    },
  },
  last_year: {
    name: 'Last year',
    value: () => {
      const moment = subYears(new Date(), 1)

      return {
        start: startOfYear(moment),
        end: endOfYear(moment),
      }
    },
  },
  // last_hour: {
  //   name: 'Last hour',
  //   value: () => {
  //     const moment = subHours(new Date(), 1)

  //     return {
  //       start: startOfHour(moment)),
  //       end: endOfHour(moment)),
  //     }
  //   },
  // },
  // last_8_hours: {
  //   name: 'Last 8 hours',
  //   value: () => {
  //     const moment = new Date()

  //     return {
  //       start: subHours(moment, 1)),
  //       end: endOfHour(moment)),
  //     }
  //   },
  // },
  // last_24_hours: {
  //   name: 'Last 24 hours',
  //   value: () => {
  //     const moment = new Date()

  //     return {
  //       start: subMinutes(moment, 60)),
  //       end: moment),
  //     }
  //   },
  // },
  last_7_days: {
    name: 'Last 7 days',
    value: () => {
      const moment = new Date()

      return {
        start: startOfDay(subDays(moment, 7)),
        end: endOfDay(moment),
      }
    },
  },
  last_14_days: {
    name: 'Last 14 days',
    value: () => {
      const moment = new Date()

      return {
        start: startOfDay(subDays(moment, 14)),
        end: endOfDay(moment),
      }
    },
  },
  last_30_days: {
    name: 'Last 30 days',
    value: () => {
      const moment = new Date()

      return {
        start: startOfDay(subDays(moment, 30)),
        end: endOfDay(moment),
      }
    },
  },
  last_60_days: {
    name: 'Last 60 days',
    value: () => {
      const moment = new Date()

      return {
        start: startOfDay(subDays(moment, 60)),
        end: endOfDay(moment),
      }
    },
  },
  last_90_days: {
    name: 'Last 90 days',
    value: () => {
      const moment = new Date()

      return {
        start: startOfDay(subDays(moment, 90)),
        end: endOfDay(moment),
      }
    },
  },
  last_12_months: {
    name: 'Last 12 months',
    value: () => {
      const moment = new Date()

      return {
        start: startOfDay(subMonths(moment, 12)),
        end: endOfDay(moment),
      }
    },
  },
}

export const getDateTime = (
  time: number | string | Date,
  options: Intl.DateTimeFormatOptions = {
    timeZone: 'UTC',
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    weekday: 'short',
    hour12: false,
  }
): string => {
  const date = new Date(time)
  return date.toLocaleString('en-GB', options)
}

export const getDate = (time: number | string | Date): string => {
  return getDateTime(time, {
    timeZone: 'UTC',
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour12: false,
  })
}

export const getTime = (time: number | string | Date): string => {
  return getDateTime(time, {
    timeZone: 'UTC',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
}
