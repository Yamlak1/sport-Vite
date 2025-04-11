import { PlayerPosition } from "@/types/football";

// Example: a more balanced, symmetrical 4-3-3 layout
export const homePositions: PlayerPosition[] = [
  { position: "GK", top: "50%", left: "5%" }, // Goalkeeper
  { position: "RB", top: "90%", left: "20%" }, // Right Back
  { position: "CB", top: "72%", left: "15%" }, // Center Back
  { position: "CB", top: "32%", left: "15%" }, // Center Back
  { position: "LB", top: "10%", left: "20%" }, // Left Back
  { position: "RM", top: "90%", left: "35%" }, // Right Midfield
  { position: "CM", top: "50%", left: "30%" }, // Center Midfield
  { position: "LM", top: "10%", left: "35%" }, // Left Midfield
  { position: "RF", top: "80%", left: "45%" }, // Right Forward
  { position: "CF", top: "50%", left: "45%" }, // Center Forward
  { position: "LF", top: "20%", left: "45%" }, // Left Forward
];

export const awayPositions: PlayerPosition[] = [
  { position: "GK", top: "50%", left: "95%" }, // Goalkeeper
  { position: "RB", top: "10%", left: "80%" }, // Right Back
  { position: "CB", top: "32%", left: "85%" }, // Center Back
  { position: "CB", top: "72%", left: "85%" }, // Center Back
  { position: "LB", top: "90%", left: "80%" }, // Left Back
  { position: "RM", top: "10%", left: "65%" }, // Right Midfield
  { position: "CM", top: "50%", left: "70%" }, // Center Midfield
  { position: "LM", top: "90%", left: "65%" }, // Left Midfield
  { position: "RF", top: "80%", left: "55%" }, // Right Forward
  { position: "CF", top: "50%", left: "55%" }, // Center Forward
  { position: "LF", top: "20%", left: "55%" }, // Left Forward
];

/**
 * Only return the last name of each player in the lineup.
 */
export function mapLineup(lineup: string[], positions: PlayerPosition[]) {
  return lineup.map((fullName, index) => {
    const nameParts = fullName.trim().split(" ");
    const lastName = nameParts[nameParts.length - 1];
    return {
      name: lastName,
      position: positions[index].position,
      top: positions[index].top,
      left: positions[index].left,
    };
  });
}
