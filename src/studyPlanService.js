import axios from 'axios';

export const generateStudyPlan = async (time, subjects) => {
  try {
    const response = await axios.post('/api/generate-study-plan', { time, subjects });
    return response.data.studyPlan;
  } catch (error) {
    console.error('Error generating study plan:', error);
    return [];
  }
};
