// src/App.tsx
import { Routes, Route } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Main from './pages/MainPage';
import AdminSignup from './pages/AdminSignup';
import Results from './pages/ResultsAdmin';
import LivePage from './pages/Live';
import { useSong } from './context/songContext';


function App() {

const { user} = useSong();
console.log('Current user:', user);

if (!user) {
    // If user is not logged in, redirect to login page
    return (
      <Routes>
    <Route path="/signup" element={<Signup />} />
    <Route path="/adminSignup" element={<AdminSignup />} />
    <Route path="*" element={<Login />} />
    
    </Routes>
    )
  }else{

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/main" element={<Main />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/adminSignup" element={<AdminSignup />} />
      <Route path="/results" element={<Results />} /> 
      <Route path="/live" element={<LivePage />} /> 
      <Route path="*" element={<Login />} />
    </Routes>
  );
}
}
export default App;
