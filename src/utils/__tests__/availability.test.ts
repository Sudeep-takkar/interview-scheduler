import { calculateEndTime, isTimeSlotAvailable } from '../availability';
import { Engineer, Candidate, InterviewSlot } from '../../types';

describe('Availability Calculations', () => {
  const mockEngineer: Engineer = {
    id: 1,
    name: "Test Engineer",
    availability: [
      { day: "Monday", startTime: "09:00", endTime: "12:00" },
      { day: "Tuesday", startTime: "14:00", endTime: "17:00" }
    ]
  };

  const mockCandidate: Candidate = {
    id: 1,
    name: "Test Candidate",
    preferredTime: { day: "Monday", startTime: "10:00", endTime: "11:00" }
  };

  const mockScheduledInterviews: InterviewSlot[] = [
    {
      engineer: mockEngineer,
      candidate: mockCandidate,
      timeSlot: { day: "Monday", startTime: "09:00", endTime: "09:30" }
    }
  ];

  describe('calculateEndTime', () => {
    test('should correctly calculate end time for 30-minute duration', () => {
      expect(calculateEndTime("09:00", 30)).toBe("09:30");
      expect(calculateEndTime("09:30", 30)).toBe("10:00");
      expect(calculateEndTime("23:45", 30)).toBe("00:15");
    });

    test('should handle hour rollover', () => {
      expect(calculateEndTime("09:45", 30)).toBe("10:15");
      expect(calculateEndTime("23:45", 45)).toBe("00:30");
    });

    test('should handle 24-hour time format correctly', () => {
      // Regular cases
      expect(calculateEndTime("09:00", 30)).toBe("09:30");
      expect(calculateEndTime("09:30", 30)).toBe("10:00");
      
      // Edge cases
      expect(calculateEndTime("23:00", 120)).toBe("01:00");
      expect(calculateEndTime("23:45", 30)).toBe("00:15");
      expect(calculateEndTime("23:45", 1435)).toBe("23:40"); // Next day same time -5min
    });

    test('should handle multi-day rollovers', () => {
      expect(calculateEndTime("23:45", 1440)).toBe("23:45"); // Exactly 24 hours
      expect(calculateEndTime("12:00", 2880)).toBe("12:00"); // 48 hours
      expect(calculateEndTime("23:45", 2880)).toBe("23:45"); // 48 hours from late time
    });
  });

  describe('isTimeSlotAvailable', () => {
    test('should return true for available slot', () => {
      const result = isTimeSlotAvailable(
        "Monday",
        "10:00",
        30,
        mockEngineer,
        mockCandidate,
        []
      );
      expect(result).toBe(true);
    });

    test('should return false for scheduled slot', () => {
      const result = isTimeSlotAvailable(
        "Monday",
        "09:00",
        30,
        mockEngineer,
        mockCandidate,
        mockScheduledInterviews
      );
      expect(result).toBe(false);
    });

    test('should return false when outside engineer availability', () => {
      const result = isTimeSlotAvailable(
        "Monday",
        "13:00",
        30,
        mockEngineer,
        mockCandidate,
        []
      );
      expect(result).toBe(false);
    });

    test('should return false when outside candidate preferred time', () => {
      const result = isTimeSlotAvailable(
        "Monday",
        "11:30",
        30,
        mockEngineer,
        mockCandidate,
        []
      );
      expect(result).toBe(false);
    });

    test('should handle slot at the boundary of availability', () => {
      const result = isTimeSlotAvailable(
        "Monday",
        "11:30",
        30,
        mockEngineer,
        {
          ...mockCandidate,
          preferredTime: { day: "Monday", startTime: "09:00", endTime: "12:00" }
        },
        []
      );
      expect(result).toBe(true);
    });
  });
});