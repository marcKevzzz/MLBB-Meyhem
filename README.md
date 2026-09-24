<div align="center">

# ⚔️ MLBB Mayhem
### Fantasy Esports Tournament & Cross-Era Simulation Engine

[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![CSS3](https://img.shields.io/badge/Vanilla_CSS-Modern_Cyberpunk-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![License](https://img.shields.io/badge/License-MIT-FFB800?style=for-the-badge)](LICENSE)

*Draft your dream Mobile Legends: Bang Bang roster across all eras (2018–2026), unlock tactical coach perks, leverage authentic hero counters, and lead your squad to the world championship.*

[Features](#-core-features) • [Game Modes](#-game-modes) • [Cross-Era Mechanics](#-cross-era-rating--simulation-engine) • [Tech Stack](#-tech-stack) • [Quick Start](#-quick-start)

---

</div>

## 🌟 Overview

**MLBB Mayhem** is a high-octane fantasy esports simulator built for the competitive Mobile Legends: Bang Bang community. Step into the shoes of a championship head coach: draft iconic players from legendary dynasties or modern prodigies, balance macro chemistry against raw star power, and out-draft rivals with meta-accurate hero counter-picks.

---

## ⚡ Core Features

### 🎯 Authentic Draft Counter Engine
- **Strategic Matchups**: Direct MLBB counters built into the simulation odds (e.g., Diggie cleanses AOE crowd control, Khufra/Phoveus ground slippery assassins, Baxia neutralizes sustain healers, Lolita absorbs projectile barrages).
- **Draft Edge Indicator**: Real-time pre-match HUD displays draft advantages (`+2%` to `+6%`) with readable tactical breakdowns.

### 🛡️ Chemistry & Franchise Synergy
- **Franchise Dynasties**: Drafting 3, 4, or 5 players from the same historic organization unlocks cohesive rotation and macro bonuses (up to **+16% win odds**).
- **Anti-Galácticos Balance**: Drafting 5 disconnected solo-queue stars incurs communication penalties (`-6%`), making synergy and team cohesion crucial.
- **Regional Traits & Iconic Duos**: Activate bonuses for MPL PH Macro, MPL ID Aggression, or historic pairs like *V33Wise*, *Royal Besties (Kairi + Kiboy)*, and *Kings of Kings (Lemon + Tuturu)*.

### 🧠 Tactical Coach Perks (4 Rarity Tiers)
- Between tournament rounds, draft randomized strategic upgrades across **Legendary (🌟)**, **Epic (💜)**, **Rare (🩵)**, and **Common (🤍)** tiers (e.g., *M-World Championship Aura*, *Tactical Time Rewind*, *Target Ban Mastermind*, *Immortal Armor*, *Divine Retribution*).

### ⚔️ Esports Broadcast Simulation
- **Live Scoreboard**: Symmetric, equalized broadcast scoreboard with animated dual-sword clash and live kill counters.
- **Dynamic KDA Progression**: Watch kills and deaths dynamically unfold across early, mid, and late-game stages.
- **Match MVP Spotlight**: Evaluates impactful performers based on kill participation, assists, and death avoidance.

---

## 🎮 Game Modes

| Mode | Description | Special Modifiers |
| :--- | :--- | :--- |
| **🏆 Tournament Playoff** | Standard competitive bracket through Qualifiers, Quarter-Finals, Semi-Finals, and BO5 Grand Finals. | Pure skill & synergy balance |
| **⚡ Underdog Ascent** | Draft high-potential underdogs and unheralded talent against world-class powerhouse teams. | Active **+8% Underdog Spirit** upset bonus |
| **🛡️ M-Series Gauntlet** | Relive iconic M-Series world championship finals by taking on legendary boss squads one by one. | Fixed boss roster progression |

---

## 📊 Cross-Era Rating & Simulation Engine

The simulation runs on an objective, calibrated **60–99 Power Rating Scale**:

1. **Objective Era Dominance**: Player ratings reflect actual peak tournament placements (M-World Championships, MSC, MPL titles) and series dominance in their active year.
2. **Dynamic Bracket Scaling**: Opponent difficulty scales relative to your team's baseline OVR, ensuring historical teams (e.g., EVOS 2019, Bren 2020) have a competitive path while super-teams face elite opposition.
3. **Normalized Power Creep**: Evaluates a player's dominance relative to their era's peers rather than raw modern stat inflation.
4. **Weighted Role Impact**: Individual lane contributions prioritize key playmakers (Jungler **35%**, Gold **30%**, Mid **18%**, EXP **12%**, Roamer **5%**).

---

## 📱 Responsive & Ergonomic UI

- **Cyber-Esports Aesthetic**: Dark futuristic palette (`#050711`), neon cyan glow, championship gold accents, and subtle stadium lighting.
- **Side-by-Side Preservation**: Roster matchups remain side-by-side on both mobile and desktop without awkward vertical stacking.
- **Zero Placeholder Assets**: Comprehensive portrait mappings for all modern (Suyou, Nolan, Cici, Arlott, Zhuxin, Chip) and classic meta heroes.

---

## 🛠️ Tech Stack

- **Framework**: [React 18](https://react.dev/)
- **Bundler & Tooling**: [Vite 6](https://vitejs.dev/)
- **Styling**: Vanilla Modern CSS (CSS Grid, Flexbox, Custom Properties, Glassmorphism)
- **Typography**: Google Fonts (*Rajdhani* for esports headers, *Inter* for crisp body text)
- **Data Architecture**: Static JSON dataset covering over 200+ historical pro rosters and 100+ hero portrait mappings

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or newer recommended)
- `npm` or `pnpm`

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/marcKevzzz/MLBB-Meyhem.git

# 2. Navigate to project root
cd MLBB-Meyhem

# 3. Install dependencies
npm install

# 4. Start local development server
npm run dev
```

Open your browser and navigate to `http://localhost:5173/` to play!

### Production Build

```bash
npm run build
npm run preview
```

---

<div align="center">

Made with ⚔️ for MLBB esports fans worldwide.

</div>
