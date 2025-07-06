
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSong } from '../context/songContext';
import { backendServerURL } from '../config';
import '../styles/Results.css';
import { getWebSocket } from '../utils';

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

   const socket = getWebSocket();;


const handleSongSelect = (song: Song) => {
  console.log(`Selected song: ${song.title} by ${song.artist}`);

  const parsedContent = JSON.parse(song.content);

  socket.emit('play-song', { ...song, content: parsedContent });
  setCurrentSong({ ...song, content: parsedContent });
  navigate('/live');
};



return (
  <div className="results-page">
    <h1>Search Results</h1>

    {songs.length === 0 ? (
      <div className="no-results">No songs found for "{query}"</div>
    ) : (
      <div className="song-list">
        {songs.map((song) => (
          <div
            key={song.id}
            className="song-card"
            onClick={() => handleSongSelect(song)}
          >
            {song.image && (
              <img src={song.image} alt={song.title} className="song-image" />
            )}
            <div>
              <h3>{song.title}</h3>
              <p>{song.artist}</p>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);
}
export default Results;


