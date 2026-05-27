const DAY_LABELS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'] as const;

export interface WeekDay {
  filled: boolean;
  isToday: boolean;
  label: string;
}

export function getWeekDays(streak: number): WeekDay[] & { labels: readonly string[] } {
  const today = new Date().getDay();
  const days = Array.from({ length: 7 }, (_, i) => {
    const orderFromToday = (i - today + 7) % 7;
    const filled = streak > orderFromToday;
    return { filled, isToday: i === today, label: DAY_LABELS[i] };
  }) as WeekDay[] & { labels: readonly string[] };
  days.labels = DAY_LABELS;
  return days;
}
