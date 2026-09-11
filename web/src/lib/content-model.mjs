// Shared by the static renderer and the build validators. No browser-only resolution.
export function resolveClinic(input) {
  const clinic = structuredClone(input);
  const a = clinic.addressParts;
  if (a) clinic.address = `${a.region} ${a.locality} ${a.street}`;
  clinic.hours = clinic.hours.map((h) => ({
    ...h,
    value: h.opens && h.closes ? `${h.opens} – ${h.closes}` : h.value,
  }));
  for (const h of clinic.hours) {
    if (h.opens || h.closes) {
      if (
        ![h.opens, h.closes].every((v) => /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(v)) ||
        h.opens >= h.closes
      )
        throw new Error(`Invalid clinic time interval: ${h.id}`);
    }
    if (h.breakId) {
      const rest = clinic.hours.find((b) => b.id === h.breakId);
      if (!rest || !(h.opens < rest.opens && rest.opens < rest.closes && rest.closes < h.closes))
        throw new Error(`Invalid clinic break: ${h.id}`);
    }
    if (
      h.days?.some(
        (d) =>
          !['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].includes(
            d,
          ),
      )
    )
      throw new Error(`Invalid clinic day: ${h.id}`);
  }
  return clinic;
}

export function resolvePages(input, clinic) {
  const values = {
    'clinic.name': clinic.name,
    'clinic.phone': clinic.phone,
    'clinic.address': clinic.address,
    'clinic.subway': clinic.subway,
    ...Object.fromEntries(
      clinic.hours.filter((h) => h.id).map((h) => [`clinic.hours.${h.id}`, h.value]),
    ),
  };
  const resolve = (value) => {
    if (typeof value === 'string')
      return value.replace(/\{\{([^{}]+)\}\}/g, (_, key) => {
        if (!Object.hasOwn(values, key) || !values[key])
          throw new Error(`Unknown clinic reference: ${key}`);
        return values[key];
      });
    if (Array.isArray(value)) return value.map(resolve);
    if (value && typeof value === 'object')
      return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, resolve(v)]));
    return value;
  };
  return resolve(input);
}

export function clinicHoursSchema(clinic) {
  return clinic.hours.flatMap((h) => {
    if (!h.days?.length || !h.opens || !h.closes || h.breakUnconfirmed) return [];
    const rest = h.breakId && clinic.hours.find((b) => b.id === h.breakId);
    const intervals = rest
      ? [
          [h.opens, rest.opens],
          [rest.closes, h.closes],
        ]
      : [[h.opens, h.closes]];
    return intervals.map(([opens, closes]) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: h.days,
      opens,
      closes,
    }));
  });
}

export function clinicAddressSchema(clinic) {
  const a = clinic.addressParts;
  return a
    ? {
        '@type': 'PostalAddress',
        streetAddress: a.street,
        addressLocality: a.locality,
        addressRegion: a.region,
        addressCountry: a.country,
      }
    : { '@type': 'PostalAddress', streetAddress: clinic.address, addressCountry: 'KR' };
}
