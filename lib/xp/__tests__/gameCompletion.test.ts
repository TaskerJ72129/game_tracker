import { describe, it, expect } from "vitest";
import { handleGameCompletion } from "../gameCompletion";

describe("Game completion XP", () => {
  it("awards base completion XP", () => {
    const result = handleGameCompletion({
      currentOverallXP: 0,
      currentGenreXP: {},
      gameGenres: ["RPG"],
    });

    expect(result.xpAwarded).toBeGreaterThan(0);
    expect(result.newOverallXP).toBe(result.xpAwarded);
  });

  it("splits XP across multiple genres", () => {
    const result = handleGameCompletion({
      currentOverallXP: 0,
      currentGenreXP: {},
      gameGenres: ["RPG", "Action"],
    });

    expect(result.newGenreXP.RPG).toBeDefined();
    expect(result.newGenreXP.Action).toBeDefined();
    expect(result.newGenreXP.RPG).toBe(result.newGenreXP.Action);
  });

  it("applies first-time genre bonus", () => {
    const result = handleGameCompletion({
      currentOverallXP: 0,
      currentGenreXP: { RPG: 100 },
      gameGenres: ["RPG", "Action"],
    });

    expect(result.newGenreXP.Action).toBeGreaterThan(0);
  });
});
