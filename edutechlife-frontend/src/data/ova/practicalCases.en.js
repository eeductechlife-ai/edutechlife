export const challenges = [
  {
    id: 1,
    title: "Market Research",
    scenario:
      "You are a business consultant and your client needs a competitive analysis of the electric vehicle market in Latin America for 2025. You need up-to-date data, trends, and projections. What is the best strategy using Gemini?",
    context:
      "You have access to Gemini Advanced with Deep Research and Google Workspace integration.",
    options: [
      "Ask Gemini to generate a complete report based solely on its training data.",
      "Use Gemini with Deep Research to search real-time sources, analyze them, and deliver a report with verifiable citations.",
      "Manually search Google, copy data into a document, then ask Gemini to summarize it.",
    ],
    correct: 1,
    feedback:
      "Deep Research is ideal for this case: it actively searches the web, cross-references sources, and delivers a report with verifiable citations. Training data may be outdated and manual search is inefficient.",
    tip: 'Activate Deep Research from Gemini Advanced and specify: "Analyze the electric vehicle market in Latin America, including key players, growth projections, and entry barriers. Cite all sources."',
  },
  {
    id: 2,
    title: "Document Analysis",
    scenario:
      "You receive a 45-page PDF contract with complex terms. You need to identify risky clauses, key dates, and obligations before a meeting in 2 hours. How do you use Gemini to maximize your time?",
    context:
      "You can upload files to Gemini and ask questions about their content.",
    options: [
      "Read the entire contract and take manual notes, then ask Gemini specific questions.",
      "Upload the PDF to Gemini and ask for an executive summary, then ask targeted questions about risky clauses, dates, and obligations.",
      "Ask Gemini to draft a counter-proposal directly without reading the original.",
    ],
    correct: 1,
    feedback:
      "Gemini can process lengthy documents in seconds. Uploading the PDF and asking targeted questions lets you extract critical information in minutes, not hours.",
    tip: 'Use the prompt: "Analyze this contract and extract: 1) Risk clauses, 2) Critical dates and deadlines, 3) Obligations of each party, 4) Negotiation recommendations."',
  },
  {
    id: 3,
    title: "Workspace Automation",
    scenario:
      "You are a project leader and need to send a weekly progress report to 15 stakeholders, each with data personalized by department. The data is in a Sheets spreadsheet. What is the most efficient workflow using Gemini in Google Workspace?",
    context:
      "Gemini is integrated into Gmail, Docs, Sheets, and Meet in Google Workspace.",
    options: [
      "Manually copy and paste each report in Gmail, adjusting data one by one.",
      "Use Gemini in Sheets to analyze data, then Gemini in Docs to draft the base report, and Gemini in Gmail to personalize and send each email.",
      "Send the same generic email to everyone with overall data.",
    ],
    correct: 1,
    feedback:
      "Gemini's Workspace integration enables a seamless workflow: analyze in Sheets, draft in Docs, and personalize in Gmail — all within the same ecosystem. This saves hours of repetitive work.",
    tip: 'In Gmail, use "Help me write" and specify: "Draft an email for the [department name] department with the following progress data: [paste relevant data]. Professional and concise tone."',
  },
  {
    id: 4,
    title: "Multimodal Analysis",
    scenario:
      "Your marketing team collected 50 screenshots of competitors showing their new campaigns. You need a quick visual analysis of trends: colors, key messages, formats, and CTAs. How do you leverage Gemini's multimodal capabilities?",
    context:
      "Gemini can analyze images, extract text from them, and recognize visual patterns.",
    options: [
      "Review each screenshot manually and take notes in a spreadsheet.",
      "Upload all images to Gemini and ask for a comparative visual analysis: color palettes, message types, formats, and detected calls to action.",
      "Only read the visible text in each screenshot and ignore visual elements.",
    ],
    correct: 1,
    feedback:
      "Gemini's multimodal capability simultaneously analyzes text, colors, composition, and visual elements. It can identify patterns that manual analysis would miss and delivers results in seconds.",
    tip: 'Suggested prompt: "Analyze these 50 competitor campaign screenshots. Identify: 1) Dominant color palettes, 2) Recurring message structures, 3) Most used formats, 4) Common CTAs. Present a trends summary."',
  },
  {
    id: 5,
    title: "Code Debugging",
    scenario:
      "You have a 300-line Python script that processes financial data, but it has intermittent errors and takes 45 minutes to run. You need to identify bugs and optimize it. You are not a Python expert. How do you use Gemini?",
    context:
      "Gemini has advanced code generation and analysis capabilities in multiple languages.",
    options: [
      "Randomly modify the code hoping it works, since you don't understand Python.",
      "Copy the complete code into Gemini, ask it to identify errors, explain each problem, and suggest performance optimizations with explanations.",
      "Hire an external developer to review the code.",
    ],
    correct: 1,
    feedback:
      "Gemini can analyze complete code, identify errors, suggest optimizations, and explain every change. It's like having a senior developer available instantly, without needing to be an expert in the language.",
    tip: 'Prompt: "Analyze this Python financial processing script. Identify: 1) Errors causing intermittent failures, 2) Performance bottlenecks, 3) Specific optimization suggestions with code. Explain each change in simple language."',
  },
  {
    id: 6,
    title: "Data Insights",
    scenario:
      "You have a CSV file with 10,000 rows of last quarter sales data: products, regions, dates, amounts, and channels. You need to identify trends, anomalies, and growth opportunities before a board meeting in 3 hours. What is your strategy with Gemini?",
    context:
      "Gemini can analyze data files, generate conceptual visualizations, and find patterns.",
    options: [
      "Open the CSV in Excel and create manual charts for each variable.",
      "Upload the CSV to Gemini and ask for: trend analysis by region and product, sales anomaly detection, best-performing channel identification, and actionable recommendations.",
      "Only calculate the total sales average and present that number.",
    ],
    correct: 1,
    feedback:
      "Gemini processes large data volumes in seconds, identifies patterns the human eye cannot detect, and delivers actionable recommendations. What would take hours in Excel, Gemini does in minutes.",
    tip: 'Prompt: "Analyze this quarterly sales CSV. I need: 1) Top 5 products by region, 2) Channels with highest month-over-month growth, 3) Anomalies or outliers, 4) Correlations between variables, 5) 3 actionable recommendations for the board meeting."',
  },
];

export const learningObjectives = [
  "Apply AI tools to real-world professional use cases",
  "Evaluate the optimal AI strategy for each scenario",
  "Develop prompt engineering skills for specific tasks",
  "Integrate multiple AI capabilities into efficient workflows",
];

export const furtherReading = [
  {
    title: "Gemini for Google Workspace Guide",
    url: "https://workspace.google.com/solutions/ai/",
    description: "Official guide for integrating Gemini in Google Workspace.",
  },
  {
    title: "Deep Research in Gemini",
    url: "https://blog.google/products/gemini/google-gemini-deep-research/",
    description: "How to use Gemini's Deep Research feature for investigation.",
  },
];
