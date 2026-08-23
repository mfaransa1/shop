# ♟ SHoP — Southside House of Pawns

> **The board is bigger than the game.**

**SHoP (Southside House of Pawns)** is a community-driven chess initiative based in **Kawangware, Nairobi, Kenya**, using chess to bring young people together, develop talent, build confidence, and create positive alternatives to drugs, crime, and idleness.

SHoP works with young people, schools, coaches, volunteers, and community partners to make chess accessible and meaningful beyond the board.

---

## Our Vision

To build a generation of young people who think strategically, make purposeful decisions, and see possibilities beyond their circumstances.

## Our Mission

To use chess as a tool for **youth development, education, community building, discipline, and positive social change**.

## Our Philosophy

> **Kila hatua ina maana.**
> *Every move matters.*

Chess teaches us that every decision has consequences. SHoP takes that lesson beyond the board.

---

# Website

The SHoP website is being designed as a premium digital home for the community.

The website will bring together:

* Chess learning
* Community activities
* School partnerships
* Tournaments
* Events
* Member stories
* Youth development
* Volunteer opportunities
* Partnerships
* Support and donations

The experience should work for several audiences:

* Young players
* Parents
* Schools
* Sponsors
* Volunteers
* Community organizations
* Chess enthusiasts
* Potential partners

---

# Design Direction

The SHoP website takes inspiration from three primary digital experiences:

### Accenture

**Reference for:**

* Editorial storytelling
* Large-scale typography
* Digital experiences
* Content hierarchy
* Motion
* Impact storytelling

### Deloitte

**Reference for:**

* Information architecture
* Professional presentation
* Organizational credibility
* Impact communication
* Stories
* Events
* People and community

### Chess.com

**Reference for:**

* Chess functionality
* Learning experiences
* Player engagement
* Tournaments
* Community features
* Chess-oriented interaction

These websites are **design references, not templates**.

SHoP will develop its own identity based on:

> **Chess × Youth × Community × Kawangware × Social Impact**

---

# Technology

The project currently uses:

* **Next.js 16**
* **Next.js App Router**
* **React**
* **TypeScript**
* **Tailwind CSS 4**
* **Turbopack**
* **Inter**
* **DM Serif Display**

The project uses a component-based architecture designed to allow the website to grow into a full digital platform.

---

# Project Structure

```text
shop/
│
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   │
│   ├── about/
│   ├── learn/
│   ├── community/
│   ├── schools/
│   ├── tournaments/
│   ├── join/
│   └── support/
│
├── src/
│   │
│   ├── components/
│   │   ├── layout/
│   │   ├── home/
│   │   ├── chess/
│   │   ├── tournaments/
│   │   ├── community/
│   │   ├── ui/
│   │   └── animations/
│   │
│   ├── data/
│   ├── lib/
│   └── types/
│
├── public/
│   ├── images/
│   │   ├── brand/
│   │   ├── hero/
│   │   ├── members/
│   │   ├── sessions/
│   │   ├── schools/
│   │   ├── tournaments/
│   │   └── gallery/
│   │
│   ├── icons/
│   └── fonts/
│
├── package.json
├── tsconfig.json
└── README.md
```

---

# Planned Website

## Home

The homepage will introduce SHoP through an editorial storytelling experience.

Planned sections:

1. Hero
2. Impact
3. Mission
4. Chess Journey
5. Sessions
6. School Impact
7. Community Stories
8. Events
9. Support SHoP
10. Final Call to Action

---

## About

The story behind SHoP.

Planned content:

* Our story
* Vision
* Mission
* Philosophy
* Why chess
* Kawangware
* Team
* Partners
* Impact

---

## Learn

A chess learning environment designed for different levels.

Potential areas:

* Beginner
* Intermediate
* Advanced
* Chess puzzles
* Opening principles
* Strategy
* Tactics
* Chess notation

---

## Community

The people behind SHoP.

Potential features:

* Member profiles
* Player stories
* Coaches
* Volunteers
* Gallery
* Community achievements

---

## Schools

A dedicated section for SHoP's school programs.

Potential content:

* School partnerships
* Chess programs
* Training sessions
* Student development
* School tournaments
* Partnership opportunities

---

## Tournaments

A dedicated tournament experience.

Potential features:

* Upcoming tournaments
* Tournament details
* Results
* Leaderboards
* Brackets
* Player information
* Previous tournaments

