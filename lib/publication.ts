export const PUBLICATION_TIME_ZONE = "Australia/Brisbane"
export type PublicationStatus = "draft" | "published"
export function publicationDay(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en", { timeZone: PUBLICATION_TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(now)
  const value = (type: string) => parts.find(p => p.type === type)!.value
  return `${value("year")}-${value("month")}-${value("day")}`
}
export function publicationState(status: string, date: string, now = new Date()) {
  return status !== "published" ? "Draft" : date > publicationDay(now) ? "Scheduled" : "Published"
}
export function publicationAction(status: string, date: string) {
  return status === "draft" ? "Save draft" : date > publicationDay() ? "Schedule" : "Publish"
}
