// SongContext.tsx
import React, { createContext, useContext, useState } from 'react';

interface SongLine {
  lyrics: string;
  chords?: string;
}
interface Song {
  title: string;
  artist: string;
  content: SongLine[][];
  rtl: boolean;
}

interface User{
    role : string;
    instrument: string;
    token: string;
}

interface SongContextType {
  currentSong: Song | null;
  setCurrentSong: (song: Song | null) => void;
  user: User | null;
  setUser: (user: User | null) => void;
}



const SongContext = createContext<SongContextType | undefined>(undefined);

export const SongProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [user, setUser] = useState<User | null>(null);

  return (
    <SongContext.Provider value={{ currentSong, setCurrentSong, user, setUser }}>
      {children}
    </SongContext.Provider>
  );
};

export const useSong = () => {
  const context = useContext(SongContext);
  if (!context) throw new Error("useSong must be used within a SongProvider");
  return context;
};
