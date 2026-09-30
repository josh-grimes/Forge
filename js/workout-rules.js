(function (root, factory) {
  const workoutRules = factory();
  if (typeof module === "object" && module.exports) module.exports = workoutRules;
  else root.ForgeWorkoutRules = workoutRules;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  function dateString(year, month, day) {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }

  function scheduledDates(workout) {
    return Array.isArray(workout.scheduledDates)
      ? workout.scheduledDates
      : [workout.date];
  }

  function matchesWeeklyRule(workout, date) {
    const rule = workout.recurrence;
    if (
      !rule ||
      !Array.isArray(rule.weekdays) ||
      !/^\d{4}-\d{2}-\d{2}$/.test(date)
    )
      return false;
    if (date < rule.startDate || (rule.endDate && date > rule.endDate))
      return false;
    return rule.weekdays.includes(new Date(`${date}T12:00:00`).getDay());
  }

  function scheduledOn(workout, date) {
    return (
      scheduledDates(workout).includes(date) ||
      (matchesWeeklyRule(workout, date) &&
        !(workout.recurrence.exceptions ?? []).includes(date))
    );
  }

  return { dateString, scheduledDates, matchesWeeklyRule, scheduledOn };
});
