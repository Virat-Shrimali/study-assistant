const handleGeneratePlan = async () => {
  try {
    const apiKey = process.env.REACT_APP_HUGGING_FACE_API_KEY; // Update environment variable

    if (!apiKey) {
      throw new Error('API key is missing');
    }

    const response = await axios.post(
      'https://api-inference.huggingface.co/models/gpt2', // Update model endpoint
      {
        inputs: `You are an expert study planner. Please create a well-structured and detailed study plan based on the following requirements:

1. Subjects to Study: ${subjects}
2. Total Available Study Time: ${time} hours

Instructions for the Study Plan:

1. Breakdown: Distribute the total study time effectively across all subjects. Ensure that each subject receives an adequate amount of time based on its complexity and importance.
2. Daily Schedule: Provide a daily study schedule. Specify the time allocated for each subject each day.
3. Topics to Cover: For each subject, list the key topics or chapters that should be covered within the allocated study time.
4. Breaks and Rest: Include recommendations for breaks and rest periods to ensure efficient studying and avoid burnout.
5. Flexibility: Suggest any adjustments or flexibility in the plan in case of unexpected changes or delays.
6. Additional Tips: Offer any additional tips or strategies for effective studying and retention of information.

Format of the Response:

- Use bullet points or numbered lists for clarity.
- Organize the plan into daily segments.
- Ensure the plan is easy to follow and implement.

Please generate the study plan based on the above instructions.`,
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        }
      }
    );

    // Process the response to extract the generated text
    const plan = response.data[0]?.generated_text || 'No response text';
    setStudyPlan(plan.split('\n')); // Split the response if needed
    setError(null); // Clear previous errors if successful
    setShowPlan(true); // Show the generated study plan
  } catch (err) {
    console.error('Error during API request:', err);
    setError('Failed to generate study plan. Please try again later.');
    setStudyPlan(null); // Clear the study plan if there's an error
    setShowPlan(false); // Hide the study plan on error
  }
};
