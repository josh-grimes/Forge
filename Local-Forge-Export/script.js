"use strict";
const $ = (id) => document.getElementById(id);
const form = $("exercise-form");
const exerciseList = $("exercise-list");
const workoutNameInput = $("workout-name");
const workoutDateInput = $("workout-date");
const startButton = $("start-workout");
const saveButton = $("save-workout");
const statusBadge = $("workout-status");
const exerciseCount = $("exercise-count");
const historyList = $("workout-history");
const workoutCount = $("workout-count");
const trackingCard = $("tracking-card");
const trackingList = $("tracking-list");
const newWorkoutCard = $("new-workout-card");
const calendarCard = document.querySelector(".calendar-card");
const historyCard = document.querySelector(".history-card");
const restCard = $("rest-card");
const calendarGrid = $("calendar-grid");
const calendarMonth = $("calendar-month");
const nameInput = $("exercise-name");
const setsInput = $("sets");
const repsInput = $("reps");
const weightInput = $("weight");
const durationInput = $("duration");
const submitButton = $("submit");
const cancelButton = $("cancel-edit");
const toast = $("toast");
const STORAGE_KEY = "forge-workouts";
const REST_KEY = "forge-rest-days";
const REST_DRAG_ID = "__forge_rest_day__";

let exercises = [];
let sections = [{ id: "main", name: "Main Workout" }];
let editingIndex = null;
let workoutState = "not-started";
let savedWorkouts = [];
let toastTimer;
let session = null;
let finishedActuals = null;
let finishedElapsedSeconds = null;
let timerInterval = null;
let stopwatchInterval = null;
let stopwatchAccumulatedMs = 0;
let stopwatchStartedAt = null;
let editingWorkoutId = null;
let editorOpen = false;
let calendarOpen = false;
let progressOpen = false;
let weightOpen = false;
let savedView = "detailed";
let restDays = [];
let visibleMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

function todayLocal() {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}
workoutDateInput.value = todayLocal();
renderSections();
setAdvancedSchedule(null, workoutDateInput.value);

