import { useState, useEffect } from 'react';
import { ChakraProvider, Box, Container, Heading, VStack, HStack, useToast, Spinner, Center } from '@chakra-ui/react';
import { Candidate, Engineer, InterviewSlot } from './types';
import { fetchEngineers, fetchCandidates } from './services/api';
import CandidateSelect from './components/CandidateSelect';
import Calendar from './components/Calendar';
import ConfirmationModal from './components/ConfirmationModal';
import DurationSelect from './components/DurationSelect';

function App() {
  const [engineers, setEngineers] = useState<Engineer[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<InterviewSlot | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scheduledInterviews, setScheduledInterviews] = useState<InterviewSlot[]>([]);
  const [duration, setDuration] = useState<15 | 30 | 60>(30);
  const toast = useToast();

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [engineersData, candidatesData] = await Promise.all([
          fetchEngineers(),
          fetchCandidates()
        ]);
        
        setEngineers(engineersData);
        setCandidates(candidatesData);
      } catch (err) {
        setError('Failed to load data. Please try again later.');
        toast({
          title: 'Error',
          description: 'Failed to load data',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [toast]);

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

  if (isLoading) {
    return (
      <ChakraProvider>
        <Center minH="100vh">
          <VStack spacing={4}>
            <Spinner size="xl" />
            <Heading size="md">Loading...</Heading>
          </VStack>
        </Center>
      </ChakraProvider>
    );
  }

  if (error) {
    return (
      <ChakraProvider>
        <Center minH="100vh">
          <Heading size="md" color="red.500">{error}</Heading>
        </Center>
      </ChakraProvider>
    );
  }

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
                  candidates={candidates}
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
                engineers={engineers}
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