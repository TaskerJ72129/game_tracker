import { describe, it, expect } from "vitest";
import { calculateLevel, xpToNextLevel } from "../xpUtils";
import { OVERALL_XP } from "../xpConfig";

describe("XP level calculations", () => {
  it("returns level 1 for 0 XP", () => {
    const result = calculateLevel(0, OVERALL_XP);
    expect(result.level).toBe(1);
    expect(result.currentXP).toBe(0);
  });

  it("levels up correctly when crossing threshold", () => {
    const result = calculateLevel(100, OVERALL_XP);
    expect(result.level).toBe(2);
    expect(result.currentXP).toBe(0);
  });

  it("calculates XP to next level correctly", () => {
    const xp = xpToNextLevel(3, OVERALL_XP);
    expect(xp).toBe(200);
  });
});
