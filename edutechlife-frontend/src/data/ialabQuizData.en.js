export const MODULE_EXAMS_EN = {
  1: [
    {
      id: 'm1q1', question: 'What is the main purpose of prompt engineering?',
      options: [
        { id: 'm1q1_a', label: 'To ask longer questions to AI' },
        { id: 'm1q1_b', label: 'To give clear and effective instructions for useful results' },
        { id: 'm1q1_c', label: 'To use complicated technical words' },
        { id: 'm1q1_d', label: 'To make AI write code automatically' }
      ],
      correctAnswer: 'm1q1_b', topic: 'Prompt Engineering', difficulty: 'easy',
      feedback: 'Review the topic "Generative AI: Your First Step" in the module resources.'
    },
    {
      id: 'm1q2', question: 'A student writes: "Write a text about artificial intelligence for students." According to the RTF method (Role, Task, Format), which components are present and which are missing?',
      options: [
        { id: 'm1q2_a', label: 'The Task is present; Role and Format are missing — it does not define what AI profile to adopt nor how to structure the response' },
        { id: 'm1q2_b', label: 'All RTF components are present in the prompt' },
        { id: 'm1q2_c', label: 'Only Role is missing; Task and Format are well defined' },
        { id: 'm1q2_d', label: 'Only Format is missing; Role and Task are well defined' }
      ],
      correctAnswer: 'm1q2_a', topic: 'RTF Method', difficulty: 'medium',
      feedback: 'The prompt has a clear Task ("write a text") but does not define the AI Role (science communicator? teacher?) nor the Format (list? essay? how many words?). Review the "Anatomy of a Prompt" (PDF) and the video "How to Create a Good Prompt".'
    },
    {
      id: 'm1q3', question: 'What is a key advantage of the RTF method (Role, Task, Format)?',
      options: [
        { id: 'm1q3_a', label: 'It makes questions shorter' },
        { id: 'm1q3_b', label: 'It structures instructions to get organized and aligned responses' },
        { id: 'm1q3_c', label: 'It eliminates the need for context' },
        { id: 'm1q3_d', label: 'It fully automates the process' }
      ],
      correctAnswer: 'm1q3_b', topic: 'Mastery Framework', difficulty: 'easy',
      feedback: 'Review "The Perfect Prompt Formula" in the module resources.'
    },
    {
      id: 'm1q4', question: 'According to the "Anatomy of a Prompt" guide (module PDF) and the video "How to Create a Good Prompt", which of these prompts is BEST structured for an accurate and useful response?',
      options: [
        { id: 'm1q4_a', label: '"Tell me everything about climate change"' },
        { id: 'm1q4_b', label: '"Act as a science communicator. Explain 3 causes of climate change and their concrete effects. Use accessible language for the general public and end with a 2-line conclusion."' },
        { id: 'm1q4_c', label: '"Climate change: causes and effects"' },
        { id: 'm1q4_d', label: '"I need information about climate change for a school project"' }
      ],
      correctAnswer: 'm1q4_b', topic: 'Prompt Structure', difficulty: 'medium',
      feedback: 'Prompt B follows the recommended structure: defines a Role (science communicator), a specific Task (explain 3 causes and effects), and a clear Format (accessible tone, 2-line conclusion).'
    },
    {
      id: 'm1q5', question: 'A student needs an executive summary of an article about neural networks to present to executives with no technical background. They write: "Summarize this article about neural networks." The AI returns a 3-page technical text. What is the cause of the problem and how should the prompt be modified?',
      options: [
        { id: 'm1q5_a', label: 'The article is too long; they should split the text into smaller parts' },
        { id: 'm1q5_b', label: 'Role, Audience, and Format are missing. It should be: "Act as a technology consultant. Executive summary in 5 bullet points for non-technical executives. Maximum 200 words."' },
        { id: 'm1q5_c', label: 'AI does not understand the topic; they should use a different AI tool' },
        { id: 'm1q5_d', label: 'The problem is the word "summarize"; they should use "synthesize" instead' }
      ],
      correctAnswer: 'm1q5_b', topic: 'RTF Application', difficulty: 'hard',
      feedback: 'The original prompt only has a generic Task. For a useful result, it needs Role (technology consultant), Audience (non-technical executives), and Format (5 bullet points, 200 words). Review the OVA "How to Communicate with AI" and the PDF guide.'
    },
    {
      id: 'm1q6', question: 'What ethical considerations are key when using generative AI?',
      options: [
        { id: 'm1q6_a', label: 'Only response speed' },
        { id: 'm1q6_b', label: 'Bias, privacy, transparency, and responsible use' },
        { id: 'm1q6_c', label: 'API cost' },
        { id: 'm1q6_d', label: 'Number of tokens used' }
      ],
      correctAnswer: 'm1q6_b', topic: 'AI Ethics', difficulty: 'medium',
      feedback: 'Review the module resources on responsible AI use.'
    },
    {
      id: 'm1q7', question: 'Compare these two prompts for the same task:\n\nPrompt A: "Tell me about the water cycle."\nPrompt B: "Act as a science teacher. Explain the water cycle in 4 key stages for 10-12 year old students. Include one simple analogy per stage and end with a verification question."\n\nWhat is the main reason Prompt B will get a better result?',
      options: [
        { id: 'm1q7_a', label: 'Prompt B is longer, so AI tries harder on the response' },
        { id: 'm1q7_b', label: 'Prompt B uses the full RTF method (Role + Task + Format + Audience), giving clear and specific instructions' },
        { id: 'm1q7_c', label: 'Prompt A uses words that are too simple for AI' },
        { id: 'm1q7_d', label: 'Prompt B uses a more formal and technical tone' }
      ],
      correctAnswer: 'm1q7_b', topic: 'RTF Comparative Analysis', difficulty: 'hard',
      feedback: 'Prompt B follows the RTF method: defines a Role (science teacher), a specific Task (explain in 4 stages), an Audience (10-12 year old students), and a Format (analogies + question). Prompt A is generic and lacks structure. Review the PDF "Anatomy of a Prompt".'
    },
    {
      id: 'm1q8', question: 'How do you structure a prompt using RTF for market analysis?',
      options: [
        { id: 'm1q8_a', label: 'By directly asking "analyze the market"' },
        { id: 'm1q8_b', label: 'By defining Role, Task, and Format to guide the AI response' },
        { id: 'm1q8_c', label: 'By using as few words as possible' },
        { id: 'm1q8_d', label: 'By copying prompts from the internet' }
      ],
      correctAnswer: 'm1q8_b', topic: 'Mastery Framework', difficulty: 'hard',
      feedback: 'Practice with the module\'s JSON templates to master the RTF structure.'
    },
    {
      id: 'm1q9', question: 'You work at a company that launches a new product every month. You need ChatGPT to draft promotional emails consistent with the brand voice. What is the most efficient strategy to maintain consistency without rewriting instructions every time?',
      options: [
        { id: 'm1q9_a', label: 'Create a custom GPT with tone and voice instructions plus brand examples in the knowledge base' },
        { id: 'm1q9_b', label: 'Copy and paste instructions manually into each new conversation' },
        { id: 'm1q9_c', label: 'Use standard chat and ask it to remember the tone each time' },
        { id: 'm1q9_d', label: 'Write the emails manually without AI help' }
      ],
      correctAnswer: 'm1q9_a', topic: 'Custom GPTs', difficulty: 'medium',
      feedback: 'A custom GPT with persistent instructions and knowledge base is the most efficient way to maintain consistency. Review the custom GPTs topic in the module resources.'
    },
    {
      id: 'm1q10', question: 'You write a prompt asking for a marketing plan. The AI gives something generic. What is the best next step?',
      options: [
        { id: 'm1q10_a', label: 'Accept the generic result because the AI already gave its best' },
        { id: 'm1q10_b', label: 'Refine the prompt by adding specific context: industry, budget, target audience, and examples of past campaigns' },
        { id: 'm1q10_c', label: 'Completely change the topic and start over' },
        { id: 'm1q10_d', label: 'Complain to the AI support team' }
      ],
      correctAnswer: 'm1q10_b', topic: 'Iterative Refinement', difficulty: 'easy',
      feedback: 'Prompt engineering is an iterative process. Each refinement adds context the AI needs to give you specific and useful results. Review the "Prompt Refinement" topic in the module resources.'
    },
    {
      id: 'm1q11', question: 'What is the key difference between a zero-shot and a few-shot prompt?',
      options: [
        { id: 'm1q11_a', label: 'Zero-shot uses no examples; few-shot includes examples in the prompt to guide the AI' },
        { id: 'm1q11_b', label: 'Zero-shot works without internet; few-shot needs a connection' },
        { id: 'm1q11_c', label: 'Zero-shot only works with images; few-shot only with text' },
        { id: 'm1q11_d', label: 'There is no difference, the terms are interchangeable' }
      ],
      correctAnswer: 'm1q11_a', topic: 'Prompting Strategies', difficulty: 'medium',
      feedback: 'In zero-shot you give a direct instruction (one shot). In few-shot you provide examples (multiple samples) to establish the desired response pattern. Review the prompting strategies topic in the module resources.'
    },
    {
      id: 'm1q12', question: 'What advantage does using a system prompt have over including instructions in each message?',
      options: [
        { id: 'm1q12_a', label: 'The system prompt sets the AI baseline behavior for the entire conversation, avoiding repeated instructions' },
        { id: 'm1q12_b', label: 'The system prompt makes the AI respond faster' },
        { id: 'm1q12_c', label: 'The system prompt only works in the paid version of ChatGPT' },
        { id: 'm1q12_d', label: 'There is no difference, both methods work the same' }
      ],
      correctAnswer: 'm1q12_a', topic: 'System Prompts', difficulty: 'medium',
      feedback: 'System prompts define the role, tone, and base rules for the entire interaction. This is especially useful in custom GPTs and applications where consistency is key. Review the system prompts topic in the module resources.'
    },
  ],
  2: [
    {
      id: 'm2q1', question: 'You are a data analyst at an e-commerce startup. You receive a CSV with 10,000 sales records from the last quarter and need to identify which products are growing the most. You also need to compare results with current market trends. What is the best strategy combining ChatGPT tools?',
      options: [
        { id: 'm2q1_a', label: 'Use Code Interpreter to analyze the CSV and Web Browsing to research market trends' },
        { id: 'm2q1_b', label: 'Use Canvas to paste data manually and DALL-E to chart it' },
        { id: 'm2q1_c', label: 'Use only Web Browsing to find articles about market trends' },
        { id: 'm2q1_d', label: 'Use DALL-E 3 to automatically generate the analysis from the CSV' }
      ],
      correctAnswer: 'm2q1_a', topic: 'ChatGPT Tools', difficulty: 'medium',
      feedback: 'Code Interpreter runs Python on the CSV for calculations and charts, while Web Browsing gets current market data. Combining them gives a complete analysis. Review the OVA "Lab: ChatGPT Tools".'
    },
    {
      id: 'm2q2', question: 'Which ChatGPT tool should you use to analyze an Excel file with sales data and create charts?',
      options: [
        { id: 'm2q2_a', label: 'DALL-E 3' },
        { id: 'm2q2_b', label: 'Code Interpreter (Data Analysis)' },
        { id: 'm2q2_c', label: 'Canvas' },
        { id: 'm2q2_d', label: 'Web Browsing' }
      ],
      correctAnswer: 'm2q2_b', topic: 'Data Analysis', difficulty: 'medium',
      feedback: 'Code Interpreter runs Python to process files and create visualizations. Review the OVA "Lab: ChatGPT Tools".'
    },
    {
      id: 'm2q3', question: 'A law firm asks you to create a custom GPT to help lawyers draft contracts. It needs to access legal templates, verify updated case law, and generate clauses per case. What is the most appropriate configuration?',
      options: [
        { id: 'm2q3_a', label: 'System prompt with detailed legal instructions + knowledge base with templates + Function Calling to case law database' },
        { id: 'm2q3_b', label: 'Just a generic system prompt saying "you are a legal assistant"' },
        { id: 'm2q3_c', label: 'Enable Web Browsing and DALL-E 3 to find visual examples of contracts' },
        { id: 'm2q3_d', label: 'A GPT without custom instructions, just with data analysis enabled' }
      ],
      correctAnswer: 'm2q3_a', topic: 'Custom GPTs', difficulty: 'medium',
      feedback: 'An effective custom GPT combines: specialized system prompt, knowledge base with relevant documents, and Function Calling for external data. Review the video "Create Your First GPT in 18 Minutes" and the GPT visual guide.'
    },
    {
      id: 'm2q4', question: 'You have a customer service GPT connected to an orders API via Function Calling. The registered function automatically extracts data like order number and email from the conversation. When a user writes "Where is my order #789? My email is ana@example.com", what happens internally?',
      options: [
        { id: 'm2q4_a', label: 'ChatGPT identifies the relevant data (#789, ana@example.com) and automatically executes the function against the orders API' },
        { id: 'm2q4_b', label: 'The user must fill out a separate form with their data before receiving help' },
        { id: 'm2q4_c', label: 'ChatGPT searches the internet for the order number to track it' },
        { id: 'm2q4_d', label: 'Function Calling sends the full user message to the API without processing' }
      ],
      correctAnswer: 'm2q4_a', topic: 'Function Calling', difficulty: 'hard',
      feedback: 'Function Calling lets ChatGPT extract structured parameters from natural language and automatically execute functions. Review "Connect ChatGPT with the Real World" and Lesson 3 of the module.'
    },
    {
      id: 'm2q5', question: 'What does Function Calling with the OpenAI API allow you to do?',
      options: [
        { id: 'm2q5_a', label: 'Call technical support by phone' },
        { id: 'm2q5_b', label: 'Connect ChatGPT with external services like databases, weather APIs, or email systems' },
        { id: 'm2q5_c', label: 'Create faster mathematical functions' },
        { id: 'm2q5_d', label: 'Automatically download all available plugins' }
      ],
      correctAnswer: 'm2q5_b', topic: 'Function Calling', difficulty: 'hard',
      feedback: 'Function Calling connects ChatGPT with the real world. Review the resources for the topic "Connect ChatGPT with the Real World".'
    },
    {
      id: 'm2q6', question: 'You are preparing a thesis and need ChatGPT to remember your theoretical framework in every session. Which feature should you use?',
      options: [
        { id: 'm2q6_a', label: 'Web Browsing' },
        { id: 'm2q6_b', label: 'DALL-E 3' },
        { id: 'm2q6_c', label: 'Projects and Memory' },
        { id: 'm2q6_d', label: 'Code Interpreter' }
      ],
      correctAnswer: 'm2q6_c', topic: 'ChatGPT Projects', difficulty: 'hard',
      feedback: 'Projects group conversations under common instructions and Memory saves context. Review the ChatGPT guide.'
    },
    {
      id: 'm2q7', question: 'A community manager receives 200+ daily comments on social media. Many are frequently asked questions (hours, prices, availability). They want to automate responses with a custom GPT. What is the most effective workflow?',
      options: [
        { id: 'm2q7_a', label: 'Create a GPT with brand tone instructions, upload a knowledge base with FAQs, and connect it via API to the social media platform' },
        { id: 'm2q7_b', label: 'Ask standard ChatGPT to respond to each comment manually one by one' },
        { id: 'm2q7_c', label: 'Set up Web Browsing to find automatic answers on the internet' },
        { id: 'm2q7_d', label: 'Use DALL-E 3 to generate images that visually respond to comments' }
      ],
      correctAnswer: 'm2q7_a', topic: 'Automation', difficulty: 'medium',
      feedback: 'A custom GPT with instructions and knowledge base, connected via API, automates responses while maintaining consistency. Review the OVA "Lab: Build a GPT" and the module\'s automation topic.'
    },
    {
      id: 'm2q8', question: 'A company implements an automated GPT to respond to customer complaints on social media. The GPT is fast but occasionally gives incorrect information about return policies. What is the best practice for using AI responsibly in this case?',
      options: [
        { id: 'm2q8_a', label: 'Implement human supervision with automatic alerts when GPT has low confidence, and periodically audit responses' },
        { id: 'm2q8_b', label: 'Disable the GPT and have the entire team respond manually without AI help' },
        { id: 'm2q8_c', label: 'Ignore errors because response speed is what matters most' },
        { id: 'm2q8_d', label: 'Configure the GPT to always give generic responses without specific information' }
      ],
      correctAnswer: 'm2q8_a', topic: 'Responsible Use', difficulty: 'medium',
      feedback: 'AI should augment human capacity, not replace it without supervision. Best practice is a hybrid system: AI for speed + human supervision for accuracy. Review the module\'s best practices on responsible AI use.'
    },
    {
      id: 'm2q9', question: 'A team of 5 salespeople wants to use ChatGPT to keep their product knowledge base updated. Each salesperson has different conversations with different clients. What is the best strategy for everyone to share updated information?',
      options: [
        { id: 'm2q9_a', label: 'Create a shared Project with product instructions and update the centralized knowledge base' },
        { id: 'm2q9_b', label: 'Each salesperson maintains their own chat with whatever instructions they remember' },
        { id: 'm2q9_c', label: 'Use a public GPT that everyone can download' },
        { id: 'm2q9_d', label: 'Share screenshots of chats via email' }
      ],
      correctAnswer: 'm2q9_a', topic: 'ChatGPT Projects', difficulty: 'medium',
      feedback: 'Projects in ChatGPT allow grouping conversations under shared instructions and files. Review the Projects topic in the module resources.'
    },
    {
      id: 'm2q10', question: 'You are designing a customer service GPT. You want it to be able to query a daily-updated product catalog. What functionality should you enable?',
      options: [
        { id: 'm2q10_a', label: 'Upload the catalog as a knowledge base and use Actions (API) to query real-time updates' },
        { id: 'm2q10_b', label: 'Ask the user to copy and paste the catalog each time' },
        { id: 'm2q10_c', label: 'Use DALL-E to generate catalog images' },
        { id: 'm2q10_d', label: 'It is not possible to query updated data in a GPT' }
      ],
      correctAnswer: 'm2q10_a', topic: 'Custom GPTs', difficulty: 'hard',
      feedback: 'GPTs can have a static knowledge base + Actions (API calls) for dynamic data. This allows querying real-time updated information. Review "Connect ChatGPT with the Real World".'
    },
    {
      id: 'm2q11', question: 'A GPT you created for your startup is working great internally. Your partner suggests publishing it on the GPT Store so other startups can use it too. What privacy consideration should you evaluate FIRST?',
      options: [
        { id: 'm2q11_a', label: 'Whether the GPT contains sensitive company data in the knowledge base or system instructions' },
        { id: 'm2q11_b', label: 'Whether the GPT name is catchy enough' },
        { id: 'm2q11_c', label: 'Whether the GPT has enough features to justify its price' },
        { id: 'm2q11_d', label: 'Whether the GPT logo looks professional' }
      ],
      correctAnswer: 'm2q11_a', topic: 'GPT Privacy', difficulty: 'medium',
      feedback: 'Before publishing a GPT, verify it does not contain confidential data (trade secrets, customer data, internal strategies). What works internally is not always safe for public release. Review the GPT privacy topic.'
    },
    {
      id: 'm2q12', question: 'You want to create an automated flow where ChatGPT analyzes social media comments, identifies urgent complaints, and sends notifications to the support team. What combination of tools do you need?',
      options: [
        { id: 'm2q12_a', label: 'A custom GPT with Actions (API) connected to the social network + webhook to the team ticket system' },
        { id: 'm2q12_b', label: 'Standard ChatGPT with Web Browsing enabled' },
        { id: 'm2q12_c', label: 'DALL-E 3 to generate automatic visual responses' },
        { id: 'm2q12_d', label: 'Canvas to manually edit each comment' }
      ],
      correctAnswer: 'm2q12_a', topic: 'Automation', difficulty: 'hard',
      feedback: 'AI automation requires: a GPT prepared for the task + Actions (API) to connect to external services + a webhook or API to trigger actions. Review the automation and Function Calling topic in the module.'
    },
  ],
  3: [
    {
      id: 'm3q1', question: 'What is Deep Research in Gemini and what is it for?',
      options: [
        { id: 'm3q1_a', label: 'A function that does shallow searches on Google' },
        { id: 'm3q1_b', label: 'A tool that deeply researches, analyzes multiple sources, and generates reports with verifiable citations' },
        { id: 'm3q1_c', label: 'A trivia question and answer game' },
        { id: 'm3q1_d', label: 'A Chrome browser extension' }
      ],
      correctAnswer: 'm3q1_b', topic: 'Deep Research', difficulty: 'easy',
      feedback: 'Deep Research creates detailed reports with cited and verifiable sources. Explore the topic "Investigate Like a Digital Detective".'
    },
    {
      id: 'm3q2', question: 'Why is it important to verify the sources that Gemini cites in its research?',
      options: [
        { id: 'm3q2_a', label: 'Because citations are always incorrect' },
        { id: 'm3q2_b', label: 'Because even though Gemini is very accurate, you should always confirm the source is real and the context is correct' },
        { id: 'm3q2_c', label: 'Because Gemini does not provide sources' },
        { id: 'm3q2_d', label: 'Because sources only work in English' }
      ],
      correctAnswer: 'm3q2_b', topic: 'Source Verification', difficulty: 'medium',
      feedback: 'Human verification is essential. Even the best AI can make mistakes. Review the OVA "From Zero to AI Expert".'
    },
    {
      id: 'm3q3', question: 'What advantage does Canvas offer when working with long documents in an AI environment?',
      options: [
        { id: 'm3q3_a', label: 'It is only for making artistic drawings' },
        { id: 'm3q3_b', label: 'It lets you edit specific parts of text without regenerating everything, ideal for reports and essays' },
        { id: 'm3q3_c', label: 'It automatically converts any text into a video' },
        { id: 'm3q3_d', label: 'It translates documents to over 200 languages' }
      ],
      correctAnswer: 'm3q3_b', topic: 'Canvas', difficulty: 'medium',
      feedback: 'Canvas is perfect for editing sections of long documents. Review the OVA "Gemini in Action: Real Cases".'
    },
    {
      id: 'm3q4', question: 'How does Gemini integrate with Google Workspace (Docs, Sheets, Gmail)?',
      options: [
        { id: 'm3q4_a', label: 'It does not integrate; they are separate products' },
        { id: 'm3q4_b', label: 'Gemini can summarize emails, analyze Sheets data, and help draft Docs directly from each application' },
        { id: 'm3q4_c', label: 'It only works in Google Slides' },
        { id: 'm3q4_d', label: 'It requires installing additional software on the computer' }
      ],
      correctAnswer: 'm3q4_b', topic: 'Google Workspace', difficulty: 'medium',
      feedback: 'Gemini is integrated across all Google Workspace. Review the topic "Gemini in Google Drive: Complete Guide".'
    },
    {
      id: 'm3q5', question: 'What is "grounding" or real-time data connection in Gemini?',
      options: [
        { id: 'm3q5_a', label: 'A technique for AI to work without internet' },
        { id: 'm3q5_b', label: 'The ability to connect Gemini responses with up-to-date information from Google Search and other live sources' },
        { id: 'm3q5_c', label: 'A type of cable to connect the computer' },
        { id: 'm3q5_d', label: 'A feature that only works on weekends' }
      ],
      correctAnswer: 'm3q5_b', topic: 'Grounding', difficulty: 'hard',
      feedback: 'Grounding gives you answers based on current information. Explore the topic "Always Up-to-Date Answers".'
    },
    {
      id: 'm3q6', question: 'In the context of guided learning, what is the best way to use Gemini to study a new topic?',
      options: [
        { id: 'm3q6_a', label: 'Ask it to write the whole essay and submit it without reading' },
        { id: 'm3q6_b', label: 'Use it as a tutor: ask progressive questions, request examples, verify concepts, and practice with guided exercises' },
        { id: 'm3q6_c', label: 'Only use it to translate texts' },
        { id: 'm3q6_d', label: 'Avoid using it because it confuses more than it helps' }
      ],
      correctAnswer: 'm3q6_b', topic: 'Guided Learning', difficulty: 'easy',
      feedback: 'AI is your personal 24/7 tutor. Use it to learn actively, not to avoid effort. Review the guided lab by MAX.'
    },
    {
      id: 'm3q7', question: 'You need to research the top 5 AI trends in 2025. Which workflow with Gemini would give you the most complete and verifiable result?',
      options: [
        { id: 'm3q7_a', label: 'Ask "what are the AI trends?" and accept the first response' },
        { id: 'm3q7_b', label: 'Use Deep Research with specific instructions, verify each cited source, cross-reference with Google Search, and generate a structured report' },
        { id: 'm3q7_c', label: 'Search Google manually and copy the first results' },
        { id: 'm3q7_d', label: 'Use only basic chat without asking for sources' }
      ],
      correctAnswer: 'm3q7_b', topic: 'Professional Research', difficulty: 'hard',
      feedback: 'The professional workflow combines Deep Research + verification + synthesis. Practice with the OVA "Gemini Practical Cases".'
    },
    {
      id: 'm3q8', question: 'A journalist needs to research a complex topic (climate change in Latin America) with verifiable sources. They have 2 hours to prepare a report. Which Gemini workflow would give the best result in the least time?',
      options: [
        { id: 'm3q8_a', label: 'Use Deep Research with specific keywords, then verify the cited sources and synthesize into a structured report in Google Docs with Gemini integrated' },
        { id: 'm3q8_b', label: 'Read 20 articles manually on Google and write the report from scratch' },
        { id: 'm3q8_c', label: 'Ask the Gemini chat to summarize everything at once without asking for sources' },
        { id: 'm3q8_d', label: 'Use only traditional Google Search without AI help' }
      ],
      correctAnswer: 'm3q8_a', topic: 'Deep Research', difficulty: 'medium',
      feedback: 'The combination of Deep Research + verification + Gemini in Google Docs speeds up research without sacrificing accuracy. Deep Research finds and analyzes sources; you verify and synthesize. Review the topic "Investigate Like a Digital Detective".'
    },
    {
      id: 'm3q9', question: 'Gemini can process text, images, audio, and video in the same conversation. What is this capability called?',
      options: [
        { id: 'm3q9_a', label: 'Multimodality — Gemini can understand and reason about multiple types of content simultaneously' },
        { id: 'm3q9_b', label: 'Transfer learning — Gemini learns from one data type and applies it to another' },
        { id: 'm3q9_c', label: 'Advanced tokenization — Gemini converts everything to numeric tokens' },
        { id: 'm3q9_d', label: 'Batch processing — Gemini processes each data type separately' }
      ],
      correctAnswer: 'm3q9_a', topic: 'Multimodality', difficulty: 'easy',
      feedback: 'Multimodality is one of Gemini\'s most powerful capabilities: you can show it an image, ask it to analyze a video, and have it read a PDF all in the same conversation. Review the OVA "Gemini in Action: Real Cases".'
    },
    {
      id: 'm3q10', question: 'You are in a meeting and need Gemini to analyze a financial chart just shown on the computer, without uploading the file. How can you do it?',
      options: [
        { id: 'm3q10_a', label: 'Use Gemini Live to share your screen and ask questions in real-time about what is shown' },
        { id: 'm3q10_b', label: 'Take a photo of the chart with your phone and upload it after the meeting' },
        { id: 'm3q10_c', label: 'Draw the chart from memory and ask Gemini to interpret it' },
        { id: 'm3q10_d', label: 'It is not possible — Gemini only analyzes explicitly uploaded files' }
      ],
      correctAnswer: 'm3q10_a', topic: 'Gemini Live', difficulty: 'medium',
      feedback: 'Gemini Live enables real-time interactions with screen sharing capability, ideal for meetings and collaborative work sessions. Review the "Real-Time Gemini" topic in the module resources.'
    },
    {
      id: 'm3q11', question: 'What is the advantage of using Gemini extensions (Google Flights, Hotels, Maps) integrated into the chat?',
      options: [
        { id: 'm3q11_a', label: 'Gemini can access up-to-date information from Google services without leaving the chat, giving contextual responses with live data' },
        { id: 'm3q11_b', label: 'Extensions completely replace Google websites' },
        { id: 'm3q11_c', label: 'They only work for booking flights, not other tasks' },
        { id: 'm3q11_d', label: 'They require an additional Google One subscription' }
      ],
      correctAnswer: 'm3q11_a', topic: 'Gemini Extensions', difficulty: 'medium',
      feedback: 'Extensions connect Gemini with Google services in real-time, enabling contextual and up-to-date responses. It is part of Gemini\'s grounding ecosystem. Review the "Extend Gemini\'s Capabilities" topic.'
    },
    {
      id: 'm3q12', question: 'A university student uses Gemini Advanced for research. What additional benefit do they get with Google One AI Premium?',
      options: [
        { id: 'm3q12_a', label: 'Access to Gemini in Gmail, Docs, Sheets, and Slides, plus cloud storage and the most advanced model capabilities' },
        { id: 'm3q12_b', label: 'Only more Google Drive storage, no AI benefits' },
        { id: 'm3q12_c', label: 'Unlimited access to DALL-E 3 for generating images' },
        { id: 'm3q12_d', label: 'Complete removal of Gemini usage limits' }
      ],
      correctAnswer: 'm3q12_a', topic: 'Google One', difficulty: 'easy',
      feedback: 'Google One AI Premium integrates Gemini across Workspace + gives access to the most advanced model + additional storage. It is the most complete plan for students and researchers. Review "Gemini Plans and Subscriptions".'
    },
  ],
  4: [
    {
      id: 'm4q1', question: 'You are a marine biology researcher and need to analyze 15 academic papers on climate change impact on coral reefs for a publication. Your supervisor asks: "Why would you use NotebookLM instead of ChatGPT for this research?" What is the most compelling reason?',
      options: [
        { id: 'm4q1_a', label: 'NotebookLM works exclusively with your documents and textually cites each source, eliminating the risk of inventing data not in your papers' },
        { id: 'm4q1_b', label: 'ChatGPT cannot read academic PDFs, only plain text documents' },
        { id: 'm4q1_c', label: 'NotebookLM is faster because it does not need internet connection' },
        { id: 'm4q1_d', label: 'ChatGPT only processes information in English and papers may be in other languages' }
      ],
      correctAnswer: 'm4q1_a', topic: 'NotebookLM', difficulty: 'medium',
      feedback: 'NotebookLM is designed for research based on your own sources: zero hallucinations, verifiable citations, and deep contextual analysis. ChatGPT is excellent for general tasks, but for academic research with specific sources, NotebookLM is the right tool. Review the video "First Steps with NotebookLM".'
    },
    {
      id: 'm4q2', question: 'You are an environmental science student and find 30 documents on climate change: 10 peer-reviewed academic papers, 5 verified news articles, 8 personal opinion blogs, 4 government datasets, and 3 science documentaries. Your NotebookLM notebook accepts up to 50 sources. What is the smartest curation strategy?',
      options: [
        { id: 'm4q2_a', label: 'Select the 10 papers + 4 datasets + 3 documentaries as priority sources, leaving out unverified opinion blogs' },
        { id: 'm4q2_b', label: 'Upload all 30 documents because there is space available in the notebook' },
        { id: 'm4q2_c', label: 'Upload only the 8 blogs because they use simpler language' },
        { id: 'm4q2_d', label: 'Upload only the 5 news articles because they have the most recent dates' }
      ],
      correctAnswer: 'm4q2_a', topic: 'NotebookLM', difficulty: 'medium',
      feedback: 'Curation is not about space — it is about selecting reliable and relevant sources. Academic papers and government datasets are verifiable; opinion blogs add noise and unfounded bias. Review the lesson "Select Sources Like an Expert" and the OVA "Simulator: Document Analysis".'
    },
    {
      id: 'm4q3', question: 'You are a medical student and have 3 PDFs on cardiac physiology to study for an exam. Tomorrow you have a 45-minute bus ride and want to use that time to review. What is the best strategy using NotebookLM?',
      options: [
        { id: 'm4q3_a', label: 'Upload the 3 PDFs to a notebook, generate an Audio Overview that analyzes them, and listen during the trip' },
        { id: 'm4q3_b', label: 'Read all 3 PDFs on the bus despite movement and poor lighting' },
        { id: 'm4q3_c', label: 'Ask ChatGPT for a general summary and read it on the bus' },
        { id: 'm4q3_d', label: 'Wait until you get home to read the PDFs calmly' }
      ],
      correctAnswer: 'm4q3_a', topic: 'Audio Overview', difficulty: 'medium',
      feedback: 'Audio Overview turns your documents into a conversational podcast with two AI voices analyzing the content. It is ideal for reviewing dense material when you cannot read, like during a trip. Review the video "Audio Overview: Your Content as a Podcast".'
    },
    {
      id: 'm4q4', question: 'NotebookLM responds: "Neuroplasticity occurs mainly in childhood (Source: neuroplasticity.pdf, page 5)." You click the citation and read in the PDF: "Neuroplasticity is most active during childhood, but continues throughout life." What do you conclude?',
      options: [
        { id: 'm4q4_a', label: 'The AI interpreted correctly but simplified the nuance — the original citation says something more precise, showing why you should always verify textual citations' },
        { id: 'm4q4_b', label: 'NotebookLM was completely wrong; the source says nothing similar' },
        { id: 'm4q4_c', label: 'The PDF is poorly written and should be removed from the notebook' },
        { id: 'm4q4_d', label: 'The AI response is correct because it cited the PDF properly, you do not need to read the original source' }
      ],
      correctAnswer: 'm4q4_a', topic: 'Precision', difficulty: 'hard',
      feedback: 'This is a classic case of why verifying citations is essential. The AI did not hallucinate — it interpreted correctly but lost an important nuance ("most active" vs "occurs mainly"). AI gives you speed; you give it precision. Review the infographic "Smart Summaries with NotebookLM".'
    },
    {
      id: 'm4q5', question: 'What is the best practice when organizing your sources in NotebookLM for research?',
      options: [
        { id: 'm4q5_a', label: 'Upload all 50 sources at once without organizing' },
        { id: 'm4q5_b', label: 'Select relevant and reliable sources, organize them by topics and categories for better results' },
        { id: 'm4q5_c', label: 'Upload only summaries, never the complete documents' },
        { id: 'm4q5_d', label: 'Mix academic sources with blogs without distinction' }
      ],
      correctAnswer: 'm4q5_b', topic: 'Curation', difficulty: 'medium',
      feedback: 'The quality of your sources determines the quality of responses. Review the topic "Select Sources Like an Expert".'
    },
    {
      id: 'm4q6', question: 'If you find two sources that contradict each other in NotebookLM, what should you do?',
      options: [
        { id: 'm4q6_a', label: 'Remove both sources and look for new ones' },
        { id: 'm4q6_b', label: 'Analyze both, identify the reasons for the contradiction, and document it as part of your research' },
        { id: 'm4q6_c', label: 'Keep only the most recent source' },
        { id: 'm4q6_d', label: 'Ignore the contradiction and move on' }
      ],
      correctAnswer: 'm4q6_b', topic: 'Critical Analysis', difficulty: 'hard',
      feedback: 'Contradictions are learning opportunities. Analyzing them strengthens your research. Review the document analysis simulator.'
    },
    {
      id: 'm4q7', question: 'According to the module\'s best practices, what should you ALWAYS do when NotebookLM gives you an answer with citations?',
      options: [
        { id: 'm4q7_a', label: 'Verify the citations by clicking them to confirm the information is correct and in context' },
        { id: 'm4q7_b', label: 'Copy and paste the response without reviewing' },
        { id: 'm4q7_c', label: 'Delete the original document since you no longer need it' },
        { id: 'm4q7_d', label: 'Translate the response to another language to verify quality' }
      ],
      correctAnswer: 'm4q7_a', topic: 'Verification', difficulty: 'medium',
      feedback: 'Always verify citations. AI is your assistant, but you are the final responsible party. Review the module OVA.'
    },
    {
      id: 'm4q8', question: 'A team of 4 students researches the same topic for an integrative project. Each has different documents and they want to use NotebookLM to work together. What is the most efficient collaborative workflow?',
      options: [
        { id: 'm4q8_a', label: 'Each student creates their notebook with their sources and shares the link with the team; everyone can consult and ask questions about each other\'s sources' },
        { id: 'm4q8_b', label: 'One student creates a notebook and the others ask them to make queries on their behalf' },
        { id: 'm4q8_c', label: 'Each student works separately and at the end they manually compare results' },
        { id: 'm4q8_d', label: 'All 4 students take turns using one computer with a single open notebook' }
      ],
      correctAnswer: 'm4q8_a', topic: 'Collaboration', difficulty: 'medium',
      feedback: 'NotebookLM allows sharing notebooks like Google Docs. Each member can have their thematic notebook and share it, giving the whole team access to consult sources and ask questions independently. Review the OVA "Lab: Create your Notebook".'
    },
    {
      id: 'm4q9', question: 'You have 10 sources in your notebook and want to extract only the main conclusions on a specific topic (e.g., "energy efficiency"). What is the most efficient way to do it?',
      options: [
        { id: 'm4q9_a', label: 'Ask NotebookLM a specific question like "According to my sources, what are the main conclusions about energy efficiency? Answers must cite sources textually"' },
        { id: 'm4q9_b', label: 'Read all 10 complete sources one by one and take manual notes' },
        { id: 'm4q9_c', label: 'Ask ChatGPT to do the analysis without uploading the sources' },
        { id: 'm4q9_d', label: 'Use the automatic Study Guide and copy everything without filtering' }
      ],
      correctAnswer: 'm4q9_a', topic: 'NotebookLM', difficulty: 'medium',
      feedback: 'The advantage of NotebookLM is that you can ask specific questions and get cited answers from your sources. You do not need to read everything — the AI finds the relevant sections for you. Review the video "First Steps with NotebookLM".'
    },
    {
      id: 'm4q10', question: 'What is the current limit of sources you can add to a single notebook in NotebookLM?',
      options: [
        { id: 'm4q10_a', label: 'Up to 50 sources per notebook, each source up to approximately 500,000 words' },
        { id: 'm4q10_b', label: 'Unlimited, you can upload as many sources as you want' },
        { id: 'm4q10_c', label: 'Maximum 10 sources per notebook, regardless of size' },
        { id: 'm4q10_d', label: 'Maximum 100 sources but each only 10 pages' }
      ],
      correctAnswer: 'm4q10_a', topic: 'NotebookLM Limits', difficulty: 'medium',
      feedback: 'Knowing the technical limits of tools is part of professional use. NotebookLM allows up to 50 sources with a considerable word limit. Review the module documentation and resources on NotebookLM.'
    },
    {
      id: 'm4q11', question: 'You generate an Audio Overview from your notebook and the AI hosts discuss your sources. What control do you have over the generated audio content?',
      options: [
        { id: 'm4q11_a', label: 'You can customize the topics to cover and regenerate if you do not like the result, but the format is conversational between two AI voices' },
        { id: 'm4q11_b', label: 'You have no control, the audio is generated automatically without options' },
        { id: 'm4q11_c', label: 'You can choose the exact voice, tone, and write the full script manually' },
        { id: 'm4q11_d', label: 'You can only decide whether to include background music or not' }
      ],
      correctAnswer: 'm4q11_a', topic: 'Audio Overview', difficulty: 'easy',
      feedback: 'Audio Overview generates an automatic conversational podcast. You can regenerate it if it does not fit your needs and guide it with notebook instructions. Review the video "Audio Overview: Your Content as a Podcast".'
    },
    {
      id: 'm4q12', question: 'A lawyer uploads 30 legal contracts to a notebook and asks: "Which contracts have confidentiality clauses expiring in less than 2 years?" NotebookLM responds citing 5 specific contracts with page numbers. What additional validation should the lawyer do?',
      options: [
        { id: 'm4q12_a', label: 'Click each citation to verify the AI interpretation matches the full clause text, not just the quoted fragment' },
        { id: 'm4q12_b', label: 'Trust the response because NotebookLM textually cites the sources' },
        { id: 'm4q12_c', label: 'Review only 1 of the 5 cited contracts to save time' },
        { id: 'm4q12_d', label: 'Ask ChatGPT to verify whether NotebookLM was right' }
      ],
      correctAnswer: 'm4q12_a', topic: 'Legal Validation', difficulty: 'hard',
      feedback: 'In legal contexts, human verification is mandatory. Although NotebookLM cites textually, the full clause context can change the interpretation. AI speeds up review, but the legal professional is the final responsible party. Review the source verification topic in the module.'
    },
  ],
  5: [
    {
      id: 'm5q1', question: 'An AI-based hiring system was trained on historical data from a tech company where 78% of employees were men. The system learned to prioritize CVs with words like "engineer" and "tech lead", and penalized terms like "volunteering" or "parental leave". Female candidates with equivalent qualifications received lower scores. What type of bias is present and at what stage of the AI pipeline did it originate?',
      options: [
        { id: 'm5q1_a', label: 'Sampling bias — the training data did not equitably represent the population, originating in data collection' },
        { id: 'm5q1_b', label: 'Automation bias — the system decided on its own without human supervision' },
        { id: 'm5q1_c', label: 'Confirmation bias — recruiters were looking to confirm their own beliefs' },
        { id: 'm5q1_d', label: 'Labeling bias — labels were incorrectly placed by external annotators' }
      ],
      correctAnswer: 'm5q1_a', topic: 'Bias in AI', difficulty: 'medium',
      feedback: 'This is a classic case of sampling bias. Historical data from a company with 78% men does not represent the general candidate population. The bias originated in data collection, before training. Review the OVA "Lab: Detect the Bias" and the PDF "Bias Detection Guide".'
    },
    {
      id: 'm5q2', question: 'You use ChatGPT to research an anxiety treatment. The AI responds: "According to a 2023 Harvard study, 89% of patients reduced symptoms with this therapy." You try to find the study and find nothing. The numbers and source seem invented. What is the most responsible action?',
      options: [
        { id: 'm5q2_a', label: 'Do not use that information until verified with reliable sources, report the possible error, and document that the AI hallucinated' },
        { id: 'm5q2_b', label: 'Use the information anyway because AI rarely gets concrete data wrong' },
        { id: 'm5q2_c', label: 'Ask the same AI to search for the source again and trust whatever it responds' },
        { id: 'm5q2_d', label: 'Ignore the incident because hallucinations are uncommon and do not matter' }
      ],
      correctAnswer: 'm5q2_a', topic: 'Hallucinations', difficulty: 'medium',
      feedback: 'Hallucinations are false information that appears truthful. They are especially dangerous in health contexts where they can have serious consequences. Always verify sources for critical information. Review the lab "Detect the Bias".'
    },
    {
      id: 'm5q3', question: 'You are using AI for a medical diagnosis and the result contradicts your professional judgment. How do you act ethically?',
      options: [
        { id: 'm5q3_a', label: 'Accept the AI without question because it is smarter' },
        { id: 'm5q3_b', label: 'Question the possible automation bias, verify with other experts, and use your professional judgment' },
        { id: 'm5q3_c', label: 'Let the AI decide the treatment' },
        { id: 'm5q3_d', label: 'Turn off the computer and start over' }
      ],
      correctAnswer: 'm5q3_b', topic: 'Responsibility', difficulty: 'medium',
      feedback: 'Automation bias makes us blindly trust AI. Your professional judgment is irreplaceable. Review the topic "AI Ethics: The Essentials".'
    },
    {
      id: 'm5q4', question: 'Which of the following is NOT a good privacy practice when using AI?',
      options: [
        { id: 'm5q4_a', label: 'Uploading client personal data to a public chatbot for analysis' },
        { id: 'm5q4_b', label: 'Reading privacy policies before using an AI tool' },
        { id: 'm5q4_c', label: 'Not sharing confidential information in AI conversations' },
        { id: 'm5q4_d', label: 'Using enterprise versions that offer data protection' }
      ],
      correctAnswer: 'm5q4_a', topic: 'Privacy', difficulty: 'medium',
      feedback: 'Never upload sensitive data to public tools. Review the PDF "Privacy Manual in AI" and the module video.'
    },
    {
      id: 'm5q5', question: 'A bank implements an AI system to approve or reject credit applications. A client is rejected and asks why. The bank responds: "It is an AI decision, we cannot explain how it works internally." What ethical principle is violated and what should the bank do?',
      options: [
        { id: 'm5q5_a', label: 'Transparency and explainability — the bank should audit the model and provide understandable explanations to the client' },
        { id: 'm5q5_b', label: 'Privacy — the bank should hide the use of AI to protect the client' },
        { id: 'm5q5_c', label: 'Speed — the bank should process applications faster' },
        { id: 'm5q5_d', label: 'Efficiency — the bank should replace human analysts' }
      ],
      correctAnswer: 'm5q5_a', topic: 'Transparency', difficulty: 'medium',
      feedback: 'Transparency is a fundamental ethical pillar. Citizens have the right to understand automated decisions affecting them. The EU AI Act requires explainability for high-risk decisions like credit. Review the video "Ethical AI: Principles and Practice" and the PDF "Code of Ethics for AI Use".'
    },
    {
      id: 'm5q6', question: 'You are a UX designer at a digital agency. Your boss asks you to use AI to generate 50 fake positive reviews for a product that has not launched yet, to improve its early reputation on social media. What is the most ethical stance?',
      options: [
        { id: 'm5q6_a', label: 'Refuse to generate fake reviews, explain that it violates ethical principles of transparency, and propose legitimate promotion alternatives' },
        { id: 'm5q6_b', label: 'Generate the reviews because your boss asked and it is part of your job' },
        { id: 'm5q6_c', label: 'Generate the reviews but modify some details to make them seem less fake' },
        { id: 'm5q6_d', label: 'Resign immediately without explanation' }
      ],
      correctAnswer: 'm5q6_a', topic: 'Responsible Use', difficulty: 'medium',
      feedback: 'Generating fake reviews violates ethical principles of transparency and honesty, and can have legal consequences (false advertising). The best path is to propose ethical alternatives. Review the OVA "Lab: Ethical Dilemmas" and the ethical user decalogue.'
    },
    {
      id: 'm5q7', question: 'A driver with autopilot is distracted looking at their phone. The system detects an obstacle and brakes in time. The driver trusts it will always work. Weeks later, in low light, the system does not detect a small object and an accident occurs. What bias describes this situation and how to prevent it?',
      options: [
        { id: 'm5q7_a', label: 'Automation bias — the driver delegated attention without critical supervision. Prevention: training on system limitations and active supervision' },
        { id: 'm5q7_b', label: 'Sampling bias — training data did not include small objects in low light' },
        { id: 'm5q7_c', label: 'Algorithmic bias — the system discriminated against certain types of objects' },
        { id: 'm5q7_d', label: 'Normal human error — accidents happen, no bias involved' }
      ],
      correctAnswer: 'm5q7_a', topic: 'Automation Bias', difficulty: 'hard',
      feedback: 'Automation bias is the human tendency to excessively trust automated systems, abandoning critical thinking. The driver assumed the system was infallible. Review the OVA "Lab: Detect the Bias" and the topic "Algorithmic Biases and Fairness".'
    },
    {
      id: 'm5q8', question: 'You want to use AI for a project but are concerned about data privacy. According to the module, what is the most responsible strategy?',
      options: [
        { id: 'm5q8_a', label: 'Never use AI for anything related to data' },
        { id: 'm5q8_b', label: 'Use tools with enterprise data protection, anonymize sensitive information, and never share personal data in public chats' },
        { id: 'm5q8_c', label: 'Share the data on social media for the community to help' },
        { id: 'm5q8_d', label: 'Trust that AI automatically protects all data' }
      ],
      correctAnswer: 'm5q8_b', topic: 'Data Protection', difficulty: 'hard',
      feedback: 'Data protection is your responsibility. Use secure tools, anonymize, and never share sensitive information. Review "Protect Your Data in the AI Era".'
    },
    {
      id: 'm5q9', question: 'The European Union classifies AI systems by risk level (minimal, limited, high, unacceptable). A system that determines access to essential financial services (like approving a mortgage) falls into the "high risk" category. What obligation does this classification impose?',
      options: [
        { id: 'm5q9_a', label: 'Conformity assessments, technical documentation, transparency, and mandatory human oversight' },
        { id: 'm5q9_b', label: 'Total prohibition of AI use in financial services' },
        { id: 'm5q9_c', label: 'Voluntary registration without specific obligations' },
        { id: 'm5q9_d', label: 'Just paying an annual fee for using the system' }
      ],
      correctAnswer: 'm5q9_a', topic: 'Regulatory Framework', difficulty: 'hard',
      feedback: 'The EU AI Act is the first comprehensive AI regulatory framework. High-risk systems require conformity assessments, documentation, transparency, and human oversight. It is important to know the regulatory framework when developing AI solutions. Review the topic "Legal and Regulatory Framework of AI".'
    },
    {
      id: 'm5q10', question: 'A data science team trains a model to predict academic success. They discover the model assigns lower scores to students from certain geographic regions, even when controlling for grades and resources. What fairness metric should they prioritize to diagnose the problem?',
      options: [
        { id: 'm5q10_a', label: 'Demographic parity — check if the positive prediction rate is similar across geographic groups' },
        { id: 'm5q10_b', label: 'Overall model accuracy without breaking down by groups' },
        { id: 'm5q10_c', label: 'Model training speed' },
        { id: 'm5q10_d', label: 'Total amount of training data' }
      ],
      correctAnswer: 'm5q10_a', topic: 'Algorithmic Fairness', difficulty: 'hard',
      feedback: 'Demographic parity measures whether model predictions are equitable across groups. If the model predicts success less frequently for certain regions, there is a bias that must be investigated and corrected. Review the OVA "Lab: Detect the Bias".'
    },
    {
      id: 'm5q11', question: 'You are developing an educational app with AI that collects student performance data. Following the data minimization principle, what is the correct practice?',
      options: [
        { id: 'm5q11_a', label: 'Collect only the data strictly necessary for the educational functionality, with informed consent and a clear deletion policy' },
        { id: 'm5q11_b', label: 'Collect all possible data "just in case" it is needed later' },
        { id: 'm5q11_c', label: 'Automatically share the data with third parties without notifying users' },
        { id: 'm5q11_d', label: 'Store data indefinitely with no deletion plan' }
      ],
      correctAnswer: 'm5q11_a', topic: 'Privacy by Design', difficulty: 'medium',
      feedback: 'Data minimization is a fundamental privacy principle: only collect what is necessary, with consent, and have a clear deletion plan. Review the topic "Protect Your Data in the AI Era" and the PDF "Privacy Manual in AI".'
    },
    {
      id: 'm5q12', question: 'An AI team documents their model with a model card. According to best practices, what information MUST it include?',
      options: [
        { id: 'm5q12_a', label: 'Model purpose, training data, performance metrics by subgroup, known limitations, and ethical considerations' },
        { id: 'm5q12_b', label: 'Only the model name and version' },
        { id: 'm5q12_c', label: 'The full names of developers and their salaries' },
        { id: 'm5q12_d', label: 'The complete source code of the model' }
      ],
      correctAnswer: 'm5q12_a', topic: 'Ethical Documentation', difficulty: 'medium',
      feedback: 'Model cards are a transparency standard in AI. They include purpose, data, subgroup metrics, limitations, and ethical considerations. They allow users to understand the model capabilities and limitations before using it. Review the transparency topic in the module resources.'
    }
  ]
};
