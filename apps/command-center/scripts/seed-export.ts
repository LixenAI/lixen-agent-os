import { getCommandCenterState } from "../lib/data";

// Exports the canonical seed state as JSON to stdout.
// Never includes secrets; safe to commit or pipe to a seed loader.
function main() {
  const state = getCommandCenterState();
  process.stdout.write(JSON.stringify(state, null, 2) + "\n");
}

main();