function notify(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function emptyState(title, description) {
  const box = element("div", "empty-state");
  box.append(element("strong", "", title), element("span", "", description));
  return box;
}

function exerciseSummary(exercise) {
  const parts = [`${exercise.sets} sets`];
  if (exercise.reps !== "") parts.push(`${exercise.reps} reps`);
  if (exercise.weight !== "") parts.push(`${exercise.weight} lbs`);
  if (exercise.duration !== "") parts.push(`${exercise.duration} ${exercise.durationUnit === "sec" ? "sec" : "min"}`);
  return parts;
}

function normalizeSections(source) {
  const valid = Array.isArray(source) ? source.filter((section) =>
    section && typeof section.id === "string" && typeof section.name === "string" && section.name.trim()) : [];
  const seen = new Set();
  const ordered = valid.filter((section) => {
    if (seen.has(section.id)) return false;
    seen.add(section.id); return true;
  }).map((section) => ({ id: section.id, name: section.name.trim() }));
  if (!seen.has("main")) ordered.unshift({ id: "main", name: "Main Workout" });
  return ordered;
}

function sectionGroups(exerciseList, sectionDefs) {
  const list = normalizeSections(sectionDefs);
  return list.map((section) => ({
    ...section,
    entries: exerciseList.flatMap((exercise, index) =>
      (exercise.sectionId ?? "main") === section.id || section.id === "main" &&
        !list.some((candidate) => candidate.id === exercise.sectionId)
        ? [{ exercise, index }] : []),
  })).filter((group) => group.entries.length);
}

function moveSection(sourceId, destinationId) {
  const from = sections.findIndex((section) => section.id === sourceId);
  const to = sections.findIndex((section) => section.id === destinationId);
  if (from < 0 || to < 0 || from === to) return;
  const [moved] = sections.splice(from, 1);
  sections.splice(to, 0, moved);
  renderSections(); renderExercises();
}

function renderSections() {
  const list = $("section-list");
  const sectionSelect = $("exercise-section");
  const selected = sectionSelect.value;
  list.replaceChildren(); sectionSelect.replaceChildren();
  for (const section of sections) {
    const row = element("div", "section-editor-row");
    row.dataset.sectionId = section.id;
    const handle = element("button", "action-button section-drag", "☰");
    handle.type = "button"; handle.draggable = true;
    handle.setAttribute("aria-label", `Drag to reorder ${section.name}. Use arrow keys to move it.`);
    handle.addEventListener("dragstart", (event) => {
      event.dataTransfer.setData("application/x-forge-section", section.id);
      event.dataTransfer.effectAllowed = "move";
      row.classList.add("dragging");
    });
    handle.addEventListener("dragend", () => {
      row.classList.remove("dragging");
      list.querySelectorAll(".reorder-target").forEach((target) => target.classList.remove("reorder-target"));
    });
    handle.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;
      event.preventDefault();
      const index = sections.findIndex((item) => item.id === section.id);
      const target = sections[index + (event.key === "ArrowUp" ? -1 : 1)];
      if (!target) return;
      moveSection(section.id, target.id);
      [...list.querySelectorAll(".section-editor-row")].find((item) => item.dataset.sectionId === section.id)
        ?.querySelector(".section-drag")?.focus();
    });
    row.addEventListener("dragover", (event) => {
      if (!event.dataTransfer.types.includes("application/x-forge-section")) return;
      event.preventDefault(); event.dataTransfer.dropEffect = "move";
      row.classList.add("reorder-target");
    });
    row.addEventListener("dragleave", () => row.classList.remove("reorder-target"));
    row.addEventListener("drop", (event) => {
      const sourceId = event.dataTransfer.getData("application/x-forge-section");
      if (!sourceId) return;
      event.preventDefault(); event.stopPropagation();
      row.classList.remove("reorder-target");
      moveSection(sourceId, section.id);
    });
    row.append(handle);
    const label = element("label", "", "Section name");
    const input = element("input"); input.type = "text"; input.maxLength = 60; input.value = section.name;
    input.addEventListener("change", () => {
      const value = input.value.trim();
      if (!value) { input.value = section.name; notify("Section names cannot be empty."); return; }
      section.name = value; renderSections(); renderExercises();
    });
    label.append(input); row.append(label);
    if (section.id !== "main") {
      const remove = element("button", "action-button delete", "Remove"); remove.type = "button";
      remove.setAttribute("aria-label", `Remove ${section.name} section`);
      remove.addEventListener("click", () => {
        exercises.forEach((exercise) => { if (exercise.sectionId === section.id) exercise.sectionId = "main"; });
        sections = sections.filter((item) => item.id !== section.id);
        renderSections(); renderExercises();
        notify(`${section.name} removed; its exercises moved to ${sections.find((item) => item.id === "main").name}.`);
      });
      row.append(remove);
    }
    list.append(row);
    const option = element("option", "", section.name); option.value = section.id; sectionSelect.append(option);
  }
  if (sections.some((section) => section.id === selected)) sectionSelect.value = selected;
}
$("add-section").addEventListener("click", () => {
  const input = $("new-section-name");
  const name = input.value.trim();
  if (!name) { input.focus(); notify("Enter a section name."); return; }
  if (sections.some((section) => section.name.toLocaleLowerCase() === name.toLocaleLowerCase())) {
    notify("That section name is already in use."); return;
  }
  const id = typeof crypto.randomUUID === "function" ? crypto.randomUUID() : `section-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  sections.push({ id, name }); input.value = "";
  renderSections(); $("exercise-section").value = id;
  notify(`${name} section added.`);
});

function setAdvancedSchedule(recurrence, date) {
  const enabled = Boolean(recurrence?.weekdays?.length);
  $("repeat-enabled").checked = enabled;
  $("repeat-options").hidden = !enabled;
  $("advanced-schedule").open = enabled;
  $("repeat-start").value = recurrence?.startDate ?? date;
  $("repeat-end").value = recurrence?.endDate ?? "";
  const weekday = new Date(`${date}T12:00:00`).getDay();
  $("new-repeat-days").querySelectorAll("input").forEach((input) => {
    input.checked = enabled ? recurrence.weekdays.includes(Number(input.value)) : Number(input.value) === weekday;
  });
}
$("repeat-enabled").addEventListener("change", () => {
  $("repeat-options").hidden = !$("repeat-enabled").checked;
});
workoutDateInput.addEventListener("change", () => {
  if (!$("repeat-enabled").checked) setAdvancedSchedule(null, workoutDateInput.value);
});

function readAdvancedSchedule(original = null) {
  if (!$("repeat-enabled").checked) return null;
  const weekdays = [...$("new-repeat-days").querySelectorAll("input:checked")].map((input) => Number(input.value));
  const startDate = $("repeat-start").value;
  const endDate = $("repeat-end").value;
  if (!weekdays.length || !startDate || endDate && endDate < startDate) {
    $("advanced-schedule").open = true;
    notify("Choose at least one weekday and a valid date range.");
    return false;
  }
  return { weekdays, startDate, endDate, exceptions: original?.recurrence?.exceptions ?? [] };
}

function renderExercises() {
  exerciseList.replaceChildren();
  exerciseCount.textContent = `${exercises.length} ${exercises.length === 1 ? "exercise" : "exercises"}`;
  if (!exercises.length) {
    exerciseList.append(
      emptyState("No exercises yet", "Add your first exercise below."),
    );
    return;
  }
  for (const group of sectionGroups(exercises, sections)) {
    exerciseList.append(element("div", "section-heading-row", group.name));
    for (const { exercise, index } of group.entries) {
    const item = element("div", "exercise-item");
    const main = element("div", "exercise-main");
    main.append(element("h3", "", exercise.name));
    const details = element("div", "exercise-details");
    exerciseSummary(exercise).forEach((text) =>
      details.append(element("span", "detail", text)),
    );
    main.append(details);
    const actions = element("div", "exercise-actions");
    const edit = element("button", "action-button", "Edit");
    edit.type = "button";
    edit.addEventListener("click", () => editExercise(index));
    const remove = element("button", "action-button delete", "Delete");
    remove.type = "button";
    remove.addEventListener("click", () => deleteExercise(index));
    actions.append(edit, remove);
    item.append(main, actions);
    exerciseList.append(item);
    }
  }
}

function resetExerciseForm() {
  const selectedSection = $("exercise-section").value;
  form.reset();
  $("exercise-section").value = selectedSection;
  editingIndex = null;
  $("form-title").textContent = "Add Exercise";
  submitButton.textContent = "+ Add Exercise";
  cancelButton.hidden = true;
}

function editExercise(index) {
  const exercise = exercises[index];
  if (!exercise) return;
  editingIndex = index;
  nameInput.value = exercise.name;
  setsInput.value = exercise.sets;
  repsInput.value = exercise.reps;
  weightInput.value = exercise.weight;
  durationInput.value = exercise.duration;
  $("exercise-section").value = exercise.sectionId ?? "main";
  $("form-title").textContent = "Edit Exercise";
  submitButton.textContent = "Save Changes";
  cancelButton.hidden = false;
  form.scrollIntoView({ behavior: "smooth", block: "center" });
  nameInput.focus();
}

function deleteExercise(index) {
  const exercise = exercises[index];
  if (!exercise || !confirm(`Delete ${exercise.name}?`)) return;
  exercises.splice(index, 1);
  if (editingIndex === index) resetExerciseForm();
  else if (editingIndex !== null && index < editingIndex) editingIndex--;
  // Changing a finished workout requires finishing it again before saving.
  if (workoutState === "finished") setWorkoutState("not-started");
  renderExercises();
  notify(`${exercise.name} deleted`);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const exercise = {
    name: nameInput.value.trim(),
    sets: setsInput.value,
    reps: repsInput.value,
    weight: weightInput.value,
    duration: durationInput.value,
    durationUnit: "sec",
    sectionId: $("exercise-section").value || "main",
  };
  if (!exercise.name || !form.reportValidity()) return;
  if (editingIndex === null) exercises.push(exercise);
  else exercises[editingIndex] = exercise;
  if (workoutState === "finished") setWorkoutState("not-started");
  notify(`${exercise.name} ${editingIndex === null ? "added" : "updated"}`);
  resetExerciseForm();
  renderExercises();
  nameInput.focus();
});
cancelButton.addEventListener("click", () => {
  resetExerciseForm();
  nameInput.focus();
});

function setWorkoutState(state) {
  workoutState = state;
  startButton.textContent =
    state === "active" ? (session?.mode === "manual" ? "Save Results" : "Finish Workout") : "Start Workout";
  $("tracking-finish").textContent = startButton.textContent;
  statusBadge.textContent =
    state === "active"
      ? "In Progress"
      : state === "finished"
        ? "Completed"
        : "Not Started";
  statusBadge.classList.toggle("active", state === "active");
  saveButton.disabled = state === "active";
  saveButton.hidden = state === "active" || !editorOpen;
  $("add-new-workout").hidden = false;
  $("add-new-workout").disabled = state === "active";
  $("open-calendar").hidden = false;
  $("open-calendar").disabled = state === "active";
  $("open-progress").hidden = false;
  $("open-progress").disabled = state === "active";
  $("open-profile").hidden = false;
  $("open-profile").disabled = state === "active";
  $("back-dashboard").hidden = state === "active" || (!editorOpen && !calendarOpen && !progressOpen && !profileOpen && !weightOpen);
  $("export-forge").hidden = false;
  $("export-forge").disabled = state === "active";
  document.body.classList.toggle("editor-open", editorOpen && state !== "active");
  document.body.classList.toggle("calendar-mode", calendarOpen && state !== "active");
  document.body.classList.toggle("progress-mode", progressOpen && state !== "active");
  document.body.classList.toggle("workouts-compact", !editorOpen && savedView === "compact" && state !== "active");
  $("saved-view-toggle").hidden = editorOpen || progressOpen || profileOpen || weightOpen || state === "active";
  document.body.classList.toggle("dashboard-mode", !editorOpen && !calendarOpen && !progressOpen && !profileOpen && !weightOpen && state !== "active");
  saveButton.textContent = editingWorkoutId ? "Save Changes" : "Save Workout";
  $("cancel-workout-edit").hidden = state === "active" || !editingWorkoutId;
  $("timer-label").textContent = session?.mode === "manual" ? "Workout time" : "Elapsed";
  $("timer-edit").hidden = state !== "active" || session?.mode !== "manual";
  document.querySelector(".stopwatch").hidden = state !== "active" || session?.mode === "manual";
  newWorkoutCard.hidden = state === "active" || !editorOpen;
  calendarCard.hidden = state === "active" || editorOpen || progressOpen || profileOpen || weightOpen;
  $("progress-card").hidden = state === "active" || !progressOpen;
  $("profile-card").hidden = state === "active" || !profileOpen;
  $("weight-card").hidden = state === "active" || !weightOpen;
  $("open-weight").hidden = false;
  $("open-weight").disabled = state === "active";
  historyCard.hidden = state === "active" || editorOpen || progressOpen || profileOpen || weightOpen;
  restCard.hidden = state === "active" || editorOpen || calendarOpen || progressOpen || profileOpen || weightOpen;
  $("today-card").hidden = state === "active" || editorOpen || calendarOpen || progressOpen || profileOpen || weightOpen;
  workoutNameInput.disabled = state === "active" || state === "finished";
  workoutDateInput.disabled = state === "active" || state === "finished";
  startButton.disabled = state === "finished" || (Boolean(editingWorkoutId) && state !== "active");
  form.querySelectorAll("input, button").forEach((control) => {
    control.disabled = state === "active";
  });
}

function formatElapsed(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remaining = seconds % 60;
  return [hours, minutes, remaining].map((value) => String(value).padStart(2, "0")).join(":");
}

function formatMinutesSeconds(seconds) {
  return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}

function parseMinutesSeconds(value) {
  const match = /^(\d+):([0-5]\d)$/.exec(value);
  return match ? Number(match[1]) * 60 + Number(match[2]) : null;
}

function startTimer() {
  clearInterval(timerInterval);
  session.elapsedOffsetSeconds ??= 0;
  session.startedAt = Date.now();
  $("elapsed-time").textContent = formatElapsed(session.elapsedOffsetSeconds);
  timerInterval = setInterval(() => {
    $("elapsed-time").textContent = formatElapsed(currentElapsed());
  }, 1000);
}

function currentElapsed() {
  return (session.elapsedOffsetSeconds ?? 0) + (session.mode === "manual" ? 0 : Math.floor((Date.now() - session.startedAt) / 1000));
}

function stopTimer() {
  const elapsed = currentElapsed();
  clearInterval(timerInterval);
  timerInterval = null;
  return elapsed;
}

function applyElapsedTime() {
  if (workoutState !== "active" || session?.mode !== "manual") return;
  const input = $("edit-elapsed");
  if (!input.value || !input.reportValidity()) {
    input.focus();
    return;
  }
  session.elapsedOffsetSeconds = parseMinutesSeconds(input.value);
  session.timeEdited = true;
  $("elapsed-time").textContent = formatElapsed(session.elapsedOffsetSeconds);
  input.value = "";
  notify("Workout time updated");
}
$("apply-elapsed").addEventListener("click", applyElapsedTime);
$("edit-elapsed").addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    applyElapsedTime();
  }
});

function stopwatchMilliseconds() {
  return stopwatchAccumulatedMs + (stopwatchStartedAt === null ? 0 : Date.now() - stopwatchStartedAt);
}

function renderStopwatch() {
  const milliseconds = stopwatchMilliseconds();
  $("stopwatch-time").textContent = `${formatElapsed(Math.floor(milliseconds / 1000))}.${String(milliseconds % 1000).padStart(3, "0")}`;
  $("stopwatch-start").disabled = stopwatchStartedAt !== null;
  $("stopwatch-stop").disabled = stopwatchStartedAt === null;
}

function resetStopwatch() {
  clearInterval(stopwatchInterval);
  stopwatchInterval = null;
  stopwatchStartedAt = null;
  stopwatchAccumulatedMs = 0;
  renderStopwatch();
}

$("stopwatch-start").addEventListener("click", () => {
  if (stopwatchStartedAt !== null) return;
  stopwatchStartedAt = Date.now();
  stopwatchInterval = setInterval(renderStopwatch, 30);
  renderStopwatch();
});
$("stopwatch-stop").addEventListener("click", () => {
  if (stopwatchStartedAt === null) return;
  stopwatchAccumulatedMs = stopwatchMilliseconds();
  stopwatchStartedAt = null;
  clearInterval(stopwatchInterval);
  stopwatchInterval = null;
  renderStopwatch();
});
$("stopwatch-reset").addEventListener("click", resetStopwatch);

function exerciseRecords(name, beforeDate = null) {
  const key = name.trim().toLocaleLowerCase();
  const records = [];
  for (const workout of savedWorkouts) {
    for (const [date, entries] of Object.entries(workout.actualLogs ?? {})) {
      if (beforeDate && date >= beforeDate || !Array.isArray(entries)) continue;
      entries.forEach((entry, index) => {
        const loggedExercise = workout.loggedExercisesByDate?.[date]?.[index] ?? workout.exercises?.[index];
        if (loggedExercise?.name?.trim().toLocaleLowerCase() === key && entry) {
          records.push({ date, entry, workoutName: workout.name || "Workout" });
        }
      });
    }
  }
  return records.sort((a, b) => a.date.localeCompare(b.date));
}

function previousSetText(entry, setIndex) {
  const detail = entry.setsDetail?.[setIndex] ?? {
    reps: entry.repsBySet?.[setIndex] ?? entry.reps,
    weight: entry.weight,
    duration: entry.duration,
  };
  const parts = [];
  if (detail?.reps !== undefined && detail.reps !== null && detail.reps !== "") parts.push(`${detail.reps} reps`);
  if (detail?.weight !== undefined && detail.weight !== null && detail.weight !== "") parts.push(`${detail.weight} lbs`);
  if (detail?.duration !== undefined && detail.duration !== null && detail.duration !== "") parts.push(`${detail.duration} sec`);
  return parts.join(" · ") || "no values recorded";
}

function entryMetrics(entry) {
  const sets = Array.isArray(entry.setsDetail) ? entry.setsDetail :
    Array.from({ length: Math.min(100, Number(entry.sets) || 1) }, (_, index) => ({
      reps: entry.repsBySet?.[index] ?? entry.reps, weight: entry.weight,
    }));
  let weight = null, reps = null, volume = null;
  for (const set of sets) {
    const hasWeight = set?.weight !== undefined && set.weight !== null && set.weight !== "";
    const hasReps = set?.reps !== undefined && set.reps !== null && set.reps !== "";
    const w = Number(set?.weight), r = Number(set?.reps);
    if (hasWeight && Number.isFinite(w)) weight = Math.max(weight ?? w, w);
    if (hasReps && Number.isFinite(r)) reps = Math.max(reps ?? r, r);
    if (hasWeight && hasReps && Number.isFinite(w * r)) volume = (volume ?? 0) + w * r;
  }
  return { weight, reps, volume };
}

function personalRecordsForEntry(name, date, entry) {
  if (!name || !entry) return [];
  const current = entryMetrics(entry);
  const earlier = exerciseRecords(name, date).map((record) => entryMetrics(record.entry));
  const labels = [];
  for (const [key, label] of [["weight", "Weight PR"], ["reps", "Rep PR"]]) {
    if (current[key] === null) continue;
    const prior = earlier.map((record) => record[key]).filter((value) => value !== null);
    if (!prior.length || current[key] > Math.max(...prior)) labels.push(label);
  }
  return labels;
}

function progressPoints(name, metric) {
  const days = new Map();
  for (const { date, entry } of exerciseRecords(name)) {
    const value = entryMetrics(entry)[metric];
    if (value === null) continue;
    const previous = days.get(date);
    days.set(date, metric === "volume" ? (previous ?? 0) + value : Math.max(previous ?? value, value));
  }
  return [...days].sort(([a], [b]) => a.localeCompare(b)).map(([date, value]) => ({ date, value }));
}

function attachGraphPointLabel(svg, dot, label) {
  const ns = "http://www.w3.org/2000/svg";
  dot.setAttribute("tabindex", "0");
  dot.setAttribute("aria-label", label);
  dot.setAttribute("stroke", "transparent");
  dot.setAttribute("stroke-width", "16");
  dot.style.cursor = "pointer";
  const tooltip = document.createElementNS(ns, "g");
  tooltip.setAttribute("pointer-events", "none");
  tooltip.setAttribute("aria-hidden", "true");
  const box = document.createElementNS(ns, "rect");
  box.setAttribute("fill", "#18181b"); box.setAttribute("stroke", "#f97316");
  box.setAttribute("rx", "6"); box.setAttribute("height", "30");
  const text = document.createElementNS(ns, "text");
  text.setAttribute("fill", "#ffffff"); text.setAttribute("font-size", "13");
  text.setAttribute("y", "20"); text.setAttribute("x", "10"); text.textContent = label;
  tooltip.append(box, text);
  const show = () => {
    svg.querySelectorAll(".graph-point-tooltip").forEach(node => node.remove());
    tooltip.setAttribute("class", "graph-point-tooltip"); svg.append(tooltip);
    const width = text.getComputedTextLength() + 20;
    box.setAttribute("width", width);
    const x = Math.max(5, Math.min(Number(dot.getAttribute("cx")) - width / 2, svg.viewBox.baseVal.width - width - 5));
    const pointY = Number(dot.getAttribute("cy"));
    tooltip.setAttribute("transform", `translate(${x},${pointY < 45 ? pointY + 14 : pointY - 42})`);
  };
  dot.addEventListener("pointerenter", show);
  dot.addEventListener("pointerleave", () => tooltip.remove());
  dot.addEventListener("focus", show);
  dot.addEventListener("blur", () => tooltip.remove());
  dot.addEventListener("click", show);
  dot.addEventListener("keydown", event => { if (event.key === "Escape") tooltip.remove(); });
}

function graphWidth() { return Math.max(240, Math.min(760, window.innerWidth - 72)); }
function renderProgress() {
  const exerciseSelect = $("progress-exercise");
  const names = [...new Set(savedWorkouts.flatMap((workout) =>
    Object.entries(workout.actualLogs ?? {}).flatMap(([date, entries]) =>
      Array.isArray(entries) ? entries.map((_, index) =>
        workout.loggedExercisesByDate?.[date]?.[index]?.name ?? workout.exercises?.[index]?.name).filter(Boolean) : []
    )))].sort((a, b) => a.localeCompare(b));
  const selected = exerciseSelect.value;
  exerciseSelect.replaceChildren();
  names.forEach((name) => { const option = element("option", "", name); option.value = name; exerciseSelect.append(option); });
  if (names.includes(selected)) exerciseSelect.value = selected;
  renderExerciseHistory(exerciseSelect.value);
  const chart = $("progress-chart"), table = $("progress-table");
  chart.replaceChildren(); table.replaceChildren();
  if (!names.length) { chart.append(emptyState("No results yet", "Complete a workout and record its sets to see progress.")); return; }
  const metric = $("progress-metric").value;
  const points = progressPoints(exerciseSelect.value, metric);
  if (!points.length) { chart.append(emptyState("No values for this measure", "Choose another measure or record weight and reps for this exercise.")); return; }
  const ns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(ns, "svg");
  const chartWidth = graphWidth();
  svg.setAttribute("viewBox", `0 0 ${chartWidth} 300`);
  svg.setAttribute("role", "group");
  svg.setAttribute("aria-label", "Exercise progress points");
  const draw = (tag, attributes, label) => {
    const node = document.createElementNS(ns, tag);
    for (const [key, value] of Object.entries(attributes)) node.setAttribute(key, String(value));
    if (label !== undefined) node.textContent = label;
    svg.append(node);
    return node;
  };
  const left = 55, right = chartWidth - 16, top = 25, bottom = 255;
  const ceiling = Math.max(1, ...points.map((point) => point.value)) * 1.15;
  const fmt = (value) => Number(value.toFixed(1)).toLocaleString();
  for (let tick = 0; tick <= 4; tick++) {
    const y = bottom - (bottom - top) * tick / 4;
    draw("line", { x1: left, y1: y, x2: right, y2: y, stroke: "#4b4d52" });
    draw("text", { x: 46, y: y + 4, fill: "#b8b8b8", "text-anchor": "end", "font-size": 12 }, fmt(ceiling * tick / 4));
  }
  const positions = points.map((point, index) => ({
    x: points.length === 1 ? (left + right) / 2 : left + (right - left) * index / (points.length - 1),
    y: bottom - point.value / ceiling * (bottom - top),
  }));
  if (positions.length > 1) draw("polyline", { points: positions.map((point) => `${point.x},${point.y}`).join(" "), fill: "none", stroke: "#f97316", "stroke-width": 3 });
  positions.forEach((position, index) => {
    const dot = draw("circle", { cx: position.x, cy: position.y, r: 5, fill: "#f97316" });
    const unit = metric === "reps" ? "reps" : "lbs";
    const measure = $("progress-metric").selectedOptions[0].textContent;
    attachGraphPointLabel(svg, dot, `${points[index].date} · ${fmt(points[index].value)} ${unit}`);
  });
  draw("text", { x: left, y: 287, fill: "#b8b8b8", "font-size": 12 }, points[0].date);
  if (points.length > 1) draw("text", { x: right, y: 287, fill: "#b8b8b8", "text-anchor": "end", "font-size": 12 }, points.at(-1).date);
  chart.setAttribute("aria-label", `${exerciseSelect.value}: ${$("progress-metric").selectedOptions[0].textContent} across ${points.length} logged days`);
  chart.append(svg);
  for (const point of [...points].reverse()) {
    const row = element("div", "progress-record");
    row.append(element("span", "", point.date), element("strong", "", fmt(point.value)));
    table.append(row);
  }
}
$("progress-exercise").addEventListener("change", renderProgress);
$("progress-metric").addEventListener("change", renderProgress);

function renderTracking(exerciseList, date, existing = [], sectionDefs = sections) {
  trackingCard.hidden = false;
  $("tracking-heading").textContent = session.mode === "manual" ? "Record Results" : "Track Workout";
  $("tracking-date").textContent = date;
  trackingList.replaceChildren();
  for (const group of sectionGroups(exerciseList, sectionDefs)) {
    trackingList.append(element("h3", "tracking-section-heading", group.name));
    for (const { exercise, index } of group.entries) {
    const row = element("div", "tracking-exercise");
    row.dataset.exerciseIndex = String(index);
    row.append(element("h3", "", exercise.name));
    const planned = element("div", "tracking-planned");
    planned.append(element("strong", "", "YOUR PLAN"));
    for (const part of exerciseSummary(exercise)) planned.append(element("span", "", part));
    row.append(planned);
    const fields = element("div", "tracking-fields");
    const setsLabel = element("label", "", "Sets completed");
    const actualSets = element("input");
    actualSets.type = "number";
    actualSets.min = "0";
    actualSets.max = "100";
    actualSets.step = "1";
    actualSets.dataset.actualField = "sets";
    actualSets.value = Math.min(100, Number(existing[index]?.sets ?? exercise.sets) || 0);
    setsLabel.append(actualSets);
    fields.append(setsLabel);
    row.append(fields);
    const earlier = exerciseRecords(exercise.name, date).at(-1);
    const setList = element("div", "set-log-list");
    const previous = existing[index] ?? {};
    const setValues = (previous.setsDetail ?? Array.from({ length: Math.min(100, Number(previous.sets || exercise.sets) || 0) }, (_, set) => ({
      reps: previous.repsBySet?.[set] ?? previous.reps ?? "",
      weight: previous.weight ?? "",
      duration: previous.duration ?? "",
    }))).map((entry) => ({ ...entry }));
    const renderSets = () => {
      const count = Math.min(100, Math.max(0, Number(actualSets.value) || 0));
      setList.replaceChildren();
      for (let set = 0; set < count; set++) {
        const setRow = element("div", "set-log");
        setRow.append(element("h4", "", `Set ${set + 1}`));
        if (earlier) setRow.append(element("p", "last-set", `Last ${earlier.date}: ${previousSetText(earlier.entry, set)}`));
        const inputs = element("div", "set-log-fields");
        for (const [key, label, step, target] of [
          ["reps", "Reps", "1", exercise.reps],
          ["weight", "Weight (lbs)", "0.5", exercise.weight],
          ["duration", "Time (sec)", "1", exercise.duration],
        ]) {
          if (target === "") continue;
          const wrapper = element("label", "", label);
          const input = element("input");
          input.type = "number";
          input.min = "0";
          input.step = step;
          input.dataset.setField = key;
          input.placeholder = `Plan: ${target}`;
          input.value = setValues[set]?.[key] ?? "";
          input.addEventListener("input", () => {
            setValues[set] ??= {};
            setValues[set][key] = input.value;
          });
          wrapper.append(input);
          inputs.append(wrapper);
        }
        if (!inputs.children.length) inputs.append(element("span", "tracking-help", "Set logged"));
        setRow.append(inputs);
        setList.append(setRow);
      }
    };
    actualSets.addEventListener("input", renderSets);
    renderSets();
    row.append(setList);
    trackingList.append(row);
    }
  }
}

function readActuals() {
  const results = [];
  for (const row of trackingList.querySelectorAll(".tracking-exercise")) {
    const actual = {};
    row.querySelectorAll("[data-actual-field]").forEach((input) => {
      actual[input.dataset.actualField] = input.value;
    });
    actual.setsDetail = [...row.querySelectorAll(".set-log")].map((setRow) => {
      const detail = {};
      setRow.querySelectorAll("[data-set-field]").forEach((input) => {
        detail[input.dataset.setField] = input.value;
      });
      return detail;
    });
    results[Number(row.dataset.exerciseIndex)] = actual;
  }
  return results;
}

function completeSession() {
  if (!trackingList.querySelectorAll("input").length) return;
  if (!trackingList.querySelectorAll("input:invalid").length) {
    const actuals = readActuals();
    const sessionExercises = session.id ? savedWorkouts.find((workout) => workout.id === session.id)?.exercises ?? [] : exercises;
    const newRecords = actuals.flatMap((entry, index) => personalRecordsForEntry(sessionExercises[index]?.name, session.date, entry));
    const recordMessage = newRecords.length ? ` · ${[...new Set(newRecords)].join(" & ")}!` : "";
    const manual = session.mode === "manual";
    const elapsedSeconds = session.mode === "manual" && !session.timeEdited ? null : currentElapsed();
    if (session.id) {
      const next = savedWorkouts.map((workout) => workout.id === session.id ? {
        ...workout,
        scheduledDates: scheduledOn(workout, session.date) ? scheduledDates(workout) : [...new Set([...scheduledDates(workout), session.date])],
        completedDates: [...new Set([...completedDates(workout), session.date])],
        actualLogs: { ...workout.actualLogs, [session.date]: actuals },
        loggedExercisesByDate: { ...workout.loggedExercisesByDate, [session.date]: workout.exercises.map((exercise) => ({ ...exercise })) },
        elapsedByDate: elapsedSeconds === null ? workout.elapsedByDate : { ...workout.elapsedByDate, [session.date]: elapsedSeconds },
      } : workout);
      if (!persistHistory(next)) return;
      if (session.mode !== "manual") stopTimer();
      resetStopwatch();
      renderWorkoutHistory();
      renderCalendar();
      renderStreaks();
      setWorkoutState("not-started");
      trackingCard.hidden = true;
      session = null;
      notify((manual ? "Results saved!" : "Workout completed and saved!") + recordMessage);
    } else {
      stopTimer();
      resetStopwatch();
      finishedActuals = actuals;
      finishedElapsedSeconds = elapsedSeconds;
      setWorkoutState("finished");
      trackingCard.hidden = true;
      session = null;
      notify("Workout finished! Save it to your workouts." + recordMessage);
    }
  } else {
    trackingList.querySelector("input:invalid").reportValidity();
  }
}

$("tracking-finish").addEventListener("click", completeSession);

startButton.addEventListener("click", () => {
  if (workoutState === "active") {
    completeSession();
    return;
  }
  if (!workoutNameInput.value.trim()) {
    workoutNameInput.focus();
    notify("Give your workout a name first.");
    return;
  }
  if (!workoutDateInput.value) {
    workoutDateInput.focus();
    notify("Choose a workout date first.");
    return;
  }
  if (!exercises.length) {
    notify("Add at least one exercise first.");
    return;
  }
  if (editingIndex !== null) {
    notify("Save or cancel your exercise edit first.");
    return;
  }
  session = { id: null, date: workoutDateInput.value, mode: "timed", elapsedOffsetSeconds: 0 };
  setWorkoutState("active");
  $("edit-elapsed").value = "";
  finishedActuals = null;
  finishedElapsedSeconds = null;
  renderTracking(exercises, session.date);
  startTimer();
  resetStopwatch();
  notify(`${workoutNameInput.value.trim()} started`);
});

function startSavedWorkout(id, date) {
  if (workoutState !== "not-started") {
    notify("Finish or save the current workout first.");
    return;
  }
  const workout = savedWorkouts.find((item) => item.id === id);
  if (!workout || !date || !workout.exercises.length) return;
  session = { id, date, mode: "timed", elapsedOffsetSeconds: 0 };
  setWorkoutState("active");
  $("edit-elapsed").value = "";
  renderTracking(workout.exercises, date, workout.actualLogs?.[date], workout.sections);
  startTimer();
  resetStopwatch();
  trackingCard.scrollIntoView({ behavior: "smooth", block: "start" });
  notify(`${workout.name} started`);
}

function recordSavedWorkout(id, date) {
  if (workoutState !== "not-started") {
    notify("Finish or save the current workout first.");
    return;
  }
  const workout = savedWorkouts.find((item) => item.id === id);
  if (!workout || !completedDates(workout).includes(date)) return;
  session = { id, date, mode: "manual", elapsedOffsetSeconds: workout.elapsedByDate?.[date] ?? 0, timeEdited: false };
  setWorkoutState("active");
  $("elapsed-time").textContent = formatElapsed(session.elapsedOffsetSeconds);
  $("edit-elapsed").value = "";
  renderTracking(workout.exercises, date, workout.actualLogs?.[date], workout.sections);
  resetStopwatch();
  trackingCard.scrollIntoView({ behavior: "smooth", block: "start" });
}

function loadHistory() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    savedWorkouts = Array.isArray(stored) ? stored.map((workout) => ({
      ...workout,
      sections: normalizeSections(workout.sections),
      exercises: Array.isArray(workout.exercises) ? workout.exercises.map((exercise) =>
        exercise.durationUnit === "sec" ? exercise : {
          ...exercise,
          duration: exercise.duration === "" ? "" : String(Number(exercise.duration) * 60),
          durationUnit: "sec",
        }) : [],
    })) : [];
  } catch (error) {
    console.error("Unable to load workout history:", error);
    savedWorkouts = [];
    notify("Workout history could not be loaded.");
  }
  try {
    const storedRest = JSON.parse(localStorage.getItem(REST_KEY) || "[]");
    restDays = Array.isArray(storedRest) ? storedRest.filter((date) => /^\d{4}-\d{2}-\d{2}$/.test(date)) : [];
  } catch (error) {
    console.error("Unable to load rest days:", error);
    restDays = [];
  }
}

function persistHistory(nextHistory) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextHistory));
    savedWorkouts = nextHistory;
    return true;
  } catch (error) {
    console.error("Unable to save workout history:", error);
    notify("Could not save. Check your browser storage settings.");
    return false;
  }
}

function resetWorkout() {
  exercises = [];
  sections = [{ id: "main", name: "Main Workout" }];
  renderSections();
  resetExerciseForm();
  workoutNameInput.value = "";
  workoutDateInput.value = todayLocal();
  setAdvancedSchedule(null, workoutDateInput.value);
  editingWorkoutId = null;
  editorOpen = false;
  $("saved-time-edit").hidden = true;
  $("new-workout-heading").textContent = "New Workout";
  setWorkoutState("not-started");
  finishedActuals = null;
  finishedElapsedSeconds = null;
  trackingCard.hidden = true;
  renderExercises();
}

function beginEditWorkout(id) {
  if (workoutState !== "not-started") {
    notify("Finish or save the current workout first.");
    return;
  }
  const workout = savedWorkouts.find((item) => item.id === id);
  if (!workout) return;
  if ((workoutNameInput.value.trim() || exercises.length) && !confirm("Replace the unsaved workout currently in the editor?")) return;
  editingWorkoutId = id;
  calendarOpen = false;
  editorOpen = true;
  progressOpen = false;
  profileOpen = false;
  weightOpen = false;
  exercises = workout.exercises.map((exercise) => ({ ...exercise }));
  sections = normalizeSections(workout.sections);
  renderSections();
  resetExerciseForm();
  workoutNameInput.value = workout.name;
  workoutDateInput.value = workout.date;
  setAdvancedSchedule(workout.recurrence, workout.date);
  const completed = completedDates(workout).filter((date) => scheduledDates(workout).includes(date));
  const timeSection = $("saved-time-edit");
  timeSection.hidden = !completed.length;
  const timeDate = $("edit-time-date");
  timeDate.replaceChildren();
  completed.forEach((date) => {
    const option = element("option", "", date);
    option.value = date;
    timeDate.append(option);
  });
  const showSavedTime = () => {
    const seconds = workout.elapsedByDate?.[timeDate.value];
    $("edit-saved-time").value = Number.isFinite(seconds) ? formatMinutesSeconds(seconds) : "";
  };
  timeDate.onchange = showSavedTime;
  showSavedTime();
  $("new-workout-heading").textContent = "Edit Workout";
  setWorkoutState("not-started");
  renderExercises();
  newWorkoutCard.scrollIntoView({ behavior: "smooth", block: "start" });
}

$("add-new-workout").addEventListener("click", () => {
  if (workoutState === "active") return;
  setHeaderMenu(false);
  if (workoutState === "finished") resetWorkout();
  calendarOpen = false;
  progressOpen = false;
  profileOpen = false;
  weightOpen = false;
  editorOpen = true;
  setWorkoutState("not-started");
  newWorkoutCard.scrollIntoView({ behavior: "smooth", block: "start" });
  workoutNameInput.focus();
});
function setSavedView(view) {
  savedView = view;
  document.body.classList.toggle("workouts-compact", !editorOpen && view === "compact" && workoutState !== "active");
  $("workout-view-compact").setAttribute("aria-pressed", String(view === "compact"));
  $("workout-view-detailed").setAttribute("aria-pressed", String(view === "detailed"));
}
$("workout-view-compact").addEventListener("click", () => setSavedView("compact"));
$("workout-view-detailed").addEventListener("click", () => setSavedView("detailed"));
document.addEventListener("dragend", () => document.body.classList.remove("dragging-tile"));
document.addEventListener("drop", () => document.body.classList.remove("dragging-tile"));
$("open-progress").addEventListener("click", () => {
  profileOpen = false;
  weightOpen = false;
  progressOpen = true;
  setWorkoutState(workoutState);
  renderProgress();
  window.scrollTo({ top: 0, behavior: "smooth" });
});
$("open-calendar").addEventListener("click", () => {
  calendarOpen = true;
  profileOpen = false;
  weightOpen = false;
  progressOpen = false;
  setWorkoutState(workoutState);
  renderWorkoutHistory();
  renderCalendar();
  window.scrollTo({ top: 0, behavior: "smooth" });
});
$("back-dashboard").addEventListener("click", () => {
  editorOpen = false;
  calendarOpen = false;
  progressOpen = false;
  profileOpen = false;
  weightOpen = false;
  setWorkoutState(workoutState);
  renderWorkoutHistory();
  renderCalendar();
  window.scrollTo({ top: 0, behavior: "smooth" });
});
$("cancel-workout-edit").addEventListener("click", resetWorkout);

saveButton.addEventListener("click", () => {
  if (workoutState === "active") return;
  if (!workoutNameInput.value.trim()) {
    workoutNameInput.focus();
    notify("Give your workout a name first.");
    return;
  }
  if (!workoutDateInput.value) {
    workoutDateInput.focus();
    notify("Choose a workout date first.");
    return;
  }
  if (!exercises.length) {
    notify("Add at least one exercise first.");
    return;
  }
  if (editingIndex !== null) {
    notify("Save or cancel your exercise edit first.");
    return;
  }
  const recurrence = readAdvancedSchedule(editingWorkoutId ? savedWorkouts.find((item) => item.id === editingWorkoutId) : null);
  if (recurrence === false) return;
  if (editingWorkoutId) {
    const original = savedWorkouts.find((item) => item.id === editingWorkoutId);
    if (!original) {
      resetWorkout();
      notify("That saved workout is no longer available.");
      return;
    }
    const loggedExercisesByDate = { ...original.loggedExercisesByDate };
    for (const date of Object.keys(original.actualLogs ?? {})) {
      loggedExercisesByDate[date] ??= original.exercises.map((exercise) => ({ ...exercise }));
    }
    const savedTimeInput = $("edit-saved-time");
    if (!$("saved-time-edit").hidden && savedTimeInput.value && !savedTimeInput.reportValidity()) {
      savedTimeInput.focus();
      return;
    }
    const editedSeconds = !$("saved-time-edit").hidden && savedTimeInput.value
      ? parseMinutesSeconds(savedTimeInput.value) : null;
    const existingDates = [...new Set(original.date === workoutDateInput.value
      ? scheduledDates(original)
      : completedDates(original).includes(original.date) || original.actualLogs?.[original.date]
        ? [...scheduledDates(original), workoutDateInput.value]
        : [...scheduledDates(original).filter((date) => date !== original.date), workoutDateInput.value])];
    const initialDateWasOnlyPlaceholder = recurrence && !original.recurrence && existingDates.length === 1 &&
      existingDates[0] === workoutDateInput.value && !completedDates(original).includes(workoutDateInput.value) &&
      !original.actualLogs?.[workoutDateInput.value];
    const updated = {
      ...original,
      name: workoutNameInput.value.trim(),
      date: workoutDateInput.value,
      scheduledDates: initialDateWasOnlyPlaceholder ? [] : !recurrence && original.recurrence
        ? [...new Set([...existingDates, ...completedDates(original)])] : existingDates,
      recurrence,
      sections: sections.map((section) => ({ ...section })),
      exercises: exercises.map((exercise) => ({ ...exercise })),
      loggedExercisesByDate,
      elapsedByDate: editedSeconds === null ? original.elapsedByDate
        : { ...original.elapsedByDate, [$("edit-time-date").value]: editedSeconds },
    };
    if (!persistHistory(savedWorkouts.map((item) => item.id === original.id ? updated : item))) return;
    renderWorkoutHistory();
    renderCalendar();
    resetWorkout();
    notify(`${updated.name} updated!`);
    return;
  }
  const workout = {
    id:
      typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    name: workoutNameInput.value.trim(),
    date: workoutDateInput.value,
    scheduledDates: recurrence && workoutState !== "finished" ? [] : [workoutDateInput.value],
    recurrence,
    sections: sections.map((section) => ({ ...section })),
    completed: workoutState === "finished",
    completedDates: workoutState === "finished" ? [workoutDateInput.value] : [],
    actualLogs: workoutState === "finished" ? { [workoutDateInput.value]: finishedActuals } : {},
    elapsedByDate: workoutState === "finished" ? { [workoutDateInput.value]: finishedElapsedSeconds } : {},
    exercises: exercises.map((exercise) => ({ ...exercise })),
  };
  if (!persistHistory([workout, ...savedWorkouts])) return;
  renderWorkoutHistory();
  visibleMonth = new Date(Number(workout.date.slice(0, 4)), Number(workout.date.slice(5, 7)) - 1, 1);
  renderCalendar();
  renderStreaks();
  resetWorkout();
  notify(`${workout.name} saved!`);
});

function reviewWorkout(id) {
  const details = document.getElementById(`workout-${id}`);
  if (!details) return;
  details.hidden = !details.hidden;
  const button = document.getElementById(`review-${id}`);
  if (button) {
    button.textContent = details.hidden ? "Review" : "Hide";
    button.setAttribute("aria-expanded", String(!details.hidden));
  }
}

function deleteWorkout(id) {
  const workout = savedWorkouts.find((item) => item.id === id);
  if (!workout || !confirm(`Delete saved workout "${workout.name}"?`)) return;
  if (!persistHistory(savedWorkouts.filter((item) => item.id !== id))) return;
  renderWorkoutHistory();
  renderCalendar();
  renderStreaks();
  notify(`${workout.name} deleted`);
}

function dateString(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function scheduledDates(workout) {
  return Array.isArray(workout.scheduledDates) ? workout.scheduledDates : [workout.date];
}

function matchesWeeklyRule(workout, date) {
  const rule = workout.recurrence;
  if (!rule || !Array.isArray(rule.weekdays) || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  if (date < rule.startDate || rule.endDate && date > rule.endDate) return false;
  return rule.weekdays.includes(new Date(`${date}T12:00:00`).getDay());
}

function scheduledOn(workout, date) {
  return scheduledDates(workout).includes(date) ||
    matchesWeeklyRule(workout, date) && !(workout.recurrence.exceptions ?? []).includes(date);
}

function repeatDescription(workout) {
  if (!workout.recurrence?.weekdays?.length) return null;
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return `Every ${workout.recurrence.weekdays.map((day) => days[day]).join(", ")} from ${workout.recurrence.startDate}${workout.recurrence.endDate ? ` to ${workout.recurrence.endDate}` : ""}`;
}

function recurrenceEditor(workout) {
  const box = element("div", "recurrence-editor");
  box.append(element("h4", "", "Repeat weekly"));
  const days = element("div", "recurrence-days");
  const dayInputs = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((name, index) => {
    const label = element("label", "", name);
    const input = element("input"); input.type = "checkbox";
    input.checked = workout.recurrence?.weekdays?.includes(index) ?? index === new Date(`${todayLocal()}T12:00:00`).getDay();
    label.prepend(input); days.append(label);
    return input;
  });
  box.append(days);
  const dates = element("div", "recurrence-dates");
  const startLabel = element("label", "", "Start date");
  const start = element("input"); start.type = "date"; start.value = workout.recurrence?.startDate ?? todayLocal();
  startLabel.append(start);
  const endLabel = element("label", "", "End date (optional)");
  const end = element("input"); end.type = "date"; end.value = workout.recurrence?.endDate ?? "";
  endLabel.append(end); dates.append(startLabel, endLabel); box.append(dates);
  const actions = element("div", "recurrence-actions");
  const save = element("button", "action-button", "Save Weekly Plan"); save.type = "button";
  save.addEventListener("click", () => {
    const weekdays = dayInputs.flatMap((input, day) => input.checked ? [day] : []);
    if (!weekdays.length || !start.value || end.value && end.value < start.value) {
      notify("Choose a weekday and a valid date range."); return;
    }
    const next = savedWorkouts.map((item) => {
      if (item.id !== workout.id) return item;
      const dates = scheduledDates(item);
      const initialDateWasOnlyPlaceholder = !item.recurrence && dates.length === 1 && dates[0] === item.date &&
        !completedDates(item).includes(item.date) && !item.actualLogs?.[item.date];
      return { ...item, scheduledDates: initialDateWasOnlyPlaceholder ? [] : dates, recurrence: {
        weekdays, startDate: start.value, endDate: end.value,
        exceptions: item.recurrence?.exceptions ?? [],
      } };
    });
    if (!persistHistory(next)) return;
    renderWorkoutHistory(); renderCalendar(); notify(`${workout.name} repeats weekly.`);
  });
  actions.append(save);
  if (workout.recurrence) {
    const stop = element("button", "action-button delete", "Stop Repeating"); stop.type = "button";
    stop.addEventListener("click", () => {
      const next = savedWorkouts.map((item) => item.id === workout.id ? { ...item, recurrence: null,
        scheduledDates: [...new Set([...scheduledDates(item), ...completedDates(item)])],
      } : item);
      if (!persistHistory(next)) return;
      renderWorkoutHistory(); renderCalendar(); notify(`${workout.name} no longer repeats.`);
    });
    actions.append(stop);
  }
  box.append(actions);
  return box;
}

function completedDates(workout) {
  return Array.isArray(workout.completedDates) ? workout.completedDates : (workout.completed === false ? [] : [workout.date]);
}

function renderStreaks() {
  const today = todayLocal();
  const activity = [...new Set([
    ...restDays,
    ...savedWorkouts.flatMap((workout) => completedDates(workout)),
  ])].filter((date) => date <= today).sort();
  let best = 0;
  let run = 0;
  let previous = null;
  for (const date of activity) {
    const day = Date.parse(`${date}T00:00:00Z`);
    if (!Number.isFinite(day)) continue;
    run = previous !== null && day - previous === 86400000 ? run + 1 : 1;
    best = Math.max(best, run);
    previous = day;
  }
  const yesterday = new Date(Date.parse(`${today}T00:00:00Z`) - 86400000).toISOString().slice(0, 10);
  const last = activity.at(-1);
  $("current-streak").textContent = last === today || last === yesterday ? String(run) : "0";
  $("best-streak").textContent = String(best);
}

function addRestDay(date) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return;
  if (restDays.includes(date)) {
    notify(`Rest day already set for ${date}`);
    return;
  }
  const next = [...restDays, date];
  try {
    localStorage.setItem(REST_KEY, JSON.stringify(next));
    restDays = next;
  } catch (error) {
    notify("Could not save the rest day.");
    return;
  }
  visibleMonth = new Date(Number(date.slice(0, 4)), Number(date.slice(5, 7)) - 1, 1);
  renderCalendar();
  renderStreaks();
  notify(`Rest day added for ${date}`);
}

function removeRestDay(date) {
  const next = restDays.filter((day) => day !== date);
  try {
    localStorage.setItem(REST_KEY, JSON.stringify(next));
    restDays = next;
  } catch (error) {
    notify("Could not remove the rest day.");
    return;
  }
  renderCalendar();
  renderStreaks();
}


function dateStatus(workout, date) {
  if (completedDates(workout).includes(date)) return "completed";
  return date < todayLocal() ? "missed" : "planned";
}

function workoutStatus(workout) {
  const dates = scheduledDates(workout);
  if (dates.length && dates.every((date) => dateStatus(workout, date) === "completed")) return "completed";
  return dates.some((date) => dateStatus(workout, date) === "missed") ? "missed" : "planned";
}

function toggleCompleted(id, date, done) {
  const wasOpen = document.getElementById(`workout-${id}`)?.hidden === false;
  const next = savedWorkouts.map((workout) => {
    if (workout.id !== id) return workout;
    const dates = completedDates(workout).filter((day) => day !== date);
    if (done) dates.push(date);
    return { ...workout, completedDates: dates };
  });
  if (!persistHistory(next)) return;
  renderWorkoutHistory();
  if (wasOpen) reviewWorkout(id);
  renderCalendar();
  renderStreaks();
}

function scheduleWorkout(id, date) {
  const workout = savedWorkouts.find((item) => item.id === id);
  if (!workout || !/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(new Date(`${date}T12:00:00`).getTime())) return;
  const dates = scheduledDates(workout);
  if (scheduledOn(workout, date)) {
    notify(`${workout.name} is already on ${date}`);
    return;
  }
  const next = savedWorkouts.map((item) => item.id === id ? {
    ...item,
    scheduledDates: matchesWeeklyRule(item, date) ? dates : [...dates, date],
    recurrence: matchesWeeklyRule(item, date) ? { ...item.recurrence,
      exceptions: (item.recurrence.exceptions ?? []).filter((day) => day !== date),
    } : item.recurrence,
  } : item);
  if (!persistHistory(next)) return;
  renderWorkoutHistory();
  renderCalendar();
  notify(`${workout.name} scheduled for ${date}`);
}

function removeScheduledDate(id, date) {
  const workout = savedWorkouts.find((item) => item.id === id);
  if (!workout) return;
  const next = savedWorkouts.map((item) => item.id === id
    ? { ...item, scheduledDates: scheduledDates(item).filter((day) => day !== date),
      completedDates: completedDates(item).filter((day) => day !== date),
      recurrence: matchesWeeklyRule(item, date) ? { ...item.recurrence,
        exceptions: [...new Set([...(item.recurrence.exceptions ?? []), date])],
      } : item.recurrence,
    } : item);
  if (!persistHistory(next)) return;
  renderWorkoutHistory();
  renderCalendar();
  renderStreaks();
  notify(`${workout.name} removed from ${date}`);
}

function actualSummary(exercise, entry) {
  if (!entry) return "No results recorded";
  if (Array.isArray(entry.setsDetail)) {
    const sets = entry.setsDetail.map((detail, index) => {
      const parts = [detail.reps !== undefined && detail.reps !== "" && `${detail.reps} reps`,
        detail.weight !== undefined && detail.weight !== "" && `${detail.weight} lbs`,
        detail.duration !== undefined && detail.duration !== "" && `${detail.duration} sec`].filter(Boolean);
      return `Set ${index + 1}: ${parts.join(", ") || "no values"}`;
    });
    return `${entry.sets ?? sets.length} sets${sets.length ? ` • ${sets.join("; ")}` : ""}`;
  }
  return [entry.sets && `${entry.sets} sets`,
    entry.repsBySet?.length ? `reps ${entry.repsBySet.map((value) => value || "—").join(" / ")}` : entry.reps && `${entry.reps} reps`,
    entry.weight && `${entry.weight} lbs`, entry.duration && `${entry.duration} sec`]
    .filter(Boolean).join(" • ") || "No values entered";
}

function positionCalendarPopup(item, popup) {
  const bounds = item.getBoundingClientRect();
  const width = popup.offsetWidth;
  const margin = 12;
  popup.style.left = `${Math.max(margin, Math.min(bounds.left, innerWidth - margin - width))}px`;
  popup.style.top = bounds.bottom + popup.offsetHeight > innerHeight && bounds.top > popup.offsetHeight
    ? `${bounds.top - popup.offsetHeight}px` : `${bounds.bottom}px`;
}

document.addEventListener("click", (event) => {
  if (!event.target.closest(".calendar-workout")) {
    document.querySelectorAll(".calendar-workout.open").forEach((item) => {
      item.classList.remove("open");
      item.querySelector(".calendar-workout-name")?.setAttribute("aria-expanded", "false");
      if (item.contains(document.activeElement)) document.activeElement.blur();
    });
  }
});

function renderCalendar() {
  renderTodayWorkout();
  calendarGrid.replaceChildren();
  const year = visibleMonth.getFullYear();
  const month = visibleMonth.getMonth();
  $("calendar-help").textContent = calendarOpen
    ? "Drag a saved workout or Rest Day onto a date. Click or tap a workout to see its controls."
    : "Drag a saved workout onto a date. Click or tap a workout to see its details and controls.";
  calendarMonth.textContent = visibleMonth.toLocaleDateString(undefined, { month: "long", year: "numeric" });
  for (const day of ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]) {
    calendarGrid.append(element("div", "calendar-weekday", day));
  }
  for (let i = 0; i < visibleMonth.getDay(); i++) {
    calendarGrid.append(element("div", "calendar-blank"));
  }
  const days = new Date(year, month + 1, 0).getDate();
  for (let day = 1; day <= days; day++) {
    const date = dateString(year, month, day);
    const cell = element("div", "calendar-day");
    cell.setAttribute("aria-label", date);
    if (date === todayLocal()) cell.classList.add("today");
    cell.append(element("span", "day-number", String(day)));
    if (restDays.includes(date)) {
      const rest = element("div", "calendar-rest");
      rest.draggable = true;
      rest.addEventListener("dragstart", (event) => {
        if (event.target.closest("button")) { event.preventDefault(); return; }
        document.body.classList.add("dragging-tile");
        event.dataTransfer.setData("text/plain", REST_DRAG_ID);
        event.dataTransfer.effectAllowed = "copy";
      });
      rest.append(element("span", "", "☾ Rest Day"));
      const remove = element("button", "rest-remove", "×");
      remove.type = "button";
      remove.setAttribute("aria-label", `Remove rest day on ${date}`);
      remove.addEventListener("click", () => removeRestDay(date));
      rest.append(remove);
      cell.append(rest);
    }
    for (const workout of savedWorkouts.filter((item) => scheduledOn(item, date))) {
      const done = completedDates(workout).includes(date);
      const status = dateStatus(workout, date);
      const item = element("div", `calendar-workout ${status}`);
      item.draggable = true;
      item.addEventListener("dragstart", (event) => {
        if (event.target.closest(".calendar-popup, .calendar-remove")) {
          event.preventDefault();
          return;
        }
        document.body.classList.add("dragging-tile");
        event.dataTransfer.setData("text/plain", workout.id);
        event.dataTransfer.effectAllowed = "copy";
      });
      const title = element("button", "calendar-workout-name", workout.name);
      title.type = "button";
      title.setAttribute("aria-label", `Details for ${workout.name} on ${date}`);
      title.setAttribute("aria-expanded", "false");
      item.append(title);
      const popup = element("div", "calendar-popup");
      popup.id = `popup-${workout.id}-${date}`;
      popup.setAttribute("role", "group");
      popup.setAttribute("aria-label", `${workout.name} on ${date}`);
      title.setAttribute("aria-controls", popup.id);
      popup.append(element("h4", "", workout.name));
      popup.append(element("p", "calendar-popup-date", `${date} · ${done ? "Complete" : status === "missed" ? "Missed" : "Planned"}`));
      for (const group of sectionGroups(workout.exercises, workout.sections)) {
        popup.append(element("p", "plan-section-heading", group.name));
        for (const { exercise } of group.entries) {
          popup.append(element("p", "calendar-popup-exercise", `${exercise.name}: ${exerciseSummary(exercise).join(" • ")}`));
        }
      }
      for (const [index, entry] of (workout.actualLogs?.[date] ?? []).entries()) {
        const exercise = workout.loggedExercisesByDate?.[date]?.[index] ?? workout.exercises[index];
        popup.append(element("p", "calendar-popup-actual", `${exercise?.name ?? "Exercise"}: ${actualSummary(exercise, entry)}`));
        for (const label of personalRecordsForEntry(exercise?.name, date, entry)) popup.append(element("span", "pr-badge", `${exercise?.name}: ${label}`));
      }
      if (Number.isFinite(workout.elapsedByDate?.[date])) {
        popup.append(element("p", "calendar-popup-actual", `Workout time: ${formatElapsed(workout.elapsedByDate[date])}`));
      }
      const controls = element("div", "calendar-popup-actions");
      const play = element("button", "action-button", "Start Workout");
      play.type = "button";
      play.addEventListener("click", () => startSavedWorkout(workout.id, date));
      controls.append(play);
      const complete = element("button", "action-button", done ? "Mark Incomplete" : "Mark Complete");
      complete.type = "button";
      complete.addEventListener("click", () => toggleCompleted(workout.id, date, !done));
      controls.append(complete);
      if (done) {
        const record = element("button", "action-button", workout.actualLogs?.[date] ? "Edit Results" : "Record Results");
        record.type = "button";
        record.addEventListener("click", () => recordSavedWorkout(workout.id, date));
        controls.append(record);
      }
      const remove = element("button", "calendar-remove", "×");
      remove.type = "button";
      remove.setAttribute("aria-label", `Remove ${workout.name} from ${date}`);
      remove.addEventListener("click", () => removeScheduledDate(workout.id, date));
      item.append(remove);
      popup.append(controls);
      item.append(popup);
      title.addEventListener("click", () => {
        const open = !item.classList.contains("open");
        document.querySelectorAll(".calendar-workout.open").forEach((other) => other.classList.remove("open"));
        item.classList.toggle("open", open);
        title.setAttribute("aria-expanded", String(open));
        if (open) positionCalendarPopup(item, popup);
      });
      item.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
          item.classList.remove("open");
          title.setAttribute("aria-expanded", "false");
          title.focus();
        }
      });
      cell.append(item);
    }
    cell.addEventListener("dragover", (event) => {
      if (!event.dataTransfer.types.includes("text/plain")) return;
      event.preventDefault();
      cell.classList.add("drop-target");
    });
    cell.addEventListener("dragleave", () => cell.classList.remove("drop-target"));
    cell.addEventListener("drop", (event) => {
      event.preventDefault();
      cell.classList.remove("drop-target");
      const dragged = event.dataTransfer.getData("text/plain");
      if (dragged === REST_DRAG_ID) addRestDay(date);
      else scheduleWorkout(dragged, date);
    });
    calendarGrid.append(cell);
  }
}

$("previous-month").addEventListener("click", () => {
  visibleMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1);
  renderCalendar();
});
$("next-month").addEventListener("click", () => {
  visibleMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1);
  renderCalendar();
});

function renderWorkoutHistory() {
  historyList.replaceChildren();
  workoutCount.textContent = `${savedWorkouts.length} ${savedWorkouts.length === 1 ? "workout" : "workouts"}`;
  if (calendarOpen) {
    const rest = element("article", "saved-workout rest-workout-tile");
    rest.draggable = true;
    rest.setAttribute("aria-label", "Drag Rest Day onto a calendar date");
    rest.addEventListener("dragstart", (event) => {
      document.body.classList.add("dragging-tile");
      event.dataTransfer.setData("text/plain", REST_DRAG_ID);
      event.dataTransfer.effectAllowed = "copy";
    });
    rest.append(element("h3", "", "☾ Rest Day"), element("p", "", "Drag onto a date to plan a rest day."));
    historyList.append(rest);
  }
  if (!savedWorkouts.length) {
    historyList.append(
      emptyState(
        "No saved workouts",
        "Your planned and completed workouts will appear here.",
      ),
    );
    return;
  }
  savedWorkouts.forEach((workout) => {
    const card = element("article", "saved-workout");
    card.draggable = true;
    card.addEventListener("dragstart", (event) => {
      if (event.target.closest("button, input, label")) { event.preventDefault(); return; }
      document.body.classList.add("dragging-tile");
      card.classList.add("dragging");
      event.dataTransfer.setData("text/plain", workout.id);
      event.dataTransfer.setData("application/x-forge-workout", workout.id);
      event.dataTransfer.effectAllowed = "copyMove";
    });
    card.addEventListener("dragend", () => {
      card.classList.remove("dragging");
      historyList.querySelectorAll(".reorder-target").forEach((target) => target.classList.remove("reorder-target"));
    });
    card.addEventListener("dragover", (event) => {
      if (!event.dataTransfer.types.includes("application/x-forge-workout")) return;
      event.preventDefault(); event.stopPropagation();
      event.dataTransfer.dropEffect = "move";
      card.classList.add("reorder-target");
    });
    card.addEventListener("dragleave", () => card.classList.remove("reorder-target"));
    card.addEventListener("drop", (event) => {
      const id = event.dataTransfer.getData("application/x-forge-workout");
      if (!id) return;
      event.preventDefault(); event.stopPropagation();
      card.classList.remove("reorder-target");
      const from = savedWorkouts.findIndex((item) => item.id === id);
      const to = savedWorkouts.findIndex((item) => item.id === workout.id);
      if (from < 0 || to < 0 || from === to) return;
      const next = [...savedWorkouts];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      if (!persistHistory(next)) return;
      renderWorkoutHistory(); renderCalendar();
      notify("Saved workouts reordered.");
    });
    const header = element("div", "saved-workout-header");
    const info = element("div");
    info.append(
      element("h3", "", workout.name),
      element("p", "", repeatDescription(workout) ?? `${scheduledDates(workout).length} ${scheduledDates(workout).length === 1 ? "calendar date" : "calendar dates"}`),
      element("span", `workout-badge ${workoutStatus(workout)}`, workout.recurrence ? `${completedDates(workout).length} completed` : `${scheduledDates(workout).filter((date) => completedDates(workout).includes(date)).length}/${scheduledDates(workout).length} done`),
      element(
        "p",
        "",
        `${workout.exercises.length} ${workout.exercises.length === 1 ? "exercise" : "exercises"}`,
      ),
    );
    const plan = element("div", "saved-plan");
    plan.append(element("strong", "", "PLAN"));
    for (const group of sectionGroups(workout.exercises, workout.sections)) {
      plan.append(element("div", "plan-section-heading", group.name));
      for (const { exercise } of group.entries) {
        plan.append(element("div", "saved-plan-exercise", `${exercise.name} · ${exerciseSummary(exercise).join(" · ")}`));
      }
    }
    info.append(plan);
    const actions = element("div", "workout-actions");
    const edit = element("button", "action-button edit-workout", "Edit Workout");
    edit.type = "button";
    edit.addEventListener("click", () => beginEditWorkout(workout.id));
    const start = element("button", "btn primary saved-start", "Start");
    start.type = "button";
    start.addEventListener("click", () => startSavedWorkout(workout.id, todayLocal()));
    const review = element("button", "action-button", "Review");
    review.type = "button";
    review.id = `review-${workout.id}`;
    review.setAttribute("aria-expanded", "false");
    review.addEventListener("click", () => reviewWorkout(workout.id));
    const remove = element("button", "action-button delete", "Delete");
    remove.type = "button";
    remove.addEventListener("click", () => deleteWorkout(workout.id));
    actions.append(start, edit, review, remove);
    header.append(info, actions);
    const details = element("div", "saved-workout-details");
    details.id = `workout-${workout.id}`;
    details.hidden = true;
    const dateLabel = element("label", "schedule-label", "Calendar / tracking date");
    const dateInput = element("input");
    dateInput.type = "date";
    dateInput.value = scheduledDates(workout)[0] ?? todayLocal();
    dateLabel.append(dateInput);
    details.append(dateLabel);
    const addDate = element("button", "action-button track-button", "Add Date");
    addDate.type = "button";
    addDate.addEventListener("click", () => scheduleWorkout(workout.id, dateInput.value));
    details.append(addDate);
    const track = element("button", "action-button track-button", "Start & Track");
    track.type = "button";
    track.addEventListener("click", () => startSavedWorkout(workout.id, dateInput.value));
    details.append(track);
    const dates = element("div", "scheduled-dates");
    for (const date of [...new Set([...scheduledDates(workout), ...completedDates(workout)])].sort()) {
      const row = element("label", "scheduled-date");
      const check = element("input");
      check.type = "checkbox";
      check.checked = completedDates(workout).includes(date);
      check.addEventListener("change", () => toggleCompleted(workout.id, date, check.checked));
      row.append(check, element("span", "", `${date} — ${check.checked ? "Done" : "Not done"}`));
      dates.append(row);
      if (check.checked) {
        const record = element("button", "action-button track-button", workout.actualLogs?.[date] ? "Edit Results" : "Record Results");
        record.type = "button";
        record.addEventListener("click", () => recordSavedWorkout(workout.id, date));
        dates.append(record);
      }
      const log = workout.actualLogs?.[date];
      if (Array.isArray(log)) {
        const summary = element("div", "actual-summary", "Actual: " + log.map((entry, i) => {
          const loggedExercise = workout.loggedExercisesByDate?.[date]?.[i] ?? workout.exercises[i];
          return `${loggedExercise?.name ?? "Exercise"}: ${actualSummary(loggedExercise, entry)}`;
        }).join(" | "));
        dates.append(summary);
      }
      if (Number.isFinite(workout.elapsedByDate?.[date])) {
        dates.append(element("div", "actual-summary", `Workout time: ${formatElapsed(workout.elapsedByDate[date])}`));
      }
    }
    details.append(dates, recurrenceEditor(workout));
    for (const group of sectionGroups(workout.exercises, workout.sections)) {
      details.append(element("h4", "plan-section-heading", group.name));
      for (const { exercise } of group.entries) {
        const row = element("div", "saved-exercise");
        row.append(element("h4", "", exercise.name), element("p", "", exerciseSummary(exercise).join(" • ")));
        details.append(row);
      }
    }
    card.append(header, details);
    historyList.append(card);
  });
}

function renderTodayWorkout() {
  const date = todayLocal();
  $("today-date").textContent = new Date(`${date}T12:00:00`).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
  const list = $("today-workouts");
  list.replaceChildren();
  const todayWorkouts = savedWorkouts.filter((workout) => scheduledOn(workout, date));
  if (!todayWorkouts.length && !restDays.includes(date)) {
    list.append(emptyState("Nothing scheduled today", "Drag a saved workout or Rest Day onto today in the calendar."));
    return;
  }
  if (restDays.includes(date)) list.append(element("p", "today-rest", "☾ Rest Day scheduled"));
  for (const workout of todayWorkouts) {
    const done = completedDates(workout).includes(date);
    const entry = element("article", "today-entry");
    const heading = element("div", "today-entry-head");
    heading.append(element("h2", "", workout.name), element("span", `workout-badge ${dateStatus(workout, date)}`, done ? "Complete" : "Planned"));
    entry.append(heading);
    const plan = element("div", "today-exercises");
    if (workout.exercises.length) {
      for (const group of sectionGroups(workout.exercises, workout.sections)) {
        plan.append(element("div", "plan-section-heading", group.name));
        for (const { exercise } of group.entries) {
        const exerciseCard = element("div", "today-exercise");
        exerciseCard.append(element("h3", "", exercise.name));
        const details = element("div", "today-exercise-details");
        const addDetail = (value, label) => {
          if (value !== undefined && value !== null && String(value) !== "") {
            const chip = element("span", "today-detail");
            chip.append(element("strong", "", String(value)), element("small", "", label));
            details.append(chip);
          }
        };
        addDetail(exercise.sets, "sets");
        addDetail(exercise.reps, "reps");
        addDetail(exercise.weight, "lbs");
        addDetail(exercise.duration, exercise.durationUnit === "sec" ? "sec" : "min");
        exerciseCard.append(details);
        plan.append(exerciseCard);
        }
      }
    } else plan.append(element("p", "", "No exercises added yet."));
    entry.append(plan);
    for (const [index, result] of (workout.actualLogs?.[date] ?? []).entries()) {
      const exerciseName = workout.loggedExercisesByDate?.[date]?.[index]?.name ?? workout.exercises[index]?.name;
      for (const label of personalRecordsForEntry(exerciseName, date, result)) entry.append(element("span", "pr-badge", `${exerciseName}: ${label}`));
    }
    if (Number.isFinite(workout.elapsedByDate?.[date])) entry.append(element("p", "actual-summary", `Workout time: ${formatElapsed(workout.elapsedByDate[date])}`));
    const actions = element("div", "workout-actions");
    const complete = element("button", "action-button", done ? "Mark Incomplete" : "Mark Complete");
    complete.type = "button";
    complete.addEventListener("click", () => toggleCompleted(workout.id, date, !done));
    const start = element("button", "btn primary today-start", "Start Workout");
    start.type = "button";
    start.addEventListener("click", () => startSavedWorkout(workout.id, date));
    actions.append(start, complete);
    if (done) {
      const record = element("button", "action-button", workout.actualLogs?.[date] ? "Edit Results" : "Record Results");
      record.type = "button";
      record.addEventListener("click", () => recordSavedWorkout(workout.id, date));
      actions.append(record);
    }
    entry.append(actions);
    list.append(entry);
  }
}



function renderExerciseHistory(name) {
  const list = $("exercise-history");
  list.replaceChildren();
  const records = name ? exerciseRecords(name).slice().reverse() : [];
  if (!records.length) { list.append(element("p", "", "No recorded sets yet.")); return; }
  for (const { date, entry, workoutName } of records) {
    const row = element("article", "exercise-history-entry");
    row.append(element("strong", "", `${date} · ${workoutName}`));
    const count = Array.isArray(entry.setsDetail) ? entry.setsDetail.length : Math.min(100, Number(entry.sets) || 1);
    for (let i = 0; i < count; i++) row.append(element("p", "", `Set ${i + 1}: ${previousSetText(entry, i)}`));
    list.append(row);
  }
}

function bodyWeightEntries() {
  return (Array.isArray(profile.bodyWeightEntries) ? profile.bodyWeightEntries : [])
    .filter(item => item && /^\d{4}-\d{2}-\d{2}$/.test(item.date) && Number.isFinite(Number(item.weight)) && Number(item.weight) > 0)
    .slice().sort((a, b) => a.date.localeCompare(b.date));
}
function saveBodyWeightEntries(entries) {
  const next = { ...profile, bodyWeightEntries: entries };
  try { localStorage.setItem(PROFILE_KEY, JSON.stringify(next)); }
  catch (error) { notify("Could not save weigh-ins in this browser."); return false; }
  profile = next;
  if (typeof queueCloudSave === "function") queueCloudSave();
  renderBodyWeight();
  return true;
}
function renderBodyWeight() {
  const entries = bodyWeightEntries(), list = $("body-weight-history"), chart = $("body-weight-chart");
  list.replaceChildren(); chart.replaceChildren();
  $("body-weight-date").max = todayLocal();
  if (!$("body-weight-date").value) $("body-weight-date").value = todayLocal();
  const target = Number(profile.targetWeight);
  if (!entries.length) {
    $("body-weight-summary").textContent = "Log your first weigh-in to start tracking your weight.";
    chart.append(element("p", "", "Your weight trend will appear here.")); return;
  }
  const latest = entries.at(-1), change = Number(latest.weight) - Number(entries[0].weight);
  $("body-weight-summary").textContent = `Latest: ${latest.weight} lbs (${latest.date}) · Change: ${change > 0 ? "+" : ""}${change.toFixed(1)} lbs` +
    (target > 0 ? ` · Target: ${target} lbs · ${Math.abs(Number(latest.weight) - target).toFixed(1)} lbs from target` : "");
  const ns = "http://www.w3.org/2000/svg", svg = document.createElementNS(ns, "svg");
  const chartWidth = graphWidth(), plotLeft = 55, plotRight = chartWidth - 16;
  svg.setAttribute("viewBox", `0 0 ${chartWidth} 260`); svg.setAttribute("role", "group");
  svg.setAttribute("aria-label", "Body weight in pounds over time; individual measurements listed below");
  const values = entries.map(e => Number(e.weight)); if (target > 0) values.push(target);
  const low = Math.min(...values) - 2, high = Math.max(...values) + 2;
  const first = Date.parse(entries[0].date), last = Date.parse(latest.date);
  const x = date => last === first ? (plotLeft + plotRight) / 2 : plotLeft + (Date.parse(date) - first) / (last - first) * (plotRight - plotLeft);
  const y = weight => 210 - (weight - low) / (high - low) * 185;
  const draw = (tag, attrs, text) => { const n = document.createElementNS(ns, tag); for (const [k,v] of Object.entries(attrs)) n.setAttribute(k,v); if (text !== undefined) n.textContent=text; svg.append(n); return n; };
  for (let i=0; i<=4; i++) { const value=low+(high-low)*i/4; draw("text", {x: 5,y:y(value)+4,fill:"#b8b8b8","font-size":12},value.toFixed(1)); draw("line",{x1:plotLeft,x2:plotRight,y1:y(value),y2:y(value),stroke:"#4b4d52"}); }
  if (target > 0) { draw("line",{x1:plotLeft,x2:plotRight,y1:y(target),y2:y(target),stroke:"#7dd3fc","stroke-dasharray":"6 4"}); draw("text",{x:plotLeft,y:y(target)-5,fill:"#7dd3fc","font-size":12},"Target"); }
  draw("polyline",{points:entries.map(e=>`${x(e.date)},${y(Number(e.weight))}`).join(" "),fill:"none",stroke:"#f97316","stroke-width":3});
  entries.forEach(e => {
    const dot = draw("circle", {cx:x(e.date),cy:y(Number(e.weight)),r:4,fill:"#f97316"});
    attachGraphPointLabel(svg, dot, `${e.date} · ${Number(e.weight).toLocaleString()} lbs`);
  });
  draw("text",{x:plotLeft,y:245,fill:"#b8b8b8","font-size":12},entries[0].date);
  if (entries.length>1) draw("text",{x:plotRight,y:245,fill:"#b8b8b8","text-anchor":"end","font-size":12},latest.date);
  chart.append(svg);
  for (const item of entries.slice().reverse()) {
    const row = element("div", "progress-record");
    row.append(element("span", "", item.date), element("strong", "", `${item.weight} lbs`));
    const edit = element("button", "btn secondary", "Edit"); edit.type="button";
    edit.addEventListener("click",()=>{ $("body-weight-date").value=item.date; $("body-weight-value").value=item.weight; $("body-weight-value").focus(); });
    const remove = element("button", "btn secondary", "Delete"); remove.type="button";
    remove.addEventListener("click",()=>{ if(confirm(`Delete weigh-in for ${item.date}?`)) saveBodyWeightEntries(bodyWeightEntries().filter(e=>e.date!==item.date)); });
    row.append(edit,remove); list.append(row);
  }
}
$("body-weight-form").addEventListener("submit", event => {
  event.preventDefault();
  if (!event.currentTarget.reportValidity()) return;
  const date = $("body-weight-date").value, weight = Number($("body-weight-value").value);
  if (!date || date > todayLocal() || !Number.isFinite(weight) || weight <= 0) { notify("Enter a valid date and weight."); return; }
  const entries = bodyWeightEntries().filter(e=>e.date!==date);
  entries.push({ date, weight });
  if (saveBodyWeightEntries(entries)) { $("body-weight-value").value=""; notify("Weigh-in saved."); }
});

function setHeaderMenu(open) {
  $("header-menu").hidden = !open;
  $("toggle-menu").setAttribute("aria-expanded", String(open));
}
$("toggle-menu").addEventListener("click", () => setHeaderMenu($("header-menu").hidden));
document.addEventListener("click", event => {
  if (!event.target.closest(".header-menu-anchor")) setHeaderMenu(false);
});
$("header-menu").addEventListener("click", event => {
  if (event.target.closest("button")) setHeaderMenu(false);
});
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && !$("header-menu").hidden) { setHeaderMenu(false); $("toggle-menu").focus(); }
});
function displayProfilePhoto() {
  const photo = typeof profile.photo === "string" && /^data:image\/(jpeg|png|webp);base64,/.test(profile.photo) ? profile.photo : "";
  for (const id of ["profile-photo-preview", "header-avatar"]) {
    const image = $(id); image.hidden = !photo;
    if (photo) image.src = photo; else image.removeAttribute("src");
  }
  $("remove-profile-photo").hidden = !photo;
}
function saveProfilePhoto(photo) {
  const next = { ...profile, photo };
  try { localStorage.setItem(PROFILE_KEY, JSON.stringify(next)); }
  catch (error) { $("photo-save-status").textContent = "Picture not saved. Browser storage may be full."; notify("Could not save your picture. Browser storage may be full."); return; }
  profile = next;
  if (typeof queueCloudSave === "function") queueCloudSave();
  displayProfilePhoto();
  $("photo-save-status").textContent = photo ? "Picture saved." : "Picture removed.";
  $("photo-save-status").dataset.state = "saved";
  notify(photo ? "Profile picture saved." : "Profile picture removed.");
}
$("profile-photo-input").addEventListener("change", async event => {
  const input = event.currentTarget, file = input.files[0];
  if (!file) return;
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 10 * 1024 * 1024) {
    notify("Choose a JPG, PNG, or WebP picture under 10 MB."); input.value = ""; return;
  }
  $("photo-save-status").textContent = "Saving picture…";
  input.disabled = true; $("remove-profile-photo").disabled = true;
  const url = URL.createObjectURL(file);
  try {
    const image = new Image();
    await new Promise((resolve, reject) => { image.onload = resolve; image.onerror = reject; image.src = url; });
    const canvas = document.createElement("canvas"); canvas.width = canvas.height = 256;
    const size = Math.min(image.naturalWidth, image.naturalHeight);
    const context = canvas.getContext("2d");
    context.fillStyle = "#ffffff"; context.fillRect(0, 0, 256, 256);
    context.drawImage(image, (image.naturalWidth-size)/2, (image.naturalHeight-size)/2, size, size, 0, 0, 256, 256);
    saveProfilePhoto(canvas.toDataURL("image/jpeg", 0.85));
  } catch (error) { $("photo-save-status").textContent = "Picture not saved. Try another image."; notify("That picture could not be opened. Try another image."); }
  finally { URL.revokeObjectURL(url); input.value = ""; input.disabled = false; $("remove-profile-photo").disabled = false; }
});
$("remove-profile-photo").addEventListener("click", () => saveProfilePhoto(""));

const PROFILE_KEY = "forge-profile";
const PROFILE_FIELDS = ["name", "fitnessGoal", "experienceLevel", "sex", "targetWeight", "age", "weight", "email", "bench", "squat", "deadlift", "pushups", "pullups"];
let profile = {};
let profileOpen = false;
function displayProfile() {
  $("profile-save-status").textContent = "No unsaved changes.";
  $("profile-save-status").dataset.state = "";
  displayProfilePhoto();
  for (const key of PROFILE_FIELDS) $("profile-" + key).value = profile[key] ?? "";
  renderBodyWeight();
}
function loadProfile() {
  try {
    const stored = JSON.parse(localStorage.getItem(PROFILE_KEY) || "{}");
    profile = stored && typeof stored === "object" && !Array.isArray(stored) ? stored : {};
  } catch (error) { console.warn("Profile unavailable:", error); profile = {}; }
  displayProfile();
}
$("profile-form").addEventListener("input", () => {
  $("profile-save-status").textContent = "Unsaved changes — select Save Profile.";
  $("profile-save-status").dataset.state = "dirty";
});
$("profile-form").addEventListener("submit", event => {
  event.preventDefault();
  if (!event.currentTarget.reportValidity()) return;
  const next = { ...profile };
  for (const key of PROFILE_FIELDS) next[key] = $("profile-" + key).value.trim();
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(next));
    profile = next;
    
    renderBodyWeight();
    $("profile-save-status").textContent = "Profile saved.";
    $("profile-save-status").dataset.state = "saved";
    notify("Profile saved.");
  } catch (error) { console.error("Unable to save profile:", error); $("profile-save-status").textContent = "Could not save. Your changes are still in the form."; notify("Could not save profile in this browser."); }
});
$("open-weight").addEventListener("click", () => {
  weightOpen = true;
  editorOpen = calendarOpen = progressOpen = profileOpen = false;
  renderBodyWeight();
  setWorkoutState(workoutState);
  window.scrollTo({ top: 0, behavior: "smooth" });
});
$("open-profile").addEventListener("click", () => {
  if (profileOpen) return;
  if (workoutState === "active") return;
  setHeaderMenu(false);
  weightOpen = false;
  profileOpen = true;
  editorOpen = calendarOpen = progressOpen = false;
  displayProfile();
  setWorkoutState(workoutState);
  window.scrollTo({ top: 0, behavior: "smooth" });
});
loadProfile();

loadHistory();
renderExercises();
renderWorkoutHistory();
renderCalendar();
renderStreaks();
setWorkoutState("not-started");

$("export-forge").addEventListener("click", () => {
  const data = { workouts: savedWorkouts, restDays, profile };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "forge-backup.json";
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});


let chartResizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(chartResizeTimer);
  chartResizeTimer = setTimeout(() => {
    if (progressOpen) renderProgress();
    if (weightOpen) renderBodyWeight();
  }, 150);
});
