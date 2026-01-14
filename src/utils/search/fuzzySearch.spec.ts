import { describe, expect, it } from "vitest";

import { fuzzyMatchNGramThreshold } from "./fuzzySearch";

describe("fuzzyMatchNGramThreshold", () => {
  it("returns true for empty query (show all)", () => {
    expect(fuzzyMatchNGramThreshold("", "")).toBe(true);
    expect(fuzzyMatchNGramThreshold("", "anything")).toBe(true);
  });

  it("is case-insensitive", () => {
    expect(fuzzyMatchNGramThreshold("AbC", "xxaBcxx")).toBe(true);
  });

  it("always enforces strict subsequence (even when n-gram containment is permissive)", () => {
    // For query length <= 2, containment threshold is 0.0, but subsequence must still match.
    expect(fuzzyMatchNGramThreshold("ab", "ba")).toBe(false);
  });

  it("requires some n-gram containment for length 3 queries (even if subsequence would match)", () => {
    // Query bigrams: ab, bc. Target: a1b2c (subsequence matches), but no adjacent bigrams match.
    expect(fuzzyMatchNGramThreshold("abc", "a1b2c")).toBe(false);
  });

  it("passes for length 3 when at least one bigram matches and subsequence matches", () => {
    // Query bigrams: ab, bc. Target bigrams include 'ab' (1/2=0.5 >= 0.4).
    expect(fuzzyMatchNGramThreshold("abc", "abXc")).toBe(true);
  });

  it("requires at least 2 of 3 bigrams for length 4 queries (containment gate)", () => {
    // Query bigrams: ab, bc, cd. Target only has 'ab' as an adjacent bigram, but subsequence matches.
    expect(fuzzyMatchNGramThreshold("abcd", "abXcXd")).toBe(false);
  });

  it("passes length 4 when enough bigrams match and subsequence matches", () => {
    // Query bigrams: ab, bc, cd. Target has 'ab' and 'cd' (2/3=0.66 >= 0.5).
    expect(fuzzyMatchNGramThreshold("abcd", "abXcd")).toBe(true);
  });

  it("fails for longer queries when characters match as subsequence but adjacency differs too much", () => {
    // Query is a subsequence, but none of its bigrams occur contiguously in the target.
    expect(fuzzyMatchNGramThreshold("abcdef", "a1b2c3d4e5f")).toBe(false);
  });

  it("passes when query appears contiguously (strong n-gram containment + subsequence)", () => {
    expect(fuzzyMatchNGramThreshold("abcdef", "xxabCDefyy")).toBe(true);
  });
});
