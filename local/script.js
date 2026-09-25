"use strict";
const $ = (id) => document.getElementById(id);
const form = $("exercise-form");
const exerciseList = $("exercise-list");
const workoutNameInput = $("workout-name");
const workoutDateInput = $("workout-date");
const startButton = $("start-workout");
const saveButton = $("save-workout");
const historyList = $("workout-history");
const workoutCount = $("workout-count");
const trackingCard = $("tracking-card");
const trackingList = $("tracking-list");
const newWorkoutCard = $("new-workout-card");
const workoutOverview = $("workout-overview");
const trackingLive = $("tracking-live");
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
const caloriesInput = $("calories");
const targetTypeInput = $("target-type");
const restInput = $("rest");
const parameterSummary = $("parameter-summary");
const parameterControls = $("parameter-controls");
const parameterList = $("parameter-list");
const parameterAddSelect = $("parameter-add-select");
const editParametersButton = $("edit-parameters");
const addParameterButton = $("add-parameter");
const submitButton = $("submit");
const cancelButton = $("cancel-edit");
const toast = $("toast");
const STORAGE_KEY = "forge-workouts";
const REST_KEY = "forge-rest-days";
const WORKOUT_TEMPLATES_KEY = "forge-workout-templates";
const SECTION_TEMPLATES_KEY = "forge-section-templates";
const WORKOUT_DRAFT_KEY = "forge-workout-draft";
const GOALS_KEY = "forge-goals";
const PR_HISTORY_KEY = "forge-pr-history";
const REST_DRAG_ID = "__forge_rest_day__";

let exercises = [];
let sections = [{ id: "main", name: "Main Workout", format: "sets", rounds: 3 }];
let editingIndex = null;
let workoutState = "not-started";
let savedWorkouts = [];
let toastTimer;
let session = null;
let finishedActuals = null;
let finishedNotes = "";
let finishedElapsedSeconds = null;
let timerInterval = null;
let stopwatchInterval = null;
let stopwatchAccumulatedMs = 0;
let stopwatchStartedAt = null;
let restTimerInterval = null;
let restSecondsRemaining = 90;
let playerPhaseInterval = null;
const PLAYER_REST_SECONDS = 90;
let editingWorkoutId = null;
let editorOpen = false;
let workoutStartOpen = false;
let templatesOpen = false;
let builderStage = "details";
let builderBuildStep = "section";
let builderHistory = [];
let builderReviewReturnStep = "exercise";
let calendarOpen = false;
let progressOpen = false;
let goalsOpen = false;
let goalStatus = "active";
let progressRange = 30;
let weightOpen = false;
let savedView = "detailed";
let restDays = [];
let visibleMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

// Library selection is explicit; custom exercises are an intentional mode.
let selectedLibraryExerciseId = null;
let customExerciseMode = false;
let activeParameters = ["reps", "weight", "rest"];
let parametersEditing = false;
const PARAMETER_LABELS = { reps: "Reps", duration: "Duration", distance: "Distance", calories: "Calories", weight: "Weight", rest: "Rest" };
const PERFORMANCE_PARAMETERS = ["reps", "duration", "distance", "calories"];
const SUPPORT_PARAMETERS = ["weight", "rest"];
function parameterValue(parameter) {
  return ({ reps: repsInput.value, duration: durationInput.value, distance: $("distance").value, calories: caloriesInput.value, weight: weightInput.value, rest: restInput.value })[parameter] || "";
}
function parameterText(parameter) {
  const value = parameterValue(parameter);
  const unit = ({ reps: "reps", duration: "sec", distance: "mi", calories: "cal", weight: "lb", rest: "sec" })[parameter];
  return value ? `${value} ${unit}` : PARAMETER_LABELS[parameter];
}
function sectionParameterText() {
  const section = sectionDefinition($("exercise-section").value);
  return section.format === "rounds" ? `${section.rounds || 3} rounds` : setsInput.value ? `${setsInput.value} sets` : "Sets";
}
function primaryTargetType(parameters = activeParameters) {
  return PERFORMANCE_PARAMETERS.find(parameter => parameters.includes(parameter)) || "reps";
}
function defaultParametersForTarget(targetType = "reps") {
  return targetType === "duration" ? ["duration", "rest"] : targetType === "distance" ? ["distance", "rest"] : targetType === "calories" ? ["calories", "rest"] : ["reps", "weight", "rest"];
}
function exerciseParameters(exercise = {}) {
  if (Array.isArray(exercise.parameters) && exercise.parameters.length) return [...new Set(exercise.parameters.filter(parameter => PARAMETER_LABELS[parameter]))];
  return defaultParametersForTarget(exercise.targetType || (exercise.calories ? "calories" : exercise.duration ? "duration" : exercise.distance ? "distance" : "reps"));
}
function setActiveParameters(parameters, editing = parametersEditing) {
  activeParameters = [...new Set(parameters.filter(parameter => PARAMETER_LABELS[parameter]))];
  if (!activeParameters.length) activeParameters = ["reps"];
  targetTypeInput.value = primaryTargetType(activeParameters);
  parametersEditing = editing;
  renderParameterEditor();
  updateExerciseFields();
}
function renderParameterEditor() {
  if (!parameterSummary || !parameterControls) return;
  parameterSummary.replaceChildren();
  parameterSummary.append(element("span", "parameter-chip section-parameter-chip", sectionParameterText()));
  activeParameters.forEach(parameter => parameterSummary.append(element("span", "parameter-chip", parameterText(parameter))));
  parameterControls.hidden = !parametersEditing;
  editParametersButton.textContent = parametersEditing ? "Done" : "Edit";
  parameterList.replaceChildren();
  activeParameters.forEach(parameter => {
    const row = element("div", "parameter-edit-row");
    row.append(element("span", "parameter-edit-name", PARAMETER_LABELS[parameter]));
    const remove = element("button", "parameter-remove", "×");
    remove.type = "button";
    remove.setAttribute("aria-label", `Remove ${PARAMETER_LABELS[parameter]}`);
    remove.addEventListener("click", () => {
      const input = ({ reps: repsInput, duration: durationInput, distance: $("distance"), calories: caloriesInput, weight: weightInput, rest: restInput })[parameter];
      if (input) input.value = "";
      setActiveParameters(activeParameters.filter(item => item !== parameter), true);
    });
    row.append(remove); parameterList.append(row);
  });
  parameterAddSelect.replaceChildren();
  [["Performance", PERFORMANCE_PARAMETERS], ["Support", SUPPORT_PARAMETERS]].forEach(([groupName, options]) => {
    const group = document.createElement("optgroup"); group.label = groupName;
    options.filter(parameter => !activeParameters.includes(parameter)).forEach(parameter => {
      const option = element("option", "", PARAMETER_LABELS[parameter]); option.value = parameter; group.append(option);
    });
    if (group.children.length) parameterAddSelect.append(group);
  });
  parameterAddSelect.disabled = !parameterAddSelect.options.length;
  addParameterButton.disabled = parameterAddSelect.disabled;
}
editParametersButton.addEventListener("click", () => { parametersEditing = !parametersEditing; renderParameterEditor(); });
addParameterButton.addEventListener("click", () => { if (parameterAddSelect.value) setActiveParameters([...activeParameters, parameterAddSelect.value], true); });
[setsInput, repsInput, durationInput, $("distance"), caloriesInput, weightInput, restInput].forEach(input => input.addEventListener("input", renderParameterEditor));
function libraryExerciseFor(exercise) {
  return typeof getExerciseById === "function" && exercise?.exerciseId
    ? getExerciseById(exercise.exerciseId) : null;
}
function preferredTargetType(record) {
  const config = record ? getTrackingConfig(record) : null;
  if (!config) return "reps";
  if (config.calories && !config.reps && !config.duration && !config.distance) return "calories";
  if (config.duration && !config.reps) return "duration";
  if (config.distance && !config.reps) return "distance";
  return "reps";
}
function updateExerciseFields() {
  const record = libraryExerciseFor({ exerciseId: selectedLibraryExerciseId });
  const config = record ? getTrackingConfig(record) : null;
  const targetType = primaryTargetType(activeParameters);
  targetTypeInput.value = targetType;
  repsInput.closest("label").hidden = !activeParameters.includes("reps"); repsInput.disabled = !activeParameters.includes("reps");
  durationInput.closest("label").hidden = !activeParameters.includes("duration"); durationInput.disabled = !activeParameters.includes("duration");
  $("distance").closest("label").hidden = !activeParameters.includes("distance"); $("distance").disabled = !activeParameters.includes("distance");
  caloriesInput.closest("label").hidden = !activeParameters.includes("calories"); caloriesInput.disabled = !activeParameters.includes("calories");
  weightInput.closest("label").hidden = !activeParameters.includes("weight"); weightInput.disabled = !activeParameters.includes("weight");
  restInput.closest("label").hidden = !activeParameters.includes("rest"); restInput.disabled = !activeParameters.includes("rest");
  nameInput.placeholder = customExerciseMode ? "Enter custom exercise name" : "Search exercise library";
  nameInput.setCustomValidity(!customExerciseMode && !record && nameInput.value.trim()
    ? "Choose an exercise from the results, or press Create custom exercise." : "");
  $("exercise-custom-toggle").textContent = customExerciseMode ? "Use exercise library" : "Create custom exercise";
  $("exercise-custom-toggle").setAttribute("aria-pressed", String(customExerciseMode));
}
function renderExerciseLibraryResults() {
  const list = $("exercise-library-results");
  list.replaceChildren();
  const panel = $("exercise-library-picker");
  panel.hidden = customExerciseMode || !!selectedLibraryExerciseId;
  if (panel.hidden) return;
  if (typeof queryExercises !== "function") {
    $("exercise-library-count").textContent = "Library unavailable. Press Create custom exercise to continue.";
    return;
  }
  const search = nameInput.value.trim();
  const all = queryExercises({ search });
  const recent = recentExerciseRecords().map((item) => item.record).filter(Boolean);
  const favorites = allExerciseRecords().filter((record) => favoriteExerciseIds().includes(record.id));
  if (!search) {
    renderLibraryGroup(list, "RECENT", recent.slice(0, 5));
    renderLibraryGroup(list, "FAVORITES", favorites.slice(0, 8));
  }
  const results = search ? all : all.filter((record) => !recent.some((item) => item.id === record.id) && !favorites.some((item) => item.id === record.id));
  $("exercise-library-count").textContent = search ? `${all.length} matches${all.length > 20 ? " · showing first 20; keep typing to narrow results" : ""}` : "";
  renderLibraryGroup(list, search ? "RESULTS" : "EXERCISES", results.slice(0, search ? 20 : 12));
  if (!all.length && search) list.append(element("p", "tracking-help", "Not in the library? Press Create custom exercise below."));
}
function allExerciseRecords() { return queryExercises({ search: "" }) || []; }
function favoriteExerciseIds() { try { return JSON.parse(localStorage.getItem("forge-favorite-exercises") || "[]"); } catch { return []; } }
function setFavoriteExerciseIds(ids) { localStorage.setItem("forge-favorite-exercises", JSON.stringify([...new Set(ids)])); }
function recentExerciseRecords() { try { return JSON.parse(localStorage.getItem("forge-recent-exercises") || "[]").map(id => ({ id, record: getExerciseById(id) })).filter(item => item.record); } catch { return []; } }
function rememberExercise(record) { const ids = recentExerciseRecords().map(item => item.id).filter(id => id !== record.id); ids.unshift(record.id); localStorage.setItem("forge-recent-exercises", JSON.stringify(ids.slice(0, 12))); }
function renderLibraryGroup(list, title, records) {
  if (!records.length) return;
  const group = element("div", "library-group"); group.append(element("span", "library-group-title", title));
  records.forEach(record => {
    const row = element("div", "library-exercise-result");
    const choose = element("button", "library-exercise-result"); choose.type = "button"; choose.append(element("strong", "", record.name), element("span", "", `${record.primaryMuscle} · ${record.equipment}`));
    choose.addEventListener("click", () => { selectedLibraryExerciseId = record.id; nameInput.value = record.name; setActiveParameters(defaultParametersForTarget(preferredTargetType(record)), false); rememberExercise(record); updateExerciseFields(); updateExerciseSectionFields(); renderExerciseLibraryResults(); renderLastPerformance(); editParametersButton.focus(); });
    const favorite = element("button", `favorite-toggle${favoriteExerciseIds().includes(record.id) ? " is-favorite" : ""}`, favoriteExerciseIds().includes(record.id) ? "★" : "☆"); favorite.type = "button"; favorite.setAttribute("aria-label", `Favorite ${record.name}`); favorite.addEventListener("click", event => { event.stopPropagation(); const ids = favoriteExerciseIds(); setFavoriteExerciseIds(ids.includes(record.id) ? ids.filter(id => id !== record.id) : [...ids, record.id]); renderExerciseLibraryResults(); });
    row.append(choose, favorite); group.append(row);
  }); list.append(group);
}
function initializeExerciseLibrary() {
  nameInput.addEventListener("input", () => {
    selectedLibraryExerciseId = null;
    updateExerciseFields();
    renderExerciseLibraryResults();
    renderLastPerformance();
    renderLastPerformance();
  });
  nameInput.addEventListener("focus", () => {
    if (customExerciseMode) return;
    selectedLibraryExerciseId = null;
    renderExerciseLibraryResults();
  });
  $("exercise-custom-toggle").addEventListener("click", () => {
    customExerciseMode = !customExerciseMode;
    selectedLibraryExerciseId = null;
    updateExerciseFields();
    renderExerciseLibraryResults();
    nameInput.focus();
  });
  renderExerciseLibraryResults();
  renderParameterEditor();
  updateExerciseFields(); updateExerciseSectionFields(); renderLastPerformance();
}

function renderLastPerformance() {
  const box = $("last-performance");
  if (!box) return;
  box.replaceChildren();
  const name = nameInput.value.trim();
  const record = name ? exerciseRecords(name).at(-1) : null;
  box.hidden = !record;
  if (!record) return;
  const head = element("div", "last-performance-head");
  head.append(element("strong", "", "Last workout"), element("small", "", `${record.workoutName} · ${record.date}`));
  const sets = element("div", "last-performance-sets");
  const details = Array.isArray(record.entry.setsDetail) ? record.entry.setsDetail : [record.entry];
  details.slice(0, 6).forEach((detail, index) => sets.append(element("span", "performance-chip", `Set ${index + 1} · ${previousSetText({ setsDetail: [detail] }, 0)}`)));
  const use = element("button", "action-button", "Use Last"); use.type = "button"; use.addEventListener("click", () => useLastPerformance(record));
  box.append(head, sets, use);
}
function useLastPerformance(record) {
  const entry = record?.entry;
  if (!entry) return;
  setsInput.value = entry.sets ?? setsInput.value;
  const detail = entry.setsDetail?.[0] ?? entry;
  repsInput.value = detail.reps ?? entry.reps ?? "";
  weightInput.value = detail.weight ?? entry.weight ?? "";
  durationInput.value = detail.duration ?? entry.duration ?? "";
  $("distance").value = detail.distance ?? entry.distance ?? "";
  caloriesInput.value = detail.calories ?? entry.calories ?? "";
  restInput.value = entry.rest ?? restInput.value;
  const targetType = detail.calories || entry.calories ? "calories" : detail.duration || entry.duration ? "duration" : detail.distance || entry.distance ? "distance" : "reps";
  setActiveParameters(defaultParametersForTarget(targetType));
  updateExerciseFields();
  notify("Last performance loaded");
}

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

