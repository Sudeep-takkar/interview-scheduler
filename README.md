# Interview Scheduler

A React TypeScript application for scheduling interviews between candidates and engineers.

## Features

- Select candidates from a dropdown
- View weekly calendar (Mon-Fri, 9 AM-6 PM)
- Filter available slots by engineer
- Configure interview duration (15, 30, or 60 minutes)
- View overlapping availability between candidates and engineers
- Lock scheduled interview slots
- Confirm interviews with detailed information

## Architecture Decisions

### Component Structure
- **App.tsx**: Main container component managing global state and layout
- **Components/**
  - `Calendar.tsx`: Displays weekly calendar with available slots
  - `CandidateSelect.tsx`: Dropdown for candidate selection
  - `ConfirmationModal.tsx`: Modal for confirming interview details
  - `DurationSelect.tsx`: Interview duration selector
  - `EngineerFilter.tsx`: Filter slots by specific engineer

### State Management
- Using React's useState for local state management
- Centralized interview scheduling logic in App component
- Prop drilling for component communication

### Utils
- `availability.ts`: Core logic for calculating time slots and checking availability
- Separate business logic from UI components
- Pure functions for better testability

### TypeScript Types
```typescript
interface TimeSlot {
  day: string;
  startTime: string;
  endTime: string;
}

interface Engineer {
  id: number;
  name: string;
  availability: TimeSlot[];
}

interface Candidate {
  id: number;
  name: string;
  preferredTime: TimeSlot;
}

interface InterviewSlot {
  engineer: Engineer;
  timeSlot: TimeSlot;
}
