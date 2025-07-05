// src/pages/Live.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Live.css';
import { io, Socket } from 'socket.io-client';
import { useSong } from '../context/songContext';



// // Types
// interface SongLine {
//   lyrics: string;
//   chords?: string;
//}

// interface SongContent {
//   title: string;
//   artist: string;
//   content: SongLine[][];  // Array of arrays for each line
//   rtl: boolean;
// }



const LivePage: React.FC = () => {
  const navigate = useNavigate();
//   const [song, setSong] = useState<SongContent | null>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollInterval, setScrollInterval] = useState<NodeJS.Timeout | null>(null);
  const { currentSong: song, setCurrentSong, user } = useSong();
  
  //const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  const role = user?.role;
  const isSinger = user?.instrument === 'vocals';

  
//     useEffect(() => {
//   const fetchSong = async () => {
//     const res = await fetch('http://localhost:3000/songs/play/2');
//     if (res.ok) {
//       const data = await res.json();
//         // Parse the content field to convert it from string to JSON
//       const parsedContent = JSON.parse(data.content);

//       setSong({ ...data, content: parsedContent });
//     }
//   };

//   fetchSong();
// }, []);



useEffect(() => {
  const socket: Socket = io('http://localhost:3000');

  socket.on('new-song', (data) => {
    try {
      const parsedContent = JSON.parse(data.content);
      setCurrentSong({ ...data, content: parsedContent });
      console.log('Received new song via socket:', data.title);
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
}, [navigate,setCurrentSong]);






// useEffect(() => {
//     const saved = localStorage.getItem('currentSong');
//   if (saved) {
//     try {
//       const parsed = JSON.parse(saved);
//       parsed.content = JSON.parse(parsed.content); // Parse nested content
//       setSong(parsed);
//     } catch (err) {
//       console.error('Failed to load saved song from localStorage', err);
//     }
//   }


//   const socket: Socket = io('http://localhost:3000'); 

//   socket.on('new-song', (data) => {
//     try {
//       const parsedContent = JSON.parse(data.content);
//       setSong({ ...data, content: parsedContent });
//       localStorage.setItem('currentSong', JSON.stringify(data));
//       console.log('Received new song:', data.title, 'by', data.artist);
//     } catch (e) {
//       console.error('Failed to parse song content:', e);
//     }
//   });

//   return () => {
//     socket.disconnect(); // disconnect the socket when the component unmounts
//   };
// }, []);



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
    const socket: Socket = io('http://localhost:3000');
    socket.emit('quit-song');
    setTimeout(() => navigate('/main'), 200); // let it broadcast before leaving
  };

  return (
  <div className={`live-page ${song?.rtl ? 'rtl' : ''}`}>
    {song ? (
      <>
        <h1 className="song-title">{song.title}</h1>
        <h2 className="song-artist">{song.artist}</h2>

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
