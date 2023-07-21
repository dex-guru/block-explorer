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
  subHours,
  startOfHour,
  endOfHour,
  subMinutes,
} from 'date-fns'

const DYNAMIC_DATE_PREFIX = 'd_'
const DATE_FORMAT = 'yyyy-MM-dd'

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
  value: string
): { start: string | null; end: string | null } => {
  const range =
    DYNAMIC_DATE_RANGES[value.substring(DYNAMIC_DATE_PREFIX.length)].value()

  return { start: range.start || null, end: range.end || null }
}

const getFormattedDate = (moment = new Date()): string => {
  return format(startOfDay(moment), DATE_FORMAT)
}

export const DYNAMIC_DATE_RANGES: Record<
  string,
  { name: string; value: () => { start: string; end: string } }
> = {
  today: {
    name: 'Today',
    value: () => {
      const moment = new Date()

      return {
        start: getFormattedDate(startOfDay(moment)),
        end: getFormattedDate(endOfDay(moment)),
      }
    },
  },
  yesterday: {
    name: 'Yesterday',
    value: () => {
      const moment = subDays(new Date(), 1)

      return {
        start: getFormattedDate(startOfDay(moment)),
        end: getFormattedDate(endOfDay(moment)),
      }
    },
  },
  this_week: {
    name: 'This week',
    value: () => {
      const moment = new Date()

      return {
        start: getFormattedDate(startOfWeek(moment)),
        end: getFormattedDate(endOfWeek(moment)),
      }
    },
  },
  this_month: {
    name: 'This month',
    value: () => {
      const moment = new Date()

      return {
        start: getFormattedDate(startOfMonth(moment)),
        end: getFormattedDate(endOfMonth(moment)),
      }
    },
  },
  this_year: {
    name: 'This year',
    value: () => {
      const moment = new Date()

      return {
        start: getFormattedDate(startOfYear(moment)),
        end: getFormattedDate(endOfYear(moment)),
      }
    },
  },
  last_week: {
    name: 'Last week',
    value: () => {
      const moment = subWeeks(new Date(), 1)

      return {
        start: getFormattedDate(startOfWeek(moment)),
        end: getFormattedDate(endOfWeek(moment)),
      }
    },
  },
  last_month: {
    name: 'Last month',
    value: () => {
      const moment = subMonths(new Date(), 1)

      return {
        start: getFormattedDate(startOfMonth(moment)),
        end: getFormattedDate(endOfMonth(moment)),
      }
    },
  },
  last_year: {
    name: 'Last year',
    value: () => {
      const moment = subYears(new Date(), 1)

      return {
        start: getFormattedDate(startOfYear(moment)),
        end: getFormattedDate(endOfYear(moment)),
      }
    },
  },
  last_hour: {
    name: 'Last hour',
    value: () => {
      const moment = subHours(new Date(), 1)

      return {
        start: getFormattedDate(startOfHour(moment)),
        end: getFormattedDate(endOfHour(moment)),
      }
    },
  },
  last_8_hours: {
    name: 'Last 8 hours',
    value: () => {
      const moment = new Date()

      return {
        start: getFormattedDate(subHours(moment, 1)),
        end: getFormattedDate(endOfHour(moment)),
      }
    },
  },
  last_24_hours: {
    name: 'Last 24 hours',
    value: () => {
      const moment = new Date()

      return {
        start: getFormattedDate(subMinutes(moment, 60)),
        end: getFormattedDate(moment),
      }
    },
  },
  last_7_days: {
    name: 'Last 7 days',
    value: () => {
      const moment = new Date()

      return {
        start: getFormattedDate(startOfDay(subDays(moment, 7))),
        end: getFormattedDate(endOfDay(moment)),
      }
    },
  },
  last_14_days: {
    name: 'Last 14 days',
    value: () => {
      const moment = new Date()

      return {
        start: getFormattedDate(startOfDay(subDays(moment, 14))),
        end: getFormattedDate(endOfDay(moment)),
      }
    },
  },
  last_30_days: {
    name: 'Last 30 days',
    value: () => {
      const moment = new Date()

      return {
        start: getFormattedDate(startOfDay(subDays(moment, 30))),
        end: getFormattedDate(endOfDay(moment)),
      }
    },
  },
  last_60_days: {
    name: 'Last 60 days',
    value: () => {
      const moment = new Date()

      return {
        start: getFormattedDate(startOfDay(subDays(moment, 60))),
        end: getFormattedDate(endOfDay(moment)),
      }
    },
  },
  last_90_days: {
    name: 'Last 90 days',
    value: () => {
      const moment = new Date()

      return {
        start: getFormattedDate(startOfDay(subDays(moment, 90))),
        end: getFormattedDate(endOfDay(moment)),
      }
    },
  },
  last_12_months: {
    name: 'Last 12 months',
    value: () => {
      const moment = new Date()

      return {
        start: getFormattedDate(startOfDay(subMonths(moment, 12))),
        end: getFormattedDate(endOfDay(moment)),
      }
    },
  },
}
