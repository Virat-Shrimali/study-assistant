import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './HomePage';
import StudyPlanPage from './StudyPlanPage';
import QuizPage from './QuizPage';
import Navbar from './Navbar'; // Import the Navbar component

function App() {
  return (
    <Router>
      <div>
        {/* Navbar will appear on every page */}
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/study-plan" element={<StudyPlanPage />} />
          <Route path="/quiz" element={<QuizPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
