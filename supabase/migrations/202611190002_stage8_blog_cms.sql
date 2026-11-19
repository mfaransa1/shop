-- SHoP Blog CMS: public readers can only read published posts; writes use the
-- existing server-side service-role API after SHOP_ADMIN_EMAILS authorisation.
create table if not exists public.shop_blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 180),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  excerpt text not null check (char_length(excerpt) between 1 and 360),
  content text not null,
  category text not null default 'Chess & Community',
  cover_image text not null default '',
  author text not null default 'SHoP Editorial Team',
  status text not null default 'draft' check (status in ('draft','published','archived')),
  published_at timestamptz,
  read_minutes integer not null default 5 check (read_minutes between 1 and 60),
  featured boolean not null default false,
  tags text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists shop_blog_posts_published_idx on public.shop_blog_posts (published_at desc) where status='published';
create index if not exists shop_blog_posts_category_idx on public.shop_blog_posts (category, published_at desc) where status='published';
create or replace function public.shop_blog_posts_set_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;
drop trigger if exists shop_blog_posts_updated_at on public.shop_blog_posts;
create trigger shop_blog_posts_updated_at before update on public.shop_blog_posts for each row execute function public.shop_blog_posts_set_updated_at();
alter table public.shop_blog_posts enable row level security;
drop policy if exists "Published blog posts are public" on public.shop_blog_posts;
create policy "Published blog posts are public" on public.shop_blog_posts for select to anon, authenticated using (status='published');
grant select on public.shop_blog_posts to anon, authenticated;

