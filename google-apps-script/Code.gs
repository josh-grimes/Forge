// Forge Apps Script backend. Set this to the ID of the Google Sheet used by Forge.
const SPREADSHEET_ID = '1CgYTqb0OSh6E0hJ7Q-64SKh2qnKWSyBZgUJ7rOdRE38';
const STATE_TAB = 'Forge State';
const LOG_TAB = 'Workout Log';
const REST_TAB = 'Rest Days';

function doGet() {
  return HtmlService.createTemplateFromFile('Index').evaluate()
    .setTitle('Forge Workout Tracker')
    .setFaviconUrl('https://raw.githubusercontent.com/josh-grimes/Forge/main/local/forge-icon.png')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1, viewport-fit=cover');
}

function forgeSheet_() {
  if (SPREADSHEET_ID === 'PASTE_YOUR_SHEET_ID_HERE') throw new Error('Add your spreadsheet ID to Code.gs first.');
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}

function getOrCreateSheet_(spreadsheet, name) {
  return spreadsheet.getSheetByName(name) || spreadsheet.insertSheet(name);
}

function emptyForgeState_(version) {
  return { version: version || 0, workouts: [], restDays: [], profile: {}, goals: [], prHistory: [] };
}

function readState_(spreadsheet) {
  const sheet = getOrCreateSheet_(spreadsheet, STATE_TAB);
  const version = Number(sheet.getRange(1, 1).getValue()) || 0;
  if (sheet.getLastRow() < 2) return emptyForgeState_(version);
  const json = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getValues().map(row => String(row[0] || '')).join('');
  if (!json) return emptyForgeState_(version);
  const data = JSON.parse(json);
  return {
    version,
    workouts: Array.isArray(data.workouts) ? data.workouts : [],
    restDays: Array.isArray(data.restDays) ? data.restDays : [],
    profile: data.profile && typeof data.profile === 'object' && !Array.isArray(data.profile) ? data.profile : {},
    goals: Array.isArray(data.goals) ? data.goals : [],
    prHistory: Array.isArray(data.prHistory) ? data.prHistory : [],
  };
}

function getForgeState() { return readState_(forgeSheet_()); }

function ensureRows_(sheet, count) {
  if (sheet.getMaxRows() < count) sheet.insertRowsAfter(sheet.getMaxRows(), count - sheet.getMaxRows());
}

function safeText_(value) {
  const text = String(value == null ? '' : value);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function writeTable_(spreadsheet, name, rows) {
  const sheet = getOrCreateSheet_(spreadsheet, name);
  ensureRows_(sheet, rows.length);
  if (sheet.getMaxColumns() < rows[0].length) sheet.insertColumnsAfter(sheet.getMaxColumns(), rows[0].length - sheet.getMaxColumns());
  sheet.clearContents();
  sheet.getRange(1, 1, rows.length, rows[0].length).setValues(rows);
  sheet.setFrozenRows(1);
}

function writeReadableTabs_(spreadsheet, data) {
  const log = [['Date', 'Workout', 'Section', 'Status', 'Exercise', 'Set', 'Planned reps', 'Planned weight (lbs)', 'Planned time (sec)', 'Actual reps', 'Actual weight (lbs)', 'Actual time (sec)', 'Workout time (sec)', 'Planned distance (mi)', 'Actual distance (mi)']];
  (data.workouts || []).forEach(workout => {
    const dates = [...new Set([...(Array.isArray(workout.scheduledDates) ? workout.scheduledDates : [workout.date]), ...(Array.isArray(workout.completedDates) ? workout.completedDates : [])])].sort();
    dates.forEach(date => {
      const completed = Array.isArray(workout.completedDates) ? workout.completedDates.includes(date) : workout.completed !== false && date === workout.date;
      (workout.exercises || []).forEach((exercise, index) => {
        const logged = workout.actualLogs && workout.actualLogs[date] && workout.actualLogs[date][index] || {};
        const section = (workout.sections || []).find(item => item.id === (exercise.sectionId || 'main')) || {};
        const count = Math.max(1, Number(section.format === 'rounds' ? section.rounds : exercise.sets) || 0, Number(section.format === 'rounds' ? logged.rounds : logged.sets) || 0);
        for (let set = 0; set < Math.min(count, 100); set++) {
          const actual = logged.setsDetail && logged.setsDetail[set] || {};
          log.push([safeText_(date), safeText_(workout.name), safeText_(section.name || 'Main Workout'), completed ? 'Done' : 'Planned', safeText_(exercise.name), set + 1, safeText_(exercise.reps), safeText_(exercise.weight), safeText_(exercise.duration), safeText_(actual.reps != null ? actual.reps : logged.repsBySet && logged.repsBySet[set]), safeText_(actual.weight != null ? actual.weight : logged.weight), safeText_(actual.duration != null ? actual.duration : logged.duration), workout.elapsedByDate && workout.elapsedByDate[date] != null ? Number(workout.elapsedByDate[date]) : '', safeText_(exercise.distance), safeText_(actual.distance != null ? actual.distance : logged.distance)]);
        }
      });
    });
  });
  writeTable_(spreadsheet, LOG_TAB, log);
  writeTable_(spreadsheet, REST_TAB, [['Rest date'], ...(data.restDays || []).map(date => [safeText_(date)])]);
}

function saveForgeState(expectedVersion, data) {
  if (!data || !Array.isArray(data.workouts) || !Array.isArray(data.restDays)) throw new Error('Invalid Forge data.');
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const spreadsheet = forgeSheet_();
    const previous = readState_(spreadsheet);
    if (Number(expectedVersion) !== previous.version) throw new Error('Sheet changed elsewhere. Reload Forge before saving more changes.');
    const payload = { workouts: data.workouts, restDays: data.restDays, profile: data.profile || {}, goals: Array.isArray(data.goals) ? data.goals : [], prHistory: Array.isArray(data.prHistory) ? data.prHistory : [] };
    const chunks = (JSON.stringify(payload).match(/[\s\S]{1,30000}/g) || ['']);
    const sheet = getOrCreateSheet_(spreadsheet, STATE_TAB);
    ensureRows_(sheet, chunks.length + 1);
    writeReadableTabs_(spreadsheet, payload);
    sheet.clearContents();
    sheet.getRange(2, 1, chunks.length, 1).setValues(chunks.map(chunk => [chunk]));
    sheet.getRange(1, 1).setValue(previous.version + 1);
    SpreadsheetApp.flush();
    return { version: previous.version + 1 };
  } finally {
    lock.releaseLock();
  }
}
