const apiDatePattern = /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{1,7}))?)?(Z|[+-]\d{2}:?\d{2})?)?$/;

/**
 * Converts the ISO date values emitted by the API into browser Date instances.
 *
 * API values without a UTC offset represent a local business date/time, so they
 * are deliberately constructed in local time instead of using Date.parse. That
 * prevents a calendar from moving the date when the browser has a non-UTC zone.
 */
export function deserializeApiDate(value: unknown): Date | null | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }

  const match = apiDatePattern.exec(value);
  if (!match) {
    return undefined;
  }

  const [, yearText, monthText, dayText, hourText, minuteText, secondText, fractionText, offset] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);

  // DateTime.MinValue is how the API represents an absent optional DateTime.
  if (year === 1 && month === 1 && day === 1) {
    return null;
  }

  const hour = Number(hourText ?? 0);
  const minute = Number(minuteText ?? 0);
  const second = Number(secondText ?? 0);
  const millisecond = Number((fractionText ?? '').padEnd(3, '0').slice(0, 3));
  let date: Date;

  if (offset) {
    // JavaScript only guarantees millisecond precision, whereas .NET may emit
    // up to seven fractional-second digits.
    const normalizedValue = fractionText && fractionText.length > 3
      ? value.replace(`.${fractionText}`, `.${fractionText.slice(0, 3)}`)
      : value;
    date = new Date(normalizedValue);
  } else {
    date = new Date(year, month - 1, day, hour, minute, second, millisecond);
  }

  if (Number.isNaN(date.getTime())) {
    return undefined;
  }

  if (!offset && (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day ||
    date.getHours() !== hour ||
    date.getMinutes() !== minute ||
    date.getSeconds() !== second
  )) {
    return undefined;
  }

  return date;
}

/** Rehydrates API date strings throughout a JSON response without changing other values. */
export function reviveApiDates<T>(response: T): T {
  const visited = new WeakSet<object>();

  const revive = (value: unknown): unknown => {
    const parsedDate = deserializeApiDate(value);
    if (parsedDate !== undefined) {
      return parsedDate;
    }

    if (value === null || typeof value !== 'object' || value instanceof Date || visited.has(value)) {
      return value;
    }

    visited.add(value);

    if (Array.isArray(value)) {
      for (let index = 0; index < value.length; index++) {
        value[index] = revive(value[index]);
      }
      return value;
    }

    if (Object.getPrototypeOf(value) === Object.prototype || Object.getPrototypeOf(value) === null) {
      const record = value as Record<string, unknown>;
      for (const key of Object.keys(record)) {
        record[key] = revive(record[key]);
      }
    }

    return value;
  };

  return revive(response) as T;
}
