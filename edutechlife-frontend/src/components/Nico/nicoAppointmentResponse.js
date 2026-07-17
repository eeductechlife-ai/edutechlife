export function checkAppointmentResponse(
  userMessage,
  messages,
  showSchedulerWithContext,
  memory,
  setIsLoading,
) {
  const lowerMessage = userMessage.toLowerCase();
  const lastMessage = messages[messages.length - 1];
  const isAppointmentResponse = lastMessage?.isAppointmentPrompt;

  if (isAppointmentResponse) {
    const positiveResponses = [
      "s\u00ed",
      "si",
      "claro",
      "por supuesto",
      "me encantar\u00eda",
      "quiero",
      "agenda",
      "agendar",
      "s\u00ed quiero",
      "si quiero",
    ];
    const negativeResponses = [
      "no",
      "ahora no",
      "despu\u00e9s",
      "m\u00e1s tarde",
      "no gracias",
    ];

    const isPositive = positiveResponses.some((response) =>
      lowerMessage.includes(response),
    );
    const isNegative = negativeResponses.some((response) =>
      lowerMessage.includes(response),
    );

    if (isPositive) {
      const recentLead = messages.find((msg) => msg.isLeadSuccess);
      let leadData = {};

      if (recentLead) {
        const nameMatch = recentLead.content.match(/Perfecto (\w+),/);
        if (nameMatch) {
          leadData.nombreCompleto = nameMatch[1];
        }
      }

      showSchedulerWithContext({
        leadData,
        interest: memory?.userProfile?.interests?.[0] || "Consulta general",
      });

      setIsLoading(false);
      return { handled: true, action: "schedule" };
    }
  }

  return { handled: false };
}
