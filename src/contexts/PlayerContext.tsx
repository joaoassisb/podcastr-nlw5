import { createContext, ReactNode, useContext, useState } from "react";

type Episode = {
  id: string;
  title: string;
  members: string;
  thumbnail: string;
  description: string;
  duration: number;
  durationAsString: string;
  url: string;
  publishedAt: string;
};

type PlayerContextData = {
  episodes: Episode[];
  currentEpisodeIndex: number;
  isPlaying: boolean;
  isLooping: boolean;
  isShuffling: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
  play: (episode: Episode) => void;
  playList: (list: Episode[], index: number) => void;
  togglePlay: () => void;
  toggleLoop: () => void;
  toggleShuffle: () => void;
  setPlayingState: (state: boolean) => void;
  nextEpisode: () => void;
  previousEpisode: () => void;
};

export const PlayerContext = createContext({} as PlayerContextData);

type PlayerContextProviderProps = {
  children: ReactNode;
};

export function PlayerContextProvider({
  children,
}: PlayerContextProviderProps) {
  const [episodes, setEpisodes] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);

  function play(episode: Episode) {
    setEpisodes([episode]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(true);
  }

  function playList(list: Episode[], index: number) {
    setEpisodes(list);
    setCurrentEpisodeIndex(index);
    setIsPlaying(true);
  }

  function togglePlay() {
    setIsPlaying(!isPlaying);
  }

  function toggleLoop() {
    setIsLooping(!isLooping);
  }

  function toggleShuffle() {
    setIsShuffling(!isShuffling);
  }

  function setPlayingState(state: boolean) {
    setIsPlaying(state);
  }

  function nextEpisode() {
    if (isShuffling) {
      const nextIndex = Math.floor(Math.random() * episodes.length);
      setCurrentEpisodeIndex(nextIndex);
    } else if (hasNext) {
      setCurrentEpisodeIndex((value) => value + 1);
    } else {
      setEpisodes([]);
      setCurrentEpisodeIndex(0);
    }
  }

  function previousEpisode() {
    if (hasPrevious) {
      setCurrentEpisodeIndex((value) => value - 1);
    }
  }

  const hasNext = isShuffling || currentEpisodeIndex + 1 < episodes.length;
  const hasPrevious = currentEpisodeIndex > 0;

  return (
    <PlayerContext.Provider
      value={{
        episodes,
        currentEpisodeIndex,
        isPlaying,
        isLooping,
        isShuffling,
        hasNext,
        hasPrevious,
        play,
        togglePlay,
        toggleLoop,
        toggleShuffle,
        setPlayingState,
        playList,
        nextEpisode,
        previousEpisode,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export const usePlayer = () => useContext(PlayerContext);
