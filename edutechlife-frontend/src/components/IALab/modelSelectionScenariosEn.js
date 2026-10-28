// Escenarios de la Guía de selección de modelos.
export const SCENARIOS_EN = [
  {
    id: "customer-service",
    title: "24/7 Customer Support in Real Time",
    context:
      "Your company receives 1000+ questions daily. You need answers in under 2 seconds, cost per answer is critical, and some customers demand data not be shared with third parties.",
    decision: "Which model would you choose and why?",
    criteria: [
      { name: "Latency", importance: "CRITICAL", reason: "<2s per response" },
      { name: "Cost", importance: "HIGH", reason: "1000+ queries/day" },
      {
        name: "Privacy",
        importance: "MEDIUM",
        reason: "Some customers require it",
      },
      {
        name: "Capabilities",
        importance: "MEDIUM",
        reason: "Routine questions",
      },
    ],
    options: [
      {
        model: "ChatGPT (API)",
        cost: "Según plan",
        latency: "~800ms",
        privacy: "Cloud",
        note: "Expensive but reliable",
      },
      {
        model: "Gemini",
        cost: "Según plan",
        latency: "~600ms",
        privacy: "Cloud",
        note: "Cheaper, better latency",
      },
      {
        model: "Gemini Notebook",
        cost: "Según plan",
        latency: "~5s",
        privacy: "Cloud",
        note: "Too slow, not real-time",
      },
      {
        model: "Llama 3.1 (self-hosted)",
        cost: "Según proveedor",
        latency: "~300ms",
        privacy: "On-premises",
        note: "Full privacy, complex setup",
      },
    ],
    expert: [
      "Latency is first: Gemini Notebook is out (5s minimum).",
      "Between ChatGPT, Gemini, and Llama self-hosted: Gemini wins on latency (600ms) and cost (costo bajo). ChatGPT is more reliable but expensive.",
      "If privacy is a legal requirement: Llama self-hosted on your infrastructure, though it requires managing GPUs.",
      "Recommendation: Gemini as default (cost-latency balance), with path to Llama self-hosted if regulations demand it.",
    ],
  },
  {
    id: "research-analysis",
    title: "Deep Document Analysis for Research",
    context:
      "You analyze 500+ academic papers per month. You need precise data extraction, comparative analysis, and can process documents 50+ pages long. Budget is flexible.",
    decision: "Which model would you choose and why?",
    criteria: [
      { name: "Latency", importance: "LOW", reason: "Can take minutes" },
      {
        name: "Cost",
        importance: "MEDIUM",
        reason: "500+ docs, but budget exists",
      },
      {
        name: "Privacy",
        importance: "LOW",
        reason: "Public documents or internal sensitive?",
      },
      {
        name: "Capabilities",
        importance: "CRITICAL",
        reason: "Deep analysis, precise extraction",
      },
    ],
    options: [
      {
        model: "ChatGPT",
        cost: "Según plan",
        latency: "2-5s",
        privacy: "Cloud",
        note: "Best reasoning, precise",
      },
      {
        model: "Gemini Advanced",
        cost: "Según plan",
        latency: "1-2s",
        privacy: "Cloud",
        note: "Fast, but less deep",
      },
      {
        model: "Gemini Notebook",
        cost: "Según plan",
        latency: "~2min/doc",
        privacy: "Cloud",
        note: "Built for this: analysis + audio overviews",
      },
      {
        model: "Claude (via API)",
        cost: "Según plan",
        latency: "2-4s",
        privacy: "Cloud",
        note: "Good at long analysis",
      },
    ],
    expert: [
      "Gemini Notebook is designed exactly for this: takes a long document and auto-generates summary + audio + insights.",
      "If you need structured data extraction: Claude or ChatGPT are solid options (always verify). If just summaries: Gemini Notebook is the clear winner.",
      "Cost: depends on plan and volume; compare current prices before deciding.",
      "Recommendation: Gemini Notebook as main flow (summary + audio for researchers), with manual Claude fallback if you need structured data.",
    ],
  },
  {
    id: "personalized-learning",
    title: "Personalized Real-Time Tutoring System",
    context:
      "Teacher uses AI to give personalized feedback to 30 students. Each session is 15 min, the model must remember the student's context (past errors, pace), and student data cannot leave your server.",
    decision: "Which model would you choose and why?",
    criteria: [
      {
        name: "Latency",
        importance: "HIGH",
        reason: "Live session, immediate feedback",
      },
      {
        name: "Cost",
        importance: "MEDIUM",
        reason: "30 students × 15 min/week",
      },
      {
        name: "Privacy",
        importance: "CRITICAL",
        reason: "Sensitive child data",
      },
      {
        name: "Capabilities",
        importance: "HIGH",
        reason: "Personalization and continuity",
      },
    ],
    options: [
      {
        model: "ChatGPT (API)",
        cost: "Según uso",
        latency: "~800ms",
        privacy: "Cloud",
        note: "Fails privacy (data to OpenAI)",
      },
      {
        model: "Gemini Advanced",
        cost: "Según plan",
        latency: "~600ms",
        privacy: "Cloud",
        note: "Same privacy restriction",
      },
      {
        model: "Llama 2/3.1 (self-hosted)",
        cost: "Según proveedor",
        latency: "~300-500ms",
        privacy: "On-premises",
        note: "Meets privacy, good latency",
      },
      {
        model: "Mistral 7B (self-hosted)",
        cost: "Según proveedor",
        latency: "~200-300ms",
        privacy: "On-premises",
        note: "Faster, less context",
      },
    ],
    expert: [
      "Privacy is non-negotiable: any cloud (ChatGPT, Gemini, Gemini Notebook) violates child protection regulations in most countries.",
      "Mandatory option: self-hosted (Llama or Mistral) on your own infrastructure.",
      "Between Llama and Mistral: Llama better for complex tasks (more context), Mistral faster and cheaper (less GPU).",
      "Recommendation: Mistral 7B self-hosted (cost-latency-privacy balance), evaluate Llama 13B if you need better context understanding.",
    ],
  },
  {
    id: "bulk-content",
    title: "Bulk Content Generation: 1000+ texts/month",
    context:
      "You generate product descriptions, emails, social media posts. High volume, medium-high quality, frequent tone/style changes. Cost is very important.",
    decision: "Which model would you choose and why?",
    criteria: [
      { name: "Latency", importance: "LOW", reason: "Batch, not real-time" },
      {
        name: "Cost",
        importance: "CRITICAL",
        reason: "1000+ texts/month, tight budget",
      },
      {
        name: "Privacy",
        importance: "LOW",
        reason: "Public content, not sensitive",
      },
      {
        name: "Capabilities",
        importance: "MEDIUM",
        reason: "Text generation, versatility",
      },
    ],
    options: [
      {
        model: "ChatGPT",
        cost: "Según uso",
        latency: "Batch OK",
        privacy: "Cloud",
        note: "Best quality, pricey",
      },
      {
        model: "Gemini",
        cost: "Según plan",
        latency: "Batch OK",
        privacy: "Cloud",
        note: "Cheaper, good quality",
      },
      {
        model: "Llama 3.1 70B (self-hosted)",
        cost: "Según proveedor",
        latency: "Batch OK",
        privacy: "On-premises",
        note: "Expensive compute, not worth it",
      },
      {
        model: "Open-source local (Mistral/Zephyr)",
        cost: "Según proveedor",
        latency: "Batch OK",
        privacy: "On-premises",
        note: "Very cheap, medium quality",
      },
    ],
    expert: [
      "High volume + cost critical → Gemini wins (0.075/1M vs 0.50/1M is 6-7x cheaper).",
      "Self-hosting for batches isn't cost-effective: GPU rental cost quickly exceeds cloud API.",
      "Quality: Gemini is fine for product descriptions/emails. Better quality from ChatGPT only worth it if product margin supports it.",
      "Recommendation: Gemini API with batch processing (even cheaper), A/B test ChatGPT only on high-conversion cases.",
    ],
  },
];
