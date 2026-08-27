export type TournamentStatus =
  | "upcoming"
  | "registration-open"
  | "ongoing"
  | "completed";

export type TournamentFormat =
  | "Swiss"
  | "Round Robin"
  | "Knockout"
  | "Team";

export type TournamentPlayer = {
  id: string;
  name: string;
  rating?: number;
  club?: string;
  avatar?: string;
};

export type LeaderboardEntry = {
  rank: number;
  playerId: string;
  playerName: string;
  rating?: number;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  points: number;
};

export type TournamentMatch = {
  id: string;
  round: number;
  position: number;
  player1?: TournamentPlayer;
  player2?: TournamentPlayer;
  player1Score?: number;
  player2Score?: number;
  winnerId?: string;
  status: "upcoming" | "live" | "completed";
};

export type TournamentRound = {
  id: string;
  name: string;
  matches: TournamentMatch[];
};

export type Tournament = {
  id: string;
  name: string;
  slug: string;
  description: string;

  status: TournamentStatus;
  format: TournamentFormat;

  date: string;
  endDate?: string;
  time?: string;

  venue: string;
  location: string;

  entryFee?: string;
  prize?: string;

  maxPlayers?: number;
  registeredPlayers?: number;

  image?: string;

  featured?: boolean;

  players: TournamentPlayer[];
  leaderboard: LeaderboardEntry[];
  rounds?: TournamentRound[];
};