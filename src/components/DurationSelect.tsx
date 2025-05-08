import { Select, FormControl, FormLabel } from '@chakra-ui/react';

type Duration = 15 | 30 | 60;

interface DurationSelectProps {
  duration: Duration;
  onDurationChange: (duration: Duration) => void;
}

const DurationSelect: React.FC<DurationSelectProps> = ({ duration, onDurationChange }) => {
  return (
    <FormControl>
      <FormLabel>Interview Duration</FormLabel>
      <Select
        value={duration}
        onChange={(e) => onDurationChange(Number(e.target.value) as Duration)}
      >
        <option value={15}>15 minutes</option>
        <option value={30}>30 minutes</option>
        <option value={60}>60 minutes</option>
      </Select>
    </FormControl>
  );
};

export default DurationSelect;