export const CRITERIA_KEYWORDS = [
  "automatiz",
  "impacto",
  "viabilidad",
  "eficiencia",
  "ahorro",
  "tiempo",
  "repetitiv",
  "escalab",
  "productiv",
  "costo",
  "cost",
  "automation",
  "impact",
  "feasib",
  "efficien",
  "saving",
  "time",
  "repetitive",
  "scalab",
  "viabilidade",
  "eficiência",
  "economia",
];

export const PREDICTIVE_KEYWORDS = [
  "predict",
  "predic",
  "tendenc",
  "proyec",
  "forecast",
  "estim",
  "demanda",
  "churn",
  "futuro",
  "anticip",
  "trend",
  "demand",
  "previs",
  "futur",
];

export const hasAny = (text, keywords) => {
  const normalized = String(text || "").toLowerCase();
  return keywords.some((k) => normalized.includes(k));
};

export const buildStep1Requirements = ({ selectedCase, taskDescription, t }) => {
  const text = String(taskDescription || "");
  return [
    {
      id: "case",
      label: t("ialab.challenge.m2.step1_req_case"),
      met: Boolean(selectedCase),
    },
    {
      id: "justify",
      label: t("ialab.challenge.m2.step1_req_justify"),
      met: text.trim().length >= 20,
    },
    {
      id: "criteria",
      label: t("ialab.challenge.m2.step1_req_criteria"),
      met: hasAny(text, CRITERIA_KEYWORDS),
    },
    {
      id: "predictive",
      label: t("ialab.challenge.m2.step1_req_predictive"),
      met: hasAny(text, PREDICTIVE_KEYWORDS),
    },
  ];
};

export const buildStep2Requirements = ({
  gptRole,
  tone,
  rules,
  knowledge,
  capabilities,
  t,
}) => [
  {
    id: "role",
    label: t("ialab.challenge.m2.step2_req_role"),
    met: String(gptRole || "").trim().length >= 3,
  },
  {
    id: "tone",
    label: t("ialab.challenge.m2.step2_req_tone"),
    met: Boolean(tone),
  },
  {
    id: "rules",
    label: t("ialab.challenge.m2.step2_req_rules"),
    met: String(rules || "").trim().length >= 10,
  },
  {
    id: "knowledge",
    label: t("ialab.challenge.m2.step2_req_knowledge"),
    met: Array.isArray(knowledge) && knowledge.length > 0,
  },
  {
    id: "capabilities",
    label: t("ialab.challenge.m2.step2_req_capabilities"),
    met: Array.isArray(capabilities) && capabilities.length > 0,
  },
];

export const buildStep3Requirements = ({
  functionName,
  selectedFields,
  returnValue,
  t,
}) => [
  {
    id: "name",
    label: t("ialab.challenge.m2.step3_req_name"),
    met: String(functionName || "").trim().length >= 3,
  },
  {
    id: "data",
    label: t("ialab.challenge.m2.step3_req_data"),
    met: Array.isArray(selectedFields) && selectedFields.length > 0,
  },
  {
    id: "return",
    label: t("ialab.challenge.m2.step3_req_return"),
    met: String(returnValue || "").trim().length >= 10,
  },
];
