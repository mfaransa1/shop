import type {
  LeaderboardEntry,
  Tournament,
  TournamentPlayer,
  TournamentRound,
} from "@/types/tournament";

const players: TournamentPlayer[] = [
  {
    id: "player-01",
    name: "Brian Ochieng",
    rating: 1580,
    club: "SHoP",
  },
  {
    id: "player-02",
    name: "Kevin Mwangi",
    rating: 1510,
    club: "SHoP",
  },
  {
    id: "player-03",
    name: "Ian Otieno",
    rating: 1460,
    club: "SHoP",
  },
  {
    id: "player-04",
    name: "David Kamau",
    rating: 1430,
    club: "SHoP",
  },
  {
    id: "player-05",
    name: "Mark Kiptoo",
    rating: 1390,
    club: "SHoP",
  },
  {
    id: "player-06",
    name: "Sammy Njoroge",
    rating: 1340,
    club: "SHoP",
  },
  {
    id: "player-07",
    name: "Dennis Maina",
    rating: 1290,
    club: "SHoP",
  },
  {
    id: "player-08",
    name: "Collins Wambua",
    rating: 1250,
    club: "SHoP",
  },
];

const leaderboard: LeaderboardEntry[] = [
  {
    rank: 1,
    playerId: "player-01",
    playerName: "Brian Ochieng",
    rating: 1580,
    played: 5,
    wins: 4,
    draws: 1,
    losses: 0,
    points: 4.5,
  },
  {
    rank: 2,
    playerId: "player-02",
    playerName: "Kevin Mwangi",
    rating: 1510,
    played: 5,
    wins: 4,
    draws: 0,
    losses: 1,
    points: 4,
  },
  {
    rank: 3,
    playerId: "player-03",
    playerName: "Ian Otieno",
    rating: 1460,
    played: 5,
    wins: 3,
    draws: 1,
    losses: 1,
    points: 3.5,
  },
  {
    rank: 4,
    playerId: "player-04",
    playerName: "David Kamau",
    rating: 1430,
    played: 5,
    wins: 3,
    draws: 0,
    losses: 2,
    points: 3,
  },
  {
    rank: 5,
    playerId: "player-05",
    playerName: "Mark Kiptoo",
    rating: 1390,
    played: 5,
    wins: 2,
    draws: 1,
    losses: 2,
    points: 2.5,
  },
  {
    rank: 6,
    playerId: "player-06",
    playerName: "Sammy Njoroge",
    rating: 1340,
    played: 5,
    wins: 2,
    draws: 0,
    losses: 3,
    points: 2,
  },
  {
    rank: 7,
    playerId: "player-07",
    playerName: "Dennis Maina",
    rating: 1290,
    played: 5,
    wins: 1,
    draws: 1,
    losses: 3,
    points: 1.5,
  },
  {
    rank: 8,
    playerId: "player-08",
    playerName: "Collins Wambua",
    rating: 1250,
    played: 5,
    wins: 0,
    draws: 0,
    losses: 5,
    points: 0,
  },
];

const rounds: TournamentRound[] = [
  {
    id: "round-1",
    name: "Quarterfinals",
    matches: [
      {
        id: "match-1",
        round: 1,
        position: 1,
        player1: players[0],
        player2: players[7],
        player1Score: 1,
        player2Score: 0,
        winnerId: players[0].id,
        status: "completed",
      },
      {
        id: "match-2",
        round: 1,
        position: 2,
        player1: players[1],
        player2: players[6],
        player1Score: 1,
        player2Score: 0,
        winnerId: players[1].id,
        status: "completed",
      },
      {
        id: "match-3",
        round: 1,
        position: 3,
        player1: players[2],
        player2: players[5],
        player1Score: 1,
        player2Score: 0,
        winnerId: players[2].id,
        status: "completed",
      },
      {
        id: "match-4",
        round: 1,
        position: 4,
        player1: players[3],
        player2: players[4],
        player1Score: 0,
        player2Score: 1,
        winnerId: players[4].id,
        status: "completed",
      },
    ],
  },
  {
    id: "round-2",
    name: "Semifinals",
    matches: [
      {
        id: "match-5",
        round: 2,
        position: 1,
        player1: players[0],
        player2: players[1],
        status: "upcoming",
      },
      {
        id: "match-6",
        round: 2,
        position: 2,
        player1: players[2],
        player2: players[4],
        status: "upcoming",
      },
    ],
  },
  {
    id: "round-3",
    name: "Final",
    matches: [
      {
        id: "match-7",
        round: 3,
        position: 1,
        status: "upcoming",
      },
    ],
  },
];

export const tournaments: Tournament[] = [
  {
    id: "shop-youth-championship",
    name: "SHoP Youth Championship",
    slug: "shop-youth-championship",
    description:
      "A friendly competitive chess tournament giving young players the opportunity to test their skills, meet other players and experience tournament chess.",
    status: "registration-open",
    format: "Swiss",
    date: "2026-09-19",
    time: "09:00",
    venue: "SHoP Chess Space",
    location: "Kawangware, Nairobi",
    entryFee: "Free",
    prize: "Trophies & chess prizes",
    maxPlayers: 32,
    registeredPlayers: 18,
    featured: true,
    players,
    leaderboard,
  },

  {
    id: "shop-community-open",
    name: "SHoP Community Open",
    slug: "shop-community-open",
    description:
      "An open tournament bringing together SHoP players, families, coaches and chess friends from across the community.",
    status: "upcoming",
    format: "Swiss",
    date: "2026-10-17",
    time: "10:00",
    venue: "SHoP Chess Space",
    location: "Kawangware, Nairobi",
    entryFee: "Free",
    prize: "Chess equipment",
    maxPlayers: 40,
    registeredPlayers: 9,
    featured: false,
    players: [],
    leaderboard: [],
  },

  {
    id: "shop-championship-final",
    name: "SHoP Championship",
    slug: "shop-championship",
    description:
      "The championship event bringing the strongest SHoP players together for a final competitive test.",
    status: "ongoing",
    format: "Knockout",
    date: "2026-08-29",
    time: "09:00",
    venue: "SHoP Chess Space",
    location: "Kawangware, Nairobi",
    entryFee: "Free",
    prize: "SHoP Championship Trophy",
    maxPlayers: 8,
    registeredPlayers: 8,
    featured: false,
    players,
    leaderboard,
    rounds,
  },
];

export const upcomingTournaments = tournaments.filter(
  (tournament) =>
    tournament.status === "upcoming" ||
    tournament.status === "registration-open"
);

export const activeTournaments = tournaments.filter(
  (tournament) =>
    tournament.status === "ongoing"
);

export const completedTournaments = tournaments.filter(
  (tournament) =>
    tournament.status === "completed"
);

export function getTournamentBySlug(slug: string) {
  return tournaments.find(
    (tournament) => tournament.slug === slug
  );
}