// src/pages/Live.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSong } from '../context/songContext';
import { getWebSocket } from '../utils';
import '../styles/Live.css';



const LivePage: React.FC = () => {
  const navigate = useNavigate();
  //   const [song, setSong] = useState<SongContent | null>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollInterval, setScrollInterval] = useState<any | null>(null);
  const { currentSong: song, setCurrentSong, user } = useSong();

  //const user = JSON.parse(localStorage.getItem('user') || '{}');

  const role = user?.role;
  const isSinger = user?.instrument === 'vocals';




  useEffect(() => {
    const socket = getWebSocket();

    socket.on('new-song', (data) => {
      try {
        const parsedContent = JSON.parse(data.content);
        setCurrentSong({ ...data, content: parsedContent });
        console.log('Received new song via socket:', data.title);
        setIsScrolling(false);
      } catch (e) {
        console.error('Failed to parse song content:', e);
      }
    });

    socket.on('song-ended', () => {
      console.log('Song ended, going back to main...');
      setCurrentSong(null);
      navigate('/main');
    });


    return () => {
      socket.disconnect();
    };
  }, [navigate, setCurrentSong]);




  // Toggle scroll behavior
  const toggleScroll = () => {
    if (isScrolling) {
      if (scrollInterval) clearInterval(scrollInterval);
      setScrollInterval(null);
    } else {
      const interval = setInterval(() => {
        window.scrollBy({ top: 1, behavior: 'smooth' });
      }, 100);
      setScrollInterval(interval);
    }
    setIsScrolling(!isScrolling);
  };

  // Admin quit button handler
  const handleQuit = () => {
    const socket = getWebSocket();
    socket.emit('quit-song');
    setTimeout(() => navigate('/main'), 200); // let it broadcast before leaving
  };

  return (
    <div className={`live-page ${song?.rtl ? 'rtl' : ''}`}>
      {song ? (
        <>
          <div className="song-title">{song.title}</div>
          <div className="song-artist">{song.artist}</div>

          <div className="song-lines">
            {song.content.map((lineGroup, idx) => (
              <div key={idx} className="song-line">
                {/* chords line */}
                <div className="line-group">
                  {lineGroup.map((word, i) => (
                    <div key={i} className="word-block">
                      {!isSinger && <div className="chord-word">{word.chords || '\u00A0'}</div>}
                      <div className="lyric-word">{word.lyrics}</div>
                    </div>
                  ))}
                </div>

              </div>
            ))}
          </div>

          <button className="floating-button" onClick={toggleScroll}>
            {isScrolling ? 'Stop Scroll' : 'Start Scroll'}
          </button>
          {role === 'admin' && (
            <button className="quit-button" onClick={handleQuit}>
              Quit
            </button>
          )}
        </>
      ) : (
        <div className="waiting-text"> live </div>
      )}
    </div>
  );
}

export default LivePage;
