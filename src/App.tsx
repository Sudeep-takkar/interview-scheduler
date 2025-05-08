import { useState } from 'react';
import { ChakraProvider, Box, Container, Heading, VStack, HStack, useToast } from '@chakra-ui/react';
import { Candidate, Engineer, InterviewSlot } from './types';
import CandidateSelect from './components/CandidateSelect';
import Calendar from './components/Calendar';
import ConfirmationModal from './components/ConfirmationModal';
import DurationSelect from './components/DurationSelect';

const MOCK_ENGINEERS: Engineer[] = [
  {
    id: 1,
    name: "Sudeep Takkar",
    availability: [
      { day: "Monday", startTime: "09:00", endTime: "12:00" },
      { day: "Tuesday", startTime: "14:00", endTime: "17:00" }
    ]
  },
  {
    id: 2,
    name: "Saloni Jain",
    availability: [
      { day: "Monday", startTime: "13:00", endTime: "18:00" },
      { day: "Wednesday", startTime: "09:00", endTime: "15:00" }
    ]
  },
  {
    id: 3,
    name: "Rahul Kumar",
    availability: [
      { day: "Tuesday", startTime: "09:00", endTime: "17:00" },
      { day: "Thursday", startTime: "13:00", endTime: "18:00" }
    ]
  }
];

const MOCK_CANDIDATES: Candidate[] = [
  {
    id: 1,
    name: "Harry Potter",
    preferredTime: { day: "Tuesday", startTime: "14:00", endTime: "17:00" }
  },
  {
    id: 2,
    name: "Salman Khan",
    preferredTime: { day: "Monday", startTime: "10:00", endTime: "15:00" }
  },
  {
    id: 3,
    name: "Akshay Kumar",
    preferredTime: { day: "Wednesday", startTime: "09:00", endTime: "15:00" }
  }, {
    id: 4,
    name: "Sudeep Takkar",
    preferredTime: { day: "Tuesday", startTime: "14:00", endTime: "17:00" }
  }
];

function App() {
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<InterviewSlot | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scheduledInterviews, setScheduledInterviews] = useState<InterviewSlot[]>([]);
  const [duration, setDuration] = useState<15 | 30 | 60>(30);
  const toast = useToast();

  const handleSlotSelect = (slot: InterviewSlot) => {
    setSelectedSlot({
      ...slot,
      timeSlot: {
        ...slot.timeSlot,
        endTime: calculateEndTime(slot.timeSlot.startTime, duration)
      }
    });
    setIsModalOpen(true);
  };

  const calculateEndTime = (startTime: string, durationMinutes: number): string => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + durationMinutes;
    const endHours = Math.floor(totalMinutes / 60);
    const endMinutes = totalMinutes % 60;
    return `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
  };

  const handleConfirmInterview = () => {
    if (selectedSlot && selectedCandidate) {
      // Add the interview to scheduled interviews
      setScheduledInterviews([
        ...scheduledInterviews,
        {
          ...selectedSlot,
          candidate: selectedCandidate
        }
      ]);

      toast({
        title: "Interview Scheduled!",
        description: `Interview scheduled with ${selectedCandidate.name} and ${selectedSlot.engineer.name}`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setIsModalOpen(false);
      setSelectedSlot(null);
    }
  };

  return (
    <ChakraProvider>
      <Box minH="100vh" bg="gray.50">
        <Container maxW="container.xl" py={8}>
          <VStack spacing={8} align="stretch">
            <Heading as="h1" textAlign="center" color="blue.600">
              Interview Scheduler
            </Heading>
            
            <Box bg="white" p={6} borderRadius="lg" boxShadow="base">
              <HStack spacing={4}>
                <CandidateSelect
                  candidates={MOCK_CANDIDATES}
                  selectedCandidate={selectedCandidate}
                  onSelect={setSelectedCandidate}
                />
                <DurationSelect
                  duration={duration}
                  onDurationChange={setDuration}
                />
              </HStack>
            </Box>
            
            <Box bg="white" p={6} borderRadius="lg" boxShadow="base">
              <Calendar
                engineers={MOCK_ENGINEERS}
                selectedCandidate={selectedCandidate}
                onSlotSelect={handleSlotSelect}
                scheduledInterviews={scheduledInterviews}
                duration={duration}
              />
            </Box>
          </VStack>
        </Container>

        <ConfirmationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleConfirmInterview}
          slot={selectedSlot}
          candidate={selectedCandidate}
        />
      </Box>
    </ChakraProvider>
  );
}

export default App;