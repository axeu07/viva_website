/**
 * Open / closed status against the gym's hours in IST (Asia/Kolkata), whatever the visitor's timezone.
 * Mon–Sat 05:00–22:00. Sunday hours are unconfirmed (TODO(client)), so Sunday reads as closed.
 */
const OPEN_MIN = 5 * 60;
const CLOSE_MIN = 22 * 60;
const OPEN_DAYS = [1, 2, 3, 4, 5, 6]; // Mon..Sat (0 = Sunday)

export type GymStatus = { open: boolean; text: string };

function istNow(now = new Date()) {
  const ist = new Date(now.getTime() + (now.getTimezoneOffset() + 330) * 60_000);
  return { day: ist.getDay(), mins: ist.getHours() * 60 + ist.getMinutes() };
}

export function gymStatus(now = new Date()): GymStatus {
  const { day, mins } = istNow(now);
  const openDay = OPEN_DAYS.includes(day);
  if (openDay && mins >= OPEN_MIN && mins < CLOSE_MIN) return { open: true, text: "Open now · until 10:00 PM" };
  // closed: work out when it next opens
  const beforeOpenToday = openDay && mins < OPEN_MIN;
  if (beforeOpenToday) return { open: false, text: "Closed · opens 5:00 AM" };
  const tomorrow = (day + 1) % 7;
  if (OPEN_DAYS.includes(tomorrow)) return { open: false, text: "Closed · opens 5:00 AM" };
  return { open: false, text: "Closed · opens Mon 5:00 AM" };
}
