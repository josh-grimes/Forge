/**
 * Forge exercise database — classic browser script; no imports or build step.
 * Load once, before Forge's main script. For Apps Script use exercise.html.
 * Edit the records below: all metadata is explicit, with no inferred defaults.
 * Legacy property getters forward to canonical fields (see compatibility section).
 * IDs and tracking modes are preserved for saved workout compatibility.
 */

const exerciseLibrary = [
  {
    "id": "barbell-bench-press",
    "name": "Barbell Bench Press",
    "primaryMuscle": "Chest",
    "secondaryMuscles": [
      "Triceps",
      "Shoulders"
    ],
    "equipment": "Barbell",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Horizontal Push",
    "unilateral": false,
    "aliases": [
      "Bench Press",
      "Flat Bench",
      "Barbell Bench"
    ],
    "family": "bench-press",
    "variation": "barbell",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Push",
    "bodyRegion": "Upper Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "dumbbell-bench-press",
    "name": "Dumbbell Bench Press",
    "primaryMuscle": "Chest",
    "secondaryMuscles": [
      "Triceps",
      "Shoulders"
    ],
    "equipment": "Dumbbells",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Horizontal Push",
    "unilateral": false,
    "aliases": [
      "Dumbbell Bench",
      "DB Bench Press",
      "Flat Dumbbell Press"
    ],
    "family": "bench-press",
    "variation": "dumbbell",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Push",
    "bodyRegion": "Upper Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "incline-barbell-bench-press",
    "name": "Incline Barbell Bench Press",
    "primaryMuscle": "Chest",
    "secondaryMuscles": [
      "Shoulders",
      "Triceps"
    ],
    "equipment": "Barbell",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Horizontal Push",
    "unilateral": false,
    "aliases": [
      "Incline Bench",
      "Incline Barbell Press"
    ],
    "family": "bench-press",
    "variation": "incline-barbell",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Push",
    "bodyRegion": "Upper Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "incline-dumbbell-bench-press",
    "name": "Incline Dumbbell Bench Press",
    "primaryMuscle": "Chest",
    "secondaryMuscles": [
      "Shoulders",
      "Triceps"
    ],
    "equipment": "Dumbbells",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Horizontal Push",
    "unilateral": false,
    "aliases": [
      "Incline Dumbbell Press",
      "Incline DB Press"
    ],
    "family": "bench-press",
    "variation": "incline-dumbbell",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Push",
    "bodyRegion": "Upper Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "decline-bench-press",
    "name": "Decline Bench Press",
    "primaryMuscle": "Chest",
    "secondaryMuscles": [
      "Triceps",
      "Shoulders"
    ],
    "equipment": "Barbell",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Horizontal Push",
    "unilateral": false,
    "aliases": [
      "Decline Press",
      "Decline Barbell Press"
    ],
    "family": "bench-press",
    "variation": "decline",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Push",
    "bodyRegion": "Upper Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "chest-press-machine",
    "name": "Chest Press Machine",
    "primaryMuscle": "Chest",
    "secondaryMuscles": [
      "Triceps",
      "Shoulders"
    ],
    "equipment": "Machine",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Horizontal Push",
    "unilateral": false,
    "aliases": [
      "Machine Chest Press",
      "Machine Press"
    ],
    "family": "bench-press",
    "variation": "machine",
    "difficulty": "Beginner",
    "mechanics": "Compound",
    "forceType": "Push",
    "bodyRegion": "Upper Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "cable-fly",
    "name": "Cable Fly",
    "primaryMuscle": "Chest",
    "secondaryMuscles": [
      "Shoulders"
    ],
    "equipment": "Cable",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Chest Isolation",
    "unilateral": false,
    "aliases": [
      "Cable Flye",
      "Cable Crossover"
    ],
    "family": "chest-fly",
    "variation": "cable",
    "difficulty": "Intermediate",
    "mechanics": "Isolation",
    "forceType": "Other",
    "bodyRegion": "Upper Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "dumbbell-fly",
    "name": "Dumbbell Fly",
    "primaryMuscle": "Chest",
    "secondaryMuscles": [
      "Shoulders"
    ],
    "equipment": "Dumbbells",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Chest Isolation",
    "unilateral": false,
    "aliases": [
      "DB Fly",
      "Dumbbell Flye"
    ],
    "family": "chest-fly",
    "variation": "dumbbell",
    "difficulty": "Intermediate",
    "mechanics": "Isolation",
    "forceType": "Other",
    "bodyRegion": "Upper Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "push-up",
    "name": "Push-Up",
    "primaryMuscle": "Chest",
    "secondaryMuscles": [
      "Triceps",
      "Shoulders",
      "Core"
    ],
    "equipment": "Bodyweight",
    "category": "Strength",
    "trackingType": "reps",
    "movementPattern": "Horizontal Push",
    "unilateral": false,
    "aliases": [
      "Pushup",
      "Push Up"
    ],
    "family": "push-up",
    "variation": "standard",
    "difficulty": "Beginner",
    "mechanics": "Compound",
    "forceType": "Push",
    "bodyRegion": "Upper Body",
    "requiresWeight": false,
    "skillBased": false
  },
  {
    "id": "chest-dip",
    "name": "Chest Dip",
    "primaryMuscle": "Chest",
    "secondaryMuscles": [
      "Triceps",
      "Shoulders"
    ],
    "equipment": "Bodyweight",
    "category": "Strength",
    "trackingType": "reps",
    "movementPattern": "Vertical Push",
    "unilateral": false,
    "aliases": [
      "Chest Dips",
      "Forward Lean Dip"
    ],
    "family": "dip",
    "variation": "chest",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Push",
    "bodyRegion": "Upper Body",
    "requiresWeight": false,
    "skillBased": true
  },
  {
    "id": "deadlift",
    "name": "Deadlift",
    "primaryMuscle": "Back",
    "secondaryMuscles": [
      "Glutes",
      "Hamstrings",
      "Core"
    ],
    "equipment": "Barbell",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Hip Hinge",
    "unilateral": false,
    "aliases": [
      "Conventional Deadlift",
      "Barbell Deadlift"
    ],
    "family": "deadlift",
    "variation": "conventional",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Pull",
    "bodyRegion": "Full Body",
    "requiresWeight": true,
    "skillBased": true
  },
  {
    "id": "pull-up",
    "name": "Pull-Up",
    "primaryMuscle": "Back",
    "secondaryMuscles": [
      "Biceps"
    ],
    "equipment": "Bodyweight",
    "category": "Strength",
    "trackingType": "reps",
    "movementPattern": "Vertical Pull",
    "unilateral": false,
    "aliases": [
      "Pullup",
      "Pull Up"
    ],
    "family": "pull-up",
    "variation": "standard",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Pull",
    "bodyRegion": "Upper Body",
    "requiresWeight": false,
    "skillBased": true
  },
  {
    "id": "chin-up",
    "name": "Chin-Up",
    "primaryMuscle": "Back",
    "secondaryMuscles": [
      "Biceps"
    ],
    "equipment": "Bodyweight",
    "category": "Strength",
    "trackingType": "reps",
    "movementPattern": "Vertical Pull",
    "unilateral": false,
    "aliases": [
      "Chinup",
      "Chin Up"
    ],
    "family": "pull-up",
    "variation": "chin-up",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Pull",
    "bodyRegion": "Upper Body",
    "requiresWeight": false,
    "skillBased": true
  },
  {
    "id": "lat-pulldown",
    "name": "Lat Pulldown",
    "primaryMuscle": "Back",
    "secondaryMuscles": [
      "Biceps"
    ],
    "equipment": "Cable",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Vertical Pull",
    "unilateral": false,
    "aliases": [
      "Lat Pull Down",
      "Pulldown"
    ],
    "family": "lat-pulldown",
    "variation": "standard",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Pull",
    "bodyRegion": "Upper Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "barbell-row",
    "name": "Barbell Row",
    "primaryMuscle": "Back",
    "secondaryMuscles": [
      "Biceps",
      "Rear Delts"
    ],
    "equipment": "Barbell",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Horizontal Pull",
    "unilateral": false,
    "aliases": [
      "Bent Over Row",
      "Bent-Over Barbell Row"
    ],
    "family": "row",
    "variation": "barbell",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Pull",
    "bodyRegion": "Upper Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "dumbbell-row",
    "name": "One-Arm Dumbbell Row",
    "primaryMuscle": "Back",
    "secondaryMuscles": [
      "Biceps",
      "Rear Delts"
    ],
    "equipment": "Dumbbells",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Horizontal Pull",
    "unilateral": true,
    "aliases": [
      "One Arm Row",
      "Single Arm Dumbbell Row",
      "DB Row"
    ],
    "family": "row",
    "variation": "dumbbell",
    "difficulty": "Advanced",
    "mechanics": "Compound",
    "forceType": "Pull",
    "bodyRegion": "Upper Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "seated-cable-row",
    "name": "Seated Cable Row",
    "primaryMuscle": "Back",
    "secondaryMuscles": [
      "Biceps",
      "Rear Delts"
    ],
    "equipment": "Cable",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Horizontal Pull",
    "unilateral": false,
    "aliases": [
      "Cable Row",
      "Seated Row"
    ],
    "family": "row",
    "variation": "cable",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Pull",
    "bodyRegion": "Upper Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "t-bar-row",
    "name": "T-Bar Row",
    "primaryMuscle": "Back",
    "secondaryMuscles": [
      "Biceps",
      "Rear Delts"
    ],
    "equipment": "Machine",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Horizontal Pull",
    "unilateral": false,
    "aliases": [
      "T Bar Row"
    ],
    "family": "row",
    "variation": "t-bar-row",
    "difficulty": "Beginner",
    "mechanics": "Compound",
    "forceType": "Pull",
    "bodyRegion": "Upper Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "chest-supported-row",
    "name": "Chest-Supported Row",
    "primaryMuscle": "Back",
    "secondaryMuscles": [
      "Biceps",
      "Rear Delts"
    ],
    "equipment": "Machine",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Horizontal Pull",
    "unilateral": false,
    "aliases": [
      "Chest Supported Machine Row"
    ],
    "family": "row",
    "variation": "chest-supported-row",
    "difficulty": "Beginner",
    "mechanics": "Compound",
    "forceType": "Pull",
    "bodyRegion": "Upper Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "straight-arm-pulldown",
    "name": "Straight-Arm Pulldown",
    "primaryMuscle": "Back",
    "secondaryMuscles": [
      "Triceps"
    ],
    "equipment": "Cable",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Vertical Pull",
    "unilateral": false,
    "aliases": [
      "Straight Arm Lat Pulldown"
    ],
    "family": "straight-arm-pulldown",
    "variation": "standard",
    "difficulty": "Intermediate",
    "mechanics": "Isolation",
    "forceType": "Pull",
    "bodyRegion": "Upper Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "inverted-row",
    "name": "Inverted Row",
    "primaryMuscle": "Back",
    "secondaryMuscles": [
      "Biceps",
      "Core"
    ],
    "equipment": "Bodyweight",
    "category": "Strength",
    "trackingType": "reps",
    "movementPattern": "Horizontal Pull",
    "unilateral": false,
    "aliases": [
      "Bodyweight Row",
      "Australian Pull-Up"
    ],
    "family": "row",
    "variation": "inverted-row",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Pull",
    "bodyRegion": "Upper Body",
    "requiresWeight": false,
    "skillBased": false
  },
  {
    "id": "rack-pull",
    "name": "Rack Pull",
    "primaryMuscle": "Back",
    "secondaryMuscles": [
      "Glutes",
      "Hamstrings"
    ],
    "equipment": "Barbell",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Hip Hinge",
    "unilateral": false,
    "aliases": [
      "Rack Deadlift"
    ],
    "family": "rack-pull",
    "variation": "standard",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Pull",
    "bodyRegion": "Upper Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "overhead-press",
    "name": "Barbell Overhead Press",
    "primaryMuscle": "Shoulders",
    "secondaryMuscles": [
      "Triceps",
      "Core"
    ],
    "equipment": "Barbell",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Vertical Push",
    "unilateral": false,
    "aliases": [
      "OHP",
      "Military Press",
      "Standing Barbell Press"
    ],
    "family": "overhead-press",
    "variation": "standard",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Push",
    "bodyRegion": "Upper Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "dumbbell-shoulder-press",
    "name": "Dumbbell Shoulder Press",
    "primaryMuscle": "Shoulders",
    "secondaryMuscles": [
      "Triceps"
    ],
    "equipment": "Dumbbells",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Vertical Push",
    "unilateral": false,
    "aliases": [
      "DB Shoulder Press",
      "Dumbbell Overhead Press"
    ],
    "family": "overhead-press",
    "variation": "dumbbell",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Push",
    "bodyRegion": "Upper Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "arnold-press",
    "name": "Arnold Press",
    "primaryMuscle": "Shoulders",
    "secondaryMuscles": [
      "Triceps"
    ],
    "equipment": "Dumbbells",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Vertical Push",
    "unilateral": false,
    "aliases": [
      "Arnold Shoulder Press"
    ],
    "family": "overhead-press",
    "variation": "arnold-press",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Push",
    "bodyRegion": "Upper Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "lateral-raise",
    "name": "Dumbbell Lateral Raise",
    "primaryMuscle": "Shoulders",
    "secondaryMuscles": [],
    "equipment": "Dumbbells",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Shoulder Isolation",
    "unilateral": false,
    "aliases": [
      "Side Raise",
      "DB Lateral Raise"
    ],
    "family": "lateral-raise",
    "variation": "standard",
    "difficulty": "Intermediate",
    "mechanics": "Isolation",
    "forceType": "Other",
    "bodyRegion": "Upper Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "cable-lateral-raise",
    "name": "Cable Lateral Raise",
    "primaryMuscle": "Shoulders",
    "secondaryMuscles": [],
    "equipment": "Cable",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Shoulder Isolation",
    "unilateral": true,
    "aliases": [
      "Cable Side Raise"
    ],
    "family": "lateral-raise",
    "variation": "cable",
    "difficulty": "Intermediate",
    "mechanics": "Isolation",
    "forceType": "Other",
    "bodyRegion": "Upper Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "front-raise",
    "name": "Dumbbell Front Raise",
    "primaryMuscle": "Shoulders",
    "secondaryMuscles": [],
    "equipment": "Dumbbells",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Shoulder Isolation",
    "unilateral": false,
    "aliases": [
      "DB Front Raise"
    ],
    "family": "front-raise",
    "variation": "standard",
    "difficulty": "Intermediate",
    "mechanics": "Isolation",
    "forceType": "Other",
    "bodyRegion": "Upper Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "rear-delt-fly",
    "name": "Rear Delt Fly",
    "primaryMuscle": "Shoulders",
    "secondaryMuscles": [
      "Back"
    ],
    "equipment": "Dumbbells",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Shoulder Isolation",
    "unilateral": false,
    "aliases": [
      "Rear Delt Raise",
      "Reverse Fly"
    ],
    "family": "rear-delt-fly",
    "variation": "standard",
    "difficulty": "Intermediate",
    "mechanics": "Isolation",
    "forceType": "Other",
    "bodyRegion": "Upper Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "reverse-pec-deck",
    "name": "Reverse Pec Deck",
    "primaryMuscle": "Shoulders",
    "secondaryMuscles": [
      "Back"
    ],
    "equipment": "Machine",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Shoulder Isolation",
    "unilateral": false,
    "aliases": [
      "Rear Delt Machine",
      "Reverse Fly Machine"
    ],
    "family": "rear-delt-fly",
    "variation": "reverse-pec-deck",
    "difficulty": "Beginner",
    "mechanics": "Isolation",
    "forceType": "Other",
    "bodyRegion": "Upper Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "face-pull",
    "name": "Face Pull",
    "primaryMuscle": "Shoulders",
    "secondaryMuscles": [
      "Back"
    ],
    "equipment": "Cable",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Horizontal Pull",
    "unilateral": false,
    "aliases": [
      "Cable Face Pull"
    ],
    "family": "face-pull",
    "variation": "standard",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Pull",
    "bodyRegion": "Upper Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "machine-shoulder-press",
    "name": "Machine Shoulder Press",
    "primaryMuscle": "Shoulders",
    "secondaryMuscles": [
      "Triceps"
    ],
    "equipment": "Machine",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Vertical Push",
    "unilateral": false,
    "aliases": [
      "Machine Overhead Press"
    ],
    "family": "overhead-press",
    "variation": "machine",
    "difficulty": "Beginner",
    "mechanics": "Compound",
    "forceType": "Push",
    "bodyRegion": "Upper Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "barbell-curl",
    "name": "Barbell Curl",
    "primaryMuscle": "Biceps",
    "secondaryMuscles": [
      "Forearms"
    ],
    "equipment": "Barbell",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Elbow Flexion",
    "unilateral": false,
    "aliases": [
      "BB Curl",
      "Standing Barbell Curl"
    ],
    "family": "biceps-curl",
    "variation": "barbell",
    "difficulty": "Intermediate",
    "mechanics": "Isolation",
    "forceType": "Pull",
    "bodyRegion": "Upper Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "dumbbell-curl",
    "name": "Dumbbell Curl",
    "primaryMuscle": "Biceps",
    "secondaryMuscles": [
      "Forearms"
    ],
    "equipment": "Dumbbells",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Elbow Flexion",
    "unilateral": false,
    "aliases": [
      "DB Curl",
      "Dumbbell Bicep Curl"
    ],
    "family": "biceps-curl",
    "variation": "dumbbell",
    "difficulty": "Intermediate",
    "mechanics": "Isolation",
    "forceType": "Pull",
    "bodyRegion": "Upper Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "hammer-curl",
    "name": "Hammer Curl",
    "primaryMuscle": "Biceps",
    "secondaryMuscles": [
      "Forearms"
    ],
    "equipment": "Dumbbells",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Elbow Flexion",
    "unilateral": false,
    "aliases": [
      "Dumbbell Hammer Curl"
    ],
    "family": "biceps-curl",
    "variation": "hammer-curl",
    "difficulty": "Intermediate",
    "mechanics": "Isolation",
    "forceType": "Pull",
    "bodyRegion": "Upper Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "incline-dumbbell-curl",
    "name": "Incline Dumbbell Curl",
    "primaryMuscle": "Biceps",
    "secondaryMuscles": [
      "Forearms"
    ],
    "equipment": "Dumbbells",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Elbow Flexion",
    "unilateral": false,
    "aliases": [
      "Incline Curl"
    ],
    "family": "biceps-curl",
    "variation": "incline",
    "difficulty": "Intermediate",
    "mechanics": "Isolation",
    "forceType": "Pull",
    "bodyRegion": "Upper Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "preacher-curl",
    "name": "Preacher Curl",
    "primaryMuscle": "Biceps",
    "secondaryMuscles": [
      "Forearms"
    ],
    "equipment": "EZ Bar",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Elbow Flexion",
    "unilateral": false,
    "aliases": [
      "EZ Bar Preacher Curl"
    ],
    "family": "biceps-curl",
    "variation": "preacher-curl",
    "difficulty": "Intermediate",
    "mechanics": "Isolation",
    "forceType": "Pull",
    "bodyRegion": "Upper Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "cable-curl",
    "name": "Cable Curl",
    "primaryMuscle": "Biceps",
    "secondaryMuscles": [
      "Forearms"
    ],
    "equipment": "Cable",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Elbow Flexion",
    "unilateral": false,
    "aliases": [
      "Cable Bicep Curl"
    ],
    "family": "biceps-curl",
    "variation": "cable",
    "difficulty": "Intermediate",
    "mechanics": "Isolation",
    "forceType": "Pull",
    "bodyRegion": "Upper Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "concentration-curl",
    "name": "Concentration Curl",
    "primaryMuscle": "Biceps",
    "secondaryMuscles": [
      "Forearms"
    ],
    "equipment": "Dumbbells",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Elbow Flexion",
    "unilateral": true,
    "aliases": [
      "Concentration Bicep Curl"
    ],
    "family": "biceps-curl",
    "variation": "concentration-curl",
    "difficulty": "Intermediate",
    "mechanics": "Isolation",
    "forceType": "Pull",
    "bodyRegion": "Upper Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "ez-bar-curl",
    "name": "EZ-Bar Curl",
    "primaryMuscle": "Biceps",
    "secondaryMuscles": [
      "Forearms"
    ],
    "equipment": "EZ Bar",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Elbow Flexion",
    "unilateral": false,
    "aliases": [
      "EZ Curl",
      "EZ Bar Bicep Curl"
    ],
    "family": "biceps-curl",
    "variation": "ez-bar-curl",
    "difficulty": "Intermediate",
    "mechanics": "Isolation",
    "forceType": "Pull",
    "bodyRegion": "Upper Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "tricep-pushdown",
    "name": "Tricep Pushdown",
    "primaryMuscle": "Triceps",
    "secondaryMuscles": [],
    "equipment": "Cable",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Elbow Extension",
    "unilateral": false,
    "aliases": [
      "Pushdown",
      "Cable Pushdown"
    ],
    "family": "triceps-extension",
    "variation": "tricep-pushdown",
    "difficulty": "Intermediate",
    "mechanics": "Isolation",
    "forceType": "Push",
    "bodyRegion": "Upper Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "rope-pushdown",
    "name": "Rope Tricep Pushdown",
    "primaryMuscle": "Triceps",
    "secondaryMuscles": [],
    "equipment": "Cable",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Elbow Extension",
    "unilateral": false,
    "aliases": [
      "Rope Tricep Extension"
    ],
    "family": "triceps-extension",
    "variation": "rope-pushdown",
    "difficulty": "Intermediate",
    "mechanics": "Isolation",
    "forceType": "Push",
    "bodyRegion": "Upper Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "skull-crusher",
    "name": "Skull Crusher",
    "primaryMuscle": "Triceps",
    "secondaryMuscles": [],
    "equipment": "EZ Bar",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Elbow Extension",
    "unilateral": false,
    "aliases": [
      "Lying Tricep Extension",
      "Skullcrusher"
    ],
    "family": "triceps-extension",
    "variation": "skull-crusher",
    "difficulty": "Intermediate",
    "mechanics": "Isolation",
    "forceType": "Push",
    "bodyRegion": "Upper Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "overhead-tricep-extension",
    "name": "Overhead Tricep Extension",
    "primaryMuscle": "Triceps",
    "secondaryMuscles": [],
    "equipment": "Dumbbells",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Elbow Extension",
    "unilateral": false,
    "aliases": [
      "Dumbbell Overhead Extension"
    ],
    "family": "triceps-extension",
    "variation": "overhead-tricep-extension",
    "difficulty": "Intermediate",
    "mechanics": "Isolation",
    "forceType": "Push",
    "bodyRegion": "Upper Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "cable-overhead-extension",
    "name": "Cable Overhead Tricep Extension",
    "primaryMuscle": "Triceps",
    "secondaryMuscles": [],
    "equipment": "Cable",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Elbow Extension",
    "unilateral": false,
    "aliases": [
      "Overhead Cable Extension"
    ],
    "family": "triceps-extension",
    "variation": "cable",
    "difficulty": "Intermediate",
    "mechanics": "Isolation",
    "forceType": "Push",
    "bodyRegion": "Upper Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "close-grip-bench-press",
    "name": "Close-Grip Bench Press",
    "primaryMuscle": "Triceps",
    "secondaryMuscles": [
      "Chest",
      "Shoulders"
    ],
    "equipment": "Barbell",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Horizontal Push",
    "unilateral": false,
    "aliases": [
      "Close Grip Bench",
      "CGBP"
    ],
    "family": "bench-press",
    "variation": "close-grip",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Push",
    "bodyRegion": "Upper Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "tricep-dip",
    "name": "Tricep Dip",
    "primaryMuscle": "Triceps",
    "secondaryMuscles": [
      "Chest",
      "Shoulders"
    ],
    "equipment": "Bodyweight",
    "category": "Strength",
    "trackingType": "reps",
    "movementPattern": "Vertical Push",
    "unilateral": false,
    "aliases": [
      "Triceps Dip",
      "Dip"
    ],
    "family": "dip",
    "variation": "tricep-dip",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Push",
    "bodyRegion": "Upper Body",
    "requiresWeight": false,
    "skillBased": false
  },
  {
    "id": "tricep-kickback",
    "name": "Tricep Kickback",
    "primaryMuscle": "Triceps",
    "secondaryMuscles": [],
    "equipment": "Dumbbells",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Elbow Extension",
    "unilateral": true,
    "aliases": [
      "Dumbbell Kickback"
    ],
    "family": "triceps-extension",
    "variation": "tricep-kickback",
    "difficulty": "Intermediate",
    "mechanics": "Isolation",
    "forceType": "Push",
    "bodyRegion": "Upper Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "back-squat",
    "name": "Barbell Back Squat",
    "primaryMuscle": "Quads",
    "secondaryMuscles": [
      "Glutes",
      "Hamstrings",
      "Core"
    ],
    "equipment": "Barbell",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Squat",
    "unilateral": false,
    "aliases": [
      "Back Squat",
      "Barbell Squat",
      "Squat"
    ],
    "family": "squat",
    "variation": "back-squat",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Push",
    "bodyRegion": "Lower Body",
    "requiresWeight": true,
    "skillBased": true
  },
  {
    "id": "front-squat",
    "name": "Front Squat",
    "primaryMuscle": "Quads",
    "secondaryMuscles": [
      "Glutes",
      "Core"
    ],
    "equipment": "Barbell",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Squat",
    "unilateral": false,
    "aliases": [
      "Barbell Front Squat"
    ],
    "family": "squat",
    "variation": "front-squat",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Push",
    "bodyRegion": "Lower Body",
    "requiresWeight": true,
    "skillBased": true
  },
  {
    "id": "goblet-squat",
    "name": "Goblet Squat",
    "primaryMuscle": "Quads",
    "secondaryMuscles": [
      "Glutes",
      "Core"
    ],
    "equipment": "Dumbbells",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Squat",
    "unilateral": false,
    "aliases": [
      "Dumbbell Goblet Squat"
    ],
    "family": "squat",
    "variation": "goblet",
    "difficulty": "Beginner",
    "mechanics": "Compound",
    "forceType": "Push",
    "bodyRegion": "Lower Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "leg-press",
    "name": "Leg Press",
    "primaryMuscle": "Quads",
    "secondaryMuscles": [
      "Glutes",
      "Hamstrings"
    ],
    "equipment": "Machine",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Squat",
    "unilateral": false,
    "aliases": [
      "Machine Leg Press"
    ],
    "family": "leg-press",
    "variation": "standard",
    "difficulty": "Beginner",
    "mechanics": "Compound",
    "forceType": "Push",
    "bodyRegion": "Lower Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "hack-squat",
    "name": "Hack Squat",
    "primaryMuscle": "Quads",
    "secondaryMuscles": [
      "Glutes"
    ],
    "equipment": "Machine",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Squat",
    "unilateral": false,
    "aliases": [
      "Hack Squat Machine"
    ],
    "family": "squat",
    "variation": "hack-squat",
    "difficulty": "Beginner",
    "mechanics": "Compound",
    "forceType": "Push",
    "bodyRegion": "Lower Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "leg-extension",
    "name": "Leg Extension",
    "primaryMuscle": "Quads",
    "secondaryMuscles": [],
    "equipment": "Machine",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Knee Extension",
    "unilateral": false,
    "aliases": [
      "Leg Extension Machine",
      "Quad Extension"
    ],
    "family": "leg-extension",
    "variation": "standard",
    "difficulty": "Beginner",
    "mechanics": "Isolation",
    "forceType": "Push",
    "bodyRegion": "Lower Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "walking-lunge",
    "name": "Walking Lunge",
    "primaryMuscle": "Quads",
    "secondaryMuscles": [
      "Glutes",
      "Hamstrings"
    ],
    "equipment": "Dumbbells",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Lunge",
    "unilateral": true,
    "aliases": [
      "Walking Lunges"
    ],
    "family": "lunge",
    "variation": "walking-lunge",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Push",
    "bodyRegion": "Lower Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "reverse-lunge",
    "name": "Reverse Lunge",
    "primaryMuscle": "Quads",
    "secondaryMuscles": [
      "Glutes",
      "Hamstrings"
    ],
    "equipment": "Dumbbells",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Lunge",
    "unilateral": true,
    "aliases": [
      "Backward Lunge"
    ],
    "family": "lunge",
    "variation": "reverse-lunge",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Push",
    "bodyRegion": "Lower Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "bulgarian-split-squat",
    "name": "Bulgarian Split Squat",
    "primaryMuscle": "Quads",
    "secondaryMuscles": [
      "Glutes",
      "Hamstrings"
    ],
    "equipment": "Dumbbells",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Lunge",
    "unilateral": true,
    "aliases": [
      "Bulgarian Squat",
      "BSS"
    ],
    "family": "squat",
    "variation": "bulgarian-split-squat",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Push",
    "bodyRegion": "Lower Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "step-up",
    "name": "Step-Up",
    "primaryMuscle": "Quads",
    "secondaryMuscles": [
      "Glutes"
    ],
    "equipment": "Dumbbells",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Lunge",
    "unilateral": true,
    "aliases": [
      "Box Step-Up"
    ],
    "family": "step-up",
    "variation": "standard",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Push",
    "bodyRegion": "Lower Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "romanian-deadlift",
    "name": "Romanian Deadlift",
    "primaryMuscle": "Hamstrings",
    "secondaryMuscles": [
      "Glutes",
      "Back"
    ],
    "equipment": "Barbell",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Hip Hinge",
    "unilateral": false,
    "aliases": [
      "RDL",
      "Barbell RDL"
    ],
    "family": "deadlift",
    "variation": "romanian",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Pull",
    "bodyRegion": "Lower Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "dumbbell-rdl",
    "name": "Dumbbell Romanian Deadlift",
    "primaryMuscle": "Hamstrings",
    "secondaryMuscles": [
      "Glutes",
      "Back"
    ],
    "equipment": "Dumbbells",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Hip Hinge",
    "unilateral": false,
    "aliases": [
      "Dumbbell Romanian Deadlift",
      "DB RDL"
    ],
    "family": "deadlift",
    "variation": "dumbbell",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Pull",
    "bodyRegion": "Lower Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "lying-leg-curl",
    "name": "Lying Leg Curl",
    "primaryMuscle": "Hamstrings",
    "secondaryMuscles": [],
    "equipment": "Machine",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Knee Flexion",
    "unilateral": false,
    "aliases": [
      "Lying Hamstring Curl"
    ],
    "family": "leg-curl",
    "variation": "lying-leg-curl",
    "difficulty": "Beginner",
    "mechanics": "Isolation",
    "forceType": "Pull",
    "bodyRegion": "Lower Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "seated-leg-curl",
    "name": "Seated Leg Curl",
    "primaryMuscle": "Hamstrings",
    "secondaryMuscles": [],
    "equipment": "Machine",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Knee Flexion",
    "unilateral": false,
    "aliases": [
      "Seated Hamstring Curl"
    ],
    "family": "leg-curl",
    "variation": "seated-leg-curl",
    "difficulty": "Beginner",
    "mechanics": "Isolation",
    "forceType": "Pull",
    "bodyRegion": "Lower Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "good-morning",
    "name": "Good Morning",
    "primaryMuscle": "Hamstrings",
    "secondaryMuscles": [
      "Glutes",
      "Back"
    ],
    "equipment": "Barbell",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Hip Hinge",
    "unilateral": false,
    "aliases": [
      "Barbell Good Morning"
    ],
    "family": "good-morning",
    "variation": "standard",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Pull",
    "bodyRegion": "Lower Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "hip-thrust",
    "name": "Barbell Hip Thrust",
    "primaryMuscle": "Glutes",
    "secondaryMuscles": [
      "Hamstrings"
    ],
    "equipment": "Barbell",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Hip Extension",
    "unilateral": false,
    "aliases": [
      "Hip Thrust",
      "Barbell Glute Thrust"
    ],
    "family": "hip-thrust",
    "variation": "standard",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Push",
    "bodyRegion": "Lower Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "glute-bridge",
    "name": "Glute Bridge",
    "primaryMuscle": "Glutes",
    "secondaryMuscles": [
      "Hamstrings"
    ],
    "equipment": "Bodyweight",
    "category": "Strength",
    "trackingType": "reps",
    "movementPattern": "Hip Extension",
    "unilateral": false,
    "aliases": [
      "Glute Bridge"
    ],
    "family": "glute-bridge",
    "variation": "standard",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Push",
    "bodyRegion": "Lower Body",
    "requiresWeight": false,
    "skillBased": false
  },
  {
    "id": "cable-kickback",
    "name": "Cable Glute Kickback",
    "primaryMuscle": "Glutes",
    "secondaryMuscles": [
      "Hamstrings"
    ],
    "equipment": "Cable",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Hip Extension",
    "unilateral": true,
    "aliases": [
      "Glute Kickback"
    ],
    "family": "cable-kickback",
    "variation": "cable",
    "difficulty": "Intermediate",
    "mechanics": "Isolation",
    "forceType": "Push",
    "bodyRegion": "Lower Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "standing-calf-raise",
    "name": "Standing Calf Raise",
    "primaryMuscle": "Calves",
    "secondaryMuscles": [],
    "equipment": "Machine",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Plantar Flexion",
    "unilateral": false,
    "aliases": [
      "Standing Calf Raise Machine"
    ],
    "family": "calf-raise",
    "variation": "standing-calf-raise",
    "difficulty": "Beginner",
    "mechanics": "Isolation",
    "forceType": "Push",
    "bodyRegion": "Lower Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "seated-calf-raise",
    "name": "Seated Calf Raise",
    "primaryMuscle": "Calves",
    "secondaryMuscles": [],
    "equipment": "Machine",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Plantar Flexion",
    "unilateral": false,
    "aliases": [
      "Seated Calf Machine"
    ],
    "family": "calf-raise",
    "variation": "seated-calf-raise",
    "difficulty": "Beginner",
    "mechanics": "Isolation",
    "forceType": "Push",
    "bodyRegion": "Lower Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "single-leg-calf-raise",
    "name": "Single-Leg Calf Raise",
    "primaryMuscle": "Calves",
    "secondaryMuscles": [],
    "equipment": "Bodyweight",
    "category": "Strength",
    "trackingType": "reps",
    "movementPattern": "Plantar Flexion",
    "unilateral": true,
    "aliases": [
      "One Leg Calf Raise"
    ],
    "family": "calf-raise",
    "variation": "single-leg",
    "difficulty": "Intermediate",
    "mechanics": "Isolation",
    "forceType": "Push",
    "bodyRegion": "Lower Body",
    "requiresWeight": false,
    "skillBased": false
  },
  {
    "id": "leg-press-calf-raise",
    "name": "Leg Press Calf Raise",
    "primaryMuscle": "Calves",
    "secondaryMuscles": [],
    "equipment": "Machine",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Plantar Flexion",
    "unilateral": false,
    "aliases": [
      "Calf Press"
    ],
    "family": "calf-raise",
    "variation": "leg-press-calf-raise",
    "difficulty": "Beginner",
    "mechanics": "Isolation",
    "forceType": "Push",
    "bodyRegion": "Lower Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "plank",
    "name": "Plank",
    "primaryMuscle": "Core",
    "secondaryMuscles": [
      "Shoulders"
    ],
    "equipment": "Bodyweight",
    "category": "Core",
    "trackingType": "duration",
    "movementPattern": "Core Stability",
    "unilateral": false,
    "aliases": [
      "Front Plank"
    ],
    "family": "plank",
    "variation": "standard",
    "difficulty": "Intermediate",
    "mechanics": "Isometric",
    "forceType": "Static",
    "bodyRegion": "Core",
    "requiresWeight": false,
    "skillBased": false
  },
  {
    "id": "side-plank",
    "name": "Side Plank",
    "primaryMuscle": "Core",
    "secondaryMuscles": [],
    "equipment": "Bodyweight",
    "category": "Core",
    "trackingType": "duration",
    "movementPattern": "Core Stability",
    "unilateral": true,
    "aliases": [
      "Side Bridge"
    ],
    "family": "plank",
    "variation": "side-plank",
    "difficulty": "Intermediate",
    "mechanics": "Isometric",
    "forceType": "Static",
    "bodyRegion": "Core",
    "requiresWeight": false,
    "skillBased": false
  },
  {
    "id": "crunch",
    "name": "Crunch",
    "primaryMuscle": "Core",
    "secondaryMuscles": [],
    "equipment": "Bodyweight",
    "category": "Core",
    "trackingType": "reps",
    "movementPattern": "Spinal Flexion",
    "unilateral": false,
    "aliases": [
      "Ab Crunch"
    ],
    "family": "crunch",
    "variation": "standard",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Other",
    "bodyRegion": "Core",
    "requiresWeight": false,
    "skillBased": false
  },
  {
    "id": "sit-up",
    "name": "Sit-Up",
    "primaryMuscle": "Core",
    "secondaryMuscles": [],
    "equipment": "Bodyweight",
    "category": "Core",
    "trackingType": "reps",
    "movementPattern": "Spinal Flexion",
    "unilateral": false,
    "aliases": [
      "Situp"
    ],
    "family": "sit-up",
    "variation": "standard",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Other",
    "bodyRegion": "Core",
    "requiresWeight": false,
    "skillBased": false
  },
  {
    "id": "cable-crunch",
    "name": "Cable Crunch",
    "primaryMuscle": "Core",
    "secondaryMuscles": [],
    "equipment": "Cable",
    "category": "Core",
    "trackingType": "weight-reps",
    "movementPattern": "Spinal Flexion",
    "unilateral": false,
    "aliases": [
      "Kneeling Cable Crunch"
    ],
    "family": "cable-crunch",
    "variation": "cable",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Other",
    "bodyRegion": "Core",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "hanging-leg-raise",
    "name": "Hanging Leg Raise",
    "primaryMuscle": "Core",
    "secondaryMuscles": [
      "Hip Flexors"
    ],
    "equipment": "Bodyweight",
    "category": "Core",
    "trackingType": "reps",
    "movementPattern": "Hip Flexion",
    "unilateral": false,
    "aliases": [
      "Hanging Leg Raises"
    ],
    "family": "leg-raise",
    "variation": "hanging-leg-raise",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Other",
    "bodyRegion": "Core",
    "requiresWeight": false,
    "skillBased": false
  },
  {
    "id": "knee-raise",
    "name": "Hanging Knee Raise",
    "primaryMuscle": "Core",
    "secondaryMuscles": [
      "Hip Flexors"
    ],
    "equipment": "Bodyweight",
    "category": "Core",
    "trackingType": "reps",
    "movementPattern": "Hip Flexion",
    "unilateral": false,
    "aliases": [
      "Hanging Knee Raise"
    ],
    "family": "knee-raise",
    "variation": "standard",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Other",
    "bodyRegion": "Core",
    "requiresWeight": false,
    "skillBased": false
  },
  {
    "id": "russian-twist",
    "name": "Russian Twist",
    "primaryMuscle": "Core",
    "secondaryMuscles": [],
    "equipment": "Bodyweight",
    "category": "Core",
    "trackingType": "reps",
    "movementPattern": "Core Rotation",
    "unilateral": false,
    "aliases": [
      "Russian Twists"
    ],
    "family": "russian-twist",
    "variation": "standard",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Other",
    "bodyRegion": "Core",
    "requiresWeight": false,
    "skillBased": false
  },
  {
    "id": "ab-wheel-rollout",
    "name": "Ab Wheel Rollout",
    "primaryMuscle": "Core",
    "secondaryMuscles": [
      "Shoulders"
    ],
    "equipment": "Ab Wheel",
    "category": "Core",
    "trackingType": "reps",
    "movementPattern": "Core Stability",
    "unilateral": false,
    "aliases": [
      "Ab Roller",
      "Ab Wheel"
    ],
    "family": "ab-wheel-rollout",
    "variation": "standard",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Other",
    "bodyRegion": "Core",
    "requiresWeight": false,
    "skillBased": false
  },
  {
    "id": "mountain-climber",
    "name": "Mountain Climber",
    "primaryMuscle": "Core",
    "secondaryMuscles": [
      "Shoulders",
      "Legs"
    ],
    "equipment": "Bodyweight",
    "category": "Core",
    "trackingType": "duration",
    "movementPattern": "Core Stability",
    "unilateral": true,
    "aliases": [
      "Mountain Climbers"
    ],
    "family": "mountain-climber",
    "variation": "standard",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Other",
    "bodyRegion": "Core",
    "requiresWeight": false,
    "skillBased": false
  },
  {
    "id": "wrist-curl",
    "name": "Wrist Curl",
    "primaryMuscle": "Forearms",
    "secondaryMuscles": [],
    "equipment": "Dumbbells",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Wrist Flexion",
    "unilateral": false,
    "aliases": [
      "Dumbbell Wrist Curl"
    ],
    "family": "wrist-curl",
    "variation": "standard",
    "difficulty": "Intermediate",
    "mechanics": "Isolation",
    "forceType": "Pull",
    "bodyRegion": "Upper Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "reverse-wrist-curl",
    "name": "Reverse Wrist Curl",
    "primaryMuscle": "Forearms",
    "secondaryMuscles": [],
    "equipment": "Dumbbells",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Wrist Extension",
    "unilateral": false,
    "aliases": [
      "Dumbbell Reverse Wrist Curl"
    ],
    "family": "reverse-wrist-curl",
    "variation": "standard",
    "difficulty": "Intermediate",
    "mechanics": "Isolation",
    "forceType": "Pull",
    "bodyRegion": "Upper Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "reverse-curl",
    "name": "Reverse Curl",
    "primaryMuscle": "Forearms",
    "secondaryMuscles": [
      "Biceps"
    ],
    "equipment": "EZ Bar",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Elbow Flexion",
    "unilateral": false,
    "aliases": [
      "Reverse Bicep Curl"
    ],
    "family": "biceps-curl",
    "variation": "reverse-curl",
    "difficulty": "Intermediate",
    "mechanics": "Isolation",
    "forceType": "Pull",
    "bodyRegion": "Upper Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "farmers-carry",
    "name": "Farmer's Carry",
    "primaryMuscle": "Forearms",
    "secondaryMuscles": [
      "Traps",
      "Core"
    ],
    "equipment": "Dumbbells",
    "category": "Strength",
    "trackingType": "distance-duration",
    "movementPattern": "Loaded Carry",
    "unilateral": false,
    "aliases": [
      "Farmer Walk",
      "Farmer's Walk"
    ],
    "family": "loaded-carry",
    "variation": "farmers-carry",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Carry",
    "bodyRegion": "Full Body",
    "requiresWeight": false,
    "skillBased": false
  },
  {
    "id": "barbell-shrug",
    "name": "Barbell Shrug",
    "primaryMuscle": "Traps",
    "secondaryMuscles": [
      "Forearms"
    ],
    "equipment": "Barbell",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Scapular Elevation",
    "unilateral": false,
    "aliases": [
      "BB Shrug",
      "Barbell Shrugs"
    ],
    "family": "barbell-shrug",
    "variation": "barbell",
    "difficulty": "Intermediate",
    "mechanics": "Isolation",
    "forceType": "Pull",
    "bodyRegion": "Upper Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "dumbbell-shrug",
    "name": "Dumbbell Shrug",
    "primaryMuscle": "Traps",
    "secondaryMuscles": [
      "Forearms"
    ],
    "equipment": "Dumbbells",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Scapular Elevation",
    "unilateral": false,
    "aliases": [
      "DB Shrug",
      "Dumbbell Shrugs"
    ],
    "family": "dumbbell-shrug",
    "variation": "dumbbell",
    "difficulty": "Intermediate",
    "mechanics": "Isolation",
    "forceType": "Pull",
    "bodyRegion": "Upper Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "clean-and-press",
    "name": "Clean and Press",
    "primaryMuscle": "Full Body",
    "secondaryMuscles": [
      "Shoulders",
      "Legs",
      "Back"
    ],
    "equipment": "Barbell",
    "category": "Power",
    "trackingType": "weight-reps",
    "movementPattern": "Olympic / Power",
    "unilateral": false,
    "aliases": [
      "Clean & Press"
    ],
    "family": "clean-and-press",
    "variation": "standard",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Other",
    "bodyRegion": "Full Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "power-clean",
    "name": "Power Clean",
    "primaryMuscle": "Full Body",
    "secondaryMuscles": [
      "Legs",
      "Back",
      "Shoulders"
    ],
    "equipment": "Barbell",
    "category": "Power",
    "trackingType": "weight-reps",
    "movementPattern": "Olympic / Power",
    "unilateral": false,
    "aliases": [
      "Barbell Power Clean"
    ],
    "family": "power-clean",
    "variation": "standard",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Other",
    "bodyRegion": "Full Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "hang-clean",
    "name": "Hang Clean",
    "primaryMuscle": "Full Body",
    "secondaryMuscles": [
      "Legs",
      "Back",
      "Shoulders"
    ],
    "equipment": "Barbell",
    "category": "Power",
    "trackingType": "weight-reps",
    "movementPattern": "Olympic / Power",
    "unilateral": false,
    "aliases": [
      "Barbell Hang Clean"
    ],
    "family": "hang-clean",
    "variation": "standard",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Other",
    "bodyRegion": "Full Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "thruster",
    "name": "Barbell Thruster",
    "primaryMuscle": "Full Body",
    "secondaryMuscles": [
      "Quads",
      "Shoulders",
      "Triceps"
    ],
    "equipment": "Barbell",
    "category": "Power",
    "trackingType": "weight-reps",
    "movementPattern": "Squat to Press",
    "unilateral": false,
    "aliases": [
      "Barbell Thruster"
    ],
    "family": "thruster",
    "variation": "standard",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Other",
    "bodyRegion": "Full Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "kettlebell-swing",
    "name": "Kettlebell Swing",
    "primaryMuscle": "Full Body",
    "secondaryMuscles": [
      "Glutes",
      "Hamstrings",
      "Core"
    ],
    "equipment": "Kettlebell",
    "category": "Power",
    "trackingType": "weight-reps",
    "movementPattern": "Hip Hinge",
    "unilateral": false,
    "aliases": [
      "KB Swing"
    ],
    "family": "kettlebell-swing",
    "variation": "standard",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Pull",
    "bodyRegion": "Full Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "running",
    "name": "Running",
    "primaryMuscle": "Cardio",
    "secondaryMuscles": [
      "Legs"
    ],
    "equipment": "Bodyweight",
    "category": "Cardio",
    "trackingType": "distance-duration",
    "movementPattern": "Locomotion",
    "unilateral": true,
    "aliases": [
      "Run",
      "Outdoor Running"
    ],
    "family": "running",
    "variation": "outdoor",
    "difficulty": "Beginner",
    "mechanics": "Cardio",
    "forceType": "Locomotion",
    "bodyRegion": "Full Body",
    "requiresWeight": false,
    "skillBased": false
  },
  {
    "id": "treadmill-running",
    "name": "Treadmill Running",
    "primaryMuscle": "Cardio",
    "secondaryMuscles": [
      "Legs"
    ],
    "equipment": "Treadmill",
    "category": "Cardio",
    "trackingType": "distance-duration",
    "movementPattern": "Locomotion",
    "unilateral": true,
    "aliases": [
      "Treadmill Run"
    ],
    "family": "running",
    "variation": "treadmill",
    "difficulty": "Beginner",
    "mechanics": "Cardio",
    "forceType": "Locomotion",
    "bodyRegion": "Full Body",
    "requiresWeight": false,
    "skillBased": false
  },
  {
    "id": "walking",
    "name": "Walking",
    "primaryMuscle": "Cardio",
    "secondaryMuscles": [
      "Legs"
    ],
    "equipment": "Bodyweight",
    "category": "Cardio",
    "trackingType": "distance-duration",
    "movementPattern": "Locomotion",
    "unilateral": true,
    "aliases": [
      "Walk"
    ],
    "family": "walking",
    "variation": "standard",
    "difficulty": "Beginner",
    "mechanics": "Cardio",
    "forceType": "Locomotion",
    "bodyRegion": "Full Body",
    "requiresWeight": false,
    "skillBased": false
  },
  {
    "id": "cycling",
    "name": "Cycling",
    "primaryMuscle": "Cardio",
    "secondaryMuscles": [
      "Legs"
    ],
    "equipment": "Bike",
    "category": "Cardio",
    "trackingType": "distance-duration",
    "movementPattern": "Cycling",
    "unilateral": true,
    "aliases": [
      "Biking",
      "Bike Ride"
    ],
    "family": "cycling",
    "variation": "outdoor",
    "difficulty": "Beginner",
    "mechanics": "Cardio",
    "forceType": "Locomotion",
    "bodyRegion": "Lower Body",
    "requiresWeight": false,
    "skillBased": false
  },
  {
    "id": "stationary-bike",
    "name": "Stationary Bike",
    "primaryMuscle": "Cardio",
    "secondaryMuscles": [
      "Legs"
    ],
    "equipment": "Bike",
    "category": "Cardio",
    "trackingType": "duration",
    "movementPattern": "Cycling",
    "unilateral": true,
    "aliases": [
      "Exercise Bike",
      "Indoor Cycling"
    ],
    "family": "cycling",
    "variation": "stationary",
    "difficulty": "Beginner",
    "mechanics": "Cardio",
    "forceType": "Locomotion",
    "bodyRegion": "Lower Body",
    "requiresWeight": false,
    "skillBased": false
  },
  {
    "id": "rowing-machine",
    "name": "Rowing Machine",
    "primaryMuscle": "Cardio",
    "secondaryMuscles": [
      "Back",
      "Legs",
      "Arms"
    ],
    "equipment": "Rowing Machine",
    "category": "Cardio",
    "trackingType": "distance-duration",
    "movementPattern": "Rowing",
    "unilateral": false,
    "aliases": [
      "Rower",
      "Indoor Rowing"
    ],
    "family": "rowing-cardio",
    "variation": "machine",
    "difficulty": "Beginner",
    "mechanics": "Cardio",
    "forceType": "Pull",
    "bodyRegion": "Full Body",
    "requiresWeight": false,
    "skillBased": false
  },
  {
    "id": "stair-climber",
    "name": "Stair Climber",
    "primaryMuscle": "Cardio",
    "secondaryMuscles": [
      "Quads",
      "Glutes",
      "Calves"
    ],
    "equipment": "Machine",
    "category": "Cardio",
    "trackingType": "duration",
    "movementPattern": "Locomotion",
    "unilateral": true,
    "aliases": [
      "Stairmaster",
      "Stair Machine"
    ],
    "family": "stair-climber",
    "variation": "standard",
    "difficulty": "Beginner",
    "mechanics": "Cardio",
    "forceType": "Locomotion",
    "bodyRegion": "Full Body",
    "requiresWeight": false,
    "skillBased": false
  },
  {
    "id": "elliptical",
    "name": "Elliptical",
    "primaryMuscle": "Cardio",
    "secondaryMuscles": [
      "Legs"
    ],
    "equipment": "Machine",
    "category": "Cardio",
    "trackingType": "duration",
    "movementPattern": "Locomotion",
    "unilateral": true,
    "aliases": [
      "Elliptical Machine"
    ],
    "family": "elliptical",
    "variation": "standard",
    "difficulty": "Beginner",
    "mechanics": "Cardio",
    "forceType": "Locomotion",
    "bodyRegion": "Full Body",
    "requiresWeight": false,
    "skillBased": false
  },
  {
    "id": "jump-rope",
    "name": "Jump Rope",
    "primaryMuscle": "Cardio",
    "secondaryMuscles": [
      "Calves",
      "Shoulders"
    ],
    "equipment": "Jump Rope",
    "category": "Cardio",
    "trackingType": "duration",
    "movementPattern": "Jumping",
    "unilateral": false,
    "aliases": [
      "Skipping Rope",
      "Skipping"
    ],
    "family": "jump-rope",
    "variation": "standard",
    "difficulty": "Intermediate",
    "mechanics": "Cardio",
    "forceType": "Locomotion",
    "bodyRegion": "Full Body",
    "requiresWeight": false,
    "skillBased": false
  },
  {
    "id": "burpee",
    "name": "Burpee",
    "primaryMuscle": "Full Body",
    "secondaryMuscles": [
      "Chest",
      "Legs",
      "Core"
    ],
    "equipment": "Bodyweight",
    "category": "Cardio",
    "trackingType": "reps",
    "movementPattern": "Full Body",
    "unilateral": false,
    "aliases": [
      "Burpees"
    ],
    "family": "burpee",
    "variation": "standard",
    "difficulty": "Intermediate",
    "mechanics": "Cardio",
    "forceType": "Other",
    "bodyRegion": "Full Body",
    "requiresWeight": false,
    "skillBased": false
  },
  {
    "id": "jumping-jacks",
    "name": "Jumping Jacks",
    "primaryMuscle": "Cardio",
    "secondaryMuscles": [
      "Legs",
      "Shoulders"
    ],
    "equipment": "Bodyweight",
    "category": "Cardio",
    "trackingType": "duration",
    "movementPattern": "Full Body",
    "unilateral": false,
    "aliases": [
      "Jumping Jack"
    ],
    "family": "jumping-jacks",
    "variation": "standard",
    "difficulty": "Intermediate",
    "mechanics": "Cardio",
    "forceType": "Locomotion",
    "bodyRegion": "Full Body",
    "requiresWeight": false,
    "skillBased": false
  },
  {
    "id": "bodyweight-squat",
    "name": "Bodyweight Squat",
    "primaryMuscle": "Quads",
    "secondaryMuscles": [
      "Glutes",
      "Core"
    ],
    "equipment": "Bodyweight",
    "category": "Warm-Up",
    "trackingType": "reps",
    "movementPattern": "Squat",
    "unilateral": false,
    "aliases": [
      "Air Squat"
    ],
    "family": "squat",
    "variation": "bodyweight",
    "difficulty": "Beginner",
    "mechanics": "Compound",
    "forceType": "Push",
    "bodyRegion": "Lower Body",
    "requiresWeight": false,
    "skillBased": false
  },
  {
    "id": "walking-high-knees",
    "name": "High Knees",
    "primaryMuscle": "Cardio",
    "secondaryMuscles": [
      "Legs",
      "Core"
    ],
    "equipment": "Bodyweight",
    "category": "Warm-Up",
    "trackingType": "duration",
    "movementPattern": "Locomotion",
    "unilateral": true,
    "aliases": [
      "High Knees"
    ],
    "family": "walking-high-knees",
    "variation": "standard",
    "difficulty": "Beginner",
    "mechanics": "Compound",
    "forceType": "Locomotion",
    "bodyRegion": "Full Body",
    "requiresWeight": false,
    "skillBased": false
  },
  {
    "id": "arm-circles",
    "name": "Arm Circles",
    "primaryMuscle": "Shoulders",
    "secondaryMuscles": [],
    "equipment": "Bodyweight",
    "category": "Warm-Up",
    "trackingType": "duration",
    "movementPattern": "Shoulder Mobility",
    "unilateral": false,
    "aliases": [
      "Arm Circle"
    ],
    "family": "arm-circles",
    "variation": "standard",
    "difficulty": "Beginner",
    "mechanics": "Mobility",
    "forceType": "Other",
    "bodyRegion": "Upper Body",
    "requiresWeight": false,
    "skillBased": false
  },
  {
    "id": "band-pull-apart",
    "name": "Band Pull-Apart",
    "primaryMuscle": "Shoulders",
    "secondaryMuscles": [
      "Back"
    ],
    "equipment": "Resistance Band",
    "category": "Warm-Up",
    "trackingType": "reps",
    "movementPattern": "Horizontal Pull",
    "unilateral": false,
    "aliases": [
      "Band Pull Apart"
    ],
    "family": "band-pull-apart",
    "variation": "standard",
    "difficulty": "Beginner",
    "mechanics": "Compound",
    "forceType": "Pull",
    "bodyRegion": "Upper Body",
    "requiresWeight": false,
    "skillBased": false
  },
  {
    "id": "dead-hang",
    "name": "Dead Hang",
    "primaryMuscle": "Forearms",
    "secondaryMuscles": [
      "Back",
      "Shoulders"
    ],
    "equipment": "Pull-Up Bar",
    "category": "Mobility",
    "trackingType": "duration",
    "movementPattern": "Hang",
    "unilateral": false,
    "aliases": [
      "Passive Hang",
      "Bar Hang"
    ],
    "family": "dead-hang",
    "variation": "standard",
    "difficulty": "Beginner",
    "mechanics": "Mobility",
    "forceType": "Other",
    "bodyRegion": "Upper Body",
    "requiresWeight": false,
    "skillBased": false
  },
  {
    "id": "smith-machine-bench-press",
    "name": "Smith Machine Bench Press",
    "primaryMuscle": "Chest",
    "secondaryMuscles": [
      "Triceps",
      "Shoulders"
    ],
    "equipment": "Smith Machine",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Horizontal Push",
    "unilateral": false,
    "aliases": [
      "Smith Bench",
      "Smith Bench Press"
    ],
    "family": "bench-press",
    "variation": "machine",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Push",
    "bodyRegion": "Upper Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "smith-machine-incline-press",
    "name": "Smith Machine Incline Press",
    "primaryMuscle": "Chest",
    "secondaryMuscles": [
      "Shoulders",
      "Triceps"
    ],
    "equipment": "Smith Machine",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Horizontal Push",
    "unilateral": false,
    "aliases": [
      "Smith Incline Press",
      "Incline Smith Bench"
    ],
    "family": "bench-press",
    "variation": "incline",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Push",
    "bodyRegion": "Upper Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "incline-chest-press-machine",
    "name": "Incline Chest Press Machine",
    "primaryMuscle": "Chest",
    "secondaryMuscles": [
      "Shoulders",
      "Triceps"
    ],
    "equipment": "Machine",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Horizontal Push",
    "unilateral": false,
    "aliases": [
      "Incline Machine Press"
    ],
    "family": "bench-press",
    "variation": "incline",
    "difficulty": "Beginner",
    "mechanics": "Compound",
    "forceType": "Push",
    "bodyRegion": "Upper Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "pec-deck",
    "name": "Pec Deck",
    "primaryMuscle": "Chest",
    "secondaryMuscles": [],
    "equipment": "Machine",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Chest Isolation",
    "unilateral": false,
    "aliases": [
      "Machine Fly",
      "Pec Fly"
    ],
    "family": "chest-fly",
    "variation": "pec-deck",
    "difficulty": "Beginner",
    "mechanics": "Isolation",
    "forceType": "Other",
    "bodyRegion": "Upper Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "low-to-high-cable-fly",
    "name": "Low-to-High Cable Fly",
    "primaryMuscle": "Chest",
    "secondaryMuscles": [
      "Shoulders"
    ],
    "equipment": "Cable",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Chest Isolation",
    "unilateral": false,
    "aliases": [
      "Low Cable Fly",
      "Low to High Fly"
    ],
    "family": "chest-fly",
    "variation": "low-to-high-cable",
    "difficulty": "Intermediate",
    "mechanics": "Isolation",
    "forceType": "Other",
    "bodyRegion": "Upper Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "high-to-low-cable-fly",
    "name": "High-to-Low Cable Fly",
    "primaryMuscle": "Chest",
    "secondaryMuscles": [
      "Shoulders"
    ],
    "equipment": "Cable",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Chest Isolation",
    "unilateral": false,
    "aliases": [
      "High Cable Fly",
      "High to Low Fly"
    ],
    "family": "chest-fly",
    "variation": "high-to-low-cable",
    "difficulty": "Intermediate",
    "mechanics": "Isolation",
    "forceType": "Other",
    "bodyRegion": "Upper Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "single-arm-cable-fly",
    "name": "Single-Arm Cable Fly",
    "primaryMuscle": "Chest",
    "secondaryMuscles": [
      "Shoulders",
      "Core"
    ],
    "equipment": "Cable",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Chest Isolation",
    "unilateral": true,
    "aliases": [
      "One Arm Cable Fly"
    ],
    "family": "chest-fly",
    "variation": "single-arm",
    "difficulty": "Intermediate",
    "mechanics": "Isolation",
    "forceType": "Other",
    "bodyRegion": "Upper Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "floor-press",
    "name": "Barbell Floor Press",
    "primaryMuscle": "Chest",
    "secondaryMuscles": [
      "Triceps",
      "Shoulders"
    ],
    "equipment": "Barbell",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Horizontal Push",
    "unilateral": false,
    "aliases": [
      "Barbell Floor Press"
    ],
    "family": "floor-press",
    "variation": "standard",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Push",
    "bodyRegion": "Upper Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "dumbbell-floor-press",
    "name": "Dumbbell Floor Press",
    "primaryMuscle": "Chest",
    "secondaryMuscles": [
      "Triceps",
      "Shoulders"
    ],
    "equipment": "Dumbbells",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Horizontal Push",
    "unilateral": false,
    "aliases": [
      "DB Floor Press"
    ],
    "family": "floor-press",
    "variation": "dumbbell",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Push",
    "bodyRegion": "Upper Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "diamond-push-up",
    "name": "Diamond Push-Up",
    "primaryMuscle": "Chest",
    "secondaryMuscles": [
      "Triceps",
      "Shoulders"
    ],
    "equipment": "Bodyweight",
    "category": "Strength",
    "trackingType": "reps",
    "movementPattern": "Horizontal Push",
    "unilateral": false,
    "aliases": [
      "Diamond Pushup",
      "Triangle Push-Up"
    ],
    "family": "push-up",
    "variation": "diamond",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Push",
    "bodyRegion": "Upper Body",
    "requiresWeight": false,
    "skillBased": false
  },
  {
    "id": "incline-push-up",
    "name": "Incline Push-Up",
    "primaryMuscle": "Chest",
    "secondaryMuscles": [
      "Triceps",
      "Shoulders"
    ],
    "equipment": "Bodyweight",
    "category": "Strength",
    "trackingType": "reps",
    "movementPattern": "Horizontal Push",
    "unilateral": false,
    "aliases": [
      "Incline Pushup"
    ],
    "family": "push-up",
    "variation": "incline",
    "difficulty": "Beginner",
    "mechanics": "Compound",
    "forceType": "Push",
    "bodyRegion": "Upper Body",
    "requiresWeight": false,
    "skillBased": false
  },
  {
    "id": "decline-push-up",
    "name": "Decline Push-Up",
    "primaryMuscle": "Chest",
    "secondaryMuscles": [
      "Shoulders",
      "Triceps"
    ],
    "equipment": "Bodyweight",
    "category": "Strength",
    "trackingType": "reps",
    "movementPattern": "Horizontal Push",
    "unilateral": false,
    "aliases": [
      "Decline Pushup"
    ],
    "family": "push-up",
    "variation": "decline",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Push",
    "bodyRegion": "Upper Body",
    "requiresWeight": false,
    "skillBased": false
  },
  {
    "id": "wide-grip-lat-pulldown",
    "name": "Wide-Grip Lat Pulldown",
    "primaryMuscle": "Back",
    "secondaryMuscles": [
      "Biceps"
    ],
    "equipment": "Cable",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Vertical Pull",
    "unilateral": false,
    "aliases": [
      "Wide Pulldown"
    ],
    "family": "lat-pulldown",
    "variation": "wide-grip",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Pull",
    "bodyRegion": "Upper Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "close-grip-lat-pulldown",
    "name": "Close-Grip Lat Pulldown",
    "primaryMuscle": "Back",
    "secondaryMuscles": [
      "Biceps"
    ],
    "equipment": "Cable",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Vertical Pull",
    "unilateral": false,
    "aliases": [
      "Close Grip Pulldown"
    ],
    "family": "lat-pulldown",
    "variation": "close-grip",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Pull",
    "bodyRegion": "Upper Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "neutral-grip-pulldown",
    "name": "Neutral-Grip Lat Pulldown",
    "primaryMuscle": "Back",
    "secondaryMuscles": [
      "Biceps"
    ],
    "equipment": "Cable",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Vertical Pull",
    "unilateral": false,
    "aliases": [
      "Neutral Pulldown"
    ],
    "family": "lat-pulldown",
    "variation": "neutral-grip",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Pull",
    "bodyRegion": "Upper Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "single-arm-lat-pulldown",
    "name": "Single-Arm Lat Pulldown",
    "primaryMuscle": "Back",
    "secondaryMuscles": [
      "Biceps"
    ],
    "equipment": "Cable",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Vertical Pull",
    "unilateral": true,
    "aliases": [
      "One Arm Lat Pulldown"
    ],
    "family": "lat-pulldown",
    "variation": "single-arm",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Pull",
    "bodyRegion": "Upper Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "machine-row",
    "name": "Machine Row",
    "primaryMuscle": "Back",
    "secondaryMuscles": [
      "Biceps",
      "Rear Delts"
    ],
    "equipment": "Machine",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Horizontal Pull",
    "unilateral": false,
    "aliases": [
      "Seated Machine Row"
    ],
    "family": "row",
    "variation": "machine",
    "difficulty": "Beginner",
    "mechanics": "Compound",
    "forceType": "Pull",
    "bodyRegion": "Upper Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "single-arm-cable-row",
    "name": "Single-Arm Cable Row",
    "primaryMuscle": "Back",
    "secondaryMuscles": [
      "Biceps",
      "Rear Delts"
    ],
    "equipment": "Cable",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Horizontal Pull",
    "unilateral": true,
    "aliases": [
      "One Arm Cable Row"
    ],
    "family": "row",
    "variation": "single-arm",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Pull",
    "bodyRegion": "Upper Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "pendlay-row",
    "name": "Pendlay Row",
    "primaryMuscle": "Back",
    "secondaryMuscles": [
      "Biceps",
      "Core"
    ],
    "equipment": "Barbell",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Horizontal Pull",
    "unilateral": false,
    "aliases": [
      "Pendlay Barbell Row"
    ],
    "family": "row",
    "variation": "pendlay-row",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Pull",
    "bodyRegion": "Upper Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "meadows-row",
    "name": "Meadows Row",
    "primaryMuscle": "Back",
    "secondaryMuscles": [
      "Biceps",
      "Rear Delts"
    ],
    "equipment": "Barbell",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Horizontal Pull",
    "unilateral": true,
    "aliases": [
      "Landmine Meadows Row"
    ],
    "family": "row",
    "variation": "meadows-row",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Pull",
    "bodyRegion": "Upper Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "landmine-row",
    "name": "Landmine Row",
    "primaryMuscle": "Back",
    "secondaryMuscles": [
      "Biceps",
      "Rear Delts"
    ],
    "equipment": "Barbell",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Horizontal Pull",
    "unilateral": false,
    "aliases": [
      "Landmine T-Bar Row"
    ],
    "family": "row",
    "variation": "landmine-row",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Pull",
    "bodyRegion": "Upper Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "dumbbell-pullover",
    "name": "Dumbbell Pullover",
    "primaryMuscle": "Back",
    "secondaryMuscles": [
      "Chest",
      "Triceps"
    ],
    "equipment": "Dumbbells",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Vertical Pull",
    "unilateral": false,
    "aliases": [
      "DB Pullover"
    ],
    "family": "dumbbell-pullover",
    "variation": "dumbbell",
    "difficulty": "Intermediate",
    "mechanics": "Isolation",
    "forceType": "Pull",
    "bodyRegion": "Upper Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "cable-pullover",
    "name": "Cable Pullover",
    "primaryMuscle": "Back",
    "secondaryMuscles": [
      "Triceps"
    ],
    "equipment": "Cable",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Vertical Pull",
    "unilateral": false,
    "aliases": [
      "Cable Lat Pullover"
    ],
    "family": "cable-pullover",
    "variation": "cable",
    "difficulty": "Intermediate",
    "mechanics": "Isolation",
    "forceType": "Pull",
    "bodyRegion": "Upper Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "assisted-pull-up",
    "name": "Assisted Pull-Up",
    "primaryMuscle": "Back",
    "secondaryMuscles": [
      "Biceps"
    ],
    "equipment": "Machine",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Vertical Pull",
    "unilateral": false,
    "aliases": [
      "Assisted Pullup",
      "Machine Pull-Up"
    ],
    "family": "pull-up",
    "variation": "assisted",
    "difficulty": "Beginner",
    "mechanics": "Compound",
    "forceType": "Pull",
    "bodyRegion": "Upper Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "seated-barbell-shoulder-press",
    "name": "Seated Barbell Shoulder Press",
    "primaryMuscle": "Shoulders",
    "secondaryMuscles": [
      "Triceps"
    ],
    "equipment": "Barbell",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Vertical Push",
    "unilateral": false,
    "aliases": [
      "Seated Barbell Press"
    ],
    "family": "overhead-press",
    "variation": "barbell",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Push",
    "bodyRegion": "Upper Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "single-arm-dumbbell-press",
    "name": "Single-Arm Dumbbell Shoulder Press",
    "primaryMuscle": "Shoulders",
    "secondaryMuscles": [
      "Triceps",
      "Core"
    ],
    "equipment": "Dumbbells",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Vertical Push",
    "unilateral": true,
    "aliases": [
      "One Arm Dumbbell Press"
    ],
    "family": "overhead-press",
    "variation": "single-arm",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Push",
    "bodyRegion": "Upper Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "landmine-press",
    "name": "Landmine Press",
    "primaryMuscle": "Shoulders",
    "secondaryMuscles": [
      "Chest",
      "Triceps"
    ],
    "equipment": "Barbell",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Vertical Push",
    "unilateral": false,
    "aliases": [
      "Landmine Shoulder Press"
    ],
    "family": "landmine-press",
    "variation": "standard",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Push",
    "bodyRegion": "Upper Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "single-arm-landmine-press",
    "name": "Single-Arm Landmine Press",
    "primaryMuscle": "Shoulders",
    "secondaryMuscles": [
      "Chest",
      "Triceps",
      "Core"
    ],
    "equipment": "Barbell",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Vertical Push",
    "unilateral": true,
    "aliases": [
      "One Arm Landmine Press"
    ],
    "family": "landmine-press",
    "variation": "single-arm",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Push",
    "bodyRegion": "Upper Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "upright-row",
    "name": "Upright Row",
    "primaryMuscle": "Shoulders",
    "secondaryMuscles": [
      "Traps",
      "Biceps"
    ],
    "equipment": "Barbell",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Vertical Pull",
    "unilateral": false,
    "aliases": [
      "Barbell Upright Row"
    ],
    "family": "upright-row",
    "variation": "standard",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Pull",
    "bodyRegion": "Upper Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "cable-upright-row",
    "name": "Cable Upright Row",
    "primaryMuscle": "Shoulders",
    "secondaryMuscles": [
      "Traps",
      "Biceps"
    ],
    "equipment": "Cable",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Vertical Pull",
    "unilateral": false,
    "aliases": [
      "Upright Cable Row"
    ],
    "family": "upright-row",
    "variation": "cable",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Pull",
    "bodyRegion": "Upper Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "leaning-lateral-raise",
    "name": "Leaning Cable Lateral Raise",
    "primaryMuscle": "Shoulders",
    "secondaryMuscles": [],
    "equipment": "Cable",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Shoulder Isolation",
    "unilateral": true,
    "aliases": [
      "Leaning Cable Raise"
    ],
    "family": "lateral-raise",
    "variation": "leaning-lateral-raise",
    "difficulty": "Intermediate",
    "mechanics": "Isolation",
    "forceType": "Other",
    "bodyRegion": "Upper Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "machine-lateral-raise",
    "name": "Machine Lateral Raise",
    "primaryMuscle": "Shoulders",
    "secondaryMuscles": [],
    "equipment": "Machine",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Shoulder Isolation",
    "unilateral": false,
    "aliases": [
      "Lateral Raise Machine"
    ],
    "family": "lateral-raise",
    "variation": "machine",
    "difficulty": "Beginner",
    "mechanics": "Isolation",
    "forceType": "Other",
    "bodyRegion": "Upper Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "cable-rear-delt-fly",
    "name": "Cable Rear Delt Fly",
    "primaryMuscle": "Shoulders",
    "secondaryMuscles": [
      "Back"
    ],
    "equipment": "Cable",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Shoulder Isolation",
    "unilateral": false,
    "aliases": [
      "Cable Reverse Fly"
    ],
    "family": "rear-delt-fly",
    "variation": "cable",
    "difficulty": "Intermediate",
    "mechanics": "Isolation",
    "forceType": "Other",
    "bodyRegion": "Upper Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "band-face-pull",
    "name": "Band Face Pull",
    "primaryMuscle": "Shoulders",
    "secondaryMuscles": [
      "Back"
    ],
    "equipment": "Resistance Band",
    "category": "Strength",
    "trackingType": "reps",
    "movementPattern": "Horizontal Pull",
    "unilateral": false,
    "aliases": [
      "Resistance Band Face Pull"
    ],
    "family": "face-pull",
    "variation": "band-face-pull",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Pull",
    "bodyRegion": "Upper Body",
    "requiresWeight": false,
    "skillBased": false
  },
  {
    "id": "spider-curl",
    "name": "Spider Curl",
    "primaryMuscle": "Biceps",
    "secondaryMuscles": [
      "Forearms"
    ],
    "equipment": "Dumbbells",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Elbow Flexion",
    "unilateral": false,
    "aliases": [
      "Spider Bicep Curl"
    ],
    "family": "biceps-curl",
    "variation": "spider-curl",
    "difficulty": "Intermediate",
    "mechanics": "Isolation",
    "forceType": "Pull",
    "bodyRegion": "Upper Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "bayesian-cable-curl",
    "name": "Bayesian Cable Curl",
    "primaryMuscle": "Biceps",
    "secondaryMuscles": [
      "Forearms"
    ],
    "equipment": "Cable",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Elbow Flexion",
    "unilateral": true,
    "aliases": [
      "Bayesian Curl"
    ],
    "family": "biceps-curl",
    "variation": "cable",
    "difficulty": "Intermediate",
    "mechanics": "Isolation",
    "forceType": "Pull",
    "bodyRegion": "Upper Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "rope-hammer-curl",
    "name": "Rope Hammer Curl",
    "primaryMuscle": "Biceps",
    "secondaryMuscles": [
      "Forearms"
    ],
    "equipment": "Cable",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Elbow Flexion",
    "unilateral": false,
    "aliases": [
      "Cable Hammer Curl"
    ],
    "family": "biceps-curl",
    "variation": "rope-hammer-curl",
    "difficulty": "Intermediate",
    "mechanics": "Isolation",
    "forceType": "Pull",
    "bodyRegion": "Upper Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "cross-body-hammer-curl",
    "name": "Cross-Body Hammer Curl",
    "primaryMuscle": "Biceps",
    "secondaryMuscles": [
      "Forearms"
    ],
    "equipment": "Dumbbells",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Elbow Flexion",
    "unilateral": true,
    "aliases": [
      "Cross Body Curl"
    ],
    "family": "biceps-curl",
    "variation": "cross-body-hammer-curl",
    "difficulty": "Intermediate",
    "mechanics": "Isolation",
    "forceType": "Pull",
    "bodyRegion": "Upper Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "machine-bicep-curl",
    "name": "Machine Bicep Curl",
    "primaryMuscle": "Biceps",
    "secondaryMuscles": [
      "Forearms"
    ],
    "equipment": "Machine",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Elbow Flexion",
    "unilateral": false,
    "aliases": [
      "Bicep Curl Machine"
    ],
    "family": "biceps-curl",
    "variation": "machine",
    "difficulty": "Beginner",
    "mechanics": "Isolation",
    "forceType": "Pull",
    "bodyRegion": "Upper Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "zottman-curl",
    "name": "Zottman Curl",
    "primaryMuscle": "Biceps",
    "secondaryMuscles": [
      "Forearms"
    ],
    "equipment": "Dumbbells",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Elbow Flexion",
    "unilateral": false,
    "aliases": [
      "Zottman Bicep Curl"
    ],
    "family": "biceps-curl",
    "variation": "zottman-curl",
    "difficulty": "Intermediate",
    "mechanics": "Isolation",
    "forceType": "Pull",
    "bodyRegion": "Upper Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "drag-curl",
    "name": "Barbell Drag Curl",
    "primaryMuscle": "Biceps",
    "secondaryMuscles": [
      "Forearms"
    ],
    "equipment": "Barbell",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Elbow Flexion",
    "unilateral": false,
    "aliases": [
      "Barbell Drag Curl"
    ],
    "family": "biceps-curl",
    "variation": "drag-curl",
    "difficulty": "Intermediate",
    "mechanics": "Isolation",
    "forceType": "Pull",
    "bodyRegion": "Upper Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "high-cable-curl",
    "name": "High Cable Curl",
    "primaryMuscle": "Biceps",
    "secondaryMuscles": [
      "Forearms"
    ],
    "equipment": "Cable",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Elbow Flexion",
    "unilateral": false,
    "aliases": [
      "Cable Crucifix Curl"
    ],
    "family": "biceps-curl",
    "variation": "high-cable",
    "difficulty": "Intermediate",
    "mechanics": "Isolation",
    "forceType": "Pull",
    "bodyRegion": "Upper Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "single-arm-tricep-pushdown",
    "name": "Single-Arm Tricep Pushdown",
    "primaryMuscle": "Triceps",
    "secondaryMuscles": [],
    "equipment": "Cable",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Elbow Extension",
    "unilateral": true,
    "aliases": [
      "One Arm Pushdown"
    ],
    "family": "triceps-extension",
    "variation": "single-arm",
    "difficulty": "Intermediate",
    "mechanics": "Isolation",
    "forceType": "Push",
    "bodyRegion": "Upper Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "reverse-grip-pushdown",
    "name": "Reverse-Grip Tricep Pushdown",
    "primaryMuscle": "Triceps",
    "secondaryMuscles": [
      "Forearms"
    ],
    "equipment": "Cable",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Elbow Extension",
    "unilateral": false,
    "aliases": [
      "Underhand Tricep Pushdown"
    ],
    "family": "triceps-extension",
    "variation": "reverse-grip-pushdown",
    "difficulty": "Intermediate",
    "mechanics": "Isolation",
    "forceType": "Push",
    "bodyRegion": "Upper Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "single-arm-overhead-extension",
    "name": "Single-Arm Overhead Tricep Extension",
    "primaryMuscle": "Triceps",
    "secondaryMuscles": [],
    "equipment": "Cable",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Elbow Extension",
    "unilateral": true,
    "aliases": [
      "One Arm Overhead Extension"
    ],
    "family": "triceps-extension",
    "variation": "single-arm-overhead",
    "difficulty": "Intermediate",
    "mechanics": "Isolation",
    "forceType": "Push",
    "bodyRegion": "Upper Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "dumbbell-skull-crusher",
    "name": "Dumbbell Skull Crusher",
    "primaryMuscle": "Triceps",
    "secondaryMuscles": [],
    "equipment": "Dumbbells",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Elbow Extension",
    "unilateral": false,
    "aliases": [
      "DB Skull Crusher"
    ],
    "family": "triceps-extension",
    "variation": "dumbbell",
    "difficulty": "Intermediate",
    "mechanics": "Isolation",
    "forceType": "Push",
    "bodyRegion": "Upper Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "jm-press",
    "name": "JM Press",
    "primaryMuscle": "Triceps",
    "secondaryMuscles": [
      "Chest",
      "Shoulders"
    ],
    "equipment": "Barbell",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Elbow Extension",
    "unilateral": false,
    "aliases": [
      "JM Bench Press"
    ],
    "family": "triceps-extension",
    "variation": "jm-press",
    "difficulty": "Intermediate",
    "mechanics": "Isolation",
    "forceType": "Push",
    "bodyRegion": "Upper Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "machine-tricep-extension",
    "name": "Machine Tricep Extension",
    "primaryMuscle": "Triceps",
    "secondaryMuscles": [],
    "equipment": "Machine",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Elbow Extension",
    "unilateral": false,
    "aliases": [
      "Tricep Extension Machine"
    ],
    "family": "triceps-extension",
    "variation": "machine",
    "difficulty": "Beginner",
    "mechanics": "Isolation",
    "forceType": "Push",
    "bodyRegion": "Upper Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "bench-dip",
    "name": "Bench Dip",
    "primaryMuscle": "Triceps",
    "secondaryMuscles": [
      "Chest",
      "Shoulders"
    ],
    "equipment": "Bodyweight",
    "category": "Strength",
    "trackingType": "reps",
    "movementPattern": "Vertical Push",
    "unilateral": false,
    "aliases": [
      "Bench Dips"
    ],
    "family": "dip",
    "variation": "bench",
    "difficulty": "Beginner",
    "mechanics": "Compound",
    "forceType": "Push",
    "bodyRegion": "Upper Body",
    "requiresWeight": false,
    "skillBased": false
  },
  {
    "id": "close-grip-push-up",
    "name": "Close-Grip Push-Up",
    "primaryMuscle": "Triceps",
    "secondaryMuscles": [
      "Chest",
      "Shoulders"
    ],
    "equipment": "Bodyweight",
    "category": "Strength",
    "trackingType": "reps",
    "movementPattern": "Horizontal Push",
    "unilateral": false,
    "aliases": [
      "Close Grip Pushup",
      "Tricep Push-Up"
    ],
    "family": "push-up",
    "variation": "close-grip",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Push",
    "bodyRegion": "Upper Body",
    "requiresWeight": false,
    "skillBased": false
  },
  {
    "id": "smith-machine-squat",
    "name": "Smith Machine Squat",
    "primaryMuscle": "Quads",
    "secondaryMuscles": [
      "Glutes",
      "Hamstrings"
    ],
    "equipment": "Smith Machine",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Squat",
    "unilateral": false,
    "aliases": [
      "Smith Squat"
    ],
    "family": "squat",
    "variation": "machine",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Push",
    "bodyRegion": "Lower Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "zercher-squat",
    "name": "Zercher Squat",
    "primaryMuscle": "Quads",
    "secondaryMuscles": [
      "Glutes",
      "Core",
      "Back"
    ],
    "equipment": "Barbell",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Squat",
    "unilateral": false,
    "aliases": [
      "Zercher"
    ],
    "family": "squat",
    "variation": "zercher-squat",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Push",
    "bodyRegion": "Lower Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "box-squat",
    "name": "Box Squat",
    "primaryMuscle": "Quads",
    "secondaryMuscles": [
      "Glutes",
      "Hamstrings"
    ],
    "equipment": "Barbell",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Squat",
    "unilateral": false,
    "aliases": [
      "Barbell Box Squat"
    ],
    "family": "squat",
    "variation": "box-squat",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Push",
    "bodyRegion": "Lower Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "pause-squat",
    "name": "Pause Squat",
    "primaryMuscle": "Quads",
    "secondaryMuscles": [
      "Glutes",
      "Core"
    ],
    "equipment": "Barbell",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Squat",
    "unilateral": false,
    "aliases": [
      "Paused Squat"
    ],
    "family": "squat",
    "variation": "pause-squat",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Push",
    "bodyRegion": "Lower Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "sissy-squat",
    "name": "Sissy Squat",
    "primaryMuscle": "Quads",
    "secondaryMuscles": [],
    "equipment": "Bodyweight",
    "category": "Strength",
    "trackingType": "reps",
    "movementPattern": "Squat",
    "unilateral": false,
    "aliases": [
      "Bodyweight Sissy Squat"
    ],
    "family": "squat",
    "variation": "sissy-squat",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Push",
    "bodyRegion": "Lower Body",
    "requiresWeight": false,
    "skillBased": false
  },
  {
    "id": "single-leg-press",
    "name": "Single-Leg Press",
    "primaryMuscle": "Quads",
    "secondaryMuscles": [
      "Glutes",
      "Hamstrings"
    ],
    "equipment": "Machine",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Squat",
    "unilateral": true,
    "aliases": [
      "One Leg Press"
    ],
    "family": "single-leg-press",
    "variation": "single-leg",
    "difficulty": "Beginner",
    "mechanics": "Compound",
    "forceType": "Push",
    "bodyRegion": "Lower Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "lateral-lunge",
    "name": "Lateral Lunge",
    "primaryMuscle": "Quads",
    "secondaryMuscles": [
      "Glutes",
      "Adductors"
    ],
    "equipment": "Dumbbells",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Lunge",
    "unilateral": true,
    "aliases": [
      "Side Lunge"
    ],
    "family": "lunge",
    "variation": "lateral-lunge",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Push",
    "bodyRegion": "Lower Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "curtsy-lunge",
    "name": "Curtsy Lunge",
    "primaryMuscle": "Glutes",
    "secondaryMuscles": [
      "Quads"
    ],
    "equipment": "Dumbbells",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Lunge",
    "unilateral": true,
    "aliases": [
      "Curtsy Squat"
    ],
    "family": "lunge",
    "variation": "curtsy-lunge",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Push",
    "bodyRegion": "Lower Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "split-squat",
    "name": "Split Squat",
    "primaryMuscle": "Quads",
    "secondaryMuscles": [
      "Glutes",
      "Hamstrings"
    ],
    "equipment": "Dumbbells",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Lunge",
    "unilateral": true,
    "aliases": [
      "Stationary Lunge"
    ],
    "family": "squat",
    "variation": "split-squat",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Push",
    "bodyRegion": "Lower Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "pistol-squat",
    "name": "Pistol Squat",
    "primaryMuscle": "Quads",
    "secondaryMuscles": [
      "Glutes",
      "Core"
    ],
    "equipment": "Bodyweight",
    "category": "Strength",
    "trackingType": "reps",
    "movementPattern": "Squat",
    "unilateral": true,
    "aliases": [
      "Single Leg Squat"
    ],
    "family": "squat",
    "variation": "pistol",
    "difficulty": "Advanced",
    "mechanics": "Compound",
    "forceType": "Push",
    "bodyRegion": "Lower Body",
    "requiresWeight": false,
    "skillBased": true
  },
  {
    "id": "sumo-deadlift",
    "name": "Sumo Deadlift",
    "primaryMuscle": "Glutes",
    "secondaryMuscles": [
      "Hamstrings",
      "Quads",
      "Back"
    ],
    "equipment": "Barbell",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Hip Hinge",
    "unilateral": false,
    "aliases": [
      "Sumo Deadlift"
    ],
    "family": "deadlift",
    "variation": "sumo",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Pull",
    "bodyRegion": "Full Body",
    "requiresWeight": true,
    "skillBased": true
  },
  {
    "id": "stiff-leg-deadlift",
    "name": "Stiff-Leg Deadlift",
    "primaryMuscle": "Hamstrings",
    "secondaryMuscles": [
      "Glutes",
      "Back"
    ],
    "equipment": "Barbell",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Hip Hinge",
    "unilateral": false,
    "aliases": [
      "Stiff Leg Deadlift",
      "SLDL"
    ],
    "family": "deadlift",
    "variation": "stiff-leg",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Pull",
    "bodyRegion": "Lower Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "single-leg-rdl",
    "name": "Single-Leg Romanian Deadlift",
    "primaryMuscle": "Hamstrings",
    "secondaryMuscles": [
      "Glutes",
      "Core"
    ],
    "equipment": "Dumbbells",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Hip Hinge",
    "unilateral": true,
    "aliases": [
      "Single Leg Romanian Deadlift"
    ],
    "family": "deadlift",
    "variation": "single-leg-rdl",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Pull",
    "bodyRegion": "Lower Body",
    "requiresWeight": true,
    "skillBased": true
  },
  {
    "id": "nordic-hamstring-curl",
    "name": "Nordic Hamstring Curl",
    "primaryMuscle": "Hamstrings",
    "secondaryMuscles": [
      "Glutes"
    ],
    "equipment": "Bodyweight",
    "category": "Strength",
    "trackingType": "reps",
    "movementPattern": "Knee Flexion",
    "unilateral": false,
    "aliases": [
      "Nordic Curl",
      "Nordic Ham Curl"
    ],
    "family": "leg-curl",
    "variation": "rings",
    "difficulty": "Intermediate",
    "mechanics": "Isolation",
    "forceType": "Pull",
    "bodyRegion": "Lower Body",
    "requiresWeight": false,
    "skillBased": false
  },
  {
    "id": "glute-ham-raise",
    "name": "Glute-Ham Raise",
    "primaryMuscle": "Hamstrings",
    "secondaryMuscles": [
      "Glutes"
    ],
    "equipment": "Machine",
    "category": "Strength",
    "trackingType": "reps",
    "movementPattern": "Knee Flexion",
    "unilateral": false,
    "aliases": [
      "GHR"
    ],
    "family": "leg-curl",
    "variation": "glute-ham-raise",
    "difficulty": "Beginner",
    "mechanics": "Isolation",
    "forceType": "Pull",
    "bodyRegion": "Lower Body",
    "requiresWeight": false,
    "skillBased": false
  },
  {
    "id": "single-leg-curl",
    "name": "Single-Leg Curl",
    "primaryMuscle": "Hamstrings",
    "secondaryMuscles": [],
    "equipment": "Machine",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Knee Flexion",
    "unilateral": true,
    "aliases": [
      "Single Leg Hamstring Curl"
    ],
    "family": "leg-curl",
    "variation": "single-leg",
    "difficulty": "Beginner",
    "mechanics": "Isolation",
    "forceType": "Pull",
    "bodyRegion": "Lower Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "single-leg-hip-thrust",
    "name": "Single-Leg Hip Thrust",
    "primaryMuscle": "Glutes",
    "secondaryMuscles": [
      "Hamstrings"
    ],
    "equipment": "Bodyweight",
    "category": "Strength",
    "trackingType": "reps",
    "movementPattern": "Hip Extension",
    "unilateral": true,
    "aliases": [
      "One Leg Hip Thrust"
    ],
    "family": "hip-thrust",
    "variation": "single-leg",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Push",
    "bodyRegion": "Lower Body",
    "requiresWeight": false,
    "skillBased": false
  },
  {
    "id": "machine-hip-thrust",
    "name": "Machine Hip Thrust",
    "primaryMuscle": "Glutes",
    "secondaryMuscles": [
      "Hamstrings"
    ],
    "equipment": "Machine",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Hip Extension",
    "unilateral": false,
    "aliases": [
      "Hip Thrust Machine"
    ],
    "family": "hip-thrust",
    "variation": "machine",
    "difficulty": "Beginner",
    "mechanics": "Compound",
    "forceType": "Push",
    "bodyRegion": "Lower Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "cable-pull-through",
    "name": "Cable Pull-Through",
    "primaryMuscle": "Glutes",
    "secondaryMuscles": [
      "Hamstrings"
    ],
    "equipment": "Cable",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Hip Hinge",
    "unilateral": false,
    "aliases": [
      "Pull Through"
    ],
    "family": "cable-pull-through",
    "variation": "cable",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Pull",
    "bodyRegion": "Lower Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "hip-abduction-machine",
    "name": "Hip Abduction Machine",
    "primaryMuscle": "Glutes",
    "secondaryMuscles": [],
    "equipment": "Machine",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Hip Abduction",
    "unilateral": false,
    "aliases": [
      "Abductor Machine",
      "Hip Abductor"
    ],
    "family": "hip-abduction-machine",
    "variation": "machine",
    "difficulty": "Beginner",
    "mechanics": "Isolation",
    "forceType": "Other",
    "bodyRegion": "Lower Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "hip-adduction-machine",
    "name": "Hip Adduction Machine",
    "primaryMuscle": "Adductors",
    "secondaryMuscles": [
      "Glutes"
    ],
    "equipment": "Machine",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Hip Adduction",
    "unilateral": false,
    "aliases": [
      "Adductor Machine",
      "Hip Adductor"
    ],
    "family": "hip-adduction-machine",
    "variation": "machine",
    "difficulty": "Beginner",
    "mechanics": "Isolation",
    "forceType": "Other",
    "bodyRegion": "Lower Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "donkey-calf-raise",
    "name": "Donkey Calf Raise",
    "primaryMuscle": "Calves",
    "secondaryMuscles": [],
    "equipment": "Machine",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Plantar Flexion",
    "unilateral": false,
    "aliases": [
      "Donkey Calf Raise"
    ],
    "family": "calf-raise",
    "variation": "donkey-calf-raise",
    "difficulty": "Beginner",
    "mechanics": "Isolation",
    "forceType": "Push",
    "bodyRegion": "Lower Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "smith-machine-calf-raise",
    "name": "Smith Machine Calf Raise",
    "primaryMuscle": "Calves",
    "secondaryMuscles": [],
    "equipment": "Smith Machine",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Plantar Flexion",
    "unilateral": false,
    "aliases": [
      "Smith Calf Raise"
    ],
    "family": "calf-raise",
    "variation": "machine",
    "difficulty": "Intermediate",
    "mechanics": "Isolation",
    "forceType": "Push",
    "bodyRegion": "Lower Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "dumbbell-calf-raise",
    "name": "Dumbbell Calf Raise",
    "primaryMuscle": "Calves",
    "secondaryMuscles": [],
    "equipment": "Dumbbells",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Plantar Flexion",
    "unilateral": false,
    "aliases": [
      "DB Calf Raise"
    ],
    "family": "calf-raise",
    "variation": "dumbbell",
    "difficulty": "Intermediate",
    "mechanics": "Isolation",
    "forceType": "Push",
    "bodyRegion": "Lower Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "tibialis-raise",
    "name": "Tibialis Raise",
    "primaryMuscle": "Calves",
    "secondaryMuscles": [],
    "equipment": "Bodyweight",
    "category": "Strength",
    "trackingType": "reps",
    "movementPattern": "Dorsiflexion",
    "unilateral": false,
    "aliases": [
      "Tib Raise",
      "Tibialis Anterior Raise"
    ],
    "family": "tibialis-raise",
    "variation": "standard",
    "difficulty": "Intermediate",
    "mechanics": "Isolation",
    "forceType": "Other",
    "bodyRegion": "Lower Body",
    "requiresWeight": false,
    "skillBased": false
  },
  {
    "id": "decline-sit-up",
    "name": "Decline Sit-Up",
    "primaryMuscle": "Core",
    "secondaryMuscles": [
      "Hip Flexors"
    ],
    "equipment": "Bench",
    "category": "Core",
    "trackingType": "reps",
    "movementPattern": "Spinal Flexion",
    "unilateral": false,
    "aliases": [
      "Decline Situp"
    ],
    "family": "sit-up",
    "variation": "decline",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Other",
    "bodyRegion": "Core",
    "requiresWeight": false,
    "skillBased": false
  },
  {
    "id": "weighted-crunch",
    "name": "Weighted Crunch",
    "primaryMuscle": "Core",
    "secondaryMuscles": [],
    "equipment": "Weight Plate",
    "category": "Core",
    "trackingType": "weight-reps",
    "movementPattern": "Spinal Flexion",
    "unilateral": false,
    "aliases": [
      "Weighted Ab Crunch"
    ],
    "family": "weighted-crunch",
    "variation": "weighted",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Other",
    "bodyRegion": "Core",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "reverse-crunch",
    "name": "Reverse Crunch",
    "primaryMuscle": "Core",
    "secondaryMuscles": [
      "Hip Flexors"
    ],
    "equipment": "Bodyweight",
    "category": "Core",
    "trackingType": "reps",
    "movementPattern": "Spinal Flexion",
    "unilateral": false,
    "aliases": [
      "Reverse Ab Crunch"
    ],
    "family": "reverse-crunch",
    "variation": "standard",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Other",
    "bodyRegion": "Core",
    "requiresWeight": false,
    "skillBased": false
  },
  {
    "id": "bicycle-crunch",
    "name": "Bicycle Crunch",
    "primaryMuscle": "Core",
    "secondaryMuscles": [
      "Hip Flexors"
    ],
    "equipment": "Bodyweight",
    "category": "Core",
    "trackingType": "reps",
    "movementPattern": "Core Rotation",
    "unilateral": true,
    "aliases": [
      "Bicycle Crunches"
    ],
    "family": "bicycle-crunch",
    "variation": "standard",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Other",
    "bodyRegion": "Core",
    "requiresWeight": false,
    "skillBased": false
  },
  {
    "id": "toe-touch",
    "name": "Toe Touch",
    "primaryMuscle": "Core",
    "secondaryMuscles": [],
    "equipment": "Bodyweight",
    "category": "Core",
    "trackingType": "reps",
    "movementPattern": "Spinal Flexion",
    "unilateral": false,
    "aliases": [
      "Toe Touch Crunch"
    ],
    "family": "toe-touch",
    "variation": "standard",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Other",
    "bodyRegion": "Core",
    "requiresWeight": false,
    "skillBased": false
  },
  {
    "id": "dead-bug",
    "name": "Dead Bug",
    "primaryMuscle": "Core",
    "secondaryMuscles": [
      "Hip Flexors"
    ],
    "equipment": "Bodyweight",
    "category": "Core",
    "trackingType": "reps",
    "movementPattern": "Core Stability",
    "unilateral": true,
    "aliases": [
      "Deadbug"
    ],
    "family": "dead-bug",
    "variation": "standard",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Other",
    "bodyRegion": "Core",
    "requiresWeight": false,
    "skillBased": false
  },
  {
    "id": "bird-dog",
    "name": "Bird Dog",
    "primaryMuscle": "Core",
    "secondaryMuscles": [
      "Glutes",
      "Back"
    ],
    "equipment": "Bodyweight",
    "category": "Core",
    "trackingType": "reps",
    "movementPattern": "Core Stability",
    "unilateral": true,
    "aliases": [
      "Bird Dog Exercise"
    ],
    "family": "bird-dog",
    "variation": "standard",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Other",
    "bodyRegion": "Core",
    "requiresWeight": false,
    "skillBased": false
  },
  {
    "id": "pallof-press",
    "name": "Pallof Press",
    "primaryMuscle": "Core",
    "secondaryMuscles": [
      "Shoulders"
    ],
    "equipment": "Cable",
    "category": "Core",
    "trackingType": "weight-reps",
    "movementPattern": "Anti-Rotation",
    "unilateral": false,
    "aliases": [
      "Cable Pallof Press"
    ],
    "family": "pallof-press",
    "variation": "standard",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Other",
    "bodyRegion": "Core",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "wood-chop",
    "name": "Cable Wood Chop",
    "primaryMuscle": "Core",
    "secondaryMuscles": [
      "Shoulders"
    ],
    "equipment": "Cable",
    "category": "Core",
    "trackingType": "weight-reps",
    "movementPattern": "Core Rotation",
    "unilateral": true,
    "aliases": [
      "Cable Woodchop"
    ],
    "family": "wood-chop",
    "variation": "standard",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Other",
    "bodyRegion": "Core",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "dragon-flag",
    "name": "Dragon Flag",
    "primaryMuscle": "Core",
    "secondaryMuscles": [
      "Hip Flexors"
    ],
    "equipment": "Bodyweight",
    "category": "Core",
    "trackingType": "reps",
    "movementPattern": "Core Stability",
    "unilateral": false,
    "aliases": [
      "Dragon Flags"
    ],
    "family": "dragon-flag",
    "variation": "standard",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Other",
    "bodyRegion": "Core",
    "requiresWeight": false,
    "skillBased": false
  },
  {
    "id": "plate-pinch",
    "name": "Plate Pinch",
    "primaryMuscle": "Forearms",
    "secondaryMuscles": [],
    "equipment": "Weight Plate",
    "category": "Strength",
    "trackingType": "duration",
    "movementPattern": "Grip",
    "unilateral": false,
    "aliases": [
      "Plate Pinch Hold"
    ],
    "family": "plate-pinch",
    "variation": "standard",
    "difficulty": "Intermediate",
    "mechanics": "Isometric",
    "forceType": "Static",
    "bodyRegion": "Upper Body",
    "requiresWeight": false,
    "skillBased": false
  },
  {
    "id": "wrist-roller",
    "name": "Wrist Roller",
    "primaryMuscle": "Forearms",
    "secondaryMuscles": [],
    "equipment": "Wrist Roller",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Grip",
    "unilateral": false,
    "aliases": [
      "Forearm Wrist Roller"
    ],
    "family": "wrist-roller",
    "variation": "standard",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Other",
    "bodyRegion": "Upper Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "barbell-wrist-curl",
    "name": "Barbell Wrist Curl",
    "primaryMuscle": "Forearms",
    "secondaryMuscles": [],
    "equipment": "Barbell",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Wrist Flexion",
    "unilateral": false,
    "aliases": [
      "BB Wrist Curl"
    ],
    "family": "wrist-curl",
    "variation": "barbell",
    "difficulty": "Intermediate",
    "mechanics": "Isolation",
    "forceType": "Pull",
    "bodyRegion": "Upper Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "barbell-reverse-wrist-curl",
    "name": "Barbell Reverse Wrist Curl",
    "primaryMuscle": "Forearms",
    "secondaryMuscles": [],
    "equipment": "Barbell",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Wrist Extension",
    "unilateral": false,
    "aliases": [
      "Reverse Barbell Wrist Curl"
    ],
    "family": "reverse-wrist-curl",
    "variation": "barbell",
    "difficulty": "Intermediate",
    "mechanics": "Isolation",
    "forceType": "Pull",
    "bodyRegion": "Upper Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "kettlebell-goblet-squat",
    "name": "Kettlebell Goblet Squat",
    "primaryMuscle": "Quads",
    "secondaryMuscles": [
      "Glutes",
      "Core"
    ],
    "equipment": "Kettlebell",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Squat",
    "unilateral": false,
    "aliases": [
      "KB Goblet Squat"
    ],
    "family": "squat",
    "variation": "kettlebell-goblet-squat",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Push",
    "bodyRegion": "Lower Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "kettlebell-deadlift",
    "name": "Kettlebell Deadlift",
    "primaryMuscle": "Hamstrings",
    "secondaryMuscles": [
      "Glutes",
      "Back"
    ],
    "equipment": "Kettlebell",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Hip Hinge",
    "unilateral": false,
    "aliases": [
      "KB Deadlift"
    ],
    "family": "deadlift",
    "variation": "kettlebell-deadlift",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Pull",
    "bodyRegion": "Lower Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "kettlebell-clean",
    "name": "Kettlebell Clean",
    "primaryMuscle": "Full Body",
    "secondaryMuscles": [
      "Shoulders",
      "Glutes",
      "Hamstrings"
    ],
    "equipment": "Kettlebell",
    "category": "Power",
    "trackingType": "weight-reps",
    "movementPattern": "Olympic / Power",
    "unilateral": true,
    "aliases": [
      "KB Clean"
    ],
    "family": "kettlebell-clean",
    "variation": "standard",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Other",
    "bodyRegion": "Full Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "kettlebell-snatch",
    "name": "Kettlebell Snatch",
    "primaryMuscle": "Full Body",
    "secondaryMuscles": [
      "Shoulders",
      "Glutes",
      "Core"
    ],
    "equipment": "Kettlebell",
    "category": "Power",
    "trackingType": "weight-reps",
    "movementPattern": "Olympic / Power",
    "unilateral": true,
    "aliases": [
      "KB Snatch"
    ],
    "family": "kettlebell-snatch",
    "variation": "standard",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Other",
    "bodyRegion": "Full Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "turkish-get-up",
    "name": "Turkish Get-Up",
    "primaryMuscle": "Full Body",
    "secondaryMuscles": [
      "Shoulders",
      "Core",
      "Glutes"
    ],
    "equipment": "Kettlebell",
    "category": "Strength",
    "trackingType": "weight-reps",
    "movementPattern": "Full Body",
    "unilateral": true,
    "aliases": [
      "Turkish Get Up",
      "TGU"
    ],
    "family": "turkish-get-up",
    "variation": "standard",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Other",
    "bodyRegion": "Full Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "suitcase-carry",
    "name": "Suitcase Carry",
    "primaryMuscle": "Core",
    "secondaryMuscles": [
      "Forearms",
      "Traps"
    ],
    "equipment": "Dumbbells",
    "category": "Strength",
    "trackingType": "distance-duration",
    "movementPattern": "Loaded Carry",
    "unilateral": true,
    "aliases": [
      "Suitcase Walk"
    ],
    "family": "loaded-carry",
    "variation": "suitcase-carry",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Carry",
    "bodyRegion": "Full Body",
    "requiresWeight": false,
    "skillBased": false
  },
  {
    "id": "wide-grip-push-up",
    "name": "Wide-Grip Push-Up",
    "primaryMuscle": "Chest",
    "secondaryMuscles": [
      "Shoulders",
      "Triceps"
    ],
    "equipment": "Bodyweight",
    "category": "Strength",
    "trackingType": "reps",
    "movementPattern": "Horizontal Push",
    "unilateral": false,
    "aliases": [
      "Wide Pushup"
    ],
    "family": "push-up",
    "variation": "wide-grip",
    "difficulty": "Beginner",
    "mechanics": "Compound",
    "forceType": "Push",
    "bodyRegion": "Upper Body",
    "requiresWeight": false,
    "skillBased": false
  },
  {
    "id": "pike-push-up",
    "name": "Pike Push-Up",
    "primaryMuscle": "Shoulders",
    "secondaryMuscles": [
      "Triceps",
      "Chest"
    ],
    "equipment": "Bodyweight",
    "category": "Strength",
    "trackingType": "reps",
    "movementPattern": "Vertical Push",
    "unilateral": false,
    "aliases": [
      "Pike Pushup"
    ],
    "family": "push-up",
    "variation": "pike",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Push",
    "bodyRegion": "Upper Body",
    "requiresWeight": false,
    "skillBased": true
  },
  {
    "id": "handstand-push-up",
    "name": "Handstand Push-Up",
    "primaryMuscle": "Shoulders",
    "secondaryMuscles": [
      "Triceps",
      "Core"
    ],
    "equipment": "Bodyweight",
    "category": "Strength",
    "trackingType": "reps",
    "movementPattern": "Vertical Push",
    "unilateral": false,
    "aliases": [
      "HSPU",
      "Handstand Pushup"
    ],
    "family": "push-up",
    "variation": "handstand",
    "difficulty": "Advanced",
    "mechanics": "Compound",
    "forceType": "Push",
    "bodyRegion": "Upper Body",
    "requiresWeight": false,
    "skillBased": true
  },
  {
    "id": "muscle-up",
    "name": "Muscle-Up",
    "primaryMuscle": "Full Body",
    "secondaryMuscles": [
      "Back",
      "Biceps",
      "Chest",
      "Triceps"
    ],
    "equipment": "Pull-Up Bar",
    "category": "Strength",
    "trackingType": "reps",
    "movementPattern": "Vertical Pull + Push",
    "unilateral": false,
    "aliases": [
      "Bar Muscle Up"
    ],
    "family": "muscle-up",
    "variation": "standard",
    "difficulty": "Advanced",
    "mechanics": "Compound",
    "forceType": "Push/Pull",
    "bodyRegion": "Full Body",
    "requiresWeight": false,
    "skillBased": true
  },
  {
    "id": "neutral-grip-pull-up",
    "name": "Neutral-Grip Pull-Up",
    "primaryMuscle": "Back",
    "secondaryMuscles": [
      "Biceps"
    ],
    "equipment": "Bodyweight",
    "category": "Strength",
    "trackingType": "reps",
    "movementPattern": "Vertical Pull",
    "unilateral": false,
    "aliases": [
      "Neutral Pullup"
    ],
    "family": "pull-up",
    "variation": "neutral-grip",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Pull",
    "bodyRegion": "Upper Body",
    "requiresWeight": false,
    "skillBased": true
  },
  {
    "id": "archer-push-up",
    "name": "Archer Push-Up",
    "primaryMuscle": "Chest",
    "secondaryMuscles": [
      "Triceps",
      "Shoulders",
      "Core"
    ],
    "equipment": "Bodyweight",
    "category": "Calisthenics",
    "trackingType": "reps",
    "movementPattern": "Horizontal Push",
    "unilateral": true,
    "aliases": [
      "Archer Pushup",
      "Archer Push Up"
    ],
    "family": "push-up",
    "variation": "archer-push-up",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Push",
    "bodyRegion": "Upper Body",
    "requiresWeight": false,
    "skillBased": false
  },
  {
    "id": "pseudo-planche-push-up",
    "name": "Pseudo Planche Push-Up",
    "primaryMuscle": "Chest",
    "secondaryMuscles": [
      "Shoulders",
      "Triceps",
      "Core"
    ],
    "equipment": "Bodyweight",
    "category": "Calisthenics",
    "trackingType": "reps",
    "movementPattern": "Horizontal Push",
    "unilateral": false,
    "aliases": [
      "Pseudo Planche Pushup",
      "PPPU"
    ],
    "family": "push-up",
    "variation": "pseudo-planche-push-up",
    "difficulty": "Advanced",
    "mechanics": "Compound",
    "forceType": "Push",
    "bodyRegion": "Upper Body",
    "requiresWeight": false,
    "skillBased": false
  },
  {
    "id": "ring-push-up",
    "name": "Ring Push-Up",
    "primaryMuscle": "Chest",
    "secondaryMuscles": [
      "Triceps",
      "Shoulders",
      "Core"
    ],
    "equipment": "Gymnastic Rings",
    "category": "Calisthenics",
    "trackingType": "reps",
    "movementPattern": "Horizontal Push",
    "unilateral": false,
    "aliases": [
      "Ring Pushup",
      "Gymnastic Ring Push-Up"
    ],
    "family": "push-up",
    "variation": "rings",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Push",
    "bodyRegion": "Upper Body",
    "requiresWeight": false,
    "skillBased": false
  },
  {
    "id": "explosive-push-up",
    "name": "Explosive Push-Up",
    "primaryMuscle": "Chest",
    "secondaryMuscles": [
      "Triceps",
      "Shoulders"
    ],
    "equipment": "Bodyweight",
    "category": "Calisthenics",
    "trackingType": "reps",
    "movementPattern": "Horizontal Push",
    "unilateral": false,
    "aliases": [
      "Explosive Pushup",
      "Plyometric Push-Up",
      "Plyo Push-Up"
    ],
    "family": "push-up",
    "variation": "explosive-push-up",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Push",
    "bodyRegion": "Upper Body",
    "requiresWeight": false,
    "skillBased": false
  },
  {
    "id": "clap-push-up",
    "name": "Clap Push-Up",
    "primaryMuscle": "Chest",
    "secondaryMuscles": [
      "Triceps",
      "Shoulders"
    ],
    "equipment": "Bodyweight",
    "category": "Calisthenics",
    "trackingType": "reps",
    "movementPattern": "Horizontal Push",
    "unilateral": false,
    "aliases": [
      "Clapping Push-Up",
      "Clap Pushup"
    ],
    "family": "push-up",
    "variation": "clap-push-up",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Push",
    "bodyRegion": "Upper Body",
    "requiresWeight": false,
    "skillBased": false
  },
  {
    "id": "one-arm-push-up",
    "name": "One-Arm Push-Up",
    "primaryMuscle": "Chest",
    "secondaryMuscles": [
      "Triceps",
      "Shoulders",
      "Core"
    ],
    "equipment": "Bodyweight",
    "category": "Calisthenics",
    "trackingType": "reps",
    "movementPattern": "Horizontal Push",
    "unilateral": true,
    "aliases": [
      "One Arm Push-Up",
      "Single-Arm Push-Up",
      "One Arm Pushup"
    ],
    "family": "push-up",
    "variation": "one-arm-push-up",
    "difficulty": "Advanced",
    "mechanics": "Compound",
    "forceType": "Push",
    "bodyRegion": "Upper Body",
    "requiresWeight": false,
    "skillBased": false
  },
  {
    "id": "planche-push-up",
    "name": "Planche Push-Up",
    "primaryMuscle": "Shoulders",
    "secondaryMuscles": [
      "Chest",
      "Triceps",
      "Core"
    ],
    "equipment": "Bodyweight",
    "category": "Calisthenics",
    "trackingType": "reps",
    "movementPattern": "Horizontal Push",
    "unilateral": false,
    "aliases": [
      "Planche Pushup",
      "Full Planche Push-Up"
    ],
    "family": "push-up",
    "variation": "planche-push-up",
    "difficulty": "Advanced",
    "mechanics": "Compound",
    "forceType": "Push",
    "bodyRegion": "Upper Body",
    "requiresWeight": false,
    "skillBased": false
  },
  {
    "id": "wide-grip-pull-up",
    "name": "Wide-Grip Pull-Up",
    "primaryMuscle": "Back",
    "secondaryMuscles": [
      "Biceps",
      "Forearms"
    ],
    "equipment": "Pull-Up Bar",
    "category": "Calisthenics",
    "trackingType": "reps",
    "movementPattern": "Vertical Pull",
    "unilateral": false,
    "aliases": [
      "Wide Pull-Up",
      "Wide Grip Pullup"
    ],
    "family": "pull-up",
    "variation": "wide-grip",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Pull",
    "bodyRegion": "Upper Body",
    "requiresWeight": false,
    "skillBased": true
  },
  {
    "id": "close-grip-pull-up",
    "name": "Close-Grip Pull-Up",
    "primaryMuscle": "Back",
    "secondaryMuscles": [
      "Biceps",
      "Forearms"
    ],
    "equipment": "Pull-Up Bar",
    "category": "Calisthenics",
    "trackingType": "reps",
    "movementPattern": "Vertical Pull",
    "unilateral": false,
    "aliases": [
      "Close Pull-Up",
      "Close Grip Pullup"
    ],
    "family": "pull-up",
    "variation": "close-grip",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Pull",
    "bodyRegion": "Upper Body",
    "requiresWeight": false,
    "skillBased": true
  },
  {
    "id": "commando-pull-up",
    "name": "Commando Pull-Up",
    "primaryMuscle": "Back",
    "secondaryMuscles": [
      "Biceps",
      "Forearms",
      "Core"
    ],
    "equipment": "Pull-Up Bar",
    "category": "Calisthenics",
    "trackingType": "reps",
    "movementPattern": "Vertical Pull",
    "unilateral": false,
    "aliases": [
      "Commando Pullup"
    ],
    "family": "pull-up",
    "variation": "commando-pull-up",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Pull",
    "bodyRegion": "Upper Body",
    "requiresWeight": false,
    "skillBased": false
  },
  {
    "id": "archer-pull-up",
    "name": "Archer Pull-Up",
    "primaryMuscle": "Back",
    "secondaryMuscles": [
      "Biceps",
      "Forearms",
      "Core"
    ],
    "equipment": "Pull-Up Bar",
    "category": "Calisthenics",
    "trackingType": "reps",
    "movementPattern": "Vertical Pull",
    "unilateral": true,
    "aliases": [
      "Archer Pullup",
      "Archer Pull Up"
    ],
    "family": "pull-up",
    "variation": "archer",
    "difficulty": "Advanced",
    "mechanics": "Compound",
    "forceType": "Pull",
    "bodyRegion": "Upper Body",
    "requiresWeight": false,
    "skillBased": true
  },
  {
    "id": "typewriter-pull-up",
    "name": "Typewriter Pull-Up",
    "primaryMuscle": "Back",
    "secondaryMuscles": [
      "Biceps",
      "Forearms",
      "Core"
    ],
    "equipment": "Pull-Up Bar",
    "category": "Calisthenics",
    "trackingType": "reps",
    "movementPattern": "Vertical Pull",
    "unilateral": false,
    "aliases": [
      "Typewriter Pullup",
      "Typewriter Pull Up"
    ],
    "family": "pull-up",
    "variation": "typewriter-pull-up",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Pull",
    "bodyRegion": "Upper Body",
    "requiresWeight": false,
    "skillBased": false
  },
  {
    "id": "explosive-pull-up",
    "name": "Explosive Pull-Up",
    "primaryMuscle": "Back",
    "secondaryMuscles": [
      "Biceps",
      "Forearms"
    ],
    "equipment": "Pull-Up Bar",
    "category": "Calisthenics",
    "trackingType": "reps",
    "movementPattern": "Vertical Pull",
    "unilateral": false,
    "aliases": [
      "Explosive Pullup",
      "Plyometric Pull-Up"
    ],
    "family": "pull-up",
    "variation": "explosive-pull-up",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Pull",
    "bodyRegion": "Upper Body",
    "requiresWeight": false,
    "skillBased": false
  },
  {
    "id": "chest-to-bar-pull-up",
    "name": "Chest-to-Bar Pull-Up",
    "primaryMuscle": "Back",
    "secondaryMuscles": [
      "Biceps",
      "Forearms"
    ],
    "equipment": "Pull-Up Bar",
    "category": "Calisthenics",
    "trackingType": "reps",
    "movementPattern": "Vertical Pull",
    "unilateral": false,
    "aliases": [
      "Chest to Bar Pull-Up",
      "Chest-to-Bar",
      "C2B Pull-Up"
    ],
    "family": "pull-up",
    "variation": "chest-to-bar-pull-up",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Pull",
    "bodyRegion": "Upper Body",
    "requiresWeight": false,
    "skillBased": false
  },
  {
    "id": "one-arm-pull-up",
    "name": "One-Arm Pull-Up",
    "primaryMuscle": "Back",
    "secondaryMuscles": [
      "Biceps",
      "Forearms",
      "Core"
    ],
    "equipment": "Pull-Up Bar",
    "category": "Calisthenics",
    "trackingType": "reps",
    "movementPattern": "Vertical Pull",
    "unilateral": true,
    "aliases": [
      "One Arm Pull-Up",
      "Single-Arm Pull-Up",
      "OAP"
    ],
    "family": "pull-up",
    "variation": "one-arm",
    "difficulty": "Advanced",
    "mechanics": "Compound",
    "forceType": "Pull",
    "bodyRegion": "Upper Body",
    "requiresWeight": false,
    "skillBased": true
  },
  {
    "id": "ring-row",
    "name": "Ring Row",
    "primaryMuscle": "Back",
    "secondaryMuscles": [
      "Biceps",
      "Rear Delts",
      "Core"
    ],
    "equipment": "Gymnastic Rings",
    "category": "Calisthenics",
    "trackingType": "reps",
    "movementPattern": "Horizontal Pull",
    "unilateral": false,
    "aliases": [
      "Ring Rows",
      "Gymnastic Ring Row",
      "Bodyweight Ring Row"
    ],
    "family": "row",
    "variation": "rings",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Pull",
    "bodyRegion": "Upper Body",
    "requiresWeight": false,
    "skillBased": false
  },
  {
    "id": "straight-bar-dip",
    "name": "Straight Bar Dip",
    "primaryMuscle": "Triceps",
    "secondaryMuscles": [
      "Chest",
      "Shoulders"
    ],
    "equipment": "Pull-Up Bar",
    "category": "Calisthenics",
    "trackingType": "reps",
    "movementPattern": "Vertical Push",
    "unilateral": false,
    "aliases": [
      "Straight Bar Dip",
      "Bar Dip"
    ],
    "family": "dip",
    "variation": "straight-bar",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Push",
    "bodyRegion": "Upper Body",
    "requiresWeight": false,
    "skillBased": true
  },
  {
    "id": "ring-dip",
    "name": "Ring Dip",
    "primaryMuscle": "Triceps",
    "secondaryMuscles": [
      "Chest",
      "Shoulders",
      "Core"
    ],
    "equipment": "Gymnastic Rings",
    "category": "Calisthenics",
    "trackingType": "reps",
    "movementPattern": "Vertical Push",
    "unilateral": false,
    "aliases": [
      "Ring Dips",
      "Gymnastic Ring Dip"
    ],
    "family": "dip",
    "variation": "rings",
    "difficulty": "Advanced",
    "mechanics": "Compound",
    "forceType": "Push",
    "bodyRegion": "Upper Body",
    "requiresWeight": false,
    "skillBased": true
  },
  {
    "id": "russian-dip",
    "name": "Russian Dip",
    "primaryMuscle": "Triceps",
    "secondaryMuscles": [
      "Chest",
      "Shoulders",
      "Core"
    ],
    "equipment": "Parallel Bars",
    "category": "Calisthenics",
    "trackingType": "reps",
    "movementPattern": "Vertical Push",
    "unilateral": false,
    "aliases": [
      "Russian Dips"
    ],
    "family": "dip",
    "variation": "russian-dip",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Push",
    "bodyRegion": "Upper Body",
    "requiresWeight": false,
    "skillBased": false
  },
  {
    "id": "wall-handstand",
    "name": "Wall Handstand",
    "primaryMuscle": "Shoulders",
    "secondaryMuscles": [
      "Triceps",
      "Core"
    ],
    "equipment": "Bodyweight",
    "category": "Calisthenics",
    "trackingType": "duration",
    "movementPattern": "Isometric Hold",
    "unilateral": false,
    "aliases": [
      "Wall Handstand",
      "Handstand Against Wall"
    ],
    "family": "wall-handstand",
    "variation": "standard",
    "difficulty": "Advanced",
    "mechanics": "Isometric",
    "forceType": "Static",
    "bodyRegion": "Upper Body",
    "requiresWeight": false,
    "skillBased": false
  },
  {
    "id": "freestanding-handstand",
    "name": "Freestanding Handstand",
    "primaryMuscle": "Shoulders",
    "secondaryMuscles": [
      "Triceps",
      "Core"
    ],
    "equipment": "Bodyweight",
    "category": "Calisthenics",
    "trackingType": "duration",
    "movementPattern": "Isometric Hold",
    "unilateral": false,
    "aliases": [
      "Free Handstand",
      "Free-Standing Handstand"
    ],
    "family": "freestanding-handstand",
    "variation": "standard",
    "difficulty": "Advanced",
    "mechanics": "Isometric",
    "forceType": "Static",
    "bodyRegion": "Upper Body",
    "requiresWeight": false,
    "skillBased": false
  },
  {
    "id": "wall-handstand-push-up",
    "name": "Wall Handstand Push-Up",
    "primaryMuscle": "Shoulders",
    "secondaryMuscles": [
      "Triceps",
      "Upper Chest",
      "Core"
    ],
    "equipment": "Bodyweight",
    "category": "Calisthenics",
    "trackingType": "reps",
    "movementPattern": "Vertical Push",
    "unilateral": false,
    "aliases": [
      "Wall HSPU",
      "Wall Handstand Pushup"
    ],
    "family": "push-up",
    "variation": "wall-handstand-push-up",
    "difficulty": "Advanced",
    "mechanics": "Compound",
    "forceType": "Push",
    "bodyRegion": "Upper Body",
    "requiresWeight": false,
    "skillBased": false
  },
  {
    "id": "handstand-shoulder-tap",
    "name": "Handstand Shoulder Tap",
    "primaryMuscle": "Shoulders",
    "secondaryMuscles": [
      "Triceps",
      "Core"
    ],
    "equipment": "Bodyweight",
    "category": "Calisthenics",
    "trackingType": "reps",
    "movementPattern": "Vertical Push",
    "unilateral": true,
    "aliases": [
      "Handstand Shoulder Taps",
      "HS Shoulder Tap"
    ],
    "family": "handstand-shoulder-tap",
    "variation": "standard",
    "difficulty": "Advanced",
    "mechanics": "Compound",
    "forceType": "Push",
    "bodyRegion": "Upper Body",
    "requiresWeight": false,
    "skillBased": false
  },
  {
    "id": "l-sit",
    "name": "L-Sit",
    "primaryMuscle": "Core",
    "secondaryMuscles": [
      "Hip Flexors",
      "Triceps",
      "Shoulders"
    ],
    "equipment": "Parallel Bars",
    "category": "Calisthenics",
    "trackingType": "duration",
    "movementPattern": "Isometric Hold",
    "unilateral": false,
    "aliases": [
      "L Sit",
      "L-Sit Hold"
    ],
    "family": "l-sit",
    "variation": "standard",
    "difficulty": "Intermediate",
    "mechanics": "Isometric",
    "forceType": "Static",
    "bodyRegion": "Core",
    "requiresWeight": false,
    "skillBased": false
  },
  {
    "id": "tuck-l-sit",
    "name": "Tuck L-Sit",
    "primaryMuscle": "Core",
    "secondaryMuscles": [
      "Hip Flexors",
      "Triceps"
    ],
    "equipment": "Parallel Bars",
    "category": "Calisthenics",
    "trackingType": "duration",
    "movementPattern": "Isometric Hold",
    "unilateral": false,
    "aliases": [
      "Tucked L-Sit",
      "Tuck L Sit"
    ],
    "family": "tuck-l-sit",
    "variation": "standard",
    "difficulty": "Intermediate",
    "mechanics": "Isometric",
    "forceType": "Static",
    "bodyRegion": "Core",
    "requiresWeight": false,
    "skillBased": false
  },
  {
    "id": "v-sit",
    "name": "V-Sit",
    "primaryMuscle": "Core",
    "secondaryMuscles": [
      "Hip Flexors",
      "Triceps",
      "Shoulders"
    ],
    "equipment": "Bodyweight",
    "category": "Calisthenics",
    "trackingType": "duration",
    "movementPattern": "Isometric Hold",
    "unilateral": false,
    "aliases": [
      "V Sit",
      "V-Sit Hold"
    ],
    "family": "v-sit",
    "variation": "standard",
    "difficulty": "Intermediate",
    "mechanics": "Isometric",
    "forceType": "Static",
    "bodyRegion": "Core",
    "requiresWeight": false,
    "skillBased": false
  },
  {
    "id": "hollow-body-hold",
    "name": "Hollow Body Hold",
    "primaryMuscle": "Core",
    "secondaryMuscles": [
      "Hip Flexors"
    ],
    "equipment": "Bodyweight",
    "category": "Calisthenics",
    "trackingType": "duration",
    "movementPattern": "Isometric Hold",
    "unilateral": false,
    "aliases": [
      "Hollow Hold",
      "Hollow Body"
    ],
    "family": "hollow-body-hold",
    "variation": "standard",
    "difficulty": "Intermediate",
    "mechanics": "Isometric",
    "forceType": "Static",
    "bodyRegion": "Core",
    "requiresWeight": false,
    "skillBased": false
  },
  {
    "id": "hollow-body-rock",
    "name": "Hollow Body Rock",
    "primaryMuscle": "Core",
    "secondaryMuscles": [
      "Hip Flexors"
    ],
    "equipment": "Bodyweight",
    "category": "Calisthenics",
    "trackingType": "reps",
    "movementPattern": "Spinal Flexion",
    "unilateral": false,
    "aliases": [
      "Hollow Rock",
      "Hollow Rocks"
    ],
    "family": "hollow-body-rock",
    "variation": "standard",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Other",
    "bodyRegion": "Core",
    "requiresWeight": false,
    "skillBased": false
  },
  {
    "id": "tuck-front-lever",
    "name": "Tuck Front Lever",
    "primaryMuscle": "Back",
    "secondaryMuscles": [
      "Core",
      "Shoulders",
      "Biceps"
    ],
    "equipment": "Pull-Up Bar",
    "category": "Calisthenics",
    "trackingType": "duration",
    "movementPattern": "Isometric Pull",
    "unilateral": false,
    "aliases": [
      "Tucked Front Lever",
      "Tuck FL"
    ],
    "family": "front-lever",
    "variation": "tuck",
    "difficulty": "Intermediate",
    "mechanics": "Isometric",
    "forceType": "Static",
    "bodyRegion": "Upper Body",
    "requiresWeight": false,
    "skillBased": true
  },
  {
    "id": "front-lever",
    "name": "Front Lever",
    "primaryMuscle": "Back",
    "secondaryMuscles": [
      "Core",
      "Shoulders",
      "Biceps"
    ],
    "equipment": "Pull-Up Bar",
    "category": "Calisthenics",
    "trackingType": "duration",
    "movementPattern": "Isometric Pull",
    "unilateral": false,
    "aliases": [
      "Full Front Lever",
      "FL"
    ],
    "family": "front-lever",
    "variation": "full",
    "difficulty": "Advanced",
    "mechanics": "Isometric",
    "forceType": "Static",
    "bodyRegion": "Upper Body",
    "requiresWeight": false,
    "skillBased": true
  },
  {
    "id": "front-lever-raise",
    "name": "Front Lever Raise",
    "primaryMuscle": "Back",
    "secondaryMuscles": [
      "Core",
      "Shoulders"
    ],
    "equipment": "Pull-Up Bar",
    "category": "Calisthenics",
    "trackingType": "reps",
    "movementPattern": "Vertical Pull",
    "unilateral": false,
    "aliases": [
      "Front Lever Raises",
      "FL Raise"
    ],
    "family": "front-lever",
    "variation": "front-lever-raise",
    "difficulty": "Advanced",
    "mechanics": "Compound",
    "forceType": "Pull",
    "bodyRegion": "Upper Body",
    "requiresWeight": false,
    "skillBased": false
  },
  {
    "id": "tuck-back-lever",
    "name": "Tuck Back Lever",
    "primaryMuscle": "Back",
    "secondaryMuscles": [
      "Shoulders",
      "Core",
      "Biceps"
    ],
    "equipment": "Pull-Up Bar",
    "category": "Calisthenics",
    "trackingType": "duration",
    "movementPattern": "Isometric Hold",
    "unilateral": false,
    "aliases": [
      "Tucked Back Lever",
      "Tuck BL"
    ],
    "family": "back-lever",
    "variation": "tuck",
    "difficulty": "Intermediate",
    "mechanics": "Isometric",
    "forceType": "Static",
    "bodyRegion": "Upper Body",
    "requiresWeight": false,
    "skillBased": true
  },
  {
    "id": "back-lever",
    "name": "Back Lever",
    "primaryMuscle": "Back",
    "secondaryMuscles": [
      "Shoulders",
      "Core",
      "Biceps"
    ],
    "equipment": "Pull-Up Bar",
    "category": "Calisthenics",
    "trackingType": "duration",
    "movementPattern": "Isometric Hold",
    "unilateral": false,
    "aliases": [
      "Full Back Lever",
      "BL"
    ],
    "family": "back-lever",
    "variation": "full",
    "difficulty": "Advanced",
    "mechanics": "Isometric",
    "forceType": "Static",
    "bodyRegion": "Upper Body",
    "requiresWeight": false,
    "skillBased": true
  },
  {
    "id": "tuck-planche",
    "name": "Tuck Planche",
    "primaryMuscle": "Shoulders",
    "secondaryMuscles": [
      "Chest",
      "Triceps",
      "Core"
    ],
    "equipment": "Bodyweight",
    "category": "Calisthenics",
    "trackingType": "duration",
    "movementPattern": "Isometric Push",
    "unilateral": false,
    "aliases": [
      "Tucked Planche",
      "Tuck Planche Hold"
    ],
    "family": "planche",
    "variation": "tuck",
    "difficulty": "Advanced",
    "mechanics": "Isometric",
    "forceType": "Static",
    "bodyRegion": "Upper Body",
    "requiresWeight": false,
    "skillBased": true
  },
  {
    "id": "advanced-tuck-planche",
    "name": "Advanced Tuck Planche",
    "primaryMuscle": "Shoulders",
    "secondaryMuscles": [
      "Chest",
      "Triceps",
      "Core"
    ],
    "equipment": "Bodyweight",
    "category": "Calisthenics",
    "trackingType": "duration",
    "movementPattern": "Isometric Push",
    "unilateral": false,
    "aliases": [
      "Advanced Tuck",
      "Advanced Tuck Planche Hold"
    ],
    "family": "planche",
    "variation": "advanced-tuck",
    "difficulty": "Advanced",
    "mechanics": "Isometric",
    "forceType": "Static",
    "bodyRegion": "Upper Body",
    "requiresWeight": false,
    "skillBased": true
  },
  {
    "id": "straddle-planche",
    "name": "Straddle Planche",
    "primaryMuscle": "Shoulders",
    "secondaryMuscles": [
      "Chest",
      "Triceps",
      "Core"
    ],
    "equipment": "Bodyweight",
    "category": "Calisthenics",
    "trackingType": "duration",
    "movementPattern": "Isometric Push",
    "unilateral": false,
    "aliases": [
      "Straddle Planche Hold"
    ],
    "family": "planche",
    "variation": "straddle",
    "difficulty": "Advanced",
    "mechanics": "Isometric",
    "forceType": "Static",
    "bodyRegion": "Upper Body",
    "requiresWeight": false,
    "skillBased": true
  },
  {
    "id": "full-planche",
    "name": "Full Planche",
    "primaryMuscle": "Shoulders",
    "secondaryMuscles": [
      "Chest",
      "Triceps",
      "Core"
    ],
    "equipment": "Bodyweight",
    "category": "Calisthenics",
    "trackingType": "duration",
    "movementPattern": "Isometric Push",
    "unilateral": false,
    "aliases": [
      "Planche",
      "Full Planche Hold"
    ],
    "family": "planche",
    "variation": "full",
    "difficulty": "Advanced",
    "mechanics": "Isometric",
    "forceType": "Static",
    "bodyRegion": "Upper Body",
    "requiresWeight": false,
    "skillBased": true
  },
  {
    "id": "shrimp-squat",
    "name": "Shrimp Squat",
    "primaryMuscle": "Quads",
    "secondaryMuscles": [
      "Glutes",
      "Hamstrings",
      "Core"
    ],
    "equipment": "Bodyweight",
    "category": "Calisthenics",
    "trackingType": "reps",
    "movementPattern": "Squat",
    "unilateral": true,
    "aliases": [
      "Shrimp Squats",
      "Single-Leg Shrimp Squat"
    ],
    "family": "squat",
    "variation": "shrimp-squat",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Push",
    "bodyRegion": "Lower Body",
    "requiresWeight": false,
    "skillBased": false
  },
  {
    "id": "cossack-squat",
    "name": "Cossack Squat",
    "primaryMuscle": "Quads",
    "secondaryMuscles": [
      "Glutes",
      "Hamstrings",
      "Adductors"
    ],
    "equipment": "Bodyweight",
    "category": "Calisthenics",
    "trackingType": "reps",
    "movementPattern": "Squat",
    "unilateral": true,
    "aliases": [
      "Cossack Squats",
      "Side-to-Side Squat"
    ],
    "family": "squat",
    "variation": "cossack-squat",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Push",
    "bodyRegion": "Lower Body",
    "requiresWeight": false,
    "skillBased": false
  },
  {
    "id": "jump-squat",
    "name": "Jump Squat",
    "primaryMuscle": "Quads",
    "secondaryMuscles": [
      "Glutes",
      "Hamstrings",
      "Calves"
    ],
    "equipment": "Bodyweight",
    "category": "Calisthenics",
    "trackingType": "reps",
    "movementPattern": "Squat",
    "unilateral": false,
    "aliases": [
      "Jump Squats",
      "Squat Jump",
      "Bodyweight Jump Squat"
    ],
    "family": "squat",
    "variation": "jump-squat",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Push",
    "bodyRegion": "Lower Body",
    "requiresWeight": false,
    "skillBased": false
  },
  {
    "id": "single-leg-glute-bridge",
    "name": "Single-Leg Glute Bridge",
    "primaryMuscle": "Glutes",
    "secondaryMuscles": [
      "Hamstrings",
      "Core"
    ],
    "equipment": "Bodyweight",
    "category": "Calisthenics",
    "trackingType": "reps",
    "movementPattern": "Hip Extension",
    "unilateral": true,
    "aliases": [
      "Single Leg Glute Bridge",
      "One-Leg Glute Bridge"
    ],
    "family": "glute-bridge",
    "variation": "single-leg",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Push",
    "bodyRegion": "Lower Body",
    "requiresWeight": false,
    "skillBased": false
  },
  {
    "id": "bar-muscle-up",
    "name": "Bar Muscle-Up",
    "primaryMuscle": "Back",
    "secondaryMuscles": [
      "Chest",
      "Shoulders",
      "Biceps",
      "Triceps",
      "Core"
    ],
    "equipment": "Pull-Up Bar",
    "category": "Calisthenics",
    "trackingType": "reps",
    "movementPattern": "Vertical Pull + Push",
    "unilateral": false,
    "aliases": [
      "Bar Muscle Up",
      "Bar MU",
      "BMU"
    ],
    "family": "muscle-up",
    "variation": "bar",
    "difficulty": "Advanced",
    "mechanics": "Compound",
    "forceType": "Push/Pull",
    "bodyRegion": "Full Body",
    "requiresWeight": false,
    "skillBased": true
  },
  {
    "id": "ring-muscle-up",
    "name": "Ring Muscle-Up",
    "primaryMuscle": "Back",
    "secondaryMuscles": [
      "Chest",
      "Shoulders",
      "Biceps",
      "Triceps",
      "Core"
    ],
    "equipment": "Gymnastic Rings",
    "category": "Calisthenics",
    "trackingType": "reps",
    "movementPattern": "Vertical Pull + Push",
    "unilateral": false,
    "aliases": [
      "Ring Muscle Up",
      "Ring MU",
      "RMU"
    ],
    "family": "muscle-up",
    "variation": "rings",
    "difficulty": "Advanced",
    "mechanics": "Compound",
    "forceType": "Push/Pull",
    "bodyRegion": "Full Body",
    "requiresWeight": false,
    "skillBased": true
  },
  {
    "id": "skin-the-cat",
    "name": "Skin the Cat",
    "primaryMuscle": "Shoulders",
    "secondaryMuscles": [
      "Back",
      "Core",
      "Biceps"
    ],
    "equipment": "Gymnastic Rings",
    "category": "Calisthenics",
    "trackingType": "reps",
    "movementPattern": "Shoulder Rotation",
    "unilateral": false,
    "aliases": [
      "Skin The Cat"
    ],
    "family": "skin-the-cat",
    "variation": "standard",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Other",
    "bodyRegion": "Upper Body",
    "requiresWeight": false,
    "skillBased": false
  },
  {
    "id": "human-flag",
    "name": "Human Flag",
    "primaryMuscle": "Core",
    "secondaryMuscles": [
      "Shoulders",
      "Back",
      "Arms"
    ],
    "equipment": "Vertical Bar",
    "category": "Calisthenics",
    "trackingType": "duration",
    "movementPattern": "Isometric Hold",
    "unilateral": true,
    "aliases": [
      "Human Flag Hold",
      "Flag Hold"
    ],
    "family": "human-flag",
    "variation": "standard",
    "difficulty": "Advanced",
    "mechanics": "Isometric",
    "forceType": "Static",
    "bodyRegion": "Full Body",
    "requiresWeight": false,
    "skillBased": true
  },
  {
    "id": "sled-push",
    "name": "Sled Push",
    "primaryMuscle": "Full Body",
    "secondaryMuscles": [
      "Quads",
      "Glutes",
      "Calves"
    ],
    "equipment": "Sled",
    "category": "Cardio",
    "trackingType": "distance-duration",
    "movementPattern": "Sled Push",
    "unilateral": false,
    "aliases": [
      "Prowler Push"
    ],
    "family": "sled-push",
    "variation": "standard",
    "difficulty": "Intermediate",
    "mechanics": "Cardio",
    "forceType": "Push",
    "bodyRegion": "Full Body",
    "requiresWeight": false,
    "skillBased": false
  },
  {
    "id": "sled-pull",
    "name": "Sled Pull",
    "primaryMuscle": "Full Body",
    "secondaryMuscles": [
      "Back",
      "Legs",
      "Arms"
    ],
    "equipment": "Sled",
    "category": "Cardio",
    "trackingType": "distance-duration",
    "movementPattern": "Sled Pull",
    "unilateral": false,
    "aliases": [
      "Sled Drag"
    ],
    "family": "sled-pull",
    "variation": "standard",
    "difficulty": "Intermediate",
    "mechanics": "Cardio",
    "forceType": "Pull",
    "bodyRegion": "Full Body",
    "requiresWeight": false,
    "skillBased": false
  },
  {
    "id": "battle-ropes",
    "name": "Battle Ropes",
    "primaryMuscle": "Full Body",
    "secondaryMuscles": [
      "Shoulders",
      "Arms",
      "Core"
    ],
    "equipment": "Battle Ropes",
    "category": "Cardio",
    "trackingType": "duration",
    "movementPattern": "Conditioning",
    "unilateral": false,
    "aliases": [
      "Battle Rope"
    ],
    "family": "battle-ropes",
    "variation": "standard",
    "difficulty": "Intermediate",
    "mechanics": "Cardio",
    "forceType": "Push/Pull",
    "bodyRegion": "Full Body",
    "requiresWeight": false,
    "skillBased": false
  },
  {
    "id": "box-jump",
    "name": "Box Jump",
    "primaryMuscle": "Legs",
    "secondaryMuscles": [
      "Glutes",
      "Calves"
    ],
    "equipment": "Box",
    "category": "Power",
    "trackingType": "reps",
    "movementPattern": "Jumping",
    "unilateral": false,
    "aliases": [
      "Box Jumps"
    ],
    "family": "box-jump",
    "variation": "standard",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Other",
    "bodyRegion": "Lower Body",
    "requiresWeight": false,
    "skillBased": false
  },
  {
    "id": "broad-jump",
    "name": "Broad Jump",
    "primaryMuscle": "Legs",
    "secondaryMuscles": [
      "Glutes",
      "Calves"
    ],
    "equipment": "Bodyweight",
    "category": "Power",
    "trackingType": "reps",
    "movementPattern": "Jumping",
    "unilateral": false,
    "aliases": [
      "Standing Broad Jump",
      "Long Jump"
    ],
    "family": "broad-jump",
    "variation": "standard",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Other",
    "bodyRegion": "Lower Body",
    "requiresWeight": false,
    "skillBased": false
  },
  {
    "id": "weighted-pull-up",
    "name": "Weighted Pull-Up",
    "primaryMuscle": "Back",
    "secondaryMuscles": [
      "Biceps",
      "Forearms",
      "Core"
    ],
    "equipment": "Pull-Up Bar",
    "category": "Calisthenics",
    "trackingType": "weight-reps",
    "movementPattern": "Vertical Pull",
    "unilateral": false,
    "aliases": [
      "Weighted Pullup",
      "Weighted Pull Up",
      "Weighted Chin"
    ],
    "family": "pull-up",
    "variation": "weighted",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Pull",
    "bodyRegion": "Upper Body",
    "requiresWeight": true,
    "skillBased": true
  },
  {
    "id": "weighted-dip",
    "name": "Weighted Dip",
    "primaryMuscle": "Triceps",
    "secondaryMuscles": [
      "Chest",
      "Shoulders"
    ],
    "equipment": "Parallel Bars",
    "category": "Calisthenics",
    "trackingType": "weight-reps",
    "movementPattern": "Vertical Push",
    "unilateral": false,
    "aliases": [
      "Weighted Dips",
      "Weighted Tricep Dip",
      "Weighted Chest Dip"
    ],
    "family": "dip",
    "variation": "weighted",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Push",
    "bodyRegion": "Upper Body",
    "requiresWeight": true,
    "skillBased": true
  },
  {
    "id": "weighted-push-up",
    "name": "Weighted Push-Up",
    "primaryMuscle": "Chest",
    "secondaryMuscles": [
      "Triceps",
      "Shoulders",
      "Core"
    ],
    "equipment": "Bodyweight",
    "category": "Calisthenics",
    "trackingType": "weight-reps",
    "movementPattern": "Horizontal Push",
    "unilateral": false,
    "aliases": [
      "Weighted Pushup",
      "Weighted Push Up",
      "Plate Push-Up"
    ],
    "family": "push-up",
    "variation": "weighted",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Push",
    "bodyRegion": "Upper Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "worlds-greatest-stretch",
    "name": "World's Greatest Stretch",
    "primaryMuscle": "Full Body",
    "secondaryMuscles": [
      "Hip Flexors",
      "Hamstrings",
      "Shoulders"
    ],
    "equipment": "Bodyweight",
    "category": "Mobility",
    "trackingType": "duration",
    "movementPattern": "Mobility",
    "unilateral": true,
    "aliases": [
      "Worlds Greatest Stretch"
    ],
    "family": "worlds-greatest-stretch",
    "variation": "standard",
    "difficulty": "Beginner",
    "mechanics": "Mobility",
    "forceType": "Other",
    "bodyRegion": "Full Body",
    "requiresWeight": false,
    "skillBased": false
  },
  {
    "id": "hip-flexor-stretch",
    "name": "Hip Flexor Stretch",
    "primaryMuscle": "Hip Flexors",
    "secondaryMuscles": [
      "Quads"
    ],
    "equipment": "Bodyweight",
    "category": "Mobility",
    "trackingType": "duration",
    "movementPattern": "Mobility",
    "unilateral": true,
    "aliases": [
      "Kneeling Hip Flexor Stretch"
    ],
    "family": "hip-flexor-stretch",
    "variation": "standard",
    "difficulty": "Beginner",
    "mechanics": "Mobility",
    "forceType": "Other",
    "bodyRegion": "Lower Body",
    "requiresWeight": false,
    "skillBased": false
  },
  {
    "id": "hamstring-stretch",
    "name": "Hamstring Stretch",
    "primaryMuscle": "Hamstrings",
    "secondaryMuscles": [],
    "equipment": "Bodyweight",
    "category": "Mobility",
    "trackingType": "duration",
    "movementPattern": "Mobility",
    "unilateral": false,
    "aliases": [
      "Hamstring Stretch"
    ],
    "family": "hamstring-stretch",
    "variation": "rings",
    "difficulty": "Beginner",
    "mechanics": "Mobility",
    "forceType": "Other",
    "bodyRegion": "Lower Body",
    "requiresWeight": false,
    "skillBased": false
  },
  {
    "id": "quad-stretch",
    "name": "Standing Quad Stretch",
    "primaryMuscle": "Quads",
    "secondaryMuscles": [
      "Hip Flexors"
    ],
    "equipment": "Bodyweight",
    "category": "Mobility",
    "trackingType": "duration",
    "movementPattern": "Mobility",
    "unilateral": true,
    "aliases": [
      "Quadriceps Stretch"
    ],
    "family": "quad-stretch",
    "variation": "standard",
    "difficulty": "Beginner",
    "mechanics": "Mobility",
    "forceType": "Other",
    "bodyRegion": "Lower Body",
    "requiresWeight": false,
    "skillBased": false
  },
  {
    "id": "calf-stretch",
    "name": "Calf Stretch",
    "primaryMuscle": "Calves",
    "secondaryMuscles": [],
    "equipment": "Bodyweight",
    "category": "Mobility",
    "trackingType": "duration",
    "movementPattern": "Mobility",
    "unilateral": true,
    "aliases": [
      "Standing Calf Stretch"
    ],
    "family": "calf-stretch",
    "variation": "standard",
    "difficulty": "Beginner",
    "mechanics": "Mobility",
    "forceType": "Other",
    "bodyRegion": "Lower Body",
    "requiresWeight": false,
    "skillBased": false
  },
  {
    "id": "weighted-chin-up",
    "name": "Weighted Chin-Up",
    "primaryMuscle": "Back",
    "secondaryMuscles": [
      "Biceps",
      "Forearms",
      "Core"
    ],
    "equipment": "Pull-Up Bar",
    "category": "Calisthenics",
    "trackingType": "weight-reps",
    "movementPattern": "Vertical Pull",
    "unilateral": false,
    "aliases": [
      "Weighted Chinup",
      "Weighted Chin Up"
    ],
    "family": "pull-up",
    "variation": "weighted-chin-up",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Pull",
    "bodyRegion": "Upper Body",
    "requiresWeight": true,
    "skillBased": true
  },
  {
    "id": "weighted-neutral-grip-pull-up",
    "name": "Weighted Neutral-Grip Pull-Up",
    "primaryMuscle": "Back",
    "secondaryMuscles": [
      "Biceps",
      "Forearms",
      "Core"
    ],
    "equipment": "Pull-Up Bar",
    "category": "Calisthenics",
    "trackingType": "weight-reps",
    "movementPattern": "Vertical Pull",
    "unilateral": false,
    "aliases": [
      "Weighted Neutral Grip Pullup"
    ],
    "family": "pull-up",
    "variation": "weighted-neutral-grip",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Pull",
    "bodyRegion": "Upper Body",
    "requiresWeight": true,
    "skillBased": true
  },
  {
    "id": "weighted-wide-grip-pull-up",
    "name": "Weighted Wide-Grip Pull-Up",
    "primaryMuscle": "Back",
    "secondaryMuscles": [
      "Biceps",
      "Forearms"
    ],
    "equipment": "Pull-Up Bar",
    "category": "Calisthenics",
    "trackingType": "weight-reps",
    "movementPattern": "Vertical Pull",
    "unilateral": false,
    "aliases": [
      "Weighted Wide Grip Pullup"
    ],
    "family": "pull-up",
    "variation": "weighted-wide-grip",
    "difficulty": "Advanced",
    "mechanics": "Compound",
    "forceType": "Pull",
    "bodyRegion": "Upper Body",
    "requiresWeight": true,
    "skillBased": true
  },
  {
    "id": "weighted-close-grip-pull-up",
    "name": "Weighted Close-Grip Pull-Up",
    "primaryMuscle": "Back",
    "secondaryMuscles": [
      "Biceps",
      "Forearms"
    ],
    "equipment": "Pull-Up Bar",
    "category": "Calisthenics",
    "trackingType": "weight-reps",
    "movementPattern": "Vertical Pull",
    "unilateral": false,
    "aliases": [
      "Weighted Close Grip Pullup"
    ],
    "family": "pull-up",
    "variation": "weighted-close-grip",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Pull",
    "bodyRegion": "Upper Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "weighted-inverted-row",
    "name": "Weighted Inverted Row",
    "primaryMuscle": "Back",
    "secondaryMuscles": [
      "Biceps",
      "Rear Delts",
      "Core"
    ],
    "equipment": "Barbell",
    "category": "Calisthenics",
    "trackingType": "weight-reps",
    "movementPattern": "Horizontal Pull",
    "unilateral": false,
    "aliases": [
      "Weighted Bodyweight Row",
      "Weighted Australian Pull-Up"
    ],
    "family": "row",
    "variation": "weighted",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Pull",
    "bodyRegion": "Upper Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "weighted-ring-row",
    "name": "Weighted Ring Row",
    "primaryMuscle": "Back",
    "secondaryMuscles": [
      "Biceps",
      "Rear Delts",
      "Core"
    ],
    "equipment": "Gymnastic Rings",
    "category": "Calisthenics",
    "trackingType": "weight-reps",
    "movementPattern": "Horizontal Pull",
    "unilateral": false,
    "aliases": [
      "Weighted Ring Rows"
    ],
    "family": "row",
    "variation": "weighted",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Pull",
    "bodyRegion": "Upper Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "weighted-chest-dip",
    "name": "Weighted Chest Dip",
    "primaryMuscle": "Chest",
    "secondaryMuscles": [
      "Triceps",
      "Shoulders"
    ],
    "equipment": "Parallel Bars",
    "category": "Calisthenics",
    "trackingType": "weight-reps",
    "movementPattern": "Vertical Push",
    "unilateral": false,
    "aliases": [
      "Weighted Chest Dips"
    ],
    "family": "dip",
    "variation": "weighted",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Push",
    "bodyRegion": "Upper Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "weighted-ring-dip",
    "name": "Weighted Ring Dip",
    "primaryMuscle": "Triceps",
    "secondaryMuscles": [
      "Chest",
      "Shoulders",
      "Core"
    ],
    "equipment": "Gymnastic Rings",
    "category": "Calisthenics",
    "trackingType": "weight-reps",
    "movementPattern": "Vertical Push",
    "unilateral": false,
    "aliases": [
      "Weighted Ring Dips"
    ],
    "family": "dip",
    "variation": "weighted-rings",
    "difficulty": "Advanced",
    "mechanics": "Compound",
    "forceType": "Push",
    "bodyRegion": "Upper Body",
    "requiresWeight": true,
    "skillBased": true
  },
  {
    "id": "weighted-decline-push-up",
    "name": "Weighted Decline Push-Up",
    "primaryMuscle": "Chest",
    "secondaryMuscles": [
      "Shoulders",
      "Triceps",
      "Core"
    ],
    "equipment": "Bodyweight",
    "category": "Calisthenics",
    "trackingType": "weight-reps",
    "movementPattern": "Horizontal Push",
    "unilateral": false,
    "aliases": [
      "Weighted Decline Pushup"
    ],
    "family": "push-up",
    "variation": "weighted-decline",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Push",
    "bodyRegion": "Upper Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "weighted-diamond-push-up",
    "name": "Weighted Diamond Push-Up",
    "primaryMuscle": "Chest",
    "secondaryMuscles": [
      "Triceps",
      "Shoulders"
    ],
    "equipment": "Bodyweight",
    "category": "Calisthenics",
    "trackingType": "weight-reps",
    "movementPattern": "Horizontal Push",
    "unilateral": false,
    "aliases": [
      "Weighted Diamond Pushup"
    ],
    "family": "push-up",
    "variation": "weighted-diamond",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Push",
    "bodyRegion": "Upper Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "weighted-ring-push-up",
    "name": "Weighted Ring Push-Up",
    "primaryMuscle": "Chest",
    "secondaryMuscles": [
      "Triceps",
      "Shoulders",
      "Core"
    ],
    "equipment": "Gymnastic Rings",
    "category": "Calisthenics",
    "trackingType": "weight-reps",
    "movementPattern": "Horizontal Push",
    "unilateral": false,
    "aliases": [
      "Weighted Ring Pushup"
    ],
    "family": "push-up",
    "variation": "weighted",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Push",
    "bodyRegion": "Upper Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "weighted-pistol-squat",
    "name": "Weighted Pistol Squat",
    "primaryMuscle": "Quads",
    "secondaryMuscles": [
      "Glutes",
      "Hamstrings",
      "Core"
    ],
    "equipment": "Bodyweight",
    "category": "Calisthenics",
    "trackingType": "weight-reps",
    "movementPattern": "Squat",
    "unilateral": true,
    "aliases": [
      "Loaded Pistol Squat"
    ],
    "family": "squat",
    "variation": "weighted-pistol",
    "difficulty": "Advanced",
    "mechanics": "Compound",
    "forceType": "Push",
    "bodyRegion": "Lower Body",
    "requiresWeight": true,
    "skillBased": true
  },
  {
    "id": "weighted-shrimp-squat",
    "name": "Weighted Shrimp Squat",
    "primaryMuscle": "Quads",
    "secondaryMuscles": [
      "Glutes",
      "Hamstrings",
      "Core"
    ],
    "equipment": "Bodyweight",
    "category": "Calisthenics",
    "trackingType": "weight-reps",
    "movementPattern": "Squat",
    "unilateral": true,
    "aliases": [
      "Loaded Shrimp Squat"
    ],
    "family": "squat",
    "variation": "weighted",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Push",
    "bodyRegion": "Lower Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "weighted-step-up",
    "name": "Weighted Step-Up",
    "primaryMuscle": "Quads",
    "secondaryMuscles": [
      "Glutes",
      "Hamstrings"
    ],
    "equipment": "Box",
    "category": "Calisthenics",
    "trackingType": "weight-reps",
    "movementPattern": "Lunge",
    "unilateral": true,
    "aliases": [
      "Loaded Step-Up"
    ],
    "family": "step-up",
    "variation": "weighted",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Push",
    "bodyRegion": "Lower Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "weighted-single-leg-calf-raise",
    "name": "Weighted Single-Leg Calf Raise",
    "primaryMuscle": "Calves",
    "secondaryMuscles": [],
    "equipment": "Bodyweight",
    "category": "Calisthenics",
    "trackingType": "weight-reps",
    "movementPattern": "Plantar Flexion",
    "unilateral": true,
    "aliases": [
      "Loaded Single Leg Calf Raise"
    ],
    "family": "calf-raise",
    "variation": "weighted",
    "difficulty": "Intermediate",
    "mechanics": "Isolation",
    "forceType": "Push",
    "bodyRegion": "Lower Body",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "weighted-hanging-knee-raise",
    "name": "Weighted Hanging Knee Raise",
    "primaryMuscle": "Core",
    "secondaryMuscles": [
      "Hip Flexors",
      "Forearms"
    ],
    "equipment": "Pull-Up Bar",
    "category": "Calisthenics",
    "trackingType": "weight-reps",
    "movementPattern": "Hip Flexion",
    "unilateral": false,
    "aliases": [
      "Weighted Knee Raise"
    ],
    "family": "weighted-hanging-knee-raise",
    "variation": "weighted",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Other",
    "bodyRegion": "Core",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "weighted-hanging-leg-raise",
    "name": "Weighted Hanging Leg Raise",
    "primaryMuscle": "Core",
    "secondaryMuscles": [
      "Hip Flexors",
      "Forearms"
    ],
    "equipment": "Pull-Up Bar",
    "category": "Calisthenics",
    "trackingType": "weight-reps",
    "movementPattern": "Hip Flexion",
    "unilateral": false,
    "aliases": [
      "Weighted Leg Raise"
    ],
    "family": "leg-raise",
    "variation": "weighted",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Other",
    "bodyRegion": "Core",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "weighted-sit-up",
    "name": "Weighted Sit-Up",
    "primaryMuscle": "Core",
    "secondaryMuscles": [
      "Hip Flexors"
    ],
    "equipment": "Weight Plate",
    "category": "Calisthenics",
    "trackingType": "weight-reps",
    "movementPattern": "Spinal Flexion",
    "unilateral": false,
    "aliases": [
      "Weighted Situp"
    ],
    "family": "sit-up",
    "variation": "weighted",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Other",
    "bodyRegion": "Core",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "weighted-russian-twist",
    "name": "Weighted Russian Twist",
    "primaryMuscle": "Core",
    "secondaryMuscles": [
      "Obliques"
    ],
    "equipment": "Weight Plate",
    "category": "Calisthenics",
    "trackingType": "weight-reps",
    "movementPattern": "Core Rotation",
    "unilateral": false,
    "aliases": [
      "Weighted Russian Twists"
    ],
    "family": "russian-twist",
    "variation": "weighted",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "forceType": "Other",
    "bodyRegion": "Core",
    "requiresWeight": true,
    "skillBased": false
  },
  {
    "id": "weighted-muscle-up",
    "name": "Weighted Muscle-Up",
    "primaryMuscle": "Full Body",
    "secondaryMuscles": [
      "Back",
      "Biceps",
      "Chest",
      "Triceps",
      "Shoulders",
      "Core"
    ],
    "equipment": "Pull-Up Bar",
    "category": "Calisthenics",
    "trackingType": "weight-reps",
    "movementPattern": "Vertical Pull + Push",
    "unilateral": false,
    "aliases": [
      "Weighted Muscle Up"
    ],
    "family": "muscle-up",
    "variation": "weighted",
    "difficulty": "Advanced",
    "mechanics": "Compound",
    "forceType": "Push/Pull",
    "bodyRegion": "Full Body",
    "requiresWeight": true,
    "skillBased": true
  },
  {
    "id": "weighted-bar-muscle-up",
    "name": "Weighted Bar Muscle-Up",
    "primaryMuscle": "Full Body",
    "secondaryMuscles": [
      "Back",
      "Biceps",
      "Chest",
      "Triceps",
      "Shoulders",
      "Core"
    ],
    "equipment": "Pull-Up Bar",
    "category": "Calisthenics",
    "trackingType": "weight-reps",
    "movementPattern": "Vertical Pull + Push",
    "unilateral": false,
    "aliases": [
      "Weighted Bar Muscle Up"
    ],
    "family": "muscle-up",
    "variation": "weighted",
    "difficulty": "Advanced",
    "mechanics": "Compound",
    "forceType": "Push/Pull",
    "bodyRegion": "Full Body",
    "requiresWeight": true,
    "skillBased": true
  },
  {
    "id": "weighted-ring-muscle-up",
    "name": "Weighted Ring Muscle-Up",
    "primaryMuscle": "Full Body",
    "secondaryMuscles": [
      "Back",
      "Biceps",
      "Chest",
      "Triceps",
      "Shoulders",
      "Core"
    ],
    "equipment": "Gymnastic Rings",
    "category": "Calisthenics",
    "trackingType": "weight-reps",
    "movementPattern": "Vertical Pull + Push",
    "unilateral": false,
    "aliases": [
      "Weighted Ring Muscle Up"
    ],
    "family": "muscle-up",
    "variation": "weighted",
    "difficulty": "Advanced",
    "mechanics": "Compound",
    "forceType": "Push/Pull",
    "bodyRegion": "Full Body",
    "requiresWeight": true,
    "skillBased": true
  }
];

