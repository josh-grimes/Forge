(function (root, factory) {
  const workoutState = factory();
  if (typeof module === "object" && module.exports) module.exports = workoutState;
  else root.ForgeWorkoutState = workoutState;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  function completedDates(workout) {
    if (Array.isArray(workout.completedDates)) {
      return workout.completedDates.filter((date) =>
        /^\d{4}-\d{2}-\d{2}$/.test(date),
      );
    }
    if (
      workout.completed === true &&
      /^\d{4}-\d{2}-\d{2}$/.test(workout.date)
    )
      return [workout.date];

    // Older records did not always store `completed`. Actual results are
    // reliable evidence of completion; a scheduled date by itself is not.
    if (
      /^\d{4}-\d{2}-\d{2}$/.test(workout.date) &&
      (workout.actualLogs?.[workout.date] ||
        workout.progressRecordsByDate?.[workout.date])
    )
      return [workout.date];
    return [];
  }

  function removeDateEntry(entries, date) {
    if (!entries || typeof entries !== "object" || Array.isArray(entries))
      return entries;
    const next = { ...entries };
    delete next[date];
    return next;
  }

  return { completedDates, removeDateEntry };
});
