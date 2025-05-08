import { Engineer, Candidate } from '../types';

const generateAvailability = () => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const day = days[Math.floor(Math.random() * days.length)];
  
  return [{
    day,
    startTime: "09:00",
    endTime: "17:00"
  }];
};

export const fetchEngineers = async (): Promise<Engineer[]> => {
  const response = await fetch('https://dummyjson.com/users?limit=5');
  const data = await response.json();
  
  return data.users.map((user: any) => ({
    id: user.id,
    name: `${user.firstName} ${user.lastName}`,
    availability: generateAvailability()
  }));
};

export const fetchCandidates = async (): Promise<Candidate[]> => {
  const response = await fetch('https://dummyjson.com/users?skip=5&limit=5');
  const data = await response.json();
  
  return data.users.map((user: any) => ({
    id: user.id,
    name: `${user.firstName} ${user.lastName}`,
    preferredTime: generateAvailability()[0]
  }));
};