// Tracking flags retain the original shape expected by Forge forms.
const trackingTypeConfig = {
  "weight-reps": {
    "weight": true,
    "reps": true,
    "duration": false,
    "distance": false
  },
  "reps": {
    "weight": false,
    "reps": true,
    "duration": false,
    "distance": false
  },
  "duration": {
    "weight": false,
    "reps": false,
    "duration": true,
    "distance": false
  },
  "distance-duration": {
    "weight": false,
    "reps": false,
    "duration": true,
    "distance": true
  }
};

const exerciseVocabulary = {
  "category": [
    "Calisthenics",
    "Cardio",
    "Core",
    "Mobility",
    "Power",
    "Strength",
    "Warm-Up"
  ],
  "equipment": [
    "Ab Wheel",
    "Barbell",
    "Battle Ropes",
    "Bench",
    "Bike",
    "Bodyweight",
    "Box",
    "Cable",
    "Dumbbells",
    "EZ Bar",
    "Gymnastic Rings",
    "Jump Rope",
    "Kettlebell",
    "Machine",
    "Parallel Bars",
    "Pull-Up Bar",
    "Resistance Band",
    "Rowing Machine",
    "Sled",
    "Smith Machine",
    "Treadmill",
    "Vertical Bar",
    "Weight Plate",
    "Wrist Roller"
  ],
  "movementPattern": [
    "Anti-Rotation",
    "Chest Isolation",
    "Conditioning",
    "Core Rotation",
    "Core Stability",
    "Cycling",
    "Dorsiflexion",
    "Elbow Extension",
    "Elbow Flexion",
    "Full Body",
    "Grip",
    "Hang",
    "Hip Abduction",
    "Hip Adduction",
    "Hip Extension",
    "Hip Flexion",
    "Hip Hinge",
    "Horizontal Pull",
    "Horizontal Push",
    "Isometric Hold",
    "Isometric Pull",
    "Isometric Push",
    "Jumping",
    "Knee Extension",
    "Knee Flexion",
    "Loaded Carry",
    "Locomotion",
    "Lunge",
    "Mobility",
    "Olympic / Power",
    "Plantar Flexion",
    "Rowing",
    "Scapular Elevation",
    "Shoulder Isolation",
    "Shoulder Mobility",
    "Shoulder Rotation",
    "Sled Pull",
    "Sled Push",
    "Spinal Flexion",
    "Squat",
    "Squat to Press",
    "Vertical Pull",
    "Vertical Pull + Push",
    "Vertical Push",
    "Wrist Extension",
    "Wrist Flexion"
  ],
  "difficulty": [
    "Advanced",
    "Beginner",
    "Intermediate"
  ],
  "mechanics": [
    "Cardio",
    "Compound",
    "Isolation",
    "Isometric",
    "Mobility"
  ],
  "forceType": [
    "Carry",
    "Locomotion",
    "Other",
    "Pull",
    "Push",
    "Push/Pull",
    "Static"
  ],
  "bodyRegion": [
    "Core",
    "Full Body",
    "Lower Body",
    "Upper Body"
  ],
  "primaryMuscle": [
    "Adductors",
    "Arms",
    "Back",
    "Biceps",
    "Calves",
    "Cardio",
    "Chest",
    "Core",
    "Forearms",
    "Full Body",
    "Glutes",
    "Hamstrings",
    "Hip Flexors",
    "Legs",
    "Obliques",
    "Quads",
    "Rear Delts",
    "Shoulders",
    "Traps",
    "Triceps",
    "Upper Chest"
  ]
};

