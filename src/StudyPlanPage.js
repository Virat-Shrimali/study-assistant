import axios from 'axios';
import { useState, useRef, useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';
import jsPDF from 'jspdf';
import './StudyPlanPage.css';

function StudyPlanPage() {
  const [time, setTime] = useState('');
  const [subjects, setSubjects] = useState('');
  const [studyPlan, setStudyPlan] = useState(null);
  const [error, setError] = useState(null);
  const [showPlan, setShowPlan] = useState(false);

  const planRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (planRef.current && !planRef.current.contains(event.target)) {
        setShowPlan(false);
        setTime('');
        setSubjects('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleGeneratePlan = async () => {
    try {
      const apiKey = process.env.REACT_APP_HUGGING_FACE_API_KEY;

      if (!apiKey) {
        throw new Error('API key is missing');
      }

      const response = await axios.post(
        'https://api-inference.huggingface.co/models/gpt2',
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
- Ensure the plan is easy to follow and implement.`,
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          }
        }
      );

      const plan = response.data[0]?.generated_text || 'No response text';
      setStudyPlan(plan.split('\n'));
      setError(null);
      setShowPlan(true);
    } catch (err) {
      console.error('Error during API request:', err);
      setError('Failed to generate study plan. Please try again later.');
      setStudyPlan(null);
      setShowPlan(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!studyPlan) return;

    const doc = new jsPDF();
    doc.setFont('Poppins', 'normal');
    doc.setFontSize(12);
    
    doc.text('Study Plan', 10, 10);
    let y = 20;

    studyPlan.forEach((line, index) => {
      if (y > 270) {
        doc.addPage();
        y = 10;
      }
      doc.text(line, 10, y);
      y += 10;
    });

    doc.save('study-plan.pdf');
  };

  return (
    <div className="study-plan-container">
      <h1>Study Plan Generator</h1>
      <form onSubmit={(e) => { e.preventDefault(); handleGeneratePlan(); }}>
        <label htmlFor="time">Total Study Time (hours):</label>
        <input
          type="number"
          id="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />

        <label htmlFor="subjects">Subjects to Study:</label>
        <input
          type="text"
          id="subjects"
          value={subjects}
          onChange={(e) => setSubjects(e.target.value)}
        />

        <button type="submit">Generate Study Plan</button>
      </form>

      {showPlan && (
        <div className="plan-output" ref={planRef}>
          <h2>Study Plan</h2>
          <ul>
            {studyPlan.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
          <button className="download-btn" onClick={handleDownloadPDF}>Download as PDF</button>
        </div>
      )}

      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default StudyPlanPage;
