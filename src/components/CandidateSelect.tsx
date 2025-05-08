import { Select } from '@chakra-ui/react';
import { Candidate } from '../types';

interface CandidateSelectProps {
  candidates: Candidate[];
  selectedCandidate: Candidate | null;
  onSelect: (candidate: Candidate | null) => void;
}

const CandidateSelect: React.FC<CandidateSelectProps> = ({
  candidates,
  selectedCandidate,
  onSelect,
}) => {
  return (
    <Select
      placeholder="Select a candidate"
      value={selectedCandidate?.id || ''}
      onChange={(e) => {
        const candidate = candidates.find(
          (c) => c.id === parseInt(e.target.value)
        ) || null;
        onSelect(candidate);
      }}
      mt={8}
    >
      {candidates.map((candidate) => (
        <option key={candidate.id} value={candidate.id}>
          {candidate.name}
        </option>
      ))}
    </Select>
  );
};

export default CandidateSelect;