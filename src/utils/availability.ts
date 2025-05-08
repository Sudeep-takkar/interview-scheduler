import { Engineer, Candidate, InterviewSlot } from '../types';

export const calculateEndTime = (startTime: string, durationMinutes: number): string => {
  const [hours, minutes] = startTime.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes + durationMinutes;
  let endHours = Math.floor(totalMinutes / 60);
  const endMinutes = totalMinutes % 60;
  
  // Normalize hours to 24-hour format
  endHours = endHours % 24;
  
  return `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
};

export const isTimeSlotAvailable = (
  day: string,
  startTime: string,
  duration: number,
  engineer: Engineer,
  candidate: Candidate,
  scheduledInterviews: InterviewSlot[]
): boolean => {
  const endTime = calculateEndTime(startTime, duration);

  // Check if slot is already scheduled
  const isSlotLocked = scheduledInterviews.some(interview => {
    const interviewEnd = interview.timeSlot.endTime;
    return (
      interview.timeSlot.day === day &&
      (
        (startTime >= interview.timeSlot.startTime && startTime < interviewEnd) ||
        (endTime > interview.timeSlot.startTime && endTime <= interviewEnd)
      )
    );
  });

  if (isSlotLocked) return false;

  // Check engineer availability
  const engineerIsAvailable = engineer.availability.some(slot => 
    slot.day === day &&
    slot.startTime <= startTime &&
    endTime <= slot.endTime
  );

  // Check candidate preferred time
  const candidateSlot = candidate.preferredTime;
  const candidateIsAvailable = 
    candidateSlot.day === day &&
    candidateSlot.startTime <= startTime &&
    endTime <= candidateSlot.endTime;

  return engineerIsAvailable && candidateIsAvailable;
};