import { useSmartBoardKids } from "../../../context/SmartBoardKidsContext";
import OralExamSimulator from "../OralExamSimulator";

/**
 * AgeAdaptiveOralExam
 * Wraps OralExamSimulator with age-based styling context.
 * Age-group-specific CSS variables are applied via data-age-group attribute.
 * Handles simplified UI for younger users, more complex for older.
 */
const AgeAdaptiveOralExam = ({ onTabChange }) => {
  const { studentAge } = useSmartBoardKids();

  // Determine age group: elementary (5-8), middle (9-11), secondary (12+)
  const getAgeGroup = (age) => {
    if (!age) return "middle"; // default
    if (age <= 8) return "elementary";
    if (age <= 11) return "middle";
    return "secondary";
  };

  const ageGroup = getAgeGroup(studentAge);

  return (
    <div
      data-age-group={ageGroup}
      className="age-adaptive-wrapper oral-exam-adaptive"
    >
      <OralExamSimulator onTabChange={onTabChange} />
    </div>
  );
};

export default AgeAdaptiveOralExam;