const validDifficultyLevels = exerciseVocabulary.difficulty;
const validMechanicsTypes = exerciseVocabulary.mechanics;
const validBodyRegions = exerciseVocabulary.bodyRegion;



// Canonical fields are the only stored values. Legacy getters/setters keep old
// Forge callers working without a second metadata table or duplicated values.
const exerciseFieldAliases = Object.freeze({
  muscleGroup: 'primaryMuscle', isUnilateral: 'unilateral',
  exerciseFamily: 'family', variationType: 'variation'
});
exerciseLibrary.forEach(exercise => {
  Object.entries(exerciseFieldAliases).forEach(([legacy, canonical]) => {
    Object.defineProperty(exercise, legacy, {
      configurable: true, enumerable: false,
      get() { return this[canonical]; },
      set(value) { this[canonical] = value; }
    });
  });
});

// Search ignores case, accents, punctuation and repeated whitespace.
function normalizeExerciseText(value) {
  return String(value == null ? '' : value).normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '').toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ').trim();
}
function canonicalExerciseField(field) {
  return Object.prototype.hasOwnProperty.call(exerciseFieldAliases, field)
    ? exerciseFieldAliases[field] : field;
}
function normalizeExerciseFilter(field, value) {
  const text = normalizeExerciseText(value);
  const synonyms = {
    equipment: { plate: 'weight plate', none: 'bodyweight', dumbbell: 'dumbbells' },
    movementPattern: { 'core flexion': 'spinal flexion', 'calf raise': 'plantar flexion' }
  };
  return synonyms[field] && Object.prototype.hasOwnProperty.call(synonyms[field], text)
    ? synonyms[field][text] : text;
}

