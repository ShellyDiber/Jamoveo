// src/App.tsx
import { Routes, Route } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Main from './pages/MainPage';
import AdminSignup from './pages/AdminSignup';
import Results from './pages/ResultsAdmin';
import LivePage from './pages/Live';


function App() {
  return (
    <Routes>
      <Route path="/main" element={<Main />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/adminSignup" element={<AdminSignup />} />
      <Route path="/results" element={<Results />} /> 
      <Route path="/live" element={<LivePage />} /> 
    </Routes>
  );
}

export default App;
