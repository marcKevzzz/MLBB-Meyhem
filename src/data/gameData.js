export const ROLES = ["EXP", "Jungler", "Mid", "Gold", "Roamer"];
export const RI = { EXP: "⚔️", Jungler: "🐾", Mid: "🔮", Gold: "🏹", Roamer: "🛡️" };
export const STAGES = ["Qualifier", "Quarter Final", "Semi Final", "Final"];

export const PREDEFINED_COMMENTARIES = [
  "Absolute masterclass from **[Player]**! Their tactical execution completely dismantled **[Opponent]** in the final games of this **[Stage]**.",
  "The crowd is chanting **[Player]**'s name! That legendary performance just sealed a historic **[Score]** victory against **[Opponent]**.",
  "Can we talk about the map pressure from **[Player]**? **[Opponent]** had zero answers for their rotations, locking down the series for Your Dynasty!",
  "Drafting **[Player]** was the best decision this season. Their high-IQ play dragged Your Dynasty across the finish line in this intense **[Stage]** matchup.",
  "Unbelievable reflexes! **[Player]**'s clutch initiation wiped out **[Opponent]**'s backline, securing the series **[Score]**.",
  "That's why **[Player]** is considered a legend. A flawless game in the **[Stage]** leaves the analysts and fans completely speechless.",
  "Your Dynasty clutches it out! **[Player]**'s clinical execution proved to be the ultimate difference-maker against **[Opponent]**.",
  "A tactical genius at work! **[Player]** orchestrated the entire map, turning the match into a nightmare for **[Opponent]**.",
  "The MVP chants are loud and clear! **[Player]** putting on a clinic to carry Your Dynasty to a crucial **[Stage]** win.",
  "Esports history right here! **[Player]**'s aggressive dives broke the defensive lines of **[Opponent]** like it was nothing.",
  "No one does it like **[Player]**. The limits of their mechanics were fully tested, and **[Opponent]** paid the price in a swift series defeat.",
  "A defining moment for **[Player]**. Step aside, challengers—this display confirms who owns the lane in this **[Stage]**.",
  "With **[Player]** steering the ship, Your Dynasty looks unstoppable. Their synergy was a sight to behold as they took down **[Opponent]**.",
  "Cold-blooded and calculating! **[Player]** waited for the perfect window, then decimated **[Opponent]** to close the series.",
  "It's a complete blowout! **[Player]** dominated from level one, leaving **[Opponent]** with absolutely no breathing room.",
  "Your Dynasty takes the series **[Score]**! **[Player]** proved why they are the cornerstone of this roster with a spectacular performance.",
  "The micro-movements from **[Player]** were pure art. **[Opponent]** was chasing shadows all game long in this **[Stage]**.",
  "A signature performance! **[Player]** simply refused to lose, securing the series sweep against a stunned **[Opponent]**.",
  "That is the definition of a hyper-carry! **[Player]**'s gold lead was insurmountable, crushing **[Opponent]**'s defensive lines.",
  "Incredible macro play! **[Player]** shut down **[Opponent]**'s routes, starving out the enemy carry and clinching the win.",
  "What a statement win! **[Player]** shut down all doubts with an aggressive, show-stopping execution in the **[Stage]**.",
  "They said it couldn't be done, but **[Player]**'s heroic defense set up the ultimate counter-attack to defeat **[Opponent]**!",
  "Pure dominance! **[Player]** was on full display as they spearheaded the offensive charge.",
  "A master of positioning. **[Player]** stayed untouched, raining down damage to wrap up the **[Stage]** series in style.",
  "From the first draft pick to the final nexus explosion, **[Player]** was the star. A stunning run closes out the matchup against **[Opponent]**."
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