/**
 * One query layer. Filters combine with AND; an array in a field matches ANY.
 * Search words may match different fields. Empty/null filters are ignored.
 * muscle matches primary or secondary; primaryMuscle matches only the primary.
 * Boolean filters accept only true/false/null (strings throw rather than misfilter).
 * Unknown filter names throw to expose typos. Results preserve source order.
 * Legacy option names are accepted, including variationType and isUnilateral.
 */
function queryExercises(options = {}) {
  if (typeof options === 'string') options = { search: options };
  if (!options || typeof options !== 'object' || Array.isArray(options)) {
    throw new TypeError('Exercise query must be an options object or search string.');
  }
  const strings = ['id', 'name', 'primaryMuscle', 'equipment', 'category',
    'movementPattern', 'family', 'variation', 'difficulty', 'mechanics',
    'forceType', 'bodyRegion', 'trackingType'];
  const booleans = ['unilateral', 'skillBased', 'requiresWeight'];
  const filters = [];
  let tokens = [];
  Object.entries(options).forEach(([key, value]) => {
    const field = canonicalExerciseField(key);
    if (field === 'search') {
      tokens = normalizeExerciseText(value).split(' ').filter(Boolean);
      return;
    }
    if (![...strings, ...booleans, 'muscle'].includes(field)) {
      throw new TypeError('Unknown exercise filter: ' + key);
    }
    if (value == null || value === '') return;
    if (booleans.includes(field)) {
      if (typeof value !== 'boolean') throw new TypeError(key + ' must be a boolean.');
      filters.push(exercise => exercise[field] === value);
      return;
    }
    const values = Array.isArray(value) ? value : [value];
    if (!values.every(item => typeof item === 'string' && item.trim())) {
      throw new TypeError(key + ' must contain nonempty strings.');
    }
    const wanted = values.map(item => normalizeExerciseFilter(field, item));
    filters.push(exercise => {
      const actual = field === 'muscle'
        ? [exercise.primaryMuscle, ...exercise.secondaryMuscles] : [exercise[field]];
      return actual.some(item => wanted.includes(normalizeExerciseFilter(field, item)));
    });
  });
  return exerciseLibrary.filter(exercise => {
    if (!filters.every(matches => matches(exercise))) return false;
    if (!tokens.length) return true;
    const haystack = normalizeExerciseText([
      ...strings.map(field => exercise[field]),
      ...exercise.secondaryMuscles, ...exercise.aliases
    ].join(' '));
    return tokens.every(token => haystack.includes(token));
  });
}
function queryExerciseDatabase(options = {}) { return queryExercises(options); }
function searchExercises(searchTerm = '') { return queryExercises({ search: searchTerm }); }
function filterExercises(options = {}) { return queryExercises(options); }
function findExercises(options = {}) { return queryExercises(options); }

