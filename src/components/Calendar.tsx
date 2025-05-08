import React from 'react'
import { Box, Grid, Text, Button } from '@chakra-ui/react';
import { Engineer, Candidate, InterviewSlot } from '../types';

interface CalendarProps {
  engineers: Engineer[];
  selectedCandidate: Candidate | null;
  onSlotSelect: (slot: InterviewSlot) => void;
  scheduledInterviews: InterviewSlot[];
  duration: 15 | 30 | 60;
}

const Calendar: React.FC<CalendarProps> = ({
  engineers,
  selectedCandidate,
  onSlotSelect,
  scheduledInterviews,
  duration
}) => {
  const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  
  // Generate time slots based on duration
  const generateTimeSlots = () => {
    const slots: string[] = [];
    const startHour = 9; // 9 AM
    const endHour = 18; // 6 PM
    
    for (let hour = startHour; hour < endHour; hour++) {
      const intervals = 60 / duration;
      for (let i = 0; i < intervals; i++) {
        const minutes = i * duration;
        slots.push(
          `${String(hour).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
        );
      }
    }
    return slots;
  };

  const TIME_SLOTS = generateTimeSlots();

  const calculateEndTime = (startTime: string): string => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + duration;
    const endHours = Math.floor(totalMinutes / 60);
    const endMinutes = totalMinutes % 60;
    return `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
  };

  const isSlotAvailable = (day: string, time: string) => {
    if (!selectedCandidate) return false;

    const endTime = calculateEndTime(time);

    // Check if slot is already scheduled
    const isSlotLocked = scheduledInterviews.some(interview => {
      const interviewEnd = interview.timeSlot.endTime;
      return (
        interview.timeSlot.day === day &&
        (
          (time >= interview.timeSlot.startTime && time < interviewEnd) ||
          (endTime > interview.timeSlot.startTime && endTime <= interviewEnd)
        )
      );
    });

    if (isSlotLocked) return false;

    const availableEngineers = engineers.filter((engineer) => {
      return engineer.availability.some((slot) => {
        return (
          slot.day === day &&
          slot.startTime <= time &&
          endTime <= slot.endTime
        );
      });
    });

    const candidateSlot = selectedCandidate.preferredTime;
    return (
      candidateSlot.day === day &&
      candidateSlot.startTime <= time &&
      endTime <= candidateSlot.endTime &&
      availableEngineers.length > 0
    );
  };

  return (
    <Box overflowX="auto">
      <Grid templateColumns={`auto repeat(${DAYS.length}, 1fr)`} gap={2}>
        <Box></Box>
        {DAYS.map((day) => (
          <Text key={day} fontWeight="bold" textAlign="center">
            {day}
          </Text>
        ))}

        {TIME_SLOTS.map((time) => (
          <React.Fragment key={time}>
            <Text>{time}</Text>
            {DAYS.map((day) => {
              const available = isSlotAvailable(day, time);
              return (
                <Button
                  key={`${day}-${time}`}
                  size="sm"
                  variant={available ? 'solid' : 'ghost'}
                  colorScheme={available ? 'blue' : 'gray'}
                  isDisabled={!available}
                  onClick={() => {
                    const engineer = engineers.find((e) =>
                      e.availability.some(
                        (slot) =>
                          slot.day === day &&
                          slot.startTime <= time &&
                          calculateEndTime(time) <= slot.endTime
                      )
                    );
                    if (engineer) {
                      onSlotSelect({
                        engineer,
                        candidate: selectedCandidate!,
                        timeSlot: {
                          day,
                          startTime: time,
                          endTime: calculateEndTime(time)
                        }
                      });
                    }
                  }}
                >
                  &nbsp;
                </Button>
              );
            })}
          </React.Fragment>
        ))}
      </Grid>
    </Box>
  );
};

export default Calendar;