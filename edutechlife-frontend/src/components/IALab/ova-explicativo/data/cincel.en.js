export default {
  badge: "Module 1 · Explanation",
  title: "The Chisel",
  subtitle:
    "What a prompt is, how it is built, and why AI answers better to a clear instruction",
  intro:
    "A prompt is the instruction you write for the AI. Like the artisan's chisel, it shapes the result: the more precise the stroke, the better the piece. Here you will learn the parts of a prompt and how the AI interprets what you write.",
  objectives: [
    "Define what a prompt is and what it is for",
    "Identify its parts: role, task, format, context and constraints",
    "Explain what a token and the context window are",
    "Fix a vague prompt step by step",
  ],
  sections: [
    {
      title: "1. What a prompt is",
      explain: [
        "A prompt is everything you write to ask the AI for something: a question, an instruction, an example text, or a mix of these.",
        "The AI does not read your intention: it reads your words. What you do not write, it does not know. That is why a good prompt states what you want clearly.",
      ],
      terms: [
        {
          term: "Prompt",
          def: "The instruction or question you write to get an answer from the AI.",
        },
        {
          term: "Response",
          def: "What the AI generates from your prompt; it can vary even if you repeat the question.",
        },
      ],
      how: [
        "You write your request.",
        "The AI interprets it using the words you used.",
        "It generates a response. If it does not serve you, you adjust the prompt and repeat.",
      ],
      example:
        "«Write something about water» gives a general answer. «Explain to 10-year-olds why water evaporates, in five sentences» gives a useful one.",
      mistake:
        "Thinking the AI knows the context in your head. If you do not write it, it does not exist for the AI.",
    },
    {
      title: "2. The five parts of a prompt",
      explain: [
        "A complete prompt usually has five parts. Not all are mandatory, but the more you include, the less the AI has to guess.",
        "Role: the part it plays. Task: the concrete action. Format: how the answer should look. Context: for whom and why. Constraints: what it must not do.",
      ],
      terms: [
        {
          term: "Role",
          def: "The part the AI plays, for example «primary school teacher» or «editor».",
        },
        {
          term: "Task",
          def: "The concrete action to carry out: summarize, compare, draft, explain.",
        },
        {
          term: "Format",
          def: "The shape of the answer: list, table, three paragraphs, maximum length.",
        },
        {
          term: "Context",
          def: "Information about the situation: audience, purpose, data it may use.",
        },
        {
          term: "Constraint",
          def: "A limit: what it must not include or do.",
        },
      ],
      how: [
        "Start with the task: what you want it to do.",
        "Add the context: who it is for.",
        "Define the format and the constraints.",
        "If you want a tone or a point of view, add the role.",
      ],
      example:
        "«Act as a school editor. Summarize this text for parents in three paragraphs, with no jargon and no student names.» It has role, task, context, format and a constraint.",
      mistake:
        "Writing only the task, with no context or format, and then complaining that the answer is generic.",
    },
    {
      title: "3. How the AI reads your prompt",
      explain: [
        "The AI processes text in tokens, fragments of words. It works with a limited amount of text at a time: the context window. What falls outside it can be lost.",
        "Many tools also have some randomness: the same question can get different answers. So review and compare, rather than trusting a single answer.",
      ],
      terms: [
        {
          term: "Token",
          def: "A text fragment the AI processes; one word can be one or several tokens.",
        },
        {
          term: "Context window",
          def: "The amount of text the AI can consider at once.",
        },
        {
          term: "Randomness",
          def: "The natural variation in answers even when the prompt is the same.",
        },
      ],
      how: [
        "Put the most important thing at the start of the prompt.",
        "In long conversations, restate the key instructions.",
        "Compare two answers before you decide.",
      ],
      example:
        "If you paste ten pages and then ask «use only section 2», the AI may not recall section 2 well. Ask for the section by its title.",
      mistake:
        "Believing the answer is always the same. It changes with each attempt and with the length of the text.",
    },
    {
      title: "4. Fixing a vague prompt",
      explain: [
        "A vague prompt leaves too much to guessing. Fixing it means adding what is missing: a clear task, the audience, the format and a limit.",
        "This method works for any request: ask yourself what is missing and add it.",
      ],
      terms: [
        {
          term: "Vague prompt",
          def: "An instruction with no clear task, no context or no format.",
        },
        {
          term: "Iterate",
          def: "To improve the prompt step by step based on what the answer returns.",
        },
      ],
      how: [
        "Read the answer and say what is missing.",
        "Add the missing part to the prompt.",
        "Repeat until the answer serves your purpose.",
      ],
      example:
        "«Make me a plan» → «Make a four-week study plan for algebra, two hours a day, as a weekly table».",
      mistake:
        "Giving many orders in one message: the AI may do only part of them. Ask for one thing at a time, or number the tasks.",
    },
  ],
  summary: [
    "A prompt is the instruction you write; the AI only knows what you write.",
    "A complete prompt has a task, a role, a format, a context and constraints.",
    "The AI works with tokens and a limited context window; put what matters clearly and first.",
    "The answer can vary: compare and review before using it.",
    "To fix a vague prompt, add what is missing and repeat.",
  ],
  check: [
    {
      q: "What are the five parts of a complete prompt?",
      options: [
        "Role, task, format, context and constraints.",
        "Title, date, author, price and email.",
        "Start, middle, end, signature and page number.",
      ],
      correct: 0,
      feedback:
        "Role, task, format, context and constraints are the pieces that make the answer precise.",
    },
    {
      q: "What is the context window?",
      options: [
        "The screen where the answer is shown.",
        "The amount of text the AI can consider at once.",
        "The time the AI takes to answer.",
      ],
      correct: 1,
      feedback:
        "The context window is the limit of text the AI processes at once; what falls outside can be lost.",
    },
    {
      q: "Your prompt only says «make a summary». How do you improve it?",
      options: [
        "Leave it as is, the AI knows what to do.",
        "Add who it is for, the length and the format you need.",
        "Repeat it three times in a row.",
      ],
      correct: 1,
      feedback:
        "Adding audience, length and format gives the AI what it needs to get it right.",
    },
  ],
};
