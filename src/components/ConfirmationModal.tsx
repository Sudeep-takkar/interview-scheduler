import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  VStack,
} from '@chakra-ui/react';
import { InterviewSlot, Candidate } from '../types';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  slot: InterviewSlot | null;
  candidate: Candidate | null;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  slot,
  candidate,
}) => {
  if (!slot || !candidate) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Confirm Interview</ModalHeader>
        <ModalBody>
          <VStack align="stretch" spacing={3}>
            <Text>
              <strong>Candidate:</strong> {candidate.name}
            </Text>
            <Text>
              <strong>Engineer:</strong> {slot.engineer.name}
            </Text>
            <Text>
              <strong>Time:</strong> {slot.timeSlot.day} at{' '}
              {slot.timeSlot.startTime}
            </Text>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="blue" onClick={onConfirm}>
            Confirm
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ConfirmationModal;