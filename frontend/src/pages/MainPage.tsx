
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Main.css';
import { Socket } from 'socket.io-client';
import { useSong } from '../context/songContext';
import { getWebSocket } from '../utils';

const MainPage: React.FC = () => {
  const navigate = useNavigate();
  //const user = JSON.parse(localStorage.getItem('user') || '{}');
  const { user, setCurrentSong } = useSong();
  const role = user?.role;
  const [query, setQuery] = useState('');

  useEffect(() => {
    let socket: Socket | undefined;
    if (role !== 'admin') {
      socket = getWebSocket();

      socket.on('new-song', (data) => {
        console.log('New song received by socket:', data.title);
        // localStorage.setItem('currentSong', JSON.stringify(data));
        const parsed = { ...data};
        setCurrentSong(parsed);
        navigate('/live');
      });
    }

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [role, navigate,  setCurrentSong]);

  const handleSearch = () => {
    if (query.trim() !== '') {
      navigate(`/results?query=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className={`main-container ${role !== 'admin' ? 'waiting-container' : ''}`}>
      <div className="main-box">
        {role === 'admin' ? (
          <>
            <h2 className="admin-title">Search any song...</h2>
            <input
              type="text"
              placeholder="Enter song name or artist"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="admin-input"
            />
            <button onClick={handleSearch} className="admin-button">
              Search
            </button>
          </>
        ) : (
          <h2 className="waiting-text">Waiting for next song...</h2>
        )}
      </div>
    </div>
  );
};

export default MainPage;
