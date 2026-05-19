export function formatDate(value: Date | string): string {
  const d = new Date(value);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours24 = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const ampm = hours24 >= 12 ? 'PM' : 'AM';
  const hours12 = String(hours24 % 12 || 12).padStart(2, '0');
  return `${year}-${month}-${day} ${hours12}:${minutes} ${ampm}`;
}

const ISO_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;

export function transformDates(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (obj instanceof Date) return formatDate(obj);
  if (typeof obj?.toHexString === 'function') return obj.toHexString();
  if (typeof obj === 'string' && ISO_REGEX.test(obj)) return formatDate(obj);
  if (Array.isArray(obj)) return obj.map(transformDates);
  if (typeof obj === 'object')
    return Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [k, transformDates(v)]),
    );
  return obj;
}
