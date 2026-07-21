export function trackTopicFromMessage(userMessage, extractTopic, trackAcademicTopic) {
  const subject = extractTopic(userMessage.text);
  if (subject) {
    trackAcademicTopic(subject.topic);
  }
}
