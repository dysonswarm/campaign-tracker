import { createAI, getAIState } from "ai/rsc";

export const AIProvider = createAI({
  actions: {
    // ...
  },
  initialAIState: {
    // ...
  },
  initialUIState: {
    // ...
  },
  onSetAIState: async ({ key, state, done }) => {},
  onGetUIState: async () => {
    "use server";

    const currentAIState = getAIState();
    const externalAIState = await loadAIStateFromDatabase();

    if (currentAIState === externalAIState) return undefined;

    // Update current AI state and return the new UI state
    const state = getMutableAIState();
    state.done(externalAIState);
    return <div>...</div>;
  },
});
