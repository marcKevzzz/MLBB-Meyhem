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
