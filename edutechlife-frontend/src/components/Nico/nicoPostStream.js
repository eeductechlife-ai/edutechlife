import { getConversationPhase } from "./nicoConversation";
import { shouldInsertProactiveMessage } from "./nicoConversation";
import { getProactiveMessageByContext } from "./nicoConversation";
import { getConversationOptions } from "./nicoContext";
import { optimizeLongConversation } from "./nicoContext";
import { speakTextConversational } from "../../utils/speech";

export function handlePostStreamActions({
  messages,
  showedConversationOptions,
  userContext,
  userMessageCount,
  lastProactiveIndex,
  audioEnabled,
  currentLead,
  userMessage,
  setShowedConversationOptions,
  setMessages,
  setUserMessageCount,
  setConversationPhase,
  setLastProactiveIndex,
  setAudioPermissionError,
  updateLeadInfo,
}) {
  const userMsgCount =
    messages.filter((msg) => msg.role === "user").length + 1;
  if (userMsgCount >= 2 && !showedConversationOptions) {
    setTimeout(() => {
      const options = getConversationOptions([...messages], userContext);
      if (options) {
        setShowedConversationOptions(true);
        const optionsMessage = {
          role: "assistant",
          content:
            "Para hacer nuestra conversaci\u00f3n m\u00e1s productiva, \u00bfte gustar\u00eda...",
          timestamp: new Date().toISOString(),
          hasOptions: true,
          options: options,
        };
        setMessages((prev) => {
          const newMessages = [...prev, optionsMessage];
          return optimizeLongConversation(newMessages, 25);
        });
      }
    }, 300);
  }

  if (currentLead) {
    updateLeadInfo({
      lastInteraction: new Date().toISOString(),
      lastMessage: userMessage,
    });
  }

  setUserMessageCount((prev) => prev + 1);
  const currentPhase = getConversationPhase(userMessageCount + 1);
  setConversationPhase(currentPhase);
  if (
    shouldInsertProactiveMessage(
      currentPhase,
      userMessageCount + 1,
      lastProactiveIndex,
    )
  ) {
    setTimeout(() => {
      const proactiveMsg = getProactiveMessageByContext(
        currentPhase,
        userContext.detectedTopics,
        userContext.userName,
      );
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
          speakTextConversational(
            proactiveMsg,
            "nico_premium",
            {},
            undefined,
            setAudioPermissionError,
          );
        }
      }
    }, 500);
  }
}