---

## Join

A simple pathway for young people, parents, volunteers, and community members to get involved.

---

## Support

A section for people and organizations that want to support SHoP.

Potential options:

* Donate
* Sponsor
* Provide chess equipment
* Volunteer
* Partner with SHoP
* Support school programs

---

# Component Architecture

The project is organized around reusable components.

### Layout

```text
Navbar
Footer
MobileMenu
SocialLinks
```

### Homepage

```text
Hero
Impact
Mission
ChessJourney
Sessions
SchoolImpact
CommunityStories
Events
HomeCTA
```

### Chess

```text
ChessBoard
ChessPiece
ChessPuzzle
GameCard
MoveNotation
```

### Tournaments

```text
TournamentCard
Leaderboard
TournamentBracket
```

### Community

```text
MemberCard
StoryCard
Gallery
```

### UI

```text
Button
Modal
Drawer
Badge
SectionHeading
Marquee
Counter
MagneticButton
```

### Animation

```text
FadeIn
Reveal
Stagger
Parallax
PageTransition
```

---

# Design System

The initial SHoP visual system is based on:

### Colors

```text
Ink       #111111
Cream     #F3EDE2
Paper     #FAF9F6
White     #FFFFFF
Muted     #6B6B67
Border    #D9D5CC
```

The final SHoP accent color will be determined after the logo, photography, and visual identity are finalized.

### Typography

**DM Serif Display**

Used for:

* Hero statements
* Editorial headlines
* Major quotes

**Inter**

Used for:

* Navigation
* Body copy
* Buttons
* Interface elements
* Statistics
* Chess information

---

# Development Principles

SHoP should feel:

**Premium**

**Human**

**Bold**

**Youthful**

**Purposeful**

**Community-driven**

The website should not feel like a generic NGO template or a conventional chess-club website.

Every visual and interactive decision should support the story.

### Motion

Animation will be purposeful rather than excessive.

Planned interactions include:

* Text reveals
* Image reveals
* Scroll-based transitions
* Subtle parallax
* Chess-piece movement
* Hover interactions
* Counters
* Page transitions

The goal is:

> **Premium motion, not motion for motion's sake.**

---

# Development Roadmap

### Phase 1 — Foundation

* [x] Next.js project
* [x] App Router
* [x] Tailwind CSS
* [x] Typography setup
* [x] Initial color system
* [x] Project architecture
* [x] Git initialization
* [ ] GitHub repository setup

### Phase 2 — Global Experience

* [x] Global styles
* [x] Navigation foundation
* [ ] Mobile navigation refinement
* [ ] Footer
* [ ] Page transitions
* [ ] Accessibility refinements

### Phase 3 — Homepage

* [ ] Hero
* [ ] Impact section
* [ ] Mission
* [ ] Chess Journey
* [ ] Sessions
* [ ] School Impact
* [ ] Community Stories
* [ ] Events
* [ ] Home CTA

### Phase 4 — Chess Experience

* [ ] Chess board
* [ ] Chess pieces
* [ ] Move notation
* [ ] Chess puzzles
* [ ] Game cards
* [ ] Interactive chess features

### Phase 5 — Main Pages

* [ ] About
* [ ] Learn
* [ ] Community
* [ ] Schools
* [ ] Tournaments
* [ ] Join
* [ ] Support

### Phase 6 — Final Experience

* [ ] Mobile optimization
* [ ] Accessibility
* [ ] Performance optimization
* [ ] SEO
* [ ] Image optimization
* [ ] Animation refinement
* [ ] Social sharing
* [ ] Analytics
* [ ] Production deployment

---

# Development Workflow

SHoP will be developed incrementally.

Each major feature should be:

1. Designed
2. Implemented
3. Tested locally
4. Reviewed visually
5. Optimized for mobile
6. Committed to Git
7. Pushed to GitHub

Major development checkpoints should use descriptive commit messages.

Example:

```bash
git commit -m "feat: build SHoP hero section"
```

---

# Current Status

The project currently has the initial application foundation and design system in place.

### Current milestone

> **Foundation → Global Experience → Homepage Hero**

The next major component to build is the **SHoP Hero**.

The Hero will establish the visual language for the rest of the website.

---

## SHoP

**Southside House of Pawns**

**Kawangware, Nairobi, Kenya**

> **The board is bigger than the game.**

> **Kila hatua ina maana.**
