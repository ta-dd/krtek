# Product Requirement Document: Reaction Time Experiment App

## 1. Introduction
This document outlines the requirements for a simple browser-based application designed to measure human reaction time for psychological experiment purposes. The application will feature a "whack-a-mole" style interaction with a single mole, focusing on pure reaction time rather than aiming accuracy.

## 2. Goals
*   To provide an accurate and consistent measurement of a user's reaction time.
*   To offer a clear and intuitive user experience for participants.
*   To allow for easy data collection (average reaction time and raw data export).
*   To be simple to set up and run without complex server-side dependencies.

## 3. User Flow

```mermaid
graph TD
    A[Start Screen] --> B{Click "Start" Button};
    B --> C[Game Screen: Round 0/10];
    C --> D{Brief Pause (1s)};
    D --> E[Display hole.png];
    E --> F{Random Delay (1-4s)};
    F --> G[Display mole-sneaking.png];
    G --> H{Fixed Delay (700ms)};
    H --> I[Display mole-visible.png & Start Timer];
    I --> J{User Clicks Hole};
    J -- If clicked too early --> I;
    J -- If clicked correctly --> K[Record Reaction Time];
    K --> L[Display hole.png];
    L --> M{Brief Pause (500ms)};
    M --> N{Increment Round Counter};
    N -- If Round < 10 --> E;
    N -- If Round = 10 --> O[End Screen];
    O --> P[Display Average Reaction Time];
    O --> Q{Download Results Button};
    O --> R{Restart Button};
    Q --> S[Download CSV];
    R --> A;
```

## 4. Functional Requirements

### 4.1 Experiment Initiation
*   The application shall present a "Start" screen with clear instructions.
*   The experiment shall begin when the user clicks a "Start" button.

### 4.2 Game Mechanics
*   The game shall feature a single, central "hole" element.
*   The mole's appearance shall follow a three-stage animation sequence:
    1.  **Initial State:** The `hole.png` image is displayed.
    2.  **Sneaking State:** After a random delay (between 1000ms and 4000ms), the `mole-sneaking.png` image shall replace `hole.png`.
    3.  **Visible State:** After a fixed delay (700ms), the `mole-visible.png` image shall replace `mole-sneaking.png`, and the reaction timer shall begin.
*   The user shall react by clicking the hole when the `mole-visible.png` image is displayed.
*   Clicks made before the `mole-visible.png` appears shall not be registered as valid reactions.

### 4.3 Experiment Progression
*   A single experiment session shall consist of 10 rounds.
*   A round counter shall be displayed, starting at "0/10" and incrementing to "1/10" when the first round's animation begins, and so on.
*   Upon a successful click, the reaction time shall be recorded.
*   The image shall revert to `hole.png` after a successful click.
*   The next round shall automatically begin after a brief pause (500ms) following a successful click.

### 4.4 Experiment Conclusion
*   After 10 rounds, the game screen shall transition to an "End" screen.
*   The "End" screen shall display the user's average reaction time across all 10 rounds.
*   The "End" screen shall include a "Download Results" button.
*   The "End" screen shall include a "Restart" button to begin a new experiment.

### 4.5 Data Export
*   The "Download Results" button shall export the raw reaction times for each round into a CSV file. The CSV should include "Round" and "Reaction Time (ms)" columns.

## 5. Non-Functional Requirements

### 5.1 Performance
*   Reaction time measurement shall be accurate to the millisecond.
*   The application shall run smoothly in a modern web browser without noticeable lag.

### 5.2 User Interface (UI)
*   **Background:** The page background shall be solid white (`#ffffff`).
*   **Font:** The primary font shall be "Futura Light", with "Century Gothic" and generic sans-serif as fallbacks.
*   **Visuals:** Custom `.png` image files shall be used for the `hole`, `mole-sneaking`, and `mole-visible` states.
*   **Responsiveness:** The application should be usable on standard desktop browser sizes.

### 5.3 Technical Specifications
*   **Tech Stack:** HTML, CSS, and vanilla JavaScript. No external frameworks or libraries (e.g., React, Vue, TypeScript) are required for this project.
*   **File Structure:**
    *   `index.html`: Main application structure.
    *   `style.css`: Styling for the application.
    *   `script.js`: Core game logic and functionality.
    *   `hole.png`: Image for the empty hole.
    *   `mole-sneaking.png`: Image for the mole in its sneaking state.
    *   `mole-visible.png`: Image for the mole in its fully visible state.