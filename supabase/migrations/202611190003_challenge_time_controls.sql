-- Persist the selected clock on each invitation so both players start the same game.
alter table public.friend_challenges
  add column if not exists chess_time_control text not null default 'blitz',
  add column if not exists chess_initial_time_ms integer not null default 180000,
  add column if not exists chess_increment_ms integer not null default 0;

alter table public.friend_challenges
  drop constraint if exists friend_challenges_chess_time_control_check;
alter table public.friend_challenges
  add constraint friend_challenges_chess_time_control_check
  check (chess_time_control in ('bullet', 'blitz', 'rapid'));

alter table public.friend_challenges
  drop constraint if exists friend_challenges_chess_clock_check;
alter table public.friend_challenges
  add constraint friend_challenges_chess_clock_check
  check (chess_initial_time_ms between 60000 and 900000 and chess_increment_ms between 0 and 10000);
