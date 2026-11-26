const time = new Intl.DateTimeFormat("en-NG", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Africa/Lagos" });
const day = new Intl.DateTimeFormat("en-NG", { weekday: "short", day: "numeric", month: "short", timeZone: "Africa/Lagos" });
const full = new Intl.DateTimeFormat("en-NG", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Africa/Lagos" });
const key = new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Lagos" });

export const formatTime = (d) => time.format(new Date(d));
export const formatDay = (d) => day.format(new Date(d));
export const formatDateTime = (d) => full.format(new Date(d));
export const dayKey = (d) => key.format(new Date(d));
export const isSameDay = (a, b) => dayKey(a) === dayKey(b);
