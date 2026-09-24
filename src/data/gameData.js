export const ROLES = ["EXP", "Jungler", "Mid", "Gold", "Roamer"];

// MLBB Official Role Icons (SVG inline)
export const ROLE_SVG = {
  EXP: `<img src="/assets/roles/exp.png" alt="EXP" class="role-icon" width="18" height="18">`,
  Gold: `<img src="/assets/roles/gold.png" alt="Gold" class="role-icon" width="18" height="18">`,
  Jungler: `<img src="/assets/roles/jungle.png" alt="Jungler" class="role-icon" width="18" height="18">`,
  Mid: `<img src="/assets/roles/mid.png" alt="Mid" class="role-icon" width="18" height="18">`,
  Roamer: `<img src="/assets/roles/roamer.png" alt="Roamer" class="role-icon" width="18" height="18">`,
};

// Text label fallback
export const RI = { EXP: "EXP", Jungler: "JG", Mid: "MID", Gold: "GOLD", Roamer: "ROAM" };
export const STAGES = ["Qualifier", "Quarter Final", "Semi Final", "Final"];

// M-Series World Championship Boss Rush stages (7 Rounds: M1 → M7)
export const M_SERIES_STAGES = [
  "M1: EVOS Legends",
  "M2: Bren Esports",
  "M3: Blacklist Int.",
  "M4: ECHO",
  "M5: AP Bren",
  "M6: Fnatic ONIC PH",
  "M7: Aurora Gaming"
];

export const M_SERIES_CHAMPIONS = [
  {
    roundIdx: 0,
    edition: "M1",
    stage: "M1 World Championship",
    shortStage: "M1: EVOS Legends",
    teamKey: "EVOS Legends 2019",
    name: "EVOS Legends",
    year: 2019,
    country: "Indonesia",
    title: "M1 World Champions (2019)",
    desc: "The trailblazing Indonesian powerhouse led by Oura & Wann. Accessible gauntlet entry.",
    targetDiff: -4 // Accessible start: userAvg - 4 OVR
  },
  {
    roundIdx: 1,
    edition: "M2",
    stage: "M2 World Championship",
    shortStage: "M2: Bren Esports",
    teamKey: "Bren Esports 2021",
    name: "Bren Esports",
    year: 2021,
    country: "Philippines",
    title: "M2 World Champions (2021)",
    desc: "Calculated hyper-aggression orchestrated by KarlTzy. Moderate tactical challenge.",
    targetDiff: -2 // userAvg - 2 OVR
  },
  {
    roundIdx: 2,
    edition: "M3",
    stage: "M3 World Championship",
    shortStage: "M3: Blacklist Int.",
    teamKey: "Blacklist International 2021",
    name: "Blacklist International",
    year: 2021,
    country: "Philippines",
    title: "M3 World Champions (2021)",
    desc: "The legendary UBE System (Ultimate Bonding Experience) perfected by OhMyV33NUS & Wise.",
    targetDiff: 0 // userAvg + 0 OVR
  },
  {
    roundIdx: 3,
    edition: "M4",
    stage: "M4 World Championship",
    shortStage: "M4: ECHO",
    teamKey: "ECHO 2023",
    name: "ECHO",
    year: 2023,
    country: "Philippines",
    title: "M4 World Champions (2023)",
    desc: "The Orcas' explosive mechanical peak featuring Sanford, KarlTzy & Bennyqt.",
    targetDiff: +1 // userAvg + 1 OVR
  },
  {
    roundIdx: 4,
    edition: "M5",
    stage: "M5 World Championship",
    shortStage: "M5: AP Bren",
    teamKey: "AP Bren 2023",
    name: "AP Bren",
    year: 2023,
    country: "Philippines",
    title: "M5 World Champions (2023)",
    desc: "The two-time world champion titans under Ducky, FlapTzy & KyleTzy.",
    targetDiff: +2 // userAvg + 2 OVR
  },
  {
    roundIdx: 5,
    edition: "M6",
    stage: "M6 World Championship",
    shortStage: "M6: Fnatic ONIC PH",
    teamKey: "Fnatic ONIC PH 2024",
    name: "Fnatic ONIC PH",
    year: 2024,
    country: "Philippines",
    title: "M6 World Champions (2024)",
    desc: "The undefeated world champions led by Finals MVP Kelra, K1NGKONG & Brusko.",
    targetDiff: +3 // userAvg + 3 OVR
  },
  {
    roundIdx: 6,
    edition: "M7",
    stage: "M7 World Championship",
    shortStage: "M7: Aurora Gaming",
    teamKey: "Aurora Gaming PH 2026",
    name: "Aurora Gaming PH",
    year: 2026,
    country: "Philippines",
    title: "M7 World Champions (2026)",
    desc: "The supreme modern dynasty led by Demonkite, Edward & Light. Pinnacle final boss!",
    targetDiff: +3.5 // userAvg + 3.5 OVR (Formidable final boss, but slight possible to win with right players & synergy!)
  }
];

