
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import io from 'socket.io-client';
import { useSong } from '../context/songContext';
import { backendServerURL } from '../config';

type Song = {
  id: string;
  title: string;
  artist: string;
  image?: string;
  content: string;
  rtl: boolean;
};

const Results: React.FC = () => {
  
  const [searchParams] = useSearchParams();
  const [songs, setSongs] = useState<Song[]>([]);
  const query = searchParams.get('query') || '';
  const navigate = useNavigate();
  const { setCurrentSong } = useSong();

  


// Fetch songs based on the query parameter
useEffect(() => {
 
  const fetchSongs = async () => {
    try {
      const res = await fetch(`${backendServerURL}/api/songs?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setSongs(data);
      } else {
        console.error('Unexpected response:', data);
        setSongs([]);
      }
    } catch (err) {
      console.error('Error fetching songs:', err);
      setSongs([]);
    }
  };

  if (query) {
    fetchSongs();
  }
}, [query]);

   const socket = io(backendServerURL );



// const handleSongSelect = (song: Song)=> {
//   console.log(`Selected song: ${song.title} by ${song.artist}`);
//   socket.emit('play-song', song); // sends the selected song to the server
//   //localStorage.setItem('currentSong', JSON.stringify(song)); // save the current song to localStorage
//   setCurrentSong(song);
//   navigate('/live');
// };

const handleSongSelect = (song: Song) => {
  console.log(`Selected song: ${song.title} by ${song.artist}`);

  const parsedContent = JSON.parse(song.content);

  socket.emit('play-song', { ...song, content: parsedContent });
  setCurrentSong({ ...song, content: parsedContent });
  navigate('/live');
};




  return (
    <div style={styles.page}>
      <h1>Search Results</h1>
      <div style={styles.list}>
        {songs.map((song) => (
          <div
            key={song.id}
            style={styles.card}
            onClick={() => handleSongSelect(song)}
          >
            {song.image && <img src={song.image} alt={song.title} style={styles.image} />}
            <div>
              <h3>{song.title}</h3>
              <p>{song.artist}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    padding: '2rem',
    fontFamily: 'sans-serif',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    maxWidth: '600px',
    margin: '0 auto',
  },
  card: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem',
    border: '1px solid #ccc',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  },
  image: {
    width: '60px',
    height: '60px',
    borderRadius: '8px',
    objectFit: 'cover',
  },
};

export default Results;


