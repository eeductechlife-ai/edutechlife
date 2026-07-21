import { getConversationPhase, shouldInsertProactiveMessage, getProactiveMessageByContext } from "./nicoConversation";
import { speakTextConversational } from "../../utils/speech";

export { handlePostStreamActions } from "./nicoPostStream";

export function advanceMessagePhase(userMessageCount, setUserMessageCount, setConversationPhase) {
  setUserMessageCount((prev) => prev + 1);
  const currentPhase = getConversationPhase(userMessageCount + 1);
  setConversationPhase(currentPhase);
  return currentPhase;
}

export function tryInsertProactiveMessage({
  currentPhase,
  userMessageCount,
  lastProactiveIndex,
  userContext,
  audioEnabled,
  setMessages,
  setLastProactiveIndex,
  setAudioPermissionError,
}) {
  if (shouldInsertProactiveMessage(currentPhase, userMessageCount + 1, lastProactiveIndex)) {
    setTimeout(() => {
      const proactiveMsg = getProactiveMessageByContext(currentPhase, userContext.detectedTopics, userContext.userName);
      if (proactiveMsg) {
        const proactiveObj = {
          role: "assistant",
          content: proactiveMsg,
          timestamp: new Date().toISOString(),
          isProactive: true,
        };
        setMessages((prev) => [...prev, proactiveObj]);
        setLastProactiveIndex(userMessageCount + 1);
        if (audioEnabled) {
          speakTextConversational(proactiveMsg, "nico_premium", {}, undefined, setAudioPermissionError);
        }
      }
    }, 500);
  }
}
