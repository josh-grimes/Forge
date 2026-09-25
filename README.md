# Forge Workout Tracker

Forge is organized into two independent app targets:

```text
Forge/
├── README.md
├── local/
│   ├── index.html
│   ├── script.js
│   ├── style.css
│   ├── exercise.js
│   ├── forge-logo.png
│   └── forge-icon.png
└── google-apps-script/
    ├── Code.gs
    ├── Index.html
    └── exercise.html
```

## Local version

Open `local/index.html` in a browser. Keep every file in the `local` folder together. Local data is stored in that browser's local storage.

## Google Apps Script version

Copy the three files in `google-apps-script` into an Apps Script project:

1. Replace `Code.gs`.
2. Add an HTML file named `Index` and paste `Index.html`.
3. Add an HTML file named `exercise` and paste `exercise.html`.
4. Deploy the project as a web app.

The Google Apps Script build stores Forge state in the connected Google Sheet. After changing these files, deploy a new web-app version.

## Included features

- Workout planning, scheduling, repeats, and calendar tracking
- Independently choose Sets or Rounds for every workout section
- Rounds sections show a section-level round quantity and never request per-exercise sets
- Sets sections request the number of sets for each exercise
- Workout overview screen before timers and tracking begin
- Guided builder with a visual Details → Build → Review progress indicator
- Forge Workout start chooser for blank workouts, drafts, and templates
- Dedicated Templates screen for saved workout templates
- Autosaved builder drafts that can be resumed separately from completed workouts
- Separate workout Preview action
- Guided Back navigation that undoes recent exercise or section additions
- Start chooser displayed in the same editor layout as the workout builder
- Continuous exercise entry without a repetitive Add Another Exercise action
- Simple prescription editing with a selector for Reps, Duration, Distance, or Calories
- Only the selected prescription value field is shown while Weight and Rest remain available
- Chunk 6 polish: selector changes update validation and estimates immediately, with responsive controls and reduced-motion support
- Rest timer and workout stopwatch
- Per-workout and per-session notes
- Three measurable goals with progress bars
- Exercise library and custom exercises
- Set-by-set results, personal records, progress charts, weight tracking, and streaks
- Local backup/export and Google Sheets persistence
