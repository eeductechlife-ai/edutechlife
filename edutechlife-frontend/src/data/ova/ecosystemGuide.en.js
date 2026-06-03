export const infographicData = {
  header: { title: "Mastering the ChatGPT Ecosystem", subtitle: "From Theory to Professional Action" },
  sections: [
    {
      id: "evolution", title: "AI Engine Evolution (GPT Models)", icon: "TrendingUp",
      content: "ChatGPT became the fastest-growing application in history after its November 2022 launch, reaching 100 Million Users in 2 months.",
      details: [
        { title: "GPT-4o", date: "May 2024", text: "Omni multimodal (text, image, audio).", extendedText: "This model broke latency barriers. It enables real-time voice interactions without typical delays, can 'see' through a smartphone camera and analyze the environment instantly, and processes audio natively rather than converting it to text first." },
        { title: "GPT-5", date: "August 2025", text: "Optimized system, drastic reduction in hallucinations.", extendedText: "A qualitative leap toward enterprise reliability. It focuses on Agentic Workflows, where AI can more safely interact with external databases and make significantly fewer logical errors or invent data." },
        { title: "GPT-5.5", date: "April 2026", text: "Autonomous reasoning and step-by-step planning.", extendedText: "Represents the smartest model of the decade. It can receive a complex goal (e.g., 'Create a complete marketing campaign'), break it into small tasks, execute necessary code, correct its own errors, and use multiple web tools without constant human intervention." }
      ]
    },
    {
      id: "modes", title: "Operation Modes", icon: "Cpu",
      content: "AI adapts its processing power and response time according to task complexity.",
      details: [
        { title: "Fast Mode", text: "Instant responses to simple, direct tasks.", extendedText: "Ideal for daily productivity: summarizing long email chains, quick content brainstorming, drafting client responses, or correcting grammar in seconds. Prioritizes speed over deep analysis." },
        { title: "Thinking Mode (Deep)", text: "Detailed analysis and strategic decisions. Requires processing time.", extendedText: "The AI invests time in 'thinking' before writing. Essential for solving complex code bugs, designing software architectures, writing analytical academic essays, or modeling financial scenarios where a superficial error would be costly." }
      ]
    },
    {
      id: "tools", title: "The Integrated Toolbox", icon: "Wrench",
      content: "ChatGPT evolved from a simple chatbot to a complete digital workspace.",
      details: [
        { title: "Web Search and Code Interpreter", text: "Access to live data and Python script execution.", icon: "Search", extendedText: "You can upload a raw Excel file and ask it to clean data, perform statistical analysis (like regressions), and generate interactive charts. The AI writes Python code in the background, executes it, and delivers the visual result." },
        { title: "Canvas: Collaborative Editing", text: "A shared workspace in a side panel.", icon: "Layout", extendedText: "Instead of regenerating entire text in the chat, Canvas opens a side document. You can select a single paragraph and ask 'make this paragraph more professional', or edit code directly while AI reviews changes. Ideal for long projects." },
        { title: "Memory and Projects", text: "Remembers preferences and organizes complex contexts under 'Projects'.", icon: "Database", extendedText: "If you set up a 'Project' for Edutechlife, you can upload the brand manual and guidelines. From then on, any chat within that project will remember to use your colors, institutional tone, and preferred formats without repeating yourself." }
      ]
    },
    {
      id: "automation", title: "Connectivity and Automation", icon: "Share2",
      content: "The real power comes from connecting your AI with the outside world and your daily applications.",
      details: [
        { title: "Zapier", text: "Simple, intuitive automations.", icon: "Zap", extendedText: "Excellent for beginners. Example: 'Every time I receive an email labeled Invoice in Gmail, use AI to extract the amount and automatically add it to a row in Google Sheets'." },
        { title: "Make (Integromat)", text: "Complex, powerful flows (1,000 free operations/month).", icon: "Settings", extendedText: "Enables advanced logical branching. Example: 'If a lead comes in via Facebook, analyze their message with AI. If angry, notify Slack urgently. If a common question, send an automatic email using the company manual'." },
        { title: "Native Integration: Workspace and Slack", text: "Ability to act directly on your corporate platforms.", icon: "MessageSquare", extendedText: "AI no longer lives only in its app. You can use @ChatGPT in Slack to summarize a 50-message thread from colleagues while you were in a meeting, saving vital reading minutes." }
      ]
    }
  ]
};