function getExerciseById(id) {
  return typeof id === 'string' ? exerciseLibrary.find(e => e.id === id.trim()) || null : null;
}
function getExerciseByName(name) {
  const term = normalizeExerciseText(name);
  return term ? exerciseLibrary.find(e => normalizeExerciseText(e.name) === term) || null : null;
}
// Plural lookup exposes ambiguous aliases instead of hiding competing records.
function getExercisesByNameOrAlias(name) {
  const term = normalizeExerciseText(name);
  return term ? exerciseLibrary.filter(e => normalizeExerciseText(e.name) === term ||
    e.aliases.some(alias => normalizeExerciseText(alias) === term)) : [];
}
function getExerciseByNameOrAlias(name) {
  return getExerciseByName(name) || getExercisesByNameOrAlias(name)[0] || null;
}
function getExerciseFamily(family) { return family ? queryExercises({ family }) : []; }
function getExerciseVariations(id) {
  const exercise = getExerciseById(id);
  return exercise ? queryExercises({ family: exercise.family }).filter(e => e.id !== id) : [];
}
function getExercisesByDifficulty(difficulty) { return queryExercises({ difficulty }); }
function getExercisesByBodyRegion(bodyRegion) { return queryExercises({ bodyRegion }); }
function getExercisesByMechanics(mechanics) { return queryExercises({ mechanics }); }
function getExercisesByForceType(forceType) { return queryExercises({ forceType }); }
function getExercisesByPrimaryMuscle(primaryMuscle) { return queryExercises({ primaryMuscle }); }
function getExercisesForMuscle(muscle) { return queryExercises({ muscle }); }
function getExercisesByEquipment(equipment) { return queryExercises({ equipment }); }
function getExercisesByCategory(category) { return queryExercises({ category }); }
function getExercisesByMovementPattern(movementPattern) { return queryExercises({ movementPattern }); }
function getSkillExercises() { return queryExercises({ skillBased: true }); }
function getWeightedExercises() { return queryExercises({ requiresWeight: true }); }
function getBodyweightExercises() { return queryExercises({ equipment: 'Bodyweight' }); }
function getUnilateralExercises() { return queryExercises({ unilateral: true }); }
function getBilateralExercises() { return queryExercises({ unilateral: false }); }
function getExercisesAlphabetically() {
  return [...exerciseLibrary].sort((a, b) => a.name.localeCompare(b.name));
}
function getUniqueExerciseValues(property) {
  property = canonicalExerciseField(property);
  return [...new Set(exerciseLibrary.flatMap(e => e[property] || []))]
    .sort((a, b) => String(a).localeCompare(String(b)));
}
function groupExercisesBy(property, options = {}) {
  property = canonicalExerciseField(property);
  const groups = Object.create(null);
  queryExercises(options).forEach(exercise => {
    const value = exercise[property];
    (Array.isArray(value) ? value : [value == null ? 'Other' : value]).forEach(key => {
      (groups[key] || (groups[key] = [])).push(exercise);
    });
  });
  return groups;
}
function groupExercisesByMuscle() { return groupExercisesBy('primaryMuscle'); }
function groupExercisesByFamily() { return groupExercisesBy('family'); }
function groupExercisesByEquipment() { return groupExercisesBy('equipment'); }
function groupExercisesByCategory() { return groupExercisesBy('category'); }
function getCategories() { return getExerciseCategories(); }