function setBuilderStage(stage) {
  builderStage = ["details", "build", "review"].includes(stage) ? stage : "details";
  newWorkoutCard.dataset.builderStage = builderStage;
  const order = ["details", "build", "review"];
  newWorkoutCard.querySelectorAll("[data-builder-step]").forEach((step) => {
    const index = order.indexOf(step.dataset.builderStep);
    const current = order.indexOf(builderStage);
    step.classList.toggle("is-active", index === current);
    step.classList.toggle("is-complete", index < current);
    step.setAttribute("aria-current", index === current ? "step" : "false");
  });
  const heading = $("builder-build-heading");
  if (heading) heading.hidden = builderStage !== "build";
  const review = $("builder-review-panel");
  if (review) review.hidden = builderStage !== "review";
  const preview = $("builder-preview");
  const save = $("builder-save");
  if (preview) { preview.hidden = builderStage === "details"; preview.textContent = "Preview"; }
  if (save) save.hidden = builderStage !== "review";
  if (builderStage === "build") renderSections();
  if (builderStage === "review") renderBuilderReview();
  persistBuilderDraft();
}
function builderSnapshot() {
  return {
    sections: sections.map(section => ({ ...section })),
    exercises: exercises.map(exercise => ({ ...exercise })),
    stage: builderStage,
    buildStep: builderBuildStep,
  };
}
function pushBuilderHistory() {
  builderHistory.push(builderSnapshot());
  if (builderHistory.length > 40) builderHistory.shift();
}
function restoreBuilderSnapshot(snapshot) {
  if (!snapshot) return false;
  sections = normalizeSections(snapshot.sections);
  exercises = snapshot.exercises.map(exercise => ({ ...exercise }));
  editingIndex = null;
  resetExerciseForm();
  renderSections();
  renderExercises();
  setBuilderStage(snapshot.stage || "build");
  setBuilderBuildStep(snapshot.buildStep || "exercise");
  return true;
}
function undoBuilderStep() {
  if (builderHistory.length) {
    const snapshot = builderHistory.pop();
    restoreBuilderSnapshot(snapshot);
    if (builderBuildStep === "exercise" && sections.length > 1) {
      const currentEntries = sectionGroups(exercises, sections).find(group => group.id === sections.at(-1).id)?.entries || [];
      if (!currentEntries.length && builderHistory.length) restoreBuilderSnapshot(builderHistory.pop());
    }
    return true;
  }
  return false;
}
function syncGuidedSectionFields() {
  const section = sections.at(-1) || sections[0] || { name: "", format: "sets", rounds: 3 };
  const name = $("guided-section-name");
  const format = $("guided-section-format");
  const rounds = $("guided-section-rounds");
  if (!name || !format || !rounds) return;
  name.value = section.name === "Main Workout" && !exercises.length ? "" : section.name;
  format.value = section.format === "rounds" ? "rounds" : "sets";
  rounds.replaceChildren();
  for (let count = 1; count <= 20; count++) { const option = element("option", "", String(count)); option.value = String(count); rounds.append(option); }
  rounds.value = String(section.rounds || 3);
  $("guided-rounds-field").hidden = format.value !== "rounds";
  const sectionNumber = $("builder-section-number");
  if (sectionNumber) sectionNumber.textContent = `SECTION ${Math.max(1, sections.indexOf(section) + 1)}`;
}
function setBuilderBuildStep(step) {
  builderBuildStep = step === "exercise" ? "exercise" : "section";
  newWorkoutCard.dataset.builderBuildStep = builderBuildStep;
  const setup = $("builder-section-setup");
  if (setup) setup.hidden = builderBuildStep !== "section";
  const heading = $("builder-exercise-heading");
  if (heading) heading.hidden = builderBuildStep !== "exercise";
  if (builderBuildStep === "section") syncGuidedSectionFields();
  updateBuilderExerciseHeading();
  renderGuidedExerciseList();
}
function updateBuilderExerciseHeading() {
  const section = sections.at(-1) || sections[0];
  if (!section) return;
  const label = $("builder-exercise-section-label");
  const number = $("builder-exercise-number");
  const entries = sectionGroups(exercises, sections).find(group => group.id === section.id)?.entries || [];
  if (label) label.textContent = section.name.toUpperCase();
  if (number) number.textContent = `Exercise ${entries.length + 1}`;
}
function renderGuidedExerciseList() {
  const list = $("builder-guided-exercises");
  const actions = $("builder-guided-actions");
  if (!list || !actions) return;
  list.replaceChildren();
  const hasExercises = exercises.length > 0;
  list.hidden = !hasExercises || builderBuildStep !== "exercise";
  actions.hidden = !hasExercises || builderBuildStep !== "exercise";
  if (!hasExercises) return;
  sectionGroups(exercises, sections).forEach(group => {
    if (sectionGroups(exercises, sections).length > 1) list.append(element("p", "builder-guided-section-label", group.name.toUpperCase()));
    group.entries.forEach(({ exercise, index }) => {
      const item = element("button", "builder-guided-exercise");
      item.type = "button";
      item.append(element("span", "builder-guided-exercise-check", "✓"));
      const copy = element("span", "builder-guided-exercise-copy");
      copy.append(element("strong", "", exercise.name), element("span", "", exerciseSummary(exercise).join(" · ") || "Target not set"));
      item.append(copy);
      item.addEventListener("click", () => editExercise(index));
      list.append(item);
    });
  });
}
function renderBuilderReview() {
  const summary = $("builder-review-summary");
  const warningsBox = $("builder-review-warnings");
  if (!summary || !warningsBox) return;
  summary.replaceChildren();
  const intro = element("div", "builder-review-intro");
  intro.append(element("p", "", `${exercises.length} ${exercises.length === 1 ? "exercise" : "exercises"} · ${sections.length} ${sections.length === 1 ? "section" : "sections"} · ${formatEstimatedDuration(estimatedWorkoutSeconds()).replace("Estimated duration · ", "")}`));
  summary.append(intro);
  const warnings = [];
  sectionGroups(exercises, sections).forEach(group => {
    const section = element("div", "builder-review-section");
    const heading = element("div", "builder-review-section-heading");
    const definition = sectionDefinition(group.id, sections);
    heading.append(element("h3", "", group.name), element("span", "", definition.format === "rounds" ? `${definition.rounds} rounds` : "Sets"));
    section.append(heading);
    group.entries.forEach(({ exercise, index }) => {
      const row = element("div", "builder-review-exercise");
      const copy = element("div", "builder-review-exercise-copy");
      const targetType = exercise.targetType || (exercise.calories ? "calories" : exercise.duration ? "duration" : exercise.distance ? "distance" : "reps");
      const target = targetType === "calories" ? exercise.calories : targetType === "duration" ? exercise.duration : targetType === "distance" ? exercise.distance : exercise.reps;
      if (!target) warnings.push(`${exercise.name} is missing a ${targetType} target.`);
      copy.append(element("strong", "", exercise.name), element("span", "", exerciseSummary(exercise).join(" · ") || "Target not set"));
      const edit = element("button", "action-button builder-review-edit", "Edit");
      edit.type = "button";
      edit.addEventListener("click", () => { setBuilderStage("build"); setBuilderBuildStep("exercise"); editExercise(index); });
      row.append(copy, edit); section.append(row);
    });
    summary.append(section);
  });
  warningsBox.replaceChildren();
  warningsBox.hidden = !warnings.length;
  if (warnings.length) { warningsBox.append(element("strong", "", "Review before saving")); warnings.slice(0, 5).forEach(warning => warningsBox.append(element("div", "", `• ${warning}`))); }
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
  const parts = exercise.sets !== undefined && exercise.sets !== "" ? [`${exercise.sets} sets`] : [];
  for (const [field, unit] of [["reps", "reps"], ["weight", "lbs"],
    ["duration", exercise.durationUnit === "sec" ? "sec" : "min"], ["distance", "mi"], ["calories", "cal"], ["rest", "sec"]]) {
    if (exercise[field] != null && exercise[field] !== "") parts.push(`${exercise[field]} ${unit}`);
  }
  return parts;
}
function readTemplates(key) {
  try { const value = JSON.parse(localStorage.getItem(key) || "[]"); return Array.isArray(value) ? value : []; }
  catch { return []; }
}
function writeTemplates(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
function estimatedWorkoutSeconds(exerciseList = exercises, sectionDefs = sections) {
  const steps = buildPlayerSteps(exerciseList, sectionDefs);
  return steps.reduce((total, step, index) => {
    const exercise = step.exercise || {};
    const work = Number(exercise.duration) > 0 ? Number(exercise.duration) : Number(exercise.reps) > 0 ? Number(exercise.reps) * 4 : 30;
    const rest = index < steps.length - 1 ? Math.max(0, Number(exercise.rest) || 0) : 0;
    return total + work + rest;
  }, 0);
}
function formatEstimatedDuration(seconds) {
  if (!seconds) return "Estimated duration —";
  return `Estimated duration · ${Math.max(1, Math.round(seconds / 60))} min`;
}
function updateEstimatedDuration() {
  const output = $("estimated-duration");
  if (output) output.textContent = formatEstimatedDuration(estimatedWorkoutSeconds());
}
function renderBuilderValidation() {
  const box = $("builder-validation");
  if (!box) return;
  const warnings = [];
  if (!exercises.length) warnings.push("Add an exercise to begin building this workout.");
  sections.forEach(section => {
    const entries = sectionGroups(exercises, sections).find(group => group.id === section.id)?.entries || [];
    if (!entries.length) warnings.push(`${section.name} is empty and will be skipped when the workout starts.`);
  });
  exercises.forEach(exercise => {
    const targetType = exercise.targetType || (exercise.calories ? "calories" : exercise.duration ? "duration" : exercise.distance ? "distance" : "reps");
    const target = targetType === "calories" ? exercise.calories : targetType === "duration" ? exercise.duration : targetType === "distance" ? exercise.distance : exercise.reps;
    if (!target) warnings.push(`${exercise.name || "An exercise"} is missing a ${targetType} target.`);
  });
  box.hidden = !warnings.length;
  box.replaceChildren();
  if (warnings.length) {
    box.append(element("strong", "", warnings.length === 1 ? "Builder check" : "Builder checks"));
    warnings.slice(0, 4).forEach(message => box.append(element("span", "", `• ${message}`)));
    if (warnings.length > 4) box.append(element("span", "", `• ${warnings.length - 4} more check${warnings.length - 4 === 1 ? "" : "s"}`));
  }
}
function populateWorkoutTemplates() {
  const select = $("workout-template");
  if (!select) return;
  const selected = select.value;
  select.replaceChildren(element("option", "", "Choose a saved template"));
  readTemplates(WORKOUT_TEMPLATES_KEY).forEach((template) => {
    const option = element("option", "", template.name); option.value = template.id; select.append(option);
  });
  if (selected) select.value = selected;
  const sectionSelect = $("section-template");
  if (sectionSelect) {
    sectionSelect.replaceChildren(element("option", "", "Insert saved section"));
    readTemplates(SECTION_TEMPLATES_KEY).forEach((template) => { const option = element("option", "", template.name); option.value = template.id; sectionSelect.append(option); });
  }
}
function readBuilderDraft() {
  try {
    const draft = JSON.parse(localStorage.getItem(WORKOUT_DRAFT_KEY) || "null");
    return draft && typeof draft === "object" ? draft : null;
  } catch { return null; }
}
function updateBuilderStartOptions() {
  const status = $("workout-start-status");
  const continueButton = $("continue-draft-workout");
  if (!status || !continueButton) return;
  const draft = readBuilderDraft();
  continueButton.disabled = !draft;
  status.textContent = draft?.name ? `Draft available: ${draft.name}` : "No saved drafts yet.";
  status.classList.toggle("has-draft", Boolean(draft));
}
function persistBuilderDraft() {
  if (!workoutNameInput?.value.trim() && !exercises.length && !$("workout-description")?.value.trim()) {
    updateBuilderStartOptions();
    return;
  }
  const draft = {
    name: workoutNameInput.value.trim(),
    description: $("workout-description").value.trim(),
    notes: $("workout-notes").value.trim(),
    date: workoutDateInput.value,
    sections: sections.map(section => ({ ...section })),
    exercises: exercises.map(exercise => ({ ...exercise })),
    stage: builderStage,
    buildStep: builderBuildStep,
    updatedAt: new Date().toISOString(),
  };
  try {
    localStorage.setItem(WORKOUT_DRAFT_KEY, JSON.stringify(draft));
    const status = $("builder-save-status");
    if (status && editorOpen) { status.textContent = "Draft saved"; status.dataset.state = "saved"; }
  } catch (error) { console.error("Unable to save workout draft:", error); }
  updateBuilderStartOptions();
}
function clearBuilderDraft() {
  try { localStorage.removeItem(WORKOUT_DRAFT_KEY); } catch (error) { console.error("Unable to clear workout draft:", error); }
  updateBuilderStartOptions();
}
function openWorkoutStartChooser() {
  setHeaderMenu(false);
  editorOpen = false;
  workoutStartOpen = true;
  templatesOpen = false;
  calendarOpen = progressOpen = profileOpen = weightOpen = false;
  updateBuilderStartOptions();
  setWorkoutState("not-started");
  window.scrollTo({ top: 0, behavior: "smooth" });
}
function openTemplatesScreen() {
  setHeaderMenu(false);
  editorOpen = false;
  workoutStartOpen = false;
  templatesOpen = true;
  calendarOpen = progressOpen = profileOpen = weightOpen = false;
  renderTemplatesScreen();
  setWorkoutState("not-started");
  window.scrollTo({ top: 0, behavior: "smooth" });
}
function renderTemplatesScreen() {
  const list = $("templates-list");
  if (!list) return;
  list.replaceChildren();
  const templates = readTemplates(WORKOUT_TEMPLATES_KEY);
  if (!templates.length) { list.append(emptyState("No saved templates yet", "Save a workout as a template from the Review stage.")); return; }
  templates.forEach(template => {
    const item = element("article", "template-library-item");
    const copy = element("div", "template-library-copy");
    const description = template.description || "Saved workout template";
    copy.append(element("strong", "", template.name), element("span", "", `${template.sections?.length || 0} sections · ${template.exercises?.length || 0} exercises · ${description}`));
    const use = element("button", "btn primary", "Use Template");
    use.type = "button";
    use.addEventListener("click", () => loadTemplateFromScreen(template.id));
    item.append(copy, use);
    list.append(item);
  });
}
function loadTemplateFromScreen(id) {
  const template = readTemplates(WORKOUT_TEMPLATES_KEY).find(item => item.id === id);
  if (!template) return;
  if (readBuilderDraft() && !confirm("Replace the current draft with this template?")) return;
  clearBuilderDraft();
  builderHistory = [];
  editingWorkoutId = null;
  workoutNameInput.value = template.name || "";
  $("workout-description").value = template.description || "";
  $("workout-notes").value = template.notes || "";
  sections = normalizeSections(template.sections);
  exercises = (template.exercises || []).map(exercise => ({ ...exercise }));
  renderSections();
  renderExercises();
  workoutStartOpen = templatesOpen = false;
  editorOpen = true;
  setBuilderStage("details");
  setBuilderBuildStep("section");
  setWorkoutState("not-started");
  notify(`${template.name} loaded.`);
}
function startBlankBuilder() {
  if (readBuilderDraft() && !confirm("Start a blank workout and replace the current draft?")) return;
  clearBuilderDraft();
  builderHistory = [];
  editingWorkoutId = null;
  exercises = [];
  sections = [{ id: "main", name: "Main Workout", format: "sets", rounds: 3 }];
  resetExerciseForm();
  workoutNameInput.value = "";
  $("workout-description").value = "";
  $("workout-notes").value = "";
  renderSections();
  renderExercises();
  workoutStartOpen = templatesOpen = false;
  editorOpen = true;
  setBuilderStage("details");
  setBuilderBuildStep("section");
  setWorkoutState("not-started");
  workoutNameInput.focus();
  notify("Blank workout ready.");
}
function continueBuilderDraft() {
  const draft = readBuilderDraft();
  if (!draft) { notify("No saved draft is available yet."); return; }
  builderHistory = [];
  editingWorkoutId = null;
  workoutNameInput.value = draft.name || "";
  $("workout-description").value = draft.description || "";
  $("workout-notes").value = draft.notes || "";
  sections = normalizeSections(draft.sections);
  exercises = Array.isArray(draft.exercises) ? draft.exercises.map(exercise => ({ ...exercise })) : [];
  renderSections();
  renderExercises();
  setBuilderStage("details");
  setBuilderBuildStep("section");
  workoutStartOpen = templatesOpen = false;
  editorOpen = true;
  setWorkoutState("not-started");
  notify(`${draft.name || "Draft"} loaded.`);
}
function saveWorkoutAsTemplate() {
  if (!workoutNameInput.value.trim()) { workoutNameInput.focus(); notify("Name the workout before saving it as a template."); return; }
  if (!exercises.length) { notify("Add at least one exercise before saving a template."); return; }
  const name = prompt("Template name", workoutNameInput.value.trim())?.trim();
  if (!name) return;
  const templates = readTemplates(WORKOUT_TEMPLATES_KEY);
  const template = { id: `template-${Date.now()}-${Math.random().toString(36).slice(2)}`, name, description: $("workout-description").value.trim(), sections: sections.map(section => ({ ...section })), exercises: exercises.map(exercise => ({ ...exercise })), notes: $("workout-notes").value.trim(), estimatedSeconds: estimatedWorkoutSeconds() };
  writeTemplates(WORKOUT_TEMPLATES_KEY, [template, ...templates.filter(item => item.name.toLocaleLowerCase() !== name.toLocaleLowerCase())].slice(0, 30));
  populateWorkoutTemplates(); $("workout-template").value = template.id;
  notify(`${name} saved as a template.`);
}
function applyWorkoutTemplate(id) {
  const template = readTemplates(WORKOUT_TEMPLATES_KEY).find(item => item.id === id);
  if (!template) return;
  if ((workoutNameInput.value.trim() || exercises.length) && !confirm("Replace the current workout with this template?")) { $("workout-template").value = ""; return; }
  editingWorkoutId = null; workoutNameInput.value = template.name; $("workout-description").value = template.description || ""; $("workout-notes").value = template.notes || "";
  sections = normalizeSections(template.sections); exercises = (template.exercises || []).map(exercise => ({ ...exercise }));
  renderSections(); renderExercises(); notify(`${template.name} loaded.`);
}
function saveSectionAsTemplate(section, entries) {
  const name = prompt("Section template name", section.name)?.trim();
  if (!name) return;
  const templates = readTemplates(SECTION_TEMPLATES_KEY);
  const template = { id: `section-template-${Date.now()}-${Math.random().toString(36).slice(2)}`, name, section: { ...section, id: "template-section" }, exercises: entries.map(({ exercise }) => ({ ...exercise, sectionId: "template-section" })) };
  writeTemplates(SECTION_TEMPLATES_KEY, [template, ...templates.filter(item => item.name.toLocaleLowerCase() !== name.toLocaleLowerCase())].slice(0, 30));
  notify(`${name} section saved as a template.`);
}
function insertSectionTemplate(id) {
  const template = readTemplates(SECTION_TEMPLATES_KEY).find(item => item.id === id);
  if (!template) return;
  const section = { ...template.section, id: `section-${Date.now()}-${Math.random().toString(36).slice(2)}`, name: template.name };
  sections.push(section);
  exercises.push(...(template.exercises || []).map(exercise => ({ ...exercise, sectionId: section.id })));
  renderSections(); renderExercises(); notify(`${template.name} section inserted.`);
}
function normalizeSections(source) {
  const valid = Array.isArray(source) ? source.filter((section) =>
    section && typeof section.id === "string" && typeof section.name === "string" && section.name.trim()) : [];
  const seen = new Set();
  const ordered = valid.filter((section) => {
    if (seen.has(section.id)) return false;
    seen.add(section.id); return true;
  }).map((section) => ({
    id: section.id,
    name: section.name.trim(),
    format: section.format === "rounds" ? "rounds" : "sets",
    rounds: Math.max(1, Math.min(100, Number(section.rounds) || 3)),
  }));
  if (!seen.has("main")) ordered.unshift({ id: "main", name: "Main Workout", format: "sets", rounds: 3 });
  return ordered;
}

function sectionDefinition(sectionId, sectionDefs = sections) {
  return normalizeSections(sectionDefs).find((section) => section.id === (sectionId || "main"))
    || normalizeSections(sectionDefs)[0] || { id: "main", name: "Main Workout", format: "sets", rounds: 3 };
}

function sectionQuantityLabel(section) {
  return section.format === "rounds" ? `${section.rounds} rounds` : "Per exercise";
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
    row.draggable = true;
    row.addEventListener("dragstart", (event) => {
      event.dataTransfer.setData("application/x-forge-section", section.id);
      event.dataTransfer.effectAllowed = "move";
      row.classList.add("dragging");
    });
    row.addEventListener("dragend", () => {
      row.classList.remove("dragging");
      list.querySelectorAll(".reorder-target").forEach((target) => target.classList.remove("reorder-target"));
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
    const label = element("label", "section-name-field");
    const input = element("input"); input.type = "text"; input.maxLength = 60; input.value = section.name;
    input.placeholder = "Section name";
    input.addEventListener("change", () => {
      const value = input.value.trim();
      if (!value) { input.value = section.name; notify("Section names cannot be empty."); return; }
      section.name = value; renderSections(); renderExercises();
    });
    label.append(input);
    const formatLabel = element("label", "section-format-field");
    const format = element("select");
    format.setAttribute("aria-label", `${section.name} format`);
    [["sets", "Sets"], ["rounds", "Rounds"]].forEach(([value, text]) => {
      const option = element("option", "", text); option.value = value; format.append(option);
    });
    format.value = section.format;
    format.addEventListener("change", () => {
      section.format = format.value;
      renderSections(); renderExercises();
      updateExerciseFields();
    });
    formatLabel.append(format);
    const quantityLabel = element("label", "section-quantity-field");
    const quantity = element("select");
    quantity.setAttribute("aria-label", `${section.name} rounds`);
    for (let count = 1; count <= 20; count++) {
      const option = element("option", "", String(count)); option.value = String(count); quantity.append(option);
    }
    quantity.value = String(section.rounds);
    quantityLabel.hidden = section.format !== "rounds";
    quantity.disabled = section.format !== "rounds";
    quantity.addEventListener("change", () => { section.rounds = Number(quantity.value) || 3; renderExercises(); renderParameterEditor(); });
    quantityLabel.append(quantity);
    row.append(label, formatLabel, quantityLabel);
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
  updateExerciseFields(); updateExerciseSectionFields();
  renderLastPerformance();
  updateEstimatedDuration();
  renderBuilderValidation();
}
$("add-section").addEventListener("click", () => {
  const input = $("new-section-name");
  const name = input.value.trim();
  if (!name) { input.focus(); notify("Enter a section name."); return; }
  if (sections.some((section) => section.name.toLocaleLowerCase() === name.toLocaleLowerCase())) {
    notify("That section name is already in use."); return;
  }
  const id = typeof crypto.randomUUID === "function" ? crypto.randomUUID() : `section-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  sections.push({ id, name, format: "sets", rounds: 3 }); input.value = "";
  renderSections(); renderExercises(); $("exercise-section").value = id;
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

function reorderExercises(sourceIndex, targetIndex, targetSectionId) {
  if (sourceIndex === targetIndex || !exercises[sourceIndex] || !exercises[targetIndex]) return;
  const [moved] = exercises.splice(sourceIndex, 1);
  moved.sectionId = targetSectionId;
  const insertAt = sourceIndex < targetIndex ? targetIndex - 1 : targetIndex;
  exercises.splice(insertAt, 0, moved);
  renderExercises();
}

function renderExercises() {
  exerciseList.replaceChildren();
  updateBuilderExerciseHeading();
  renderGuidedExerciseList();
  const count = $("section-count");
  if (count) count.textContent = `${sections.length} ${sections.length === 1 ? "section" : "sections"}`;
  updateEstimatedDuration();
  renderBuilderValidation();
  const status = $("builder-save-status");
  if (status) { status.textContent = "Draft updated"; status.dataset.state = "dirty"; }
  if (!exercises.length) {
    for (const section of sections) exerciseList.append(buildSectionCard(section, []));
    persistBuilderDraft();
    return;
  }
  for (const group of sectionGroups(exercises, sections)) {
    exerciseList.append(buildSectionCard(sectionDefinition(group.id, sections), group.entries));
  }
  persistBuilderDraft();
}

function buildSectionCard(section, entries) {
  const card = element("section", "section-card");
  card.dataset.sectionId = section.id;
  const header = element("div", "section-card-header");
  const title = element("div", "section-card-title");
  title.append(element("h3", "", section.name));
  const meta = element("div", "section-card-meta");
  const format = element("select", "section-chip");
  format.setAttribute("aria-label", `${section.name} format`);
  [["sets", "Sets"], ["rounds", "Rounds"]].forEach(([value, text]) => { const option = element("option", "", text); option.value = value; format.append(option); });
  format.value = section.format;
  format.addEventListener("change", () => { section.format = format.value; renderSections(); renderExercises(); updateExerciseFields(); });
  meta.append(format);
  if (section.format === "rounds") {
    const quantity = element("select", "section-chip");
    quantity.setAttribute("aria-label", `${section.name} rounds`);
    for (let count = 1; count <= 20; count++) { const option = element("option", "", String(count)); option.value = String(count); quantity.append(option); }
    quantity.value = String(section.rounds);
    quantity.addEventListener("change", () => { section.rounds = Number(quantity.value) || 3; renderExercises(); renderParameterEditor(); });
    meta.append(quantity, element("span", "section-chip", "rounds"));
  } else meta.append(element("span", "section-chip", "Per exercise"));
  title.append(meta);
  const actions = element("div", "section-card-actions");
  const menu = element("details", "section-menu");
  const summary = element("summary", "action-button", "⋮"); summary.setAttribute("aria-label", `${section.name} menu`);
  const panel = element("div", "section-menu-panel");
  const menuAction = (label, handler, danger = false) => { const button = element("button", danger ? "delete" : "", label); button.type = "button"; button.addEventListener("click", () => { menu.open = false; handler(); }); panel.append(button); };
  menuAction("Rename", () => { const name = prompt("Section name", section.name)?.trim(); if (name) { section.name = name; renderSections(); renderExercises(); } });
  menuAction("Duplicate", () => { const copy = { ...section, id: `section-${Date.now()}-${Math.random().toString(36).slice(2)}`, name: `${section.name} Copy` }; sections.splice(sections.indexOf(section) + 1, 0, copy); const copied = entries.map(({ exercise }) => ({ ...exercise, sectionId: copy.id })); exercises.push(...copied); renderSections(); renderExercises(); });
  menuAction("Save as Template", () => saveSectionAsTemplate(section, entries));
  menuAction("Move up", () => moveSection(section.id, sections[Math.max(0, sections.findIndex(item => item.id === section.id) - 1)]?.id));
  menuAction("Move down", () => moveSection(section.id, sections[Math.min(sections.length - 1, sections.findIndex(item => item.id === section.id) + 1)]?.id));
  menuAction("Collapse", () => card.classList.toggle("is-collapsed"));
  if (section.id !== "main") menuAction("Delete", () => { exercises.forEach(exercise => { if (exercise.sectionId === section.id) exercise.sectionId = "main"; }); sections = sections.filter(item => item.id !== section.id); renderSections(); renderExercises(); }, true);
  menu.append(summary, panel); actions.append(menu); header.append(title, actions); card.append(header);
  const exerciseWrap = element("div", "section-card-exercises");
  if (!entries.length) exerciseWrap.append(emptyState("No exercises yet", "Add an exercise to this section."));
  for (const { exercise, index } of entries) {
    const item = element("div", "exercise-item");
    item.draggable = true;
    item.dataset.exerciseIndex = String(index);
    item.addEventListener("dragstart", (event) => {
      event.dataTransfer.setData("application/x-forge-exercise", String(index));
      event.dataTransfer.effectAllowed = "move";
      item.classList.add("dragging");
    });
    item.addEventListener("dragend", () => item.classList.remove("dragging"));
    item.addEventListener("dragover", (event) => {
      if (!event.dataTransfer.types.includes("application/x-forge-exercise")) return;
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
      item.classList.add("reorder-target");
    });
    item.addEventListener("dragleave", () => item.classList.remove("reorder-target"));
    item.addEventListener("drop", (event) => {
      const sourceIndex = Number(event.dataTransfer.getData("application/x-forge-exercise"));
      if (!Number.isInteger(sourceIndex)) return;
      event.preventDefault();
      event.stopPropagation();
      item.classList.remove("reorder-target");
      reorderExercises(sourceIndex, index, group.id);
    });
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
    const more = element("details", "section-menu");
    const moreSummary = element("summary", "action-button", "⋮"); moreSummary.setAttribute("aria-label", `${exercise.name} menu`);
    const morePanel = element("div", "section-menu-panel");
    const exerciseAction = (label, handler, danger = false) => { const button = element("button", danger ? "delete" : "", label); button.type = "button"; button.addEventListener("click", () => { more.open = false; handler(); }); morePanel.append(button); };
    exerciseAction("Duplicate", () => duplicateExercise(index));
    exerciseAction("Replace", () => replaceExercise(index));
    exerciseAction("Move", () => moveExerciseToSection(index));
    exerciseAction("Delete", () => deleteExercise(index), true);
    more.append(moreSummary, morePanel); actions.append(edit, more);
    item.append(main, actions);
    exerciseWrap.append(item);
  }
  const add = element("button", "btn secondary section-add-exercise", "+ Add Exercise"); add.type = "button"; add.addEventListener("click", () => { $("exercise-section").value = section.id; updateExerciseSectionFields(); nameInput.focus(); form.scrollIntoView({ behavior: "smooth", block: "center" }); });
  card.append(exerciseWrap, add);
  return card;
}

function resetExerciseForm() {
  const selectedSection = $("exercise-section").value;
  form.reset();
  $("exercise-section").value = selectedSection;
  selectedLibraryExerciseId = null;
  customExerciseMode = false;
  setActiveParameters(["reps", "weight", "rest"], false);
  updateExerciseFields();
  renderExerciseLibraryResults();
  editingIndex = null;
  $("form-title").textContent = "Add Exercise";
  submitButton.textContent = "+ Add Exercise";
  cancelButton.hidden = true;
  updateExerciseFields(); updateExerciseSectionFields();
}

function updateExerciseSectionFields() {
  const format = sectionDefinition($("exercise-section").value).format;
  const setsLabel = setsInput.closest("label");
  setsLabel.hidden = format === "rounds";
  setsInput.disabled = format === "rounds";
  setsInput.required = format === "sets";
  if (format === "rounds") setsInput.value = "";
  renderParameterEditor();
}

$("exercise-section").addEventListener("change", () => {
  updateExerciseSectionFields();
  renderExercises();
});
function editExercise(index) {
  const exercise = exercises[index];
  if (!exercise) return;
  editingIndex = index;
  nameInput.value = exercise.name;
  setsInput.value = exercise.sets;
  repsInput.value = exercise.reps;
  weightInput.value = exercise.weight;
  durationInput.value = exercise.duration ?? "";
  $("distance").value = exercise.distance ?? "";
  caloriesInput.value = exercise.calories ?? "";
  restInput.value = exercise.rest ?? "";
  setActiveParameters(exerciseParameters(exercise), false);
  selectedLibraryExerciseId = libraryExerciseFor(exercise)?.id ?? null;
  customExerciseMode = !selectedLibraryExerciseId;
  updateExerciseFields();
  renderExerciseLibraryResults();
  $("exercise-section").value = exercise.sectionId ?? "main";
  $("form-title").textContent = "Edit Exercise";
  submitButton.textContent = "Save Changes";
  cancelButton.hidden = false;
  form.scrollIntoView({ behavior: "smooth", block: "center" });
  nameInput.focus();
  updateExerciseFields(); updateExerciseSectionFields();
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
function duplicateExercise(index) {
  const source = exercises[index]; if (!source) return;
  exercises.splice(index + 1, 0, { ...source, name: `${source.name} Copy` });
  renderExercises(); notify(`${source.name} duplicated`);
}
function replaceExercise(index) {
  if (!exercises[index]) return;
  editExercise(index); nameInput.value = ""; selectedLibraryExerciseId = null; customExerciseMode = false; updateExerciseFields(); renderExerciseLibraryResults(); nameInput.focus();
}
function moveExerciseToSection(index) {
  const exercise = exercises[index]; if (!exercise) return;
  const choices = sections.map((section, item) => `${item + 1}. ${section.name}`).join("\n");
  const selected = Number(prompt(`Move ${exercise.name} to:\n${choices}`, String(sections.findIndex(section => section.id === (exercise.sectionId ?? "main")) + 1)));
  if (!Number.isInteger(selected) || !sections[selected - 1]) return;
  exercise.sectionId = sections[selected - 1].id; renderExercises(); notify(`${exercise.name} moved`);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const wasEditing = editingIndex !== null;
  const exercise = {
    ...(wasEditing ? exercises[editingIndex] : {}),
    exerciseId: selectedLibraryExerciseId,
    name: nameInput.value.trim(),
    sets: sectionDefinition($("exercise-section").value).format === "rounds" ? "" : setsInput.value,
    reps: repsInput.value,
    weight: weightInput.value,
    targetType: primaryTargetType(activeParameters),
    parameters: [...activeParameters],
    duration: durationInput.value,
    durationUnit: "sec",
    distance: $("distance").value,
    distanceUnit: "mi",
    calories: caloriesInput.value,
    caloriesUnit: "cal",
    rest: restInput.value,
    sectionId: $("exercise-section").value || "main",
  };
  if (!exercise.name || !form.reportValidity()) return;
  if (editingIndex === null) {
    pushBuilderHistory();
    exercises.push(exercise);
  }
  else exercises[editingIndex] = exercise;
  if (workoutState === "finished") setWorkoutState("not-started");
  notify(`${exercise.name} ${editingIndex === null ? "added" : "updated"}`);
  resetExerciseForm();
  renderExercises();
  renderLastPerformance();
  nameInput.focus();
});
cancelButton.addEventListener("click", () => {
  resetExerciseForm();
  nameInput.focus();
});

function setWorkoutState(state) {
  workoutState = state;
  const sessionOpen = state === "active" || state === "paused" || state === "recap" || state === "overview";
  startButton.textContent =
    state === "active" ? (session?.mode === "manual" ? "Save Results" : "Finish Workout") : "Start Workout";
  $("tracking-finish").textContent = startButton.textContent;
  saveButton.disabled = sessionOpen;
  saveButton.hidden = sessionOpen || !editorOpen;
  $("add-new-workout").hidden = false;
  $("add-new-workout").disabled = sessionOpen;
  $("open-calendar").hidden = false;
  $("open-calendar").disabled = sessionOpen;
  $("open-progress").hidden = false;
  $("open-progress").disabled = sessionOpen;
  $("open-goals").hidden = false;
  $("open-goals").disabled = sessionOpen;
  $("open-profile").hidden = false;
  $("open-profile").disabled = sessionOpen;
  $("back-dashboard").hidden = sessionOpen || (!editorOpen && !workoutStartOpen && !templatesOpen && !calendarOpen && !progressOpen && !goalsOpen && !profileOpen && !weightOpen);
  $("export-forge").hidden = false;
  $("export-forge").disabled = sessionOpen;
  document.body.classList.toggle("editor-open", (editorOpen || workoutStartOpen) && !sessionOpen);
  document.body.classList.toggle("calendar-mode", calendarOpen && !sessionOpen);
  document.body.classList.toggle("progress-mode", progressOpen && !sessionOpen);
  document.body.classList.toggle("goals-mode", goalsOpen && !sessionOpen);
  document.body.classList.toggle("workouts-compact", !editorOpen && savedView === "compact" && !sessionOpen);
  $("saved-view-toggle").hidden = editorOpen || workoutStartOpen || templatesOpen || progressOpen || goalsOpen || profileOpen || weightOpen || sessionOpen;
  document.body.classList.toggle("dashboard-mode", !editorOpen && !workoutStartOpen && !templatesOpen && !calendarOpen && !progressOpen && !goalsOpen && !profileOpen && !weightOpen && !sessionOpen);
  saveButton.textContent = editingWorkoutId ? "Save Changes" : "Save Workout";
  $("cancel-workout-edit").hidden = state === "active" || !editingWorkoutId;
  $("timer-label").textContent = "Workout Time";
  $("timer-edit").hidden = state !== "active" || session?.mode !== "manual";
  document.querySelector(".stopwatch").hidden = state !== "active" || session?.mode === "manual";
  newWorkoutCard.hidden = sessionOpen || !editorOpen;
  $("workout-start-card").hidden = sessionOpen || !workoutStartOpen;
  $("templates-card").hidden = sessionOpen || !templatesOpen;
  calendarCard.hidden = sessionOpen || editorOpen || workoutStartOpen || templatesOpen || progressOpen || goalsOpen || profileOpen || weightOpen;
  $("progress-card").hidden = sessionOpen || !progressOpen;
  $("goals-card").hidden = sessionOpen || !goalsOpen;
  $("profile-card").hidden = sessionOpen || !profileOpen;
  $("weight-card").hidden = sessionOpen || !weightOpen;
  $("open-weight").hidden = false;
  $("open-weight").disabled = sessionOpen;
  historyCard.hidden = sessionOpen || editorOpen || workoutStartOpen || templatesOpen || progressOpen || goalsOpen || profileOpen || weightOpen;
  restCard.hidden = sessionOpen || editorOpen || workoutStartOpen || templatesOpen || calendarOpen || progressOpen || goalsOpen || profileOpen || weightOpen;
  $("today-card").hidden = sessionOpen || editorOpen || workoutStartOpen || templatesOpen || calendarOpen || progressOpen || goalsOpen || profileOpen || weightOpen;
  workoutNameInput.disabled = sessionOpen || state === "finished";
  workoutDateInput.disabled = sessionOpen || state === "finished";
  startButton.disabled = state === "finished" || (Boolean(editingWorkoutId) && state !== "active");
  form.querySelectorAll("input, button").forEach((control) => {
    control.disabled = sessionOpen;
  });
  workoutOverview.hidden = state !== "overview";
  trackingLive.hidden = !["active", "paused", "recap"].includes(state);
  trackingCard.hidden = !sessionOpen;
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

function formatRestTime(seconds) {
  return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}

function renderRestTimer() {
  $("rest-time").textContent = formatRestTime(restSecondsRemaining);
  $("rest-start").disabled = restTimerInterval !== null;
  $("rest-stop").disabled = restTimerInterval === null;
}

function resetRestTimer() {
  clearInterval(restTimerInterval);
  restTimerInterval = null;
  const duration = Math.max(5, Math.min(3600, Number($("rest-duration").value) || 90));
  $("rest-duration").value = duration;
  restSecondsRemaining = duration;
  renderRestTimer();
}

$("rest-duration").addEventListener("change", resetRestTimer);
$("rest-start").addEventListener("click", () => {
  if (restTimerInterval !== null) return;
  if (restSecondsRemaining <= 0) resetRestTimer();
  restTimerInterval = setInterval(() => {
    restSecondsRemaining -= 1;
    if (restSecondsRemaining <= 0) {
      restSecondsRemaining = 0;
      clearInterval(restTimerInterval);
      restTimerInterval = null;
      notify("Rest complete — start your next set.");
    }
    renderRestTimer();
  }, 1000);
  renderRestTimer();
});
$("rest-stop").addEventListener("click", () => {
  clearInterval(restTimerInterval);
  restTimerInterval = null;
  renderRestTimer();
});
$("rest-reset").addEventListener("click", resetRestTimer);
resetRestTimer();

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
          const section = workout.sections?.find(item => item.id === loggedExercise.sectionId);
          records.push({ date, entry, workoutName: workout.name || "Workout", exercise: loggedExercise, section });
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
    distance: entry.distance,
  };
  const parts = [];
  if (detail?.reps !== undefined && detail.reps !== null && detail.reps !== "") parts.push(`${detail.reps} reps`);
  if (detail?.weight !== undefined && detail.weight !== null && detail.weight !== "") parts.push(`${detail.weight} lbs`);
  if (detail?.duration !== undefined && detail.duration !== null && detail.duration !== "") parts.push(`${detail.duration} sec`);
  if (detail?.distance != null && detail.distance !== "") parts.push(`${detail.distance} mi`);
  return parts.join(" · ") || "no values recorded";
}
function entryMetrics(entry) {
  const sets = Array.isArray(entry.setsDetail) ? entry.setsDetail :
    Array.from({ length: Math.min(100, Number(entry.sets) || 1) }, (_, index) => ({
      reps: entry.repsBySet?.[index] ?? entry.reps, weight: entry.weight, duration: entry.duration, distance: entry.distance,
    }));
  let weight = null, reps = null, volume = null, duration = null, distance = null;
  for (const set of sets) {
    const hasWeight = set?.weight !== undefined && set.weight !== null && set.weight !== "";
    const hasReps = set?.reps !== undefined && set.reps !== null && set.reps !== "";
    const w = Number(set?.weight), r = Number(set?.reps);
    const d = Number(set?.duration), miles = Number(set?.distance);
    if (hasWeight && Number.isFinite(w)) weight = Math.max(weight ?? w, w);
    if (hasReps && Number.isFinite(r)) reps = Math.max(reps ?? r, r);
    if (hasWeight && hasReps && Number.isFinite(w * r)) volume = (volume ?? 0) + w * r;
    if (set?.duration !== undefined && set?.duration !== "" && Number.isFinite(d)) duration = Math.max(duration ?? d, d);
    if (set?.distance !== undefined && set?.distance !== "" && Number.isFinite(miles)) distance = Math.max(distance ?? miles, miles);
  }
  const setCount = sets.filter(set => set && Object.values(set).some(value => value !== "" && value !== null && value !== undefined)).length || sets.length;
  const fastestDuration = sets.map(set => Number(set?.duration)).filter(value => Number.isFinite(value) && value > 0).reduce((best, value) => Math.min(best, value), null);
  return { weight, reps, volume, sets: setCount, rounds: Number(entry.rounds) || setCount, duration, fastestDuration, distance };
}

function personalRecordsForEntry(name, date, entry) {
  return personalRecordDetails(name, date, entry).map(detail => `${detail.label} PR`);
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

function progressValueLabel(metric) {
  return ({ weight: "Best weight", reps: "Best reps", volume: "Total volume", sets: "Sets completed", duration: "Best duration", distance: "Best distance", rounds: "Rounds completed" })[metric] || metric;
}
function progressUnit(metric) {
  return ({ weight: "lbs", reps: "reps", volume: "lbs", sets: "sets", duration: "sec", distance: "mi", rounds: "rounds" })[metric] || "";
}
function formatProgressValue(value, metric) {
  return `${Number(value).toLocaleString(undefined, { maximumFractionDigits: 1 })}${progressUnit(metric) ? ` ${progressUnit(metric)}` : ""}`;
}
function progressDateWindow(days, end = todayLocal()) {
  if (days === "all") return "0000-00-00";
  const date = new Date(`${end}T12:00:00`); date.setDate(date.getDate() - Number(days) + 1);
  return date.toISOString().slice(0, 10);
}
function dashboardRecords(startDate, endDate = todayLocal()) {
  const records = [];
  savedWorkouts.forEach(workout => Object.entries(workout.actualLogs || {}).forEach(([date, entries]) => {
    if (date < startDate || date > endDate || !Array.isArray(entries)) return;
    entries.forEach((entry, index) => {
      const exercise = workout.loggedExercisesByDate?.[date]?.[index] || workout.exercises?.[index];
      if (entry && exercise) records.push({ date, entry, exercise, workout, elapsed: Number(workout.elapsedByDate?.[date]) || 0 });
    });
  }));
  return records;
}
function dashboardAggregate(startDate, endDate = todayLocal()) {
  const records = dashboardRecords(startDate, endDate);
  const dates = new Set(records.map(record => record.date));
  const workouts = new Set(records.map(record => `${record.workout.id}:${record.date}`));
  const volume = records.reduce((total, record) => total + (entryMetrics(record.entry).volume || 0), 0);
  const time = [...workouts].reduce((total, key) => { const [id, date] = key.split(":"); const workout = savedWorkouts.find(item => item.id === id); return total + (Number(workout?.elapsedByDate?.[date]) || 0); }, 0);
  const names = [...new Set(records.map(record => record.exercise.name))];
  let improved = 0;
  names.forEach(name => {
    const entries = records.filter(record => record.exercise.name === name).sort((a, b) => a.date.localeCompare(b.date));
    if (entries.length > 1) {
      const first = entryMetrics(entries[0].entry), last = entryMetrics(entries.at(-1).entry);
      if ((last.weight ?? -Infinity) > (first.weight ?? -Infinity) || (last.volume ?? -Infinity) > (first.volume ?? -Infinity) || (last.reps ?? -Infinity) > (first.reps ?? -Infinity)) improved++;
    }
  });
  return { records, dates, workouts, volume, time, improved };
}
function formatDashboardTime(seconds) {
  const minutes = Math.round(seconds / 60);
  return minutes >= 60 ? `${Math.floor(minutes / 60)}h ${minutes % 60}m` : `${minutes}m`;
}
function dateRangeList(startDate, endDate = todayLocal(), maxDays = 365) {
  const end = new Date(`${endDate}T12:00:00`), start = new Date(`${startDate}T12:00:00`);
  if (startDate === "0000-00-00" || Number.isNaN(start.getTime())) start.setTime(end.getTime() - (maxDays - 1) * 86400000);
  const days = [];
  for (const cursor = new Date(start); cursor <= end && days.length < maxDays; cursor.setDate(cursor.getDate() + 1)) days.push(cursor.toISOString().slice(0, 10));
  return days;
}
function consistencyStats(startDate, endDate = todayLocal()) {
  const planned = new Set(), completed = new Set();
  savedWorkouts.forEach(workout => {
    scheduledDates(workout).filter(date => date >= startDate && date <= endDate).forEach(date => planned.add(`${workout.id}:${date}`));
    completedDates(workout).filter(date => date >= startDate && date <= endDate).forEach(date => completed.add(`${workout.id}:${date}`));
  });
  const completedDays = new Set([...completed].map(key => key.split(":").at(-1)));
  const days = dateRangeList(startDate, endDate, 730);
  let current = 0, best = 0, run = 0;
  days.slice().reverse().forEach(date => { if (completedDays.has(date)) { run++; best = Math.max(best, run); } else if (run) run = 0; });
  for (const date of days.slice().reverse()) { if (!completedDays.has(date)) break; current++; }
  return { planned, completed, completedDays, current, best, days };
}
function renderProgressConsistency(startDate) {
  const end = todayLocal(), stats = consistencyStats(startDate, end), box = $("progress-consistency");
  box.replaceChildren();
  const plannedCount = stats.planned.size, completedCount = stats.completed.size;
  const cards = [[`${completedCount} / ${plannedCount || 0}`, "Planned vs completed"], [completedCount ? (completedCount / Math.max(1, (stats.days.length / 7))).toFixed(1) : "0", "Workouts / week"], [stats.current, "Current streak"], [stats.best, "Best streak"]];
  cards.forEach(([value, label]) => { const card = element("div", "consistency-card"); card.append(element("strong", "", String(value)), element("span", "", label)); box.append(card); });
  const heatmap = $("progress-heatmap"); heatmap.replaceChildren();
  stats.days.slice(-Math.min(365, stats.days.length)).forEach(date => { const planned = [...stats.planned].some(key => key.endsWith(`:${date}`)); const complete = stats.completedDays.has(date); const cell = element("span", `heatmap-day${planned ? " is-planned" : ""}${complete ? " is-complete" : ""}`); cell.title = `${date} · ${complete ? "Completed" : planned ? "Planned" : "No workout"}`; cell.setAttribute("aria-label", cell.title); heatmap.append(cell); });
}
function renderProgressComparisons(startDate) {
  const box = $("progress-comparisons"); box.replaceChildren();
  const records = dashboardRecords(startDate), byName = new Map();
  records.forEach(record => { if (!byName.has(record.exercise.name)) byName.set(record.exercise.name, []); byName.get(record.exercise.name).push(record); });
  const comparisons = [...byName].map(([name, entries]) => {
    entries.sort((a, b) => a.date.localeCompare(b.date)); const first = entryMetrics(entries[0].entry), last = entryMetrics(entries.at(-1).entry);
    const metric = ["weight", "reps", "distance", "duration", "volume"].find(key => first[key] !== null && last[key] !== null);
    return metric && entries.length > 1 ? { name, metric, first: first[metric], last: last[metric], firstDate: entries[0].date, lastDate: entries.at(-1).date } : null;
  }).filter(Boolean).sort((a, b) => (b.last - b.first) - (a.last - a.first)).slice(0, 8);
  if (!comparisons.length) { box.append(element("div", "dashboard-list-empty", "Log an exercise more than once to see progress since the selected date.")); return; }
  comparisons.forEach(item => { const card = element("article", "comparison-card"); const delta = item.last - item.first; card.append(element("strong", "", item.name), element("span", "", `${formatProgressValue(item.first, item.metric)} → ${formatProgressValue(item.last, item.metric)} (${delta >= 0 ? "+" : ""}${formatProgressValue(delta, item.metric)})`), element("span", "", `${item.firstDate} → ${item.lastDate}`)); box.append(card); });
}
function reportStats(startDate, endDate = todayLocal()) {
  const aggregate = dashboardAggregate(startDate, endDate), records = aggregate.records;
  const workouts = aggregate.workouts.size, sets = records.reduce((total, record) => total + (entryMetrics(record.entry).sets || 0), 0);
  const prs = readPRHistory().filter(record => record.date >= startDate && record.date <= endDate);
  const goals = syncGoalsFromWorkouts().filter(goal => goal.status !== "archived");
  return { ...aggregate, workouts, sets, prs, goals, progressingGoals: goals.filter(goal => Number(goal.current) > 0).length };
}
function renderReport(container, stats, previous, label) {
  container.replaceChildren();
  const lines = [["Period", label], ["Workouts completed", stats.workouts], ["Training time", formatDashboardTime(stats.time)], ["Sets", stats.sets], ["Volume", `${Math.round(stats.volume).toLocaleString()} lbs`], ["PRs", stats.prs.length], ["Goal movement", `${stats.progressingGoals} active goals progressing`]];
  if (previous) lines.push(["Compared with previous", `${stats.workouts - previous.workouts >= 0 ? "+" : ""}${stats.workouts - previous.workouts} workouts · ${stats.prs.length - previous.prs.length >= 0 ? "+" : ""}${stats.prs.length - previous.prs.length} PRs`]);
  lines.forEach(([name, value]) => { const row = element("div", "report-line"); row.append(element("span", "", name), element("strong", "", String(value))); container.append(row); });
}
function renderReportsAndScorecard() {
  const today = new Date(`${todayLocal()}T12:00:00`), weekStart = new Date(today), weekday = today.getDay(); weekStart.setDate(today.getDate() - (weekday === 0 ? 6 : weekday - 1));
  const priorWeekEnd = new Date(weekStart); priorWeekEnd.setDate(priorWeekEnd.getDate() - 1); const priorWeekStart = new Date(priorWeekEnd); priorWeekStart.setDate(priorWeekEnd.getDate() - 6);
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1, 12); const priorMonthEnd = new Date(monthStart); priorMonthEnd.setDate(priorMonthEnd.getDate() - 1); const priorMonthStart = new Date(priorMonthEnd.getFullYear(), priorMonthEnd.getMonth(), 1, 12);
  const week = reportStats(weekStart.toISOString().slice(0, 10)), priorWeek = reportStats(priorWeekStart.toISOString().slice(0, 10), priorWeekEnd.toISOString().slice(0, 10));
  const month = reportStats(monthStart.toISOString().slice(0, 10)), priorMonth = reportStats(priorMonthStart.toISOString().slice(0, 10), priorMonthEnd.toISOString().slice(0, 10));
  renderReport($("weekly-report"), week, priorWeek, `${weekStart.toISOString().slice(0, 10)} → ${todayLocal()}`);
  renderReport($("monthly-report"), month, priorMonth, `${monthStart.toLocaleString(undefined, { month: "long" })} ${monthStart.getFullYear()}`);
  const scorecard = $("forge-scorecard"); scorecard.replaceChildren();
  const consistency = consistencyStats(weekStart.toISOString().slice(0, 10));
  const current30Start = progressDateWindow(30), prior30EndDate = new Date(`${current30Start}T12:00:00`); prior30EndDate.setDate(prior30EndDate.getDate() - 1);
  const prior30End = prior30EndDate.toISOString().slice(0, 10), previous30Start = progressDateWindow(30, prior30End);
  const current30 = dashboardAggregate(current30Start), prior30 = dashboardAggregate(previous30Start, prior30End);
  const volumeDelta = prior30.volume ? Math.round((current30.volume - prior30.volume) / prior30.volume * 100) : 0;
  [[`${consistency.completed.size} / ${consistency.planned.size || 0}`, "Consistency"], [`${current30.improved} exercises`, "Strength"], [`${volumeDelta >= 0 ? "+" : ""}${volumeDelta}%`, "Work capacity"], [`${month.progressingGoals} active goals`, "Goal progress"]].forEach(([value, label]) => { const item = element("article", "scorecard-item"); item.append(element("strong", "", value), element("span", "", label)); scorecard.append(item); });
}
function renderProgressDashboard() {
  const start = progressDateWindow(progressRange), current = dashboardAggregate(start), overview = $("progress-overview");
  overview.replaceChildren();
  const weekStartDate = new Date(`${todayLocal()}T12:00:00`); const day = weekStartDate.getDay(); weekStartDate.setDate(weekStartDate.getDate() - (day === 0 ? 6 : day - 1));
  const week = dashboardAggregate(weekStartDate.toISOString().slice(0, 10));
  [[week.workouts.size, "Workouts this week"], [formatDashboardTime(current.time), "Training time"], [current.volume ? `${Math.round(current.volume).toLocaleString()} lbs` : "0 lbs", "Volume"], [readPRHistory().filter(record => record.date >= start).length, "PRs"], [current.improved, "Exercises improved"]].forEach(([value, label]) => { const card = element("div", "progress-overview-card"); card.append(element("strong", "", String(value)), element("span", "", label)); overview.append(card); });
  const goals = $("progress-goals"); goals.replaceChildren();
  const activeGoals = syncGoalsFromWorkouts().filter(goal => goal.status !== "archived");
  if (!activeGoals.length) goals.append(element("div", "dashboard-list-empty", "Create a goal to see it here."));
  activeGoals.slice(0, 5).forEach(goal => { const percent = Math.min(100, Math.round(Number(goal.current) / Number(goal.target) * 100)); const item = element("article", "dashboard-goal"); const heading = element("div", "dashboard-goal-heading"); heading.append(element("strong", "", goal.name), element("span", "", `${percent}%`)); const bar = element("div", "dashboard-goal-bar"); const fill = element("span"); fill.style.width = `${percent}%`; bar.append(fill); item.append(heading, bar); goals.append(item); });
  const prs = $("progress-prs"); prs.replaceChildren();
  const prRecords = readPRHistory().filter(record => record.date >= start).slice().reverse().slice(0, 5);
  if (!prRecords.length) prs.append(element("div", "dashboard-list-empty", "No personal records in this period."));
  prRecords.forEach(record => { const item = element("article", "dashboard-pr"); item.append(element("strong", "", record.exerciseName), element("small", "", `${record.label} · ${Number(record.value).toFixed(1).replace(/\.0$/, "")} ${record.unit || ""}`)); prs.append(item); });
  const trends = $("progress-trends"); trends.replaceChildren();
  const previousEndDate = progressRange === "all" ? null : new Date(`${start}T12:00:00`);
  if (previousEndDate) previousEndDate.setDate(previousEndDate.getDate() - 1);
  const previousEnd = previousEndDate?.toISOString().slice(0, 10);
  const previousStart = previousEnd ? progressDateWindow(progressRange, previousEnd) : null;
  const previous = previousStart ? dashboardAggregate(previousStart, previousEnd) : null;
  [["Strength", current.improved, previous?.improved], ["Volume", current.volume, previous?.volume], ["Workout frequency", current.workouts.size, previous?.workouts.size], ["Training time", current.time, previous?.time]].forEach(([label, value, prior]) => { const item = element("div", "progress-trend"); const delta = prior === null || prior === undefined ? "No comparison yet" : `${value >= prior ? "+" : ""}${Math.round(value - prior)} vs previous`; item.append(element("strong", "", label === "Volume" ? `${Math.round(value).toLocaleString()} lbs` : label === "Training time" ? formatDashboardTime(value) : String(value)), element("span", "", delta)); trends.append(item); });
  renderProgressConsistency(start);
  renderProgressComparisons(start);
  renderReportsAndScorecard();
}
function readPRHistory() {
  try { const stored = JSON.parse(localStorage.getItem(PR_HISTORY_KEY) || "[]"); return Array.isArray(stored) ? stored : []; }
  catch (error) { return []; }
}
function writePRHistory(records) {
  try { localStorage.setItem(PR_HISTORY_KEY, JSON.stringify(records.slice(-500))); return true; }
  catch (error) { return false; }
}
function estimatedOneRepMax(weight, reps) {
  return Number(weight) > 0 && Number(reps) > 0 ? Number(weight) * (1 + Number(reps) / 30) : null;
}
function prCandidates(entry) {
  const sets = Array.isArray(entry?.setsDetail) ? entry.setsDetail : [entry || {}];
  const metrics = entryMetrics(entry);
  const estimated = sets.map(set => estimatedOneRepMax(set.weight, set.reps)).filter(Boolean);
  const fastest = metrics.fastestDuration;
  const atWeight = sets.filter(set => set?.weight !== undefined && set?.weight !== "" && set?.reps !== undefined && set?.reps !== "").map(set => ({ weight: Number(set.weight), reps: Number(set.reps) })).filter(item => Number.isFinite(item.weight) && Number.isFinite(item.reps));
  return { metrics, estimatedOneRepMax: estimated.length ? Math.max(...estimated) : null, fastestDuration: fastest, repsAtWeight: atWeight };
}
function personalRecordDetails(name, date, entry) {
  if (!name || !entry) return [];
  const current = prCandidates(entry);
  const earlier = exerciseRecords(name, date).map(record => prCandidates(record.entry));
  const details = [];
  const priorMax = key => earlier.map(item => item.metrics[key]).filter(value => value !== null && value !== undefined);
  const add = (label, value, unit) => details.push({ label, value, unit });
  const bestWeight = current.metrics.weight, priorWeight = priorMax("weight");
  if (bestWeight !== null && (!priorWeight.length || bestWeight > Math.max(...priorWeight))) add("Heaviest weight", bestWeight, "lbs");
  const bestReps = current.metrics.reps, priorReps = priorMax("reps");
  if (bestReps !== null && (!priorReps.length || bestReps > Math.max(...priorReps))) add("Most reps", bestReps, "reps");
  current.repsAtWeight.forEach(item => {
    const priorAtWeight = earlier.flatMap(record => record.repsAtWeight.filter(other => other.weight === item.weight).map(other => other.reps));
    if (!priorAtWeight.length || item.reps > Math.max(...priorAtWeight)) add(`Most reps at ${item.weight} lbs`, item.reps, "reps");
  });
  if (current.estimatedOneRepMax !== null) {
    const prior = earlier.map(item => item.estimatedOneRepMax).filter(Boolean);
    if (!prior.length || current.estimatedOneRepMax > Math.max(...prior)) add("Estimated 1RM", current.estimatedOneRepMax, "lbs");
  }
  const bestVolume = current.metrics.volume, priorVolume = priorMax("volume");
  if (bestVolume !== null && (!priorVolume.length || bestVolume > Math.max(...priorVolume))) add("Highest volume", bestVolume, "lbs");
  if (current.fastestDuration !== null) {
    const prior = earlier.map(item => item.fastestDuration).filter(Boolean);
    if (!prior.length || current.fastestDuration < Math.min(...prior)) add("Fastest time", current.fastestDuration, "sec");
  }
  const bestDuration = current.metrics.duration, priorDuration = priorMax("duration");
  if (bestDuration !== null && (!priorDuration.length || bestDuration > Math.max(...priorDuration))) add("Longest duration", bestDuration, "sec");
  const bestDistance = current.metrics.distance, priorDistance = priorMax("distance");
  if (bestDistance !== null && (!priorDistance.length || bestDistance > Math.max(...priorDistance))) add("Longest distance", bestDistance, "mi");
  const bestRounds = current.metrics.rounds, priorRounds = priorMax("rounds");
  if (bestRounds !== null && (!priorRounds.length || bestRounds > Math.max(...priorRounds))) add("Most rounds", bestRounds, "rounds");
  return details;
}
function recordPersonalRecords(workout, date, actuals, exercises = workout.exercises || []) {
  const records = readPRHistory().filter(record => !(record.date === date && record.workoutName === (workout.name || "Workout")));
  (actuals || []).forEach((entry, index) => {
    const exercise = exercises[index];
    personalRecordDetails(exercise?.name, date, entry).forEach(detail => records.push({ ...detail, exerciseName: exercise.name, workoutName: workout.name || "Workout", date }));
  });
  writePRHistory(records);
}
function backfillPRHistory() {
  if (readPRHistory().length) return;
  const records = [];
  savedWorkouts.slice().sort((a, b) => String(a.date).localeCompare(String(b.date))).forEach(workout => {
    Object.entries(workout.actualLogs || {}).sort(([a], [b]) => a.localeCompare(b)).forEach(([date, actuals]) => {
      (actuals || []).forEach((entry, index) => {
        const exercise = workout.loggedExercisesByDate?.[date]?.[index] || workout.exercises?.[index];
        personalRecordDetails(exercise?.name, date, entry).forEach(detail => records.push({ ...detail, exerciseName: exercise.name, workoutName: workout.name || "Workout", date }));
      });
    });
  });
  writePRHistory(records);
}
function buildExerciseProgressRecords(workout, date, actuals) {
  return (Array.isArray(actuals) ? actuals : []).map((entry, index) => {
    if (!entry) return null;
    const exercise = workout.exercises?.[index] || {};
    const metrics = entryMetrics(entry);
    return { exerciseName: exercise.name || "Exercise", workoutId: workout.id, workoutName: workout.name || "Workout", date, ...metrics };
  }).filter(Boolean);
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
  backfillPRHistory();
  renderProgressDashboard();
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
  backfillPRHistory();
  renderPRHistory(exerciseSelect.value);
  const chart = $("progress-chart"), table = $("progress-table");
  chart.replaceChildren(); table.replaceChildren();
  const summary = $("progress-summary"); summary.replaceChildren();
  if (!names.length) { chart.append(emptyState("No results yet", "Complete a workout and record its sets to see progress.")); return; }
  const metric = $("progress-metric").value;
  const records = exerciseRecords(exerciseSelect.value);
  const metrics = records.map(record => entryMetrics(record.entry));
  const currentBest = metrics.reduce((best, item) => item[metric] !== null && item[metric] !== undefined ? Math.max(best ?? Number(item[metric]), Number(item[metric])) : best, null);
  const latest = records.at(-1);
  const latestMetric = latest ? entryMetrics(latest.entry)[metric] : null;
  [["Current best", currentBest], ["Latest", latestMetric], ["Performances", records.length], ["Last trained", latest?.date || "—"]].forEach(([label, value]) => {
    const card = element("div", "progress-summary-card");
    card.append(element("strong", "", label === "Last trained" ? String(value) : (value === null || value === undefined ? "—" : label === "Performances" ? String(value) : formatProgressValue(value, metric))), element("span", "", label));
    summary.append(card);
  });
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
  const unit = progressUnit(metric);
  positions.forEach((position, index) => {
    const dot = draw("circle", { cx: position.x, cy: position.y, r: 5, fill: "#f97316" });
    const measure = $("progress-metric").selectedOptions[0].textContent;
    attachGraphPointLabel(svg, dot, `${points[index].date} · ${fmt(points[index].value)} ${unit}`);
  });
  draw("text", { x: left, y: 287, fill: "#b8b8b8", "font-size": 12 }, points[0].date);
  if (points.length > 1) draw("text", { x: right, y: 287, fill: "#b8b8b8", "text-anchor": "end", "font-size": 12 }, points.at(-1).date);
  chart.setAttribute("aria-label", `${exerciseSelect.value}: ${$("progress-metric").selectedOptions[0].textContent} across ${points.length} logged days`);
  chart.append(svg);
  for (const point of [...points].reverse()) {
    const row = element("div", "progress-record");
    row.append(element("span", "", point.date), element("strong", "", `${fmt(point.value)}${unit ? ` ${unit}` : ""}`));
    table.append(row);
  }
}
function renderPRHistory(name) {
  const list = $("pr-history");
  list.replaceChildren();
  const records = readPRHistory().filter(record => !name || record.exerciseName === name).slice().reverse().slice(0, 20);
  if (!records.length) { list.append(element("p", "", "No personal records yet. Keep logging workouts to start building your PR history.")); return; }
  records.forEach(record => {
    const row = element("article", "pr-history-entry");
    row.append(element("strong", "", `${record.exerciseName} · ${record.label}`), element("span", "", `${Number(record.value).toFixed(1).replace(/\.0$/, "")} ${record.unit || ""}`), element("small", "", `${record.date} · ${record.workoutName}`));
    list.append(row);
  });
}
$("progress-exercise").addEventListener("change", renderProgress);
$("progress-metric").addEventListener("change", () => {
  document.querySelectorAll("[data-progress-metric]").forEach(item => item.classList.toggle("is-active", item.dataset.progressMetric === $("progress-metric").value));
  renderProgress();
});
document.querySelectorAll("[data-progress-metric]").forEach(button => button.addEventListener("click", () => {
  $("progress-metric").value = button.dataset.progressMetric;
  document.querySelectorAll("[data-progress-metric]").forEach(item => item.classList.toggle("is-active", item === button));
  renderProgress();
}));
document.querySelectorAll("[data-progress-range]").forEach(button => button.addEventListener("click", () => {
  progressRange = button.dataset.progressRange === "all" ? "all" : Number(button.dataset.progressRange);
  document.querySelectorAll("[data-progress-range]").forEach(item => item.classList.toggle("is-active", item === button));
  renderProgressDashboard();
}));

function renderWorkoutOverview(exerciseList, date, sectionDefs, workoutName) {
  $("overview-title").textContent = workoutName || "Workout Overview";
  const summary = $("overview-summary");
  summary.replaceChildren();
  const steps = buildPlayerSteps(exerciseList, sectionDefs);
  const intro = element("div", "preview-intro");
  intro.append(element("p", "eyebrow", "EXECUTION PREVIEW"), element("p", "", `${steps.length} work steps · ${sectionDefs.length} sections · ${formatEstimatedDuration(estimatedWorkoutSeconds(exerciseList, sectionDefs)).replace("Estimated duration · ", "")}`));
  summary.append(intro);
  let lastSection = null;
  steps.forEach((step, index) => {
    if (lastSection !== step.section.id) {
      lastSection = step.section.id;
      const group = element("div", "preview-section-heading");
      group.append(element("h3", "", step.section.name), element("span", "", step.mode === "rounds" ? `${step.total} rounds` : "Sets"));
      summary.append(group);
    }
    const work = element("div", "preview-step preview-work");
    const copy = element("div", "preview-step-copy");
    copy.append(element("strong", "", step.exercise.name), element("span", "", `${playerStepLabel(step)} · ${playerTarget(step.exercise)}`));
    work.append(element("span", "preview-step-number", String(index + 1)), copy);
    summary.append(work);
    const rest = Number(step.exercise.rest);
    if (Number.isFinite(rest) && rest > 0) {
      const restRow = element("div", "preview-step preview-rest");
      restRow.append(element("span", "preview-step-number", "↳"), element("div", "preview-step-copy"));
      restRow.querySelector(".preview-step-copy").append(element("strong", "", "Rest"), element("span", "", formatRestTime(rest)));
      summary.append(restRow);
    }
  });
}

function activateSession() {
  if (!session) return;
  session.player = {
    steps: buildPlayerSteps(session.exerciseList, session.sections),
    index: 0,
    results: (session.existing || []).map((entry) => entry ? JSON.parse(JSON.stringify(entry)) : entry),
    paused: false,
    phase: "exercise",
  };
  setWorkoutState("active");
  renderPlayerStep();
  if (session.mode !== "manual") startTimer();
  resetStopwatch();
  trackingCard.scrollIntoView({ behavior: "smooth", block: "start" });
  notify(`${session.name || "Workout"} started`);
}

function showWorkoutOverview(nextSession) {
  session = nextSession;
  calendarOpen = false;
  progressOpen = false;
  profileOpen = false;
  weightOpen = false;
  renderWorkoutOverview(session.exerciseList, session.date, session.sections, session.name);
  setWorkoutState("overview");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function buildPlayerSteps(exerciseList, sectionDefs) {
  const steps = [];
  for (const group of sectionGroups(exerciseList, sectionDefs)) {
    const section = sectionDefinition(group.id, sectionDefs);
    if (section.format === "rounds") {
      for (let round = 1; round <= Math.max(1, Number(section.rounds) || 1); round++) {
        group.entries.forEach(({ exercise, index }) => steps.push({ exercise, exerciseIndex: index, section, round, total: section.rounds, mode: "rounds" }));
      }
    } else {
      group.entries.forEach(({ exercise, index }) => {
        const total = Math.max(1, Number(exercise.sets) || 1);
        for (let set = 1; set <= total; set++) steps.push({ exercise, exerciseIndex: index, section, set, total, mode: "sets" });
      });
    }
  }
  return steps;
}

function playerResult(step) {
  session.player.results[step.exerciseIndex] ??= {};
  const result = session.player.results[step.exerciseIndex];
  result.setsDetail ??= [];
  const slot = step.mode === "rounds" ? step.round - 1 : step.set - 1;
  result.setsDetail[slot] ??= {};
  return result.setsDetail[slot];
}

function playerTarget(exercise) {
  const parts = [];
  if (exercise.weight) parts.push(`${exercise.weight} lb`);
  if (exercise.reps) parts.push(`${exercise.reps} reps`);
  if (exercise.duration) parts.push(`${exercise.duration} sec`);
  if (exercise.distance) parts.push(`${exercise.distance} mi`);
  return parts.join(" × ") || "Follow your plan";
}

function playerStepLabel(step) {
  return step.mode === "rounds" ? `Round ${step.round} of ${step.total}` : `Set ${step.set} of ${step.total}`;
}

function clearPlayerPhaseTimer() {
  clearInterval(playerPhaseInterval);
  playerPhaseInterval = null;
  if (session?.player) session.player.phaseRunning = false;
}

function playerCountdownText(seconds) {
  return formatRestTime(Math.max(0, Math.ceil(seconds)));
}

function playerRestDuration() {
  return Math.max(5, Math.min(3600, Number($("rest-duration").value) || PLAYER_REST_SECONDS));
}

function startPlayerCountdown(kind) {
  if (!session?.player || session.player.paused) return;
  clearPlayerPhaseTimer();
  session.player.phaseRunning = true;
  playerPhaseInterval = setInterval(() => {
    if (!session?.player || session.player.paused) return;
    const player = session.player;
    if (kind === "exercise") player.exerciseRemaining -= 1;
    else player.restRemaining -= 1;
    const remaining = kind === "exercise" ? player.exerciseRemaining : player.restRemaining;
    const display = $("player-phase-time") || document.querySelector(".player-rest-time");
    if (display) display.textContent = playerCountdownText(remaining);
    if (remaining <= 0) {
      clearPlayerPhaseTimer();
      if (kind === "exercise") {
        player.exerciseComplete = true;
        notify("Exercise complete");
        setTimeout(enterPlayerRestOrNext, 650);
      } else {
        player.phase = "exercise";
        renderPlayerStep();
      }
    }
  }, 1000);
}

function enterPlayerRestOrNext() {
  if (!session?.player) return;
  const player = session.player;
  const completedStep = player.steps[player.index];
  player.index += 1;
  player.exerciseRemaining = null;
  player.exerciseComplete = false;
  if (player.index >= player.steps.length) {
    player.phase = "exercise";
    session.elapsedOffsetSeconds = stopTimer();
    renderPlayerRecap();
    return;
  }
  const restSeconds = Math.max(0, Number(completedStep?.exercise?.rest) || 0);
  if (!restSeconds) {
    player.phase = "exercise";
    renderPlayerStep();
    return;
  }
  player.phase = "rest";
  player.restRemaining = restSeconds;
  renderPlayerStep();
  startPlayerCountdown("rest");
}

function skipPlayerRest() {
  clearPlayerPhaseTimer();
  if (!session?.player) return;
  session.player.phase = "exercise";
  session.player.restRemaining = 0;
  renderPlayerStep();
}

function renderPlayerRest() {
  const player = session.player;
  const upcoming = player.steps[player.index];
  trackingCard.hidden = false;
  $("tracking-heading").textContent = "Active Workout";
  $("tracking-date").textContent = session.date;
  $("tracking-live").hidden = false;
  $("workout-session-notes").closest("label").hidden = true;
  $("player-pause").hidden = false;
  $("player-pause").textContent = player.paused ? "Resume Workout" : "Pause Workout";
  $("player-pause").onclick = togglePlayerPause;
  document.querySelector(".stopwatch").hidden = true;
  document.querySelector(".rest-timer").hidden = true;
  $("tracking-finish").hidden = true;
  trackingList.replaceChildren();
  const card = element("div", "player-rest-card");
  const restDisplay = element("h2", "player-rest-time", playerCountdownText(player.restRemaining ?? PLAYER_REST_SECONDS));
  restDisplay.id = "player-phase-time";
  card.append(element("p", "eyebrow", "REST"), restDisplay);
  const next = element("div", "player-up-next");
  next.append(element("span", "eyebrow", "UP NEXT"), element("strong", "", upcoming ? `${upcoming.exercise.name} · ${playerStepLabel(upcoming)}` : "Workout recap"));
  if (upcoming) next.append(element("small", "", playerTarget(upcoming.exercise)));
  card.append(next);
  const controls = element("div", "player-navigation");
  const back = element("button", "btn secondary", "Back"); back.type = "button"; back.addEventListener("click", () => { clearPlayerPhaseTimer(); player.index = Math.max(0, player.index - 1); player.phase = "exercise"; player.exerciseRemaining = null; renderPlayerStep(); });
  const skip = element("button", "btn primary", "Skip Rest →"); skip.type = "button"; skip.addEventListener("click", skipPlayerRest);
  controls.append(back, skip); card.append(controls); trackingList.append(card);
}

function updateLivePRAlert(container, exercise, entry) {
  let alert = container.querySelector(".pr-alert");
  const details = personalRecordDetails(exercise?.name, session?.date, { setsDetail: [entry] });
  if (!details.length) { alert?.remove(); return; }
  if (!alert) { alert = element("div", "pr-alert"); container.prepend(alert); }
  alert.replaceChildren(element("strong", "", "🏆 NEW PR"), element("span", "", `${exercise.name} · ${details.map(detail => `${detail.label}: ${Number(detail.value).toFixed(1).replace(/\.0$/, "")} ${detail.unit || ""}`).join(" · ")}`));
}

function renderPlayerStep() {
  if (!session?.player) return;
  const player = session.player;
  if (player.phase === "rest") return renderPlayerRest();
  if (player.index >= player.steps.length) return renderPlayerRecap();
  const step = player.steps[player.index];
  if (player.exerciseRemaining == null && Number(step.exercise.duration) > 0) player.exerciseRemaining = Number(step.exercise.duration);
  const current = playerResult(step);
  trackingCard.hidden = false;
  $("tracking-heading").textContent = "Active Workout";
  $("tracking-date").textContent = session.date;
  $("tracking-live").hidden = false;
  $("workout-overview").hidden = true;
  document.querySelector(".stopwatch").hidden = true;
  document.querySelector(".rest-timer").hidden = true;
  $("tracking-finish").hidden = true;
  $("workout-session-notes").closest("label").hidden = true;
  $("player-pause").hidden = false;
  $("player-pause").textContent = player.paused ? "Resume Workout" : "Pause Workout";
  $("player-pause").onclick = togglePlayerPause;
  trackingList.replaceChildren();

  const progress = element("div", "player-progress");
  const percent = Math.round((player.index / player.steps.length) * 100);
  progress.append(element("strong", "", `Exercise ${player.index + 1} of ${player.steps.length}`), element("span", "", `${percent}% complete`));
  const bar = element("div", "player-progress-bar");
  const fill = element("span"); fill.style.width = `${percent}%`; bar.append(fill); progress.append(bar);
  trackingList.append(progress);

  const card = element("div", "player-step-card");
  card.append(element("p", "eyebrow", step.section.name));
  card.append(element("h2", "player-exercise-name", step.exercise.name));
  card.append(element("p", "player-step-label", playerStepLabel(step)));
  const target = element("div", "player-target");
  target.append(element("span", "", "TARGET"), element("strong", "", playerTarget(step.exercise)));
  card.append(target);
  if (Number(step.exercise.duration) > 0) {
    const timed = element("div", "player-countdown");
    timed.append(element("strong", "", playerCountdownText(player.exerciseRemaining ?? Number(step.exercise.duration))));
    timed.querySelector("strong").id = "player-phase-time";
    const timerButton = element("button", "action-button", player.phaseRunning ? "Pause Timer" : player.exerciseComplete ? "Completed" : "Start Timer");
    timerButton.type = "button"; timerButton.disabled = player.exerciseComplete;
    timerButton.addEventListener("click", () => {
      if (player.phaseRunning) clearPlayerPhaseTimer();
      else startPlayerCountdown("exercise");
      renderPlayerStep();
    });
    timed.append(timerButton); card.append(timed);
  }
  const fields = element("div", "player-result-fields");
  const config = libraryExerciseFor(step.exercise) ? getTrackingConfig(libraryExerciseFor(step.exercise)) : null;
  for (const [key, label, stepSize, planned] of [["weight", "Weight (lbs)", "0.5", step.exercise.weight], ["reps", "Reps", "1", step.exercise.reps], ["distance", "Distance (mi)", "0.01", step.exercise.distance], ["duration", "Time (sec)", "1", step.exercise.duration]]) {
    if (!planned && !config?.[key] && !current[key]) continue;
    const wrapper = element("label", "", label);
    const input = element("input"); input.type = "number"; input.min = "0"; input.step = stepSize; input.placeholder = planned ? String(planned) : "—"; input.value = current[key] ?? "";
    input.addEventListener("input", () => { current[key] = input.value; updateLivePRAlert(card, step.exercise, current); });
    wrapper.append(input); fields.append(wrapper);
  }
  if (!fields.children.length) fields.append(element("p", "tracking-help", "No result fields required for this exercise."));
  card.append(fields);
  updateLivePRAlert(card, step.exercise, current);
  const nav = element("div", "player-navigation");
  const back = element("button", "btn secondary", "Back"); back.type = "button"; back.disabled = player.index === 0; back.addEventListener("click", () => { clearPlayerPhaseTimer(); player.index--; renderPlayerStep(); });
  const next = element("button", "btn primary", player.index === player.steps.length - 1 ? "Review Workout" : "Next →"); next.type = "button"; next.addEventListener("click", advancePlayer);
  nav.append(back, next); card.append(nav); trackingList.append(card);

  const upcoming = Number(step.exercise.rest) > 0
    ? { rest: Number(step.exercise.rest) }
    : player.steps[player.index + 1];
  const upNext = element("div", "player-up-next");
  upNext.append(element("span", "eyebrow", "UP NEXT"));
  if (upcoming?.rest) {
    upNext.append(element("strong", "", "Rest"), element("small", "", formatRestTime(upcoming.rest)));
  } else {
    upNext.append(upcoming ? element("strong", "", `${upcoming.exercise.name} · ${playerStepLabel(upcoming)}`) : element("strong", "", "Workout recap"));
    if (upcoming) upNext.append(element("small", "", playerTarget(upcoming.exercise)));
  }
  trackingList.append(upNext);
  const end = element("button", "link-button player-end-button", "End Workout"); end.type = "button"; end.addEventListener("click", endPlayerEarly); trackingList.append(end);
}

function togglePlayerPause() {
  if (!session?.player) return;
  session.player.paused = !session.player.paused;
  if (session.player.paused) {
    session.player.phaseWasRunning = session.player.phaseRunning;
    clearPlayerPhaseTimer();
    session.elapsedOffsetSeconds = stopTimer();
  } else {
    startTimer();
    if (session.player.phaseWasRunning) startPlayerCountdown(session.player.phase === "rest" ? "rest" : "exercise");
  }
  setWorkoutState(session.player.paused ? "paused" : "active");
  renderPlayerStep();
}

function advancePlayer() {
  if (!session?.player) return;
  clearPlayerPhaseTimer();
  enterPlayerRestOrNext();
}

function endPlayerEarly() {
  if (!session?.player || !confirm("End this workout and review your results?")) return;
  clearPlayerPhaseTimer();
  session.elapsedOffsetSeconds = stopTimer();
  session.player.index = session.player.steps.length;
  renderPlayerRecap();
}

function renderCompletionInsights(summary, exerciseList, actuals, date) {
  const stats = actuals.map((entry, index) => ({ entry, exercise: exerciseList[index] })).filter(item => item.entry && item.exercise);
  const improved = [], prs = [];
  stats.forEach(({ entry, exercise }) => {
    const current = entryMetrics(entry);
    const previous = exerciseRecords(exercise.name, date).at(-1);
    if (previous) {
      const prior = entryMetrics(previous.entry);
      const comparisonMetric = ["weight", "reps", "volume", "duration", "distance"].find(key => current[key] !== null && current[key] > (prior[key] ?? -Infinity));
      if (comparisonMetric) improved.push(`${exercise.name}: ${formatProgressValue(prior[comparisonMetric], comparisonMetric)} → ${formatProgressValue(current[comparisonMetric], comparisonMetric)}`);
    }
    personalRecordDetails(exercise.name, date, entry).forEach(detail => prs.push(`${exercise.name}: ${detail.label}`));
  });
  const insights = element("div", "completion-insights");
  const addSection = (title, values, empty) => {
    const block = element("section", "completion-insight");
    block.append(element("h3", "", title));
    block.append(values.length ? element("p", "", values.join(" · ")) : element("p", "muted", empty));
    insights.append(block);
  };
  addSection("New PRs", [...new Set(prs)], "No new personal records this time.");
  addSection("Exercises improved", [...new Set(improved)], "No previous performance to compare yet.");
  const goals = syncGoalsFromWorkouts().filter(goal => goal.status !== "archived" && goal.exerciseName);
  const goalMovement = goals.map(goal => {
    const entry = stats.find(item => item.exercise.name === goal.exerciseName);
    if (!entry) return null;
    const metric = goal.metric || "weight";
    const value = entryMetrics(entry.entry)[metric];
    return value !== null && value !== undefined ? `${goal.name}: ${formatGoalValue(value, goal.unit || goalMetricUnit(metric))} / ${formatGoalValue(goal.target, goal.unit || goalMetricUnit(metric))}` : null;
  }).filter(Boolean);
  addSection("Goal progress", goalMovement, "No linked goals moved in this workout.");
  summary.append(insights);
}

function renderPlayerRecap() {
  setWorkoutState("recap");
  trackingCard.hidden = false;
  $("tracking-heading").textContent = "Workout Recap";
  $("tracking-date").textContent = session.date;
  $("workout-session-notes").closest("label").hidden = false;
  $("player-pause").hidden = true;
  document.querySelector(".stopwatch").hidden = true;
  document.querySelector(".rest-timer").hidden = true;
  $("tracking-finish").hidden = true;
  trackingList.replaceChildren();
  const summary = element("div", "player-recap-summary");
  summary.append(element("h2", "", session.name || "Workout Complete"), element("p", "", `${session.date} · Workout Time — ${formatMinutesSeconds(session.elapsedOffsetSeconds || 0)}`), element("p", "completion-review-note", "Review & Edit Results before permanently finishing this workout."));
  const completedSteps = Math.min(session.player.index, session.player.steps.length);
  const completedSets = session.player.steps.slice(0, completedSteps).filter((step) => step.mode === "sets").length;
  const completedRounds = session.player.steps.slice(0, completedSteps).filter((step) => step.mode === "rounds").length;
  const results = session.player.results;
  const totalLoggedSets = results.reduce((total, entry) => total + (entry?.setsDetail?.length || 0), 0);
  const totalVolume = results.reduce((total, entry) => total + (entry ? (entryMetrics(entry).volume || 0) : 0), 0);
  const stats = element("div", "player-recap-stats");
  [["Duration", formatMinutesSeconds(session.elapsedOffsetSeconds || 0)], ["Exercises", new Set(session.player.steps.slice(0, completedSteps).map((step) => step.exerciseIndex)).size], ["Sets", totalLoggedSets || completedSets], ["Volume", totalVolume ? `${totalVolume.toLocaleString()} lbs` : "—"]].forEach(([label, value]) => {
    const stat = element("div", "player-recap-stat"); stat.append(element("strong", "", String(value)), element("span", "", label)); stats.append(stat);
  });
  summary.append(stats);
  renderCompletionInsights(summary, session.exerciseList, results, session.date);
  for (const group of sectionGroups(session.exerciseList, session.sections)) {
    const section = element("section", "player-recap-section"); section.append(element("h3", "", group.name));
    for (const { exercise, index } of group.entries) {
      const entry = element("div", "player-recap-exercise"); entry.append(element("strong", "", exercise.name));
      const details = results[index]?.setsDetail || [];
      const total = sectionDefinition(group.id, session.sections).format === "rounds" ? sectionDefinition(group.id, session.sections).rounds : Math.max(1, Number(exercise.sets) || 1);
      for (let slot = 0; slot < total; slot++) {
        const detail = details[slot] || {};
        const line = element("div", `player-recap-line${Object.values(detail).some(Boolean) ? "" : " missing"}`);
        line.append(element("span", "", `${sectionDefinition(group.id, session.sections).format === "rounds" ? "Round" : "Set"} ${slot + 1}`));
        line.append(element("span", "", Object.values(detail).some(Boolean) ? actualSummary(exercise, { setsDetail: [detail] }) : "Not recorded"));
        const edit = element("button", "action-button", Object.values(detail).some(Boolean) ? "Edit" : "Add Result"); edit.type = "button"; edit.addEventListener("click", () => editRecapResult(index, slot, line)); line.append(edit); entry.append(line);
      }
      section.append(entry);
    }
    summary.append(section);
  }
  trackingList.append(summary);
  const recapNotes = $("workout-session-notes").closest("label");
  recapNotes.hidden = false;
  trackingList.append(recapNotes);
  const finish = element("button", "btn primary player-finish", "Save & Finish Workout"); finish.type = "button"; finish.addEventListener("click", finishPlayer); trackingList.append(finish);
}

function editRecapResult(exerciseIndex, slot, line) {
  const detail = session.player.results[exerciseIndex]?.setsDetail?.[slot] || {};
  line.replaceChildren();
  for (const [key, label] of [["weight", "Weight"], ["reps", "Reps"], ["distance", "Distance"], ["duration", "Time"]]) {
    const wrapper = element("label", "player-inline-field", label); const input = element("input"); input.type = "number"; input.value = detail[key] ?? ""; input.addEventListener("input", () => { detail[key] = input.value; }); wrapper.append(input); line.append(wrapper);
  }
  const save = element("button", "action-button", "Save"); save.type = "button"; save.addEventListener("click", renderPlayerRecap); line.append(save);
  session.player.results[exerciseIndex] ??= {}; session.player.results[exerciseIndex].setsDetail ??= []; session.player.results[exerciseIndex].setsDetail[slot] = detail;
}

function finishPlayer() {
  const actuals = session.player.results;
  const sessionNotes = $("workout-session-notes").value.trim();
  const manual = session.mode === "manual";
  const elapsedSeconds = session.elapsedOffsetSeconds || 0;
  const recordWorkout = { id: session.id, name: session.name || "Workout", exercises: session.exerciseList };
  recordPersonalRecords(recordWorkout, session.date, actuals, session.exerciseList);
  if (session.id) {
    const next = savedWorkouts.map((workout) => workout.id === session.id ? { ...workout, completedDates: [...new Set([...completedDates(workout), session.date])], actualLogs: { ...workout.actualLogs, [session.date]: actuals }, progressRecordsByDate: { ...(workout.progressRecordsByDate ?? {}), [session.date]: buildExerciseProgressRecords(workout, session.date, actuals) }, notesByDate: { ...(workout.notesByDate ?? {}), [session.date]: sessionNotes }, loggedExercisesByDate: { ...workout.loggedExercisesByDate, [session.date]: workout.exercises.map((exercise) => ({ ...exercise })) }, elapsedByDate: { ...workout.elapsedByDate, [session.date]: elapsedSeconds } } : workout);
    if (!persistHistory(next)) return;
    renderWorkoutHistory(); renderCalendar(); renderStreaks();
  } else {
    const workout = {
      id: typeof crypto.randomUUID === "function" ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      name: session.name || "Workout",
      date: session.date,
      scheduledDates: [],
      recurrence: null,
      sections: session.sections.map((section) => ({ ...section })),
      notes: $("workout-notes").value.trim(),
      notesByDate: { [session.date]: sessionNotes },
      completed: true,
      completedDates: [session.date],
      actualLogs: { [session.date]: actuals },
      progressRecordsByDate: { [session.date]: buildExerciseProgressRecords({ id: session.id, name: session.name, exercises: session.exerciseList }, session.date, actuals) },
      elapsedByDate: { [session.date]: elapsedSeconds },
      exercises: session.exerciseList.map((exercise) => ({ ...exercise })),
    };
    if (!persistHistory([workout, ...savedWorkouts])) return;
    renderWorkoutHistory(); renderCalendar(); renderStreaks();
  }
  resetStopwatch(); resetRestTimer(); session = null; trackingCard.hidden = true; setWorkoutState("not-started");
  notify(manual ? "Results saved!" : "Workout saved!");
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
    const sessionNotes = $("workout-session-notes").value.trim();
    const sessionExercises = session.exerciseList ?? (session.id ? savedWorkouts.find((workout) => workout.id === session.id)?.exercises ?? [] : exercises);
    const newRecords = actuals.flatMap((entry, index) => personalRecordsForEntry(sessionExercises[index]?.name, session.date, entry));
    const recordMessage = newRecords.length ? ` · ${[...new Set(newRecords)].join(" & ")}!` : "";
    const manual = session.mode === "manual";
    const elapsedSeconds = session.mode === "manual" && !session.timeEdited ? null : currentElapsed();
    recordPersonalRecords({ id: session.id, name: session.name || workoutNameInput.value.trim(), exercises: sessionExercises }, session.date, actuals, sessionExercises);
    if (session.id) {
      const next = savedWorkouts.map((workout) => workout.id === session.id ? {
        ...workout,
        scheduledDates: scheduledOn(workout, session.date) ? scheduledDates(workout) : [...new Set([...scheduledDates(workout), session.date])],
        completedDates: [...new Set([...completedDates(workout), session.date])],
        actualLogs: { ...workout.actualLogs, [session.date]: actuals },
        progressRecordsByDate: { ...(workout.progressRecordsByDate ?? {}), [session.date]: buildExerciseProgressRecords(workout, session.date, actuals) },
        notesByDate: { ...(workout.notesByDate ?? {}), [session.date]: sessionNotes },
        loggedExercisesByDate: { ...workout.loggedExercisesByDate, [session.date]: workout.exercises.map((exercise) => ({ ...exercise })) },
        elapsedByDate: elapsedSeconds === null ? workout.elapsedByDate : { ...workout.elapsedByDate, [session.date]: elapsedSeconds },
      } : workout);
      if (!persistHistory(next)) return;
      if (session.mode !== "manual") stopTimer();
      resetStopwatch();
      resetRestTimer();
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
      resetRestTimer();
      finishedActuals = actuals;
      finishedNotes = sessionNotes;
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
  showWorkoutOverview({ id: null, date: workoutDateInput.value, mode: "timed", elapsedOffsetSeconds: 0, name: workoutNameInput.value.trim(), exerciseList: exercises.map((exercise) => ({ ...exercise })), sections: sections.map((section) => ({ ...section })), existing: [] });
  $("edit-elapsed").value = "";
  $("workout-session-notes").value = "";
  finishedActuals = null;
  finishedNotes = "";
  finishedElapsedSeconds = null;
});

$("overview-start").addEventListener("click", activateSession);
$("overview-cancel").addEventListener("click", () => {
  session = null;
  resetWorkout();
});

function startSavedWorkout(id, date) {
  if (workoutState !== "not-started") {
    notify("Finish or save the current workout first.");
    return;
  }
  const workout = savedWorkouts.find((item) => item.id === id);
  if (!workout || !date || !workout.exercises.length) return;
  showWorkoutOverview({ id, date, mode: "timed", elapsedOffsetSeconds: 0, name: workout.name, exerciseList: workout.exercises, sections: workout.sections, existing: workout.actualLogs?.[date] });
  $("edit-elapsed").value = "";
  $("workout-session-notes").value = workout.notesByDate?.[date] ?? workout.notes ?? "";
}

function recordSavedWorkout(id, date) {
  if (workoutState !== "not-started") {
    notify("Finish or save the current workout first.");
    return;
  }
  const workout = savedWorkouts.find((item) => item.id === id);
  if (!workout || !completedDates(workout).includes(date)) return;
  showWorkoutOverview({ id, date, mode: "manual", elapsedOffsetSeconds: workout.elapsedByDate?.[date] ?? 0, timeEdited: false, name: workout.name, exerciseList: workout.exercises, sections: workout.sections, existing: workout.actualLogs?.[date] });
  $("workout-session-notes").value = workout.notesByDate?.[date] ?? workout.notes ?? "";
  $("elapsed-time").textContent = formatElapsed(session.elapsedOffsetSeconds);
  $("edit-elapsed").value = "";
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
    if (typeof syncGoalsFromWorkouts === "function") syncGoalsFromWorkouts();
    if (typeof queueCloudSave === "function") queueCloudSave();
    return true;
  } catch (error) {
    console.error("Unable to save workout history:", error);
    notify("Could not save. Check your browser storage settings.");
    return false;
  }
}

function resetWorkout() {
  exercises = [];
  sections = [{ id: "main", name: "Main Workout", format: "sets", rounds: 3 }];
  renderSections();
  resetExerciseForm();
  workoutNameInput.value = "";
  $("workout-description").value = "";
  $("workout-notes").value = "";
  workoutDateInput.value = todayLocal();
  setAdvancedSchedule(null, workoutDateInput.value);
  editingWorkoutId = null;
  builderHistory = [];
  workoutStartOpen = false;
  templatesOpen = false;
  setBuilderStage("details");
  setBuilderBuildStep("section");
  editorOpen = false;
  $("saved-time-edit").hidden = true;
  $("new-workout-heading").textContent = "New Workout";
  $("builder-save-status").textContent = "Draft ready";
  $("builder-save-status").dataset.state = "saved";
  setWorkoutState("not-started");
  finishedActuals = null;
  finishedNotes = "";
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
  $("workout-description").value = workout.description ?? "";
  $("workout-notes").value = workout.notes ?? "";
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
  setBuilderStage("build");
  setBuilderBuildStep("exercise");
  setWorkoutState("not-started");
  renderExercises();
  newWorkoutCard.scrollIntoView({ behavior: "smooth", block: "start" });
}

$("add-new-workout").addEventListener("click", () => {
  if (workoutState === "active") return;
  if (workoutState === "finished") resetWorkout();
  openWorkoutStartChooser();
});
$("builder-back").addEventListener("click", () => {
  if (builderStage === "review") {
    setBuilderStage("build");
    setBuilderBuildStep(builderReviewReturnStep);
    return;
  }
  if (builderStage === "build") {
    if (undoBuilderStep()) return;
    if (builderBuildStep === "section" && sections.length > 1) sections.pop();
    setBuilderStage("details");
    setBuilderBuildStep("section");
    return;
  }
  openWorkoutStartChooser();
});
$("builder-details-continue").addEventListener("click", () => {
  if (!workoutNameInput.value.trim()) { workoutNameInput.focus(); notify("Give your workout a name first."); return; }
  setBuilderStage("build");
  setBuilderBuildStep("section");
  $("builder-build-heading").scrollIntoView({ behavior: "smooth", block: "start" });
});
$("builder-preview").addEventListener("click", () => { if (!exercises.length) { notify("Add at least one exercise before previewing."); return; } startButton.click(); });
$("builder-save").addEventListener("click", () => { setBuilderStage("review"); saveButton.click(); });
$("guided-section-format").addEventListener("change", (event) => {
  $("guided-rounds-field").hidden = event.target.value !== "rounds";
});
$("guided-section-continue").addEventListener("click", () => {
  const name = $("guided-section-name").value.trim();
  if (!name) { $("guided-section-name").focus(); notify("Name this section first."); return; }
  const section = sections.at(-1) || sections[0];
  section.name = name;
  section.format = $("guided-section-format").value === "rounds" ? "rounds" : "sets";
  section.rounds = Number($("guided-section-rounds").value) || 3;
  renderSections(); renderExercises();
  $("exercise-section").value = section.id;
  setBuilderBuildStep("exercise");
  nameInput.focus();
  form.scrollIntoView({ behavior: "smooth", block: "start" });
});
$("guided-add-section").addEventListener("click", () => {
  pushBuilderHistory();
  const id = typeof crypto.randomUUID === "function" ? crypto.randomUUID() : `section-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  sections.push({ id, name: `Section ${sections.length + 1}`, format: "sets", rounds: 3 });
  renderSections(); renderExercises();
  setBuilderBuildStep("section");
  $("guided-section-name").value = "";
  $("builder-build-heading").scrollIntoView({ behavior: "smooth", block: "start" });
  $("guided-section-name").focus();
});
$("guided-review").addEventListener("click", () => { if (!exercises.length) return; builderReviewReturnStep = builderBuildStep; setBuilderStage("review"); });
$("builder-review-back").addEventListener("click", () => { setBuilderStage("build"); setBuilderBuildStep(builderReviewReturnStep); });
$("builder-review-save").addEventListener("click", () => { $("builder-save").click(); });
$("save-workout-template").addEventListener("click", saveWorkoutAsTemplate);
$("workout-template").addEventListener("change", (event) => {
  if (event.target.value) applyWorkoutTemplate(event.target.value);
  event.target.value = "";
});
$("section-template").addEventListener("change", (event) => {
  if (event.target.value) insertSectionTemplate(event.target.value);
  event.target.value = "";
});
[workoutNameInput, $("workout-description"), $("workout-notes"), workoutDateInput].forEach((input) => input.addEventListener("input", () => {
  const status = $("builder-save-status");
  if (status) { status.textContent = "Unsaved changes"; status.dataset.state = "dirty"; }
  if (input === workoutNameInput) document.title = `${input.value.trim() || "Forge"} | Workout Builder`;
  updateEstimatedDuration();
  persistBuilderDraft();
}));
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
  workoutStartOpen = false;
  templatesOpen = false;
  profileOpen = false;
  weightOpen = false;
  goalsOpen = false;
  progressOpen = true;
  setWorkoutState(workoutState);
  renderProgress();
  window.scrollTo({ top: 0, behavior: "smooth" });
});
$("open-goals").addEventListener("click", () => {
  workoutStartOpen = false;
  templatesOpen = false;
  profileOpen = false;
  weightOpen = false;
  progressOpen = false;
  goalsOpen = true;
  renderGoals();
  setWorkoutState(workoutState);
  window.scrollTo({ top: 0, behavior: "smooth" });
});
$("open-templates").addEventListener("click", openTemplatesScreen);
$("start-blank-workout").addEventListener("click", startBlankBuilder);
$("continue-draft-workout").addEventListener("click", continueBuilderDraft);
$("use-workout-template").addEventListener("click", openTemplatesScreen);
$("templates-back").addEventListener("click", openWorkoutStartChooser);
$("open-calendar").addEventListener("click", () => {
  workoutStartOpen = false;
  templatesOpen = false;
  calendarOpen = true;
  profileOpen = false;
  weightOpen = false;
  progressOpen = false;
  goalsOpen = false;
  setWorkoutState(workoutState);
  renderWorkoutHistory();
  renderCalendar();
  window.scrollTo({ top: 0, behavior: "smooth" });
});
$("back-dashboard").addEventListener("click", () => {
  editorOpen = false;
  workoutStartOpen = false;
  templatesOpen = false;
  calendarOpen = false;
  progressOpen = false;
  goalsOpen = false;
  profileOpen = false;
  weightOpen = false;
  setWorkoutState(workoutState);
  renderWorkoutHistory();
  renderCalendar();
  window.scrollTo({ top: 0, behavior: "smooth" });
});
function goToDashboardFromLogo() {
  if (workoutState === "active" || workoutState === "overview") return;
  $("back-dashboard").click();
}
$("home-logo").addEventListener("click", goToDashboardFromLogo);
$("home-logo").addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") { event.preventDefault(); goToDashboardFromLogo(); }
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
      description: $("workout-description").value.trim(),
      date: workoutDateInput.value,
      scheduledDates: initialDateWasOnlyPlaceholder ? [] : !recurrence && original.recurrence
        ? [...new Set([...existingDates, ...completedDates(original)])] : existingDates,
      recurrence,
      sections: sections.map((section) => ({ ...section })),
      estimatedDurationSeconds: estimatedWorkoutSeconds(),
      notes: $("workout-notes").value.trim(),
      exercises: exercises.map((exercise) => ({ ...exercise })),
      loggedExercisesByDate,
      elapsedByDate: editedSeconds === null ? original.elapsedByDate
        : { ...original.elapsedByDate, [$("edit-time-date").value]: editedSeconds },
    };
    if (!persistHistory(savedWorkouts.map((item) => item.id === original.id ? updated : item))) return;
    renderWorkoutHistory();
    renderCalendar();
    clearBuilderDraft();
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
    description: $("workout-description").value.trim(),
    date: workoutDateInput.value,
    scheduledDates: [],
    recurrence,
    sections: sections.map((section) => ({ ...section })),
    estimatedDurationSeconds: estimatedWorkoutSeconds(),
    notes: $("workout-notes").value.trim(),
    notesByDate: workoutState === "finished" ? { [workoutDateInput.value]: finishedNotes } : {},
    completed: workoutState === "finished",
    completedDates: workoutState === "finished" ? [workoutDateInput.value] : [],
    actualLogs: workoutState === "finished" ? { [workoutDateInput.value]: finishedActuals } : {},
    progressRecordsByDate: workoutState === "finished" ? { [workoutDateInput.value]: buildExerciseProgressRecords({ id: null, name: workoutNameInput.value.trim(), exercises }, workoutDateInput.value, finishedActuals) } : {},
    elapsedByDate: workoutState === "finished" ? { [workoutDateInput.value]: finishedElapsedSeconds } : {},
    exercises: exercises.map((exercise) => ({ ...exercise })),
  };
  if (!persistHistory([workout, ...savedWorkouts])) return;
  renderWorkoutHistory();
  visibleMonth = new Date(Number(workout.date.slice(0, 4)), Number(workout.date.slice(5, 7)) - 1, 1);
  renderCalendar();
  renderStreaks();
  clearBuilderDraft();
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
  const activeStreak = last === today || last === yesterday;
  $("current-streak").textContent = activeStreak ? String(run) : "0";
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
    if (typeof queueCloudSave === "function") queueCloudSave();
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
    if (typeof queueCloudSave === "function") queueCloudSave();
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
        detail.duration !== undefined && detail.duration !== "" && `${detail.duration} sec`,
        detail.distance != null && detail.distance !== "" && `${detail.distance} mi`].filter(Boolean);
      return `${entry.rounds != null ? "Round" : "Set"} ${index + 1}: ${parts.join(", ") || "no values"}`;
    });
    return entry.rounds != null
      ? `${entry.rounds ?? sets.length} rounds${sets.length ? ` • ${sets.join("; ")}` : ""}`
      : `${entry.sets ?? sets.length} sets${sets.length ? ` • ${sets.join("; ")}` : ""}`;
  }
  return [entry.sets && `${entry.sets} sets`,
    entry.repsBySet?.length ? `reps ${entry.repsBySet.map((value) => value || "—").join(" / ")}` : entry.reps && `${entry.reps} reps`,
    entry.weight && `${entry.weight} lbs`, entry.duration && `${entry.duration} sec`, entry.distance && `${entry.distance} mi`]
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
      remove.title = "Remove from this date";
      remove.addEventListener("pointerdown", (event) => event.stopPropagation());
      remove.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        removeScheduledDate(workout.id, date);
      });
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
    if (workout.notes) info.append(element("p", "workout-note-preview", `Notes: ${workout.notes}`));
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
      if (workout.notesByDate?.[date]) dates.append(element("div", "actual-summary workout-session-note", `Session notes: ${workout.notesByDate[date]}`));
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
        addDetail(exercise.distance, "mi");
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
  for (const { date, entry, workoutName } of records.slice().reverse().slice(0, 12)) {
    const row = element("article", "exercise-history-entry");
    const metrics = entryMetrics(entry);
    const headline = [metrics.weight !== null && `${metrics.weight} lbs`, metrics.reps !== null && `${metrics.reps} reps`, metrics.volume !== null && `${metrics.volume} lbs volume`, metrics.duration !== null && `${metrics.duration} sec`, metrics.distance !== null && `${metrics.distance} mi`].filter(Boolean).join(" · ");
    row.append(element("strong", "", `${date} · ${workoutName}`), element("p", "exercise-history-summary", headline || "No measurable values recorded"));
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
const PROFILE_FIELDS = ["name", "fitnessGoal", "experienceLevel", "sex", "targetWeight", "age", "weight", "email", "goal1", "goal2", "goal3", "goal1Target", "goal1Current", "goal1Unit", "goal2Target", "goal2Current", "goal2Unit", "goal3Target", "goal3Current", "goal3Unit", "bench", "squat", "deadlift", "pushups", "pullups"];
let profile = {};
let profileOpen = false;
function renderGoalTracking() {
  const list = $("goal-progress-list");
  list.replaceChildren();
  for (let index = 1; index <= 3; index++) {
    const name = String(profile[`goal${index}`] ?? "").trim();
    const target = Number(profile[`goal${index}Target`]);
    const current = Number(profile[`goal${index}Current`]);
    if (!name) continue;
    const valid = Number.isFinite(target) && target > 0 && Number.isFinite(current) && current >= 0;
    const percent = valid ? Math.min(100, Math.round(current / target * 100)) : 0;
    const item = element("article", "goal-progress-item");
    const heading = element("div", "goal-progress-heading");
    heading.append(element("strong", "", name), element("span", "", valid ? `${current} / ${target}${profile[`goal${index}Unit`] ? ` ${profile[`goal${index}Unit`]}` : ""}` : "Add a target and current value"));
    const bar = element("div", "goal-progress-bar");
    const fill = element("span"); fill.style.width = `${percent}%`; bar.append(fill);
    item.append(heading, bar, element("small", "", valid ? `${percent}% complete` : "Progress will appear after you add values."));
    list.append(item);
  }
  if (!list.children.length) list.append(element("p", "profile-hint", "Add up to three goals above to start tracking progress."));
}
function displayProfile() {
  $("profile-save-status").textContent = "No unsaved changes.";
  $("profile-save-status").dataset.state = "";
  displayProfilePhoto();
  for (const key of PROFILE_FIELDS) $("profile-" + key).value = profile[key] ?? "";
  renderGoalTracking();
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
    if (typeof queueCloudSave === "function") queueCloudSave();

    renderGoalTracking();
    renderBodyWeight();
    $("profile-save-status").textContent = "Profile saved.";
    $("profile-save-status").dataset.state = "saved";
    notify("Profile saved.");
  } catch (error) { console.error("Unable to save profile:", error); $("profile-save-status").textContent = "Could not save. Your changes are still in the form."; notify("Could not save profile in this browser."); }
});

