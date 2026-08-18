import { useSmartBoardKids } from "../../../context/SmartBoardKidsContext";
import SmartBoardAnalytics from "../SmartBoardAnalytics";

/**
 * AgeAdaptiveAnalytics
 * Wraps SmartBoardAnalytics with age-based styling context.
 * Age-group-specific CSS variables are applied via data-age-group attribute.
 * Adjusts data visualization complexity per age group.
 */
const AgeAdaptiveAnalytics = () => {
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
      className="age-adaptive-wrapper analytics-adaptive"
    >
      <SmartBoardAnalytics />
    </div>
  );
};

export default AgeAdaptiveAnalytics;