// Related suggestions are rankings, not assertions of equivalent difficulty.
// Substitutes must match both primary muscle and pattern before being ranked.
function rankRelatedExercises(id, limit, substitutes) {
  const exercise = getExerciseById(id);
  if (!exercise) return [];
  if (!Number.isInteger(limit) || limit < 0) throw new RangeError('limit must be a nonnegative integer.');
  const weights = { family: 10, primaryMuscle: 5, movementPattern: 4,
    equipment: 2, mechanics: 2, forceType: 1, bodyRegion: 1 };
  return exerciseLibrary.filter(item => item.id !== exercise.id &&
    (substitutes ? item.primaryMuscle === exercise.primaryMuscle &&
      item.movementPattern === exercise.movementPattern :
      item.family === exercise.family || item.primaryMuscle === exercise.primaryMuscle ||
      item.movementPattern === exercise.movementPattern))
    .map(item => ({ exercise: item, score: Object.entries(weights).reduce((score, [key, weight]) =>
      score + (item[key] && item[key] !== 'Other' && item[key] === exercise[key] ? weight : 0), 0) }))
    .sort((a, b) => b.score - a.score || a.exercise.name.localeCompare(b.exercise.name))
    .slice(0, limit).map(item => item.exercise);
}
function getRelatedExercises(id, limit = 6) { return rankRelatedExercises(id, limit, false); }
function getExerciseSubstitutes(id, limit = 6) { return rankRelatedExercises(id, limit, true); }
function getTrackingConfig(exercise) {
  if (typeof exercise === 'string') exercise = getExerciseById(exercise);
  if (!exercise || !Object.prototype.hasOwnProperty.call(trackingTypeConfig, exercise.trackingType)) return null;
  return { ...trackingTypeConfig[exercise.trackingType] };
}


