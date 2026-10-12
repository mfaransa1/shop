import type { Tournament } from "@/types/tournament";

const NAIROBI_TIME_ZONE = "Africa/Nairobi";

export function getNairobiDateString(date = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: NAIROBI_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  return `${year}-${month}-${day}`;
}

export function canAcceptTournamentRegistration(
  tournament: Pick<Tournament, "date" | "status">
): boolean {
  const registrationStatus =
    tournament.status === "upcoming" ||
    tournament.status === "registration-open";

  return registrationStatus && tournament.date >= getNairobiDateString();
}