export function getStagesForMode(gameMode = 'standard') {
  if (gameMode === 'gauntlet') {
    return M_SERIES_STAGES;
  }
  return STAGES;
}

export const PREDEFINED_COMMENTARIES = [
  "**[Player]** carried the team in this **[Stage]**!",
  "**[Player]** dominated the map and secured the win.",
  "A huge performance from **[Player]**. Series ends **[Score]**.",
  "**[Player]** found every opening and punished the enemy.",
  "Your Roster takes the **[Stage]** thanks to **[Player]**.",
  "**[Player]** was unstoppable from start to finish.",
  "The enemy had no answer for **[Player]** today.",
  "**[Player]** stepped up when it mattered most.",
  "A clutch play from **[Player]** seals the series.",
  "**[Player]** outclassed the opposition in every fight.",
  "What a game from **[Player]**!",
  "**[Player]** secured MVP with a brilliant performance.",
  "Your Roster wins **[Score]** after a strong showing.",
  "**[Player]** controlled every objective on the map.",
  "An impressive display of skill from **[Player]**.",
  "**[Player]** turned the game around with a huge play.",
  "The crowd erupts as **[Player]** closes out the match.",
  "**[Player]** led the team to victory in the **[Stage]**.",
  "A clean and convincing win for Your Roster.",
  "**[Player]** was the difference-maker this game.",
  "**[Player]** secured the final teamfight.",
  "Early lead, clean finish. **[Player]** delivers.",
  "**[Player]** found a game-winning pick.",
  "A dominant performance in the **[Stage]**.",
  "**[Player]** snowballed the match beyond recovery.",
  "Your Roster completes the comeback!",
  "**[Player]** shut down the enemy carry.",
  "A perfect rotation from **[Player]** secures victory.",
  "**[Player]** wins every duel they take.",
  "Another MVP-worthy game from **[Player]**.",
  "**[Player]** takes control and never looks back.",
  "The series belongs to Your Roster!",
  "**[Player]** delivered when the pressure was highest.",
  "A quick victory powered by **[Player]**.",
  "**[Player]** made every play count.",
  "The enemy defense collapses under **[Player]**.",
  "**[Player]** takes over the late game.",
  "A flawless performance from **[Player]**.",
  "Your Roster advances after a strong showing.",
  "**[Player]** ends the match in style.",
  "**[Player]**'s jungle control secured every objective.",
"**[Player]** won the mid lane and took over the map.",
"**[Player]** farmed safely before carrying the late game.",
"**[Player]** created space for the entire team.",
"**[Player]** landed a game-changing initiation.",
"**[Player]** stole the Lord and turned the game around.",
"**[Player]** defended the base and kept hope alive.",
"**[Player]** found the perfect flank to win the fight.",
"**[Player]**'s rotations kept the enemy guessing.",
"**[Player]** led the team with smart shotcalling."
];

export function generatePredefinedCommentary(won, star, opp, stage, score) {
  const templates = PREDEFINED_COMMENTARIES;
  const randomIndex = Math.floor(Math.random() * templates.length);
  const template = templates[randomIndex];
  return template
    .replaceAll("[Player]", star.ign)
    .replaceAll("[Opponent]", opp.name || opp)
    .replaceAll("[Stage]", stage)
    .replaceAll("[Score]", score);
}
