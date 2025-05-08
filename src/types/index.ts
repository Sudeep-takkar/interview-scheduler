export interface Engineer {
  id: number;
  name: string;
  availability: TimeSlot[];
}

export interface Candidate {
  id: number;
  name: string;
  preferredTime: TimeSlot;
}

export interface TimeSlot {
  day: string;
  startTime: string;
  endTime: string;
}

export interface InterviewSlot {
  engineer: Engineer;
  candidate: Candidate;
  timeSlot: TimeSlot;
}