function getMuscleGroups() {
  const muscles = new Set();
  exerciseLibrary.forEach((exercise) => {
    if (exercise.primaryMuscle) {
      muscles.add(exercise.primaryMuscle);
    }
    (exercise.secondaryMuscles || []).forEach((muscle) => {
      muscles.add(muscle);
    });
  });
  return [...muscles].sort((a, b) => a.localeCompare(b));
}

function getEquipmentTypes() {
  return getUniqueExerciseValues("equipment");
}

function getExerciseCategories() {
  return getUniqueExerciseValues("category");
}

function getMovementPatterns() {
  return getUniqueExerciseValues("movementPattern");
}

function getExerciseFamilies() {
  return getUniqueExerciseValues("family");
}

function getVariationTypes() {
  return getUniqueExerciseValues("variation");
}

function getDifficultyLevels() {
  return getUniqueExerciseValues("difficulty");
}

function getMechanicsTypes() {
  return getUniqueExerciseValues("mechanics");
}

function getForceTypes() {
  return getUniqueExerciseValues("forceType");
}

function getBodyRegions() {
  return getUniqueExerciseValues("bodyRegion");
}

function getTrackingTypes() {
  return getUniqueExerciseValues("trackingType");
}

function getTrackingConfigById(exerciseId) {
  const exercise = getExerciseById(exerciseId);
  return getTrackingConfig(exercise);
}

