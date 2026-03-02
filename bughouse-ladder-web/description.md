# Bughouse Chess Ladder Web Application

## Overview

A web-based application for managing Bughouse Chess player rankings and ladder standings. This tool allows users to import chess ladder data, sort players by various criteria, view game results, and manage player ratings.

## Features

### File Management
- Import chess ladder data from Excel (.xls) or text files (.txt, .tab)
- Load and display up to 200 players per session
- Save/load ladder data to/from browser localStorage

### Player Management
- View players sorted by rank, name, new rating, or previous rating
- Edit player information in place
- Recalculate player ratings
- Admin mode for advanced modifications

### Game Results
- Track game results across 31 rounds
- View results by player or by round
- Sort and filter game data

### User Interface
- Responsive design with zoom controls (100% or 140%)
- Dark theme header with project information
- Color-coded buttons for different actions
- Mobile-friendly layout

## Technical Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 7
- **Styling**: Inline CSS with template literals
- **Icons**: Lucide React
- **File Handling**: SheetJS/xlsx
- **Table Component**: @tanstack/react-table

## Project Structure

```
bughouse-ladder-web/
├── src/
│   ├── components/
│   │   ├── LadderForm.tsx      # Main ladder management component
│   │   └── Settings.tsx         # Application settings
│   ├── css/
│   │   └── index.css            # Global styles
│   ├── types/
│   │   └── hashUtils.ts         # TypeScript type definitions
│   └── main.tsx                 # Application entry point
├── dist/                         # Production build output
├── package.json                  # Dependencies and scripts
├── vite.config.ts               # Vite configuration
└── tsconfig.json                # TypeScript configuration
```

## Data Format

### Player Data Structure

Players are imported from Excel or text files with the following columns:

| Column | Description |
|--------|-------------|
| Group | Player group/team |
| Last Name | Player's last name |
| First Name | Player's first name |
| Rating | Current rating |
| Rank | Ladder ranking |
| New Rating | Updated rating |
| Grade | Player grade |

### Game Results Format

Game results are stored in a 2D array representing rounds and player results.

## Development

### Getting Started

1. Install dependencies: `npm install`
2. Start development server: `npm run dev`
3. Build for production: `npm run build`
4. Preview production build: `npm run preview`

### Code Quality

- Run ESLint: `npm run lint`
- Run TypeScript type checking: `npm run build`

## Browser Compatibility

- Chrome/Edge (recommended)
- Firefox
- Safari

