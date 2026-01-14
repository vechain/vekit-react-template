// Bigrams for short identifiers without spaces
const N_GRAM_SIZE = 2;

// Adaptive containment: lenient while typing, stricter as query grows.
// This avoids the "no results until the final character" issue.
const getMinContainmentRatio = (query: string): number => {
  const queryLength = query.length;
  // very permissive at the beginning to avoid "empty result" gaps
  // gradually tightens so longer queries stay precise
  // no sudden jumps that would cause results to flicker while typing
  switch (true) {
    case queryLength <= 2:
      // One bigram at most, allow it to be missing
      return 0.0;
    case queryLength === 3:
      // Two bigrams, allow one to match
      return 0.4;
    case queryLength === 4:
      // Three bigrams, allow one miss
      return 0.5;
    case queryLength === 5:
      return 0.6;
    case queryLength === 6:
      return 0.65;
    case queryLength === 7:
      return 0.7;
    case queryLength === 8:
      return 0.74;
    case queryLength === 9:
      return 0.77;
    default:
      // From 10+ chars onward, keep it stable and strict
      return 0.8;
  }
};

const buildNGrams = (str: string): string[] => {
  if (str.length <= N_GRAM_SIZE) return [str];
  const grams: string[] = [];
  for (let i = 0; i <= str.length - N_GRAM_SIZE; i++) {
    grams.push(str.slice(i, i + N_GRAM_SIZE));
  }
  return grams;
};

export function fuzzyMatchNGramThreshold(query: string, target: string): boolean {
  if (!query) return true;

  const formattedQuery = query.toLowerCase();
  const formattedTarget = target.toLowerCase();

  // Step 1: structural similarity via n-gram containment
  const queryGrams = buildNGrams(formattedQuery);
  const targetGrams = new Set(buildNGrams(formattedTarget));

  let occurrences = 0;
  for (const gram of queryGrams) {
    if (targetGrams.has(gram)) occurrences++;
  }

  const containmentRatio = queryGrams.length === 0 ? 1 : occurrences / queryGrams.length;

  if (containmentRatio < getMinContainmentRatio(formattedQuery)) return false;

  // Step 2: strict subsequence check (always enforced)
  // Characters must appear in order; substitutions are not allowed.
  let queryIndex = 0;
  for (
    let targetIndex = 0;
    targetIndex < formattedTarget.length && queryIndex < formattedQuery.length;
    targetIndex++
  ) {
    if (formattedQuery[queryIndex] === formattedTarget[targetIndex]) queryIndex++;
  }

  return queryIndex === formattedQuery.length;
}
