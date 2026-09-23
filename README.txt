FORGE + GOOGLE SHEETS

This is a ready-to-deploy Google Apps Script version of Forge. Your Google Sheet becomes the saved source of truth. The script also creates readable "Workout Log" and "Rest Days" tabs. "Forge State" stores the complete app data in chunks so calendar copies, set results, edits, times and streaks survive reloads. The Stopwatch is never saved.

NEW WORKOUT TOOLS
- During a workout, each set shows the most recent recorded result for that exercise before the workout date.
- Select Progress in the header to chart best weight, best set reps, or total weight x reps per workout date. Charts use recorded results, not planned values. New best weights and reps are highlighted as personal records.
- Select Review on a saved workout to set its Repeat weekly weekdays and date range. A weekly plan stays one saved workout; removing one calendar occurrence skips only that date. Dragging the workout to an excluded date restores it.
- The Workout Log tab includes logged repeats. Future recurring dates are generated in the app and remain in the Forge State tab until completed.

SETUP
1. Open the Google Sheet you shared: https://docs.google.com/spreadsheets/d/1CgYTqb0OSh6E0hJ7Q-64SKh2qnKWSyBZgUJ7rOdRE38/edit
2. In that sheet, choose Extensions > Apps Script.
3. Replace the editor's Code.gs content with the provided Code.gs. Your sheet ID is already filled in.
4. Add an HTML file named Index in Apps Script. Replace its content with the provided Index.html.
5. Save both files. Choose Deploy > New deployment > Web app. Choose Execute as: Me and Who has access: Only myself. Deploy and authorize the spreadsheet permissions when prompted.
6. Open the deployed web app URL. Use this URL as your Forge app from now on. Opening the old local index.html will still use local browser storage.
7. After editing Apps Script later, deploy a new version so the live web app gets the changes.

MOVING EXISTING LOCAL WORKOUTS
The new web app cannot automatically read the browser data saved by a local file, because it has a different site origin.
1. Back up your old Forge folder. Put the files in Local-Forge-Export over the files in the original folder you used to run Forge. Keep the same index.html path you previously opened.
2. Open that local index.html and press Export Data. Save the downloaded forge-backup.json file.
3. Open the Google Sheets version's web app URL. Use Import local backup at the top and choose forge-backup.json. Confirm replacement. Wait for "Saved to Google Sheets".
4. Check the Workout Log and Rest Days tabs in your sheet. Keep the JSON backup as an extra copy.

SYNC BEHAVIOR
The app writes complete Forge state to the sheet after each change and retains a local cache. It queues writes in order. If a write fails, Retry attempts to send the local changes. If another browser changed the sheet first, reload to review the conflict prompt before uploading local changes. Avoid editing the Forge State tab by hand; the Workout Log and Rest Days tabs are for reading.

The spreadsheet ID is kept in server-side Apps Script code. Do not set the web app's access to Anyone unless you intend to share your workout data and the ability to change it.

NEW WORKOUT SECTIONS & SCHEDULING
Create and rename sections such as Warm Up, Main Workout, and Cool Down in New Workout. Assign each exercise to a section. Advanced Scheduling sets weekdays and optional start/end dates before the workout is saved. Existing workouts without sections appear under Main Workout.