function readGoals() {
  try {
    const stored = JSON.parse(localStorage.getItem(GOALS_KEY) || "[]");
    return Array.isArray(stored) ? stored.filter(goal => goal && typeof goal === "object") : [];
  } catch (error) { return []; }
}
function writeGoals(next) {
  try { localStorage.setItem(GOALS_KEY, JSON.stringify(next)); if (typeof queueCloudSave === "function") queueCloudSave(); return true; }
  catch (error) { notify("Could not save goals in this browser."); return false; }
}
function goalTypeLabel(type) {
  return ({ strength: "Strength", "exercise-performance": "Exercise performance", consistency: "Consistency", endurance: "Endurance", "body-metric": "Body metric", custom: "Custom" })[type] || "Custom";
}
function goalExerciseNames() {
  return [...new Set([
    ...exercises.map(exercise => exercise.name),
    ...savedWorkouts.flatMap(workout => Object.entries(workout.loggedExercisesByDate || {}).flatMap(([, logged]) => (logged || []).map(exercise => exercise?.name))),
    ...savedWorkouts.flatMap(workout => (workout.exercises || []).map(exercise => exercise?.name)),
  ].filter(Boolean))].sort((a, b) => a.localeCompare(b));
}
function populateGoalExerciseOptions(selected = "") {
  const select = $("goal-exercise");
  select.replaceChildren(element("option", "", "Not linked to an exercise"));
  select.firstElementChild.value = "";
  goalExerciseNames().forEach(name => { const option = element("option", "", name); option.value = name; select.append(option); });
  if (selected) select.value = selected;
}
function goalMetricLabel(metric) {
  return ({ weight: "Best weight", reps: "Best reps", volume: "Total volume", duration: "Best duration", distance: "Best distance", rounds: "Most rounds" })[metric] || "Best weight";
}
function goalMetricUnit(metric) {
  return ({ weight: "lbs", reps: "reps", volume: "lbs", duration: "sec", distance: "mi", rounds: "rounds" })[metric] || "";
}
function syncGoalsFromWorkouts() {
  const goals = readGoals();
  let changed = false;
  const next = goals.map(goal => {
    if (!goal.exerciseName || !goal.metric) return goal;
    const values = exerciseRecords(goal.exerciseName).map(record => entryMetrics(record.entry)[goal.metric]).filter(value => value !== null && value !== undefined && Number.isFinite(Number(value)));
    if (!values.length) return goal;
    const current = Math.max(...values.map(Number));
    if (Number(goal.current) === current && goal.status !== "archived") return goal;
    changed = true;
    return { ...goal, current, status: goal.status === "archived" ? "archived" : (current >= Number(goal.target) ? "achieved" : "active"), updatedAt: new Date().toISOString() };
  });
  if (changed) writeGoals(next);
  return next;
}
function formatGoalValue(value, unit) {
  const number = Number(value);
  if (!Number.isFinite(number)) return "—";
  return `${number.toLocaleString(undefined, { maximumFractionDigits: 1 })}${unit ? ` ${unit}` : ""}`;
}
function migrateLegacyGoals() {
  const existing = readGoals();
  if (existing.length || !profile) return existing;
  const migrated = [];
  for (let index = 1; index <= 3; index++) {
    const name = String(profile[`goal${index}`] ?? "").trim();
    if (!name) continue;
    const current = Number(profile[`goal${index}Current`]);
    const target = Number(profile[`goal${index}Target`]);
    migrated.push({
      id: `legacy-${Date.now()}-${index}`,
      name,
      type: "custom",
      current: Number.isFinite(current) ? current : 0,
      target: Number.isFinite(target) && target > 0 ? target : 1,
      unit: String(profile[`goal${index}Unit`] ?? "").trim(),
      targetDate: "",
      status: Number.isFinite(target) && target > 0 && current >= target ? "achieved" : "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
  if (migrated.length) writeGoals(migrated);
  return migrated;
}
function normalizeGoalStatus(goal) {
  if (goal.status === "archived") return "archived";
  return Number(goal.current) >= Number(goal.target) ? "achieved" : "active";
}
function resetGoalForm() {
  $("goal-form").reset();
  $("goal-id").value = "";
  $("goal-form-panel").hidden = true;
  $("create-goal").textContent = "+ Create Goal";
}
function renderGoals() {
  const list = $("goals-list");
  list.replaceChildren();
  const goals = syncGoalsFromWorkouts().map(goal => ({ ...goal, status: normalizeGoalStatus(goal) }));
  const visible = goals.filter(goal => goal.status === goalStatus);
  if (!visible.length) {
    const copy = goalStatus === "active" ? "Create your first goal to start tracking progress." : `No ${goalStatus} goals yet.`;
    list.append(emptyState(`No ${goalStatus} goals`, copy));
    return;
  }
  visible.forEach(goal => {
    const current = Number(goal.current), target = Number(goal.target);
    const percent = Number.isFinite(current) && Number.isFinite(target) && target > 0 ? Math.min(100, Math.round(current / target * 100)) : 0;
    const card = element("article", "goal-card");
    const heading = element("div", "goal-card-heading");
    const title = element("div", "goal-card-title");
    title.append(element("h2", "", goal.name), element("span", "goal-type", goalTypeLabel(goal.type)));
    heading.append(title, element("strong", "goal-percent", `${percent}%`));
    const values = element("div", "goal-card-values");
    values.append(element("span", "", formatGoalValue(current, goal.unit)), element("span", "", `of ${formatGoalValue(target, goal.unit)}`));
    const bar = element("div", "goal-progress-bar");
    const fill = element("span"); fill.style.width = `${percent}%`; bar.append(fill);
    const meta = element("div", "goal-card-meta");
    meta.append(element("span", "", goal.targetDate ? `Target date: ${goal.targetDate}` : "No target date"), element("span", "", goal.exerciseName ? `${goal.exerciseName} · ${goalMetricLabel(goal.metric)}` : "Manual progress"));
    const milestones = element("div", "goal-milestones");
    [25, 50, 75, 100].forEach((milestone, index, all) => {
      const item = element("div", `goal-milestone${percent >= milestone ? " is-complete" : percent < milestone && (index === 0 || percent >= all[index - 1]) ? " is-next" : ""}`);
      item.append(element("span", "goal-milestone-dot", percent >= milestone ? "✓" : ""), element("span", "", `${Math.round(target * milestone / 100).toLocaleString(undefined, { maximumFractionDigits: 1 })}${goal.unit ? ` ${goal.unit}` : ""}`));
      milestones.append(item);
    });
    const actions = element("div", "goal-card-actions");
    const edit = element("button", "btn secondary", "Edit"); edit.type = "button";
    edit.addEventListener("click", () => editGoal(goal));
    const archive = element("button", "btn secondary", goal.status === "archived" ? "Restore" : "Archive"); archive.type = "button";
    archive.addEventListener("click", () => updateGoalStatus(goal.id, goal.status === "archived" ? "active" : "archived"));
    const remove = element("button", "btn secondary", "Delete"); remove.type = "button";
    remove.addEventListener("click", () => { if (confirm(`Delete “${goal.name}”?`)) deleteGoal(goal.id); });
    actions.append(edit, archive, remove);
    card.append(heading, values, bar, milestones, meta, actions); list.append(card);
  });
}
function editGoal(goal) {
  $("goal-id").value = goal.id; $("goal-name").value = goal.name; $("goal-type").value = goal.type;
  populateGoalExerciseOptions(goal.exerciseName || ""); $("goal-metric").value = goal.metric || "weight";
  $("goal-current").value = goal.current; $("goal-target").value = goal.target; $("goal-unit").value = goal.unit || ""; $("goal-date").value = goal.targetDate || "";
  $("goal-form-panel").hidden = false; $("create-goal").textContent = "Cancel"; $("goal-name").focus();
}
function updateGoalStatus(id, status) {
  const next = readGoals().map(goal => goal.id === id ? { ...goal, status, updatedAt: new Date().toISOString() } : goal);
  if (writeGoals(next)) { renderGoals(); notify(status === "archived" ? "Goal archived." : "Goal restored."); }
}
function deleteGoal(id) {
  if (writeGoals(readGoals().filter(goal => goal.id !== id))) { renderGoals(); notify("Goal deleted."); }
}
$("create-goal").addEventListener("click", () => {
  if (!$("goal-form-panel").hidden) { resetGoalForm(); return; }
  populateGoalExerciseOptions(); $("goal-metric").value = "weight"; $("goal-form-panel").hidden = false; $("create-goal").textContent = "Cancel"; $("goal-name").focus();
});
$("cancel-goal").addEventListener("click", resetGoalForm);
$("goal-form").addEventListener("submit", event => {
  event.preventDefault();
  if (!event.currentTarget.reportValidity()) return;
  const current = Number($("goal-current").value), target = Number($("goal-target").value);
  if (!Number.isFinite(current) || !Number.isFinite(target) || target <= 0 || current < 0) { notify("Enter valid current and target values."); return; }
  const goals = readGoals(), id = $("goal-id").value || (typeof crypto.randomUUID === "function" ? crypto.randomUUID() : `goal-${Date.now()}`);
  const previous = goals.find(goal => goal.id === id);
  const exerciseName = $("goal-exercise").value;
  const metric = $("goal-metric").value;
  const nextGoal = { id, name: $("goal-name").value.trim(), type: $("goal-type").value, current, target, unit: $("goal-unit").value.trim() || (exerciseName ? goalMetricUnit(metric) : ""), targetDate: $("goal-date").value, exerciseName, metric, status: previous?.status === "archived" ? "archived" : (current >= target ? "achieved" : "active"), createdAt: previous?.createdAt || new Date().toISOString(), updatedAt: new Date().toISOString() };
  const next = previous ? goals.map(goal => goal.id === id ? nextGoal : goal) : [...goals, nextGoal];
  if (writeGoals(next)) { resetGoalForm(); renderGoals(); notify(previous ? "Goal updated." : "Goal created."); }
});
document.querySelectorAll("[data-goal-status]").forEach(button => button.addEventListener("click", () => {
  goalStatus = button.dataset.goalStatus;
  document.querySelectorAll("[data-goal-status]").forEach(item => item.classList.toggle("is-active", item === button));
  renderGoals();
}));
$("open-weight").addEventListener("click", () => {
  weightOpen = true;
  editorOpen = calendarOpen = progressOpen = goalsOpen = profileOpen = false;
  renderBodyWeight();
  setWorkoutState(workoutState);
  window.scrollTo({ top: 0, behavior: "smooth" });
});
$("open-profile").addEventListener("click", () => {
  if (profileOpen) return;
  if (workoutState === "active") return;
  setHeaderMenu(false);
  weightOpen = false;
  goalsOpen = false;
  profileOpen = true;
  editorOpen = calendarOpen = progressOpen = false;
  displayProfile();
  setWorkoutState(workoutState);
  window.scrollTo({ top: 0, behavior: "smooth" });
});
loadProfile();
migrateLegacyGoals();

loadHistory();
populateWorkoutTemplates();
updateBuilderStartOptions();
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

initializeExerciseLibrary();
