// The Google Sheet provided for this Forge installation.
const SPREADSHEET_ID = '1CgYTqb0OSh6E0hJ7Q-64SKh2qnKWSyBZgUJ7rOdRE38';
const STATE_TAB = 'Forge State';
const LOG_TAB = 'Workout Log';
const REST_TAB = 'Rest Days';
const CHUNK_SIZE = 30000;

function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Forge Workout Tracker')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1, viewport-fit=cover');
}

function forgeSheet_() {
  if (SPREADSHEET_ID === 'PASTE_YOUR_SHEET_ID_HERE') {
    throw new Error('Add your spreadsheet ID to Code.gs first.');
  }
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}

function getOrCreateSheet_(spreadsheet, name) {
  return spreadsheet.getSheetByName(name) || spreadsheet.insertSheet(name);
}

function readState_(spreadsheet) {
  const sheet = getOrCreateSheet_(spreadsheet, STATE_TAB);
  const version = Number(sheet.getRange(1, 1).getValue()) || 0;
  if (sheet.getLastRow() < 2) return { version, workouts: [], restDays: [], profile: {} };
  const chunks = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1)
    .getValues().map(row => String(row[0] || '')).join('');
  if (!chunks) return { version, workouts: [], restDays: [], profile: {} };
  const data = JSON.parse(chunks);
  return {
    version,
    workouts: Array.isArray(data.workouts) ? data.workouts : [],
    restDays: Array.isArray(data.restDays) ? data.restDays : [],
    profile: data.profile && typeof data.profile === "object" && !Array.isArray(data.profile) ? data.profile : {},
  };
}

function getForgeState() {
  return readState_(forgeSheet_());
}

function ensureRows_(sheet, count) {
  if (sheet.getMaxRows() < count) sheet.insertRowsAfter(sheet.getMaxRows(), count - sheet.getMaxRows());
}

function writeTable_(spreadsheet, name, rows) {
  const sheet = getOrCreateSheet_(spreadsheet, name);
  ensureRows_(sheet, rows.length);
  sheet.clearContents();
  sheet.getRange(1, 1, rows.length, rows[0].length).setValues(rows);
  sheet.setFrozenRows(1);
}

function safeText_(value) {
  const text = String(value == null ? '' : value);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function writeReadableTabs_(spreadsheet, data) {
  const log = [[
    'Date', 'Workout', 'Section', 'Status', 'Exercise', 'Set',
    'Planned reps', 'Planned weight (lbs)', 'Planned time (sec)',
    'Actual reps', 'Actual weight (lbs)', 'Actual time (sec)', 'Workout time (sec)',
  ]];
  data.workouts.forEach(workout => {
    // Weekly repeats generate future calendar dates in the app. Keep this tab finite:
    // include explicitly planned dates and every completed repeat.
    const dates = [...new Set([
      ...(Array.isArray(workout.scheduledDates) ? workout.scheduledDates : [workout.date]),
      ...(Array.isArray(workout.completedDates) ? workout.completedDates : []),
    ])].sort();
    dates.forEach(date => {
      const completed = Array.isArray(workout.completedDates)
        ? workout.completedDates.includes(date) : workout.completed !== false && date === workout.date;
      const exercises = Array.isArray(workout.exercises) ? workout.exercises : [];
      exercises.forEach((exercise, index) => {
        const logged = workout.actualLogs && workout.actualLogs[date] && workout.actualLogs[date][index] || {};
        const count = Math.max(1, Number(exercise.sets) || 0, Number(logged.sets) || 0);
        for (let set = 0; set < Math.min(count, 100); set++) {
          const actual = logged.setsDetail && logged.setsDetail[set] || {};
          log.push([
            safeText_(date), safeText_(workout.name),
            safeText_((workout.sections || []).find(section => section.id === (exercise.sectionId || 'main'))?.name || 'Main Workout'),
            completed ? 'Done' : 'Planned',
            safeText_(exercise.name), set + 1, safeText_(exercise.reps),
            safeText_(exercise.weight), safeText_(exercise.duration),
            safeText_(actual.reps != null ? actual.reps : logged.repsBySet && logged.repsBySet[set]),
            safeText_(actual.weight != null ? actual.weight : logged.weight),
            safeText_(actual.duration != null ? actual.duration : logged.duration),
            workout.elapsedByDate && workout.elapsedByDate[date] != null ? Number(workout.elapsedByDate[date]) : '',
          ]);
        }
      });
    });
  });
  writeTable_(spreadsheet, LOG_TAB, log);
  writeTable_(spreadsheet, REST_TAB, [['Rest date'], ...data.restDays.map(date => [safeText_(date)])]);
}

function saveForgeState(expectedVersion, data) {
  if (!data || !Array.isArray(data.workouts) || !Array.isArray(data.restDays)) {
    throw new Error('Invalid Forge data.');
  }
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const spreadsheet = forgeSheet_();
    const previous = readState_(spreadsheet);
    if (Number(expectedVersion) !== previous.version) {
      throw new Error('Sheet changed elsewhere. Reload Forge before saving more changes.');
    }
    const json = JSON.stringify({ workouts: data.workouts, restDays: data.restDays, profile: data.profile || {} });
    const chunks = json.match(/[\s\S]{1,30000}/g) || [''];
    const sheet = getOrCreateSheet_(spreadsheet, STATE_TAB);
    ensureRows_(sheet, chunks.length + 1);
    // Prepare readable tabs before advancing the authoritative state version.
    writeReadableTabs_(spreadsheet, data);
    sheet.clearContents();
    sheet.getRange(2, 1, chunks.length, 1).setValues(chunks.map(chunk => [chunk]));
    sheet.getRange(1, 1).setValue(previous.version + 1);
    SpreadsheetApp.flush();
    return { version: previous.version + 1 };
  } finally {
    lock.releaseLock();
  }
}