function exerciseTracksWeight(exerciseId) {
  const config = getTrackingConfigById(exerciseId);
  return config?.weight === true;
}

function exerciseTracksReps(exerciseId) {
  const config = getTrackingConfigById(exerciseId);
  return config?.reps === true;
}

function exerciseTracksDuration(exerciseId) {
  const config = getTrackingConfigById(exerciseId);
  return config?.duration === true;
}

function exerciseTracksDistance(exerciseId) {
  const config = getTrackingConfigById(exerciseId);
  return config?.distance === true;
}

function createExerciseOptions() {
  return [...exerciseLibrary]
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((exercise) => ({
      value: exercise.id,
      label: exercise.name,
    }));
}

function getExerciseFilterOptions() {
  return {
    muscles: getMuscleGroups(),
    equipment: getEquipmentTypes(),
    categories: getExerciseCategories(),
    movementPatterns: getMovementPatterns(),
    families: getExerciseFamilies(),
    variations: getVariationTypes(),
    difficulties: getDifficultyLevels(),
    mechanics: getMechanicsTypes(),
    forceTypes: getForceTypes(),
    bodyRegions: getBodyRegions(),
    trackingTypes: getTrackingTypes(),
  };
}

function getExerciseDatabaseStats() {
  return {
    totalExercises: exerciseLibrary.length,
    muscleGroups: getMuscleGroups().length,
    equipmentTypes: getEquipmentTypes().length,
    categories: getExerciseCategories().length,
    movementPatterns: getMovementPatterns().length,
    exerciseFamilies: getExerciseFamilies().length,
    variationTypes: getVariationTypes().length,
    difficulties: getDifficultyLevels().length,
    mechanicsTypes: getMechanicsTypes().length,
    forceTypes: getForceTypes().length,
    bodyRegions: getBodyRegions().length,
    weightedExercises: exerciseLibrary.filter(
      (exercise) => exercise.requiresWeight,
    ).length,
    bodyweightExercises: exerciseLibrary.filter(
      (exercise) => exercise.equipment === "Bodyweight",
    ).length,
    skillExercises: exerciseLibrary.filter((exercise) => exercise.skillBased)
      .length,
    unilateralExercises: exerciseLibrary.filter(
      (exercise) => exercise.unilateral,
    ).length,
  };
}

/** Validate any record array without mutating it; malformed records produce errors. */
function validateExerciseLibrary(library = exerciseLibrary) {
  const errors = [], warnings = [], duplicateCandidates = [], aliasConflicts = [];
  const ids = new Map(), names = new Map(), terms = new Map(), signatures = new Map();
  const required = ['id', 'name', 'primaryMuscle', 'equipment', 'category',
    'trackingType', 'movementPattern', 'family', 'variation', 'difficulty',
    'mechanics', 'forceType', 'bodyRegion'];
  let defaultMovementPatternCount = 0;
  if (!Array.isArray(library)) {
    return { valid: false, exerciseCount: 0, errorCount: 1, warningCount: 0,
      defaultMovementPatternCount: 0, errors: ['Library must be an array.'], warnings,
      duplicateCandidates, aliasConflicts };
  }
  library.forEach((e, index) => {
    const label = 'Record ' + (index + 1) + (e && typeof e.id === 'string' ? ' (' + e.id + ')' : '');
    if (!e || typeof e !== 'object' || Array.isArray(e)) { errors.push(label + ': must be an object.'); return; }
    required.forEach(field => {
      if (typeof e[field] !== 'string' || !e[field].trim()) errors.push(label + ': missing/invalid ' + field + '.');
      else if (e[field] !== e[field].trim()) errors.push(label + ': whitespace in ' + field + '.');
    });
    ['id', 'family', 'variation'].forEach(field => {
      if (typeof e[field] === 'string' && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(e[field])) {
        errors.push(label + ': ' + field + ' must be a lowercase hyphenated identifier.');
      }
    });
    Object.entries(exerciseVocabulary).forEach(([field, values]) => {
      if (typeof e[field] === 'string' && !values.includes(e[field])) errors.push(label + ': unknown ' + field + ' "' + e[field] + '".');
    });
    ['unilateral', 'requiresWeight', 'skillBased'].forEach(field => {
      if (typeof e[field] !== 'boolean') errors.push(label + ': ' + field + ' must be boolean.');
    });
    Object.entries(exerciseFieldAliases).forEach(([legacy, canonical]) => {
      if (Object.prototype.hasOwnProperty.call(e, legacy) && e[legacy] !== e[canonical]) {
        errors.push(label + ': conflicting ' + legacy + ' and ' + canonical + '.');
      }
    });
    ['secondaryMuscles', 'aliases'].forEach(field => {
      if (!Array.isArray(e[field])) { errors.push(label + ': ' + field + ' must be an array.'); return; }
      const seen = new Set();
      e[field].forEach(value => {
        if (typeof value !== 'string' || !value.trim()) { errors.push(label + ': invalid ' + field + ' entry.'); return; }
        const term = normalizeExerciseText(value);
        if (seen.has(term)) warnings.push(label + ': repeated ' + field + ' entry "' + value + '".');
        seen.add(term);
        if (value !== value.trim()) errors.push(label + ': whitespace in ' + field + '.');
        if (field === 'secondaryMuscles' && !exerciseVocabulary.primaryMuscle.includes(value)) errors.push(label + ': unknown secondary muscle "' + value + '".');
        if (field === 'secondaryMuscles' && value === e.primaryMuscle) warnings.push(label + ': primary muscle repeated as secondary.');
      });
    });
    const config = Object.prototype.hasOwnProperty.call(trackingTypeConfig, e.trackingType) ? trackingTypeConfig[e.trackingType] : null;
    if (!config) errors.push(label + ': unknown trackingType.');
    else {
      if (!['weight', 'reps', 'duration', 'distance'].every(field => typeof config[field] === 'boolean')) errors.push(label + ': invalid tracking configuration.');
      if (e.requiresWeight !== config.weight) errors.push(label + ': requiresWeight must match the tracking weight flag.');
      if (!Object.values(config).some(value => value === true)) errors.push(label + ': tracking configuration has no enabled inputs.');
    }
    if (e.mechanics === 'Isometric' && !config?.duration) warnings.push(label + ': isometric exercise does not track duration.');
    if (e.mechanics === 'Isometric' && e.forceType !== 'Static') warnings.push(label + ': isometric mechanics conflict with forceType.');
    if (e.movementPattern === 'Other') { defaultMovementPatternCount++; warnings.push(label + ': unspecified movement pattern.'); }
    if (typeof e.id === 'string') {
      const key = normalizeExerciseText(e.id);
      if (ids.has(key)) errors.push(label + ': duplicate ID (including case/punctuation variants) with ' + ids.get(key) + '.');
      else ids.set(key, e.id);
    }
    if (typeof e.name === 'string' && e.name.trim()) {
      const key = normalizeExerciseText(e.name);
      if (names.has(key)) warnings.push(label + ': duplicate name with ' + names.get(key) + '.');
      else names.set(key, e.id);
      [e.name, ...(Array.isArray(e.aliases) ? e.aliases : [])].forEach(value => {
        if (typeof value !== 'string' || !value.trim()) return;
        const term = normalizeExerciseText(value);
        if (!terms.has(term)) terms.set(term, new Set());
        terms.get(term).add(e.id || label);
      });
    }
    // Same descriptive metadata is only a candidate: never automatically merge.
    const signature = JSON.stringify(['family', 'variation', 'equipment', 'trackingType',
      'primaryMuscle', 'movementPattern', 'unilateral'].map(field => e[field]));
    if (signatures.has(signature)) duplicateCandidates.push([signatures.get(signature), e.id]);
    else signatures.set(signature, e.id);
  });
  terms.forEach((matches, term) => {
    if (matches.size > 1) {
      const exerciseIds = [...matches];
      aliasConflicts.push({ term, ids: exerciseIds });
      warnings.push('Ambiguous name/alias "' + term + '": ' + exerciseIds.join(', ') + '.');
    }
  });
  duplicateCandidates.forEach(pair => warnings.push('Possible duplicate metadata: ' + pair.join(', ') + '. Review before merging.'));
  return { valid: errors.length === 0, exerciseCount: library.length,
    errorCount: errors.length, warningCount: warnings.length,
    defaultMovementPatternCount, errors, warnings, duplicateCandidates, aliasConflicts };
}
function printExerciseDatabaseReport() {
  const result = validateExerciseLibrary();
  console.log('Forge exercise database', getExerciseDatabaseStats(), result);
  return result;
}
function runExerciseDatabaseTests() {
  const tests = [];
  function check(name, passed) { tests.push({ name, passed: Boolean(passed) }); }
  check('database validation', validateExerciseLibrary().valid);
  check('ID lookup', getExerciseById('barbell-bench-press')?.name === 'Barbell Bench Press');
  check('normalized search', searchExercises('BARBELL bench-press').some(e => e.id === 'barbell-bench-press'));
  check('false boolean filter', queryExercises({ unilateral: false }).every(e => e.unilateral === false));
  check('legacy properties', getExerciseById('barbell-bench-press')?.muscleGroup === 'Chest');
  check('missing lookup', getExerciseById('nonexistent-exercise') === null);
  return { passed: tests.every(test => test.passed), tests };
}
// Quiet startup; reporting and smoke tests are explicit calls.
const exerciseLibraryStatus = validateExerciseLibrary();

