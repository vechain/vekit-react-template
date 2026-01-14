const workspaceFilters = [{ pathPrefix: "src/", turboFilter: "src" }];

const getMatchedFilters = (files) => {
  const matchedFilters = new Set();
  let runRoot = false;

  files.forEach((file) => {
    const normalized = file.replace(/\\/g, "/");
    const match = workspaceFilters.find(({ pathPrefix }) => normalized.includes(pathPrefix));

    if (match) {
      matchedFilters.add(match.turboFilter);
    } else {
      runRoot = true;
    }
  });

  return { matchedFilters: [...matchedFilters], runRoot };
};

const getFilterArgs = (files) => {
  const { matchedFilters, runRoot } = getMatchedFilters(files);
  const filters = runRoot ? [] : matchedFilters;
  return filters.map((f) => `--filter=${f}`).join(" ");
};

// Using different extension orders creates different object keys
// while matching the same files - lint-staged runs different patterns in parallel
export default {
  // Format
  "**/*.{ts,tsx,js,jsx,cts,mts,sol}": (files) => {
    const filterArgs = getFilterArgs(files);
    return `yarn turbo format ${filterArgs}`.trim();
  },

  // Lint (different extension order = different key, same files matched)
  "**/*.{js,jsx,ts,tsx,cts,mts,sol}": (files) => {
    const filterArgs = getFilterArgs(files);
    return `yarn turbo lint ${filterArgs}`.trim();
  },

  // TypeScript check (another different order)
  "**/*.{tsx,ts,jsx,js,mts,cts,sol}": (files) => {
    const filterArgs = getFilterArgs(files);
    return `yarn turbo ts-check ${filterArgs}`.trim();
  },

  // Knip for frontend files only
  "apps/frontend/**/*.{ts,tsx,js,jsx}": () => "yarn knip:frontend",
};