insert into public.shop_blog_posts
(title,slug,excerpt,content,category,author,status,published_at,read_minutes,featured,tags)
values
('More Than a Game: How Chess Can Shape Young Minds','more-than-a-game-chess-and-young-minds','Chess gives young people a practical space to practise patience, planning and thoughtful decision-making. Its greatest lessons often continue long after the pieces are packed away.',$article1$Chess is often introduced as a contest: two players, one board and a winner at the end. But for a young learner, every game can also become a small laboratory for thinking. A player studies the position, considers possible responses and chooses a move without knowing exactly what will happen next.

## Learning to pause and think
A chess move creates a moment to slow down. Instead of reacting immediately, a player can learn to ask: What is my opponent threatening? What choices do I have? What might happen after each choice? Repeating this process gives young people a practical way to practise reflection before action.

## Planning and taking responsibility
Chess makes consequences visible. A careless move may lose a piece; a thoughtful plan may create an opportunity several turns later. Players learn to review what happened and consider what they might do differently. This is a useful habit in school, work and everyday decisions too.

## Confidence grows through practice
Progress in chess rarely arrives all at once. A learner may first recognise how a knight moves, then spot a simple tactic, then complete a longer game with greater confidence. Each small improvement is evidence that practice matters.

Chess is not a magic solution to every learning challenge, and one game cannot measure a child's potential. It is one engaging activity that can support habits such as concentration, patience and reflection when it is taught in a welcoming environment.

At SHoP, we see the board as an invitation: to think carefully, learn from mistakes and discover that every move is an opportunity to grow.$article1$,'Chess & Learning','SHoP Editorial Team','published','2026-11-19T08:00:00+03:00',5,true,array['youth development','learning','chess benefits']),
('A Place at the Board: Why Inclusive Chess Communities Matter','a-place-at-the-board-inclusive-chess-communities','A chess community is strongest when beginners, experienced players, children and adults all feel welcome to take a seat and learn.',$article2$A chessboard has sixty-four squares, but a healthy chess community makes room for far more than sixty-four possibilities. It welcomes people with different ages, backgrounds, confidence levels and playing strengths.

## Belonging comes before rating
New players can feel intimidated when they sit beside experienced competitors. A friendly introduction, patient explanation and a game played for enjoyment can make the difference between someone leaving and someone returning. A rating describes competitive performance; it does not describe a person's value or potential.

## Learning across generations
Chess creates natural opportunities for people to meet across age groups. A young player may teach a friend a new tactic, while an older player shares a lesson learned from years of competition. Everyone has something to contribute, and everyone can remain a learner.

## Make the room welcoming
Inclusive clubs explain rules without embarrassment, discourage ridicule, celebrate effort and make fair play non-negotiable. They also consider practical barriers such as equipment, transport, safe meeting spaces and accessible session times.

A community is not built by a board alone. It is built through consistent welcome, shared responsibility and the small moments when one player encourages another. That is the kind of chess culture we want to keep building at Southside House of Pawns.$article2$,'Community','SHoP Editorial Team','published','2026-11-18T08:00:00+03:00',4,false,array['inclusion','community','belonging']),
('Learning to Lose Well: The Quiet Value of Sportsmanship','learning-to-lose-well-sportsmanship-in-chess','A loss can be disappointing, but it can also become a useful lesson in resilience, respect and honest self-review.',$article3$Every chess player loses. Sometimes a game turns on one missed tactic; sometimes the opponent simply plays better. The result can sting, especially when a player has worked hard or hoped to win. How a player responds is part of learning the game.

## Respect the person across the board
A handshake, a calm conversation and a sincere acknowledgement of good play help keep competition healthy. The opponent is not an enemy. They are another person who has agreed to share a challenge with you.

## Review without blame
After a loss, it helps to identify one or two moments that changed the game. Was a piece left undefended? Was there a chance to trade into a better ending? Did time pressure affect the decision? Specific questions are more useful than calling yourself a bad player.

## Resilience is a practice
Resilience does not mean pretending that disappointment does not exist. It means allowing yourself to feel it, learning what you can and choosing to try again. Coaches and parents can help by praising effort, curiosity and respectful behaviour rather than focusing only on results.

At SHoP, winning matters less than how we play, how we treat one another and what we learn along the way. A good game ends with respect, whatever the result.$article3$,'Life Skills','SHoP Editorial Team','published','2026-11-17T08:00:00+03:00',4,false,array['sportsmanship','resilience','fair play']),
('From First Move to First Tournament: Helping Beginners Find Their Feet','from-first-move-to-first-tournament','A first tournament should feel like a milestone to enjoy, not a test a beginner must pass. A little preparation can make the experience less intimidating.',$article4$The first tournament can be exciting and a little nerve-racking. The room may be unfamiliar, the clocks may be new and the games may feel more serious than a friendly practice session. Preparation helps a beginner focus on the experience rather than worry about every detail.

## Build a simple foundation
Before entering an event, a player should understand how every piece moves, how check and checkmate work, how to castle and what happens in a draw. Practising complete games is more valuable than memorising dozens of opening moves without understanding them.

## Learn the tournament routine
Ask the organiser about the schedule, time control, pairing process and rules for recording moves. Arrive early, bring any requested equipment and listen carefully to announcements. If something is unclear, ask an arbiter or event official politely.

## Set goals beyond winning
A beginner can aim to use the clock sensibly, check for threats before moving, record the game correctly or show good sportsmanship. These goals remain meaningful regardless of the final score.

After the event, review one game and identify one lesson to practise. A first tournament is not a verdict on a player's future. It is simply another step in a longer chess journey.$article4$,'Chess Skills','SHoP Editorial Team','published','2026-11-16T08:00:00+03:00',4,false,array['beginners','tournaments','chess journey']),
('The Thinking Behind the Move: Building Better Decision Habits','the-thinking-behind-the-move-decision-habits','A simple thinking routine can help players avoid rushed moves and make their plans more purposeful.',$article5$Strong chess decisions are not always complicated. Often they begin with a reliable routine. Before moving, a player can look at the whole position, notice what has changed and consider the opponent's most active ideas.

## A three-question check
First, ask what the opponent is threatening. This helps prevent simple oversights. Second, look for forcing moves such as checks, captures and direct threats. Third, compare candidate moves and imagine the likely reply. Even a brief pause can reveal a tactical problem before it happens.

## Plans need flexibility
A plan gives direction, but chess positions change after every move. A player who decides to attack one side of the board must still notice a threat on the other. Good planning includes the willingness to revise an idea when new information appears.

## Learn from the process
After a game, consider whether the decision was reasonable based on what you knew at the time. A move can be sensible and still turn out badly; another can succeed because the opponent makes a mistake. Reviewing the thinking process builds understanding more reliably than judging every move only by the result.

The habit is simple: observe, calculate, choose and review. With practice, it becomes a useful framework for chess and a reminder to approach important decisions with care.$article5$,'Chess Skills','SHoP Editorial Team','published','2026-11-15T08:00:00+03:00',4,false,array['strategy','decision-making','practice']),
('Why Schools Should Make Room for Chess','why-schools-should-make-room-for-chess','A school chess programme can offer structured play, peer connection and a fresh way for learners to practise patience and problem-solving.',$article6$Schools look for activities that help learners discover interests, build relationships and practise skills beyond the standard classroom routine. Chess can be one useful addition when it is organised around participation, enjoyment and steady learning.

## A flexible activity
Chess can be taught in short sessions and adapted for different experience levels. Beginners can learn the pieces and play mini-games, while more experienced learners work on tactics, notation and longer games. A school does not need every learner to be competitive for the programme to be worthwhile.

## More than competition
A club can encourage turn-taking, respectful disagreement, concentration and learning from mistakes. Team activities and peer coaching give learners opportunities to explain ideas and support one another.

## Start with a realistic plan
Schools can begin with a small set of boards, a consistent meeting time and a teacher or volunteer coordinator. Clear safeguarding expectations, attendance procedures and age-appropriate supervision should be part of the programme from the start. Progress can be reviewed through participation, learner feedback and the quality of the club experience, not only trophies.

Chess is not a replacement for teaching or a guaranteed shortcut to higher grades. It is an accessible enrichment activity that can create another place for curiosity and connection to grow. SHoP welcomes conversations with schools interested in exploring a practical partnership.$article6$,'Schools & Partnerships','SHoP Editorial Team','published','2026-11-14T08:00:00+03:00',5,false,array['schools','education','partnerships']),
('The Role of Coaches: Encouragement, Structure and Good Questions','the-role-of-chess-coaches','A good chess coach does more than demonstrate strong moves. They create a supportive environment where players learn how to think for themselves.',$article7$Coaching is often associated with explaining openings, tactics and endgames. Those skills matter, but a coach also shapes the environment in which a player learns. The best sessions combine clear instruction with curiosity, patience and room for questions.

## Guide rather than dictate
Instead of immediately giving the answer, a coach can ask a learner what they notice in a position. What pieces are undefended? Which king is less safe? What candidate moves deserve attention? Questions help players develop their own evaluation skills.

## Match the lesson to the learner
A beginner may need to practise checkmate patterns, while an experienced player may benefit from analysing a difficult endgame. A useful coach observes progress and adjusts the challenge so that players are stretched without being overwhelmed.

## Make feedback specific and kind
Feedback should identify an action the player can work on. “You missed the loose piece on move twelve” is more useful than “You always blunder.” Praise effort and good thinking, and treat mistakes as information rather than personal failure.

A strong coaching culture also values safeguarding, punctuality, fair play and respect. Coaches help create the conditions in which players can enjoy the game, improve at their own pace and support the growth of others.$article7$,'Coaching & Development','SHoP Editorial Team','published','2026-11-13T08:00:00+03:00',4,false,array['coaching','mentorship','development']),
('Building a Chess Habit: Small Practice Sessions That Add Up','building-a-chess-habit-small-practice-sessions','Consistent, focused practice can be more useful than occasional marathon sessions. Here is a simple way to make chess learning part of a realistic routine.',$article8$It is tempting to believe that improvement requires hours of study every day. For many learners, a smaller routine that can be repeated is easier to sustain. The aim is to practise with attention, not simply to spend time moving pieces.

## A manageable weekly rhythm
Try a short session focused on one theme: piece safety, checkmate patterns, opening principles or basic endgames. Add a few puzzles, play a game at a comfortable pace and review one moment that felt difficult. A notebook can help record recurring mistakes and ideas worth revisiting.

## Balance study and play
Puzzles train pattern recognition, lessons introduce concepts and games show how ideas interact in real positions. A balanced routine includes all three. It also leaves room for rest, school, work and other interests.

## Measure progress thoughtfully
Look for signs such as fewer unforced piece losses, better use of time, clearer plans and more confidence explaining a position. Ratings can be useful in the right setting, but they are only one measure and can fluctuate.

The best routine is one a player can maintain. Start small, keep it enjoyable and adjust it as skills develop. Every thoughtful practice session is another step forward.$article8$,'Practice & Growth','SHoP Editorial Team','published','2026-11-12T08:00:00+03:00',4,false,array['practice','beginners','improvement'])
on conflict (slug) do nothing;
