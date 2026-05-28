export const CONTENT_TYPES = [
  { id: 'academico', label: 'Academic', icon: '📚', desc: 'Papers, theses, research articles' },
  { id: 'tecnico', label: 'Technical', icon: '⚙️', desc: 'Manuals, guides, technical documentation' },
  { id: 'creativo', label: 'Creative', icon: '🎨', desc: 'Design guides, marketing, content' },
  { id: 'mixto', label: 'Mixed', icon: '📦', desc: 'Combination of various types' }
];

export const GOALS = [
  { id: 'estudiar', label: 'Study', icon: '📖', desc: 'Review and understand key concepts' },
  { id: 'resumir', label: 'Summarize', icon: '📝', desc: 'Extract essentials from long documents' },
  { id: 'presentar', label: 'Present', icon: '🎤', desc: 'Prepare material for a presentation' },
  { id: 'explorar', label: 'Explore', icon: '🔍', desc: 'Initial research on a new topic' }
];

export const DOC_COUNTS = [
  { id: 'pocos', label: '1-2 docs', icon: '📄', desc: 'Few documents, very focused' },
  { id: 'medio', label: '3-5 docs', icon: '📚', desc: 'Ideal amount for good discussion' },
  { id: 'varios', label: '6-10 docs', icon: '📚📚', desc: 'Broad view of the topic' },
  { id: 'muchos', label: '10+ docs', icon: '📚📚📚', desc: 'Exhaustive research' }
];

export const SOURCE_TIPS = {
  academico: 'Use peer-reviewed papers, theses, and academic articles. Source quality defines analysis depth.',
  tecnico: 'Official manuals and technical documentation generate precise podcasts. Include practical examples.',
  creativo: 'Style guides, briefs, and success stories. AI captures creative tone well if sources are descriptive.',
  mixto: 'Group your sources by topic before uploading. NotebookLM cross-references information, so organization matters.'
};

export const GOAL_TIPS = {
  estudiar: 'Listen to the podcast first for general context, then read documents for depth. Audio gives you the mental map.',
  resumir: 'Select the most important sources. The Audio Overview will be a great conversational summary, but complement with written notes.',
  presentar: 'Generate the podcast for coherent narrative. Use it as inspiration to structure your presentation.',
  explorar: 'Upload 5-10 diverse sources. The host debate will give you perspectives you had not considered.'
};

export const DOC_TIPS = {
  pocos: 'With few documents, the podcast will be very focused. Ideal for reviewing specific concepts before an exam.',
  medio: 'Ideal amount. The hosts will have enough material for interesting in-depth discussion.',
  varios: 'Good variety of perspectives. The podcast will be broader but less deep on each topic.',
  muchos: 'The podcast will cover many ideas but each superficially. Better to divide into thematic groups and generate several podcasts.'
};

export const ESTIMATED_TIME = { pocos: '3-5 minutes', medio: '5-10 minutes', varios: '10-15 minutes', muchos: '10-15 minutes' };

export const IDEAL_SOURCES = { pocos: '2-3 sources', medio: '3-5 sources', varios: '6-8 sources', muchos: '6-8 sources' };

export const FORMATS = { academico: 'PDF, Google Docs', tecnico: 'PDF, TXT, URLs', creativo: 'PDF, Google Docs, URLs', mixto: 'PDF, Google Docs, TXT, URLs' };

export const CHECKLIST_ITEMS = [
  { id: 'select', label: 'I selected and organized my best sources' },
  { id: 'create', label: 'I created a new notebook in NotebookLM' },
  { id: 'upload', label: 'I uploaded all my sources to the notebook' },
  { id: 'generate', label: 'I started generating the Audio Overview' },
  { id: 'listen', label: 'I listened to the complete result' },
  { id: 'notes', label: 'I took notes on key points' }
];
