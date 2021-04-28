import { useEffect, useRef, useState } from "react";
import { usePlayer } from "../../contexts/PlayerContext";
import Image from "next/image";
import styles from "./style.module.scss";

import Slider from "rc-slider";

import "rc-slider/assets/index.css";
import { convertDurationToTimeString } from "../../utils/convertDurationToTimeString";
import next from "next";

export function Player() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = useState(0);

  const {
    episodes,
    currentEpisodeIndex,
    isPlaying,
    isLooping,
    isShuffling,
    hasNext,
    hasPrevious,
    togglePlay,
    toggleLoop,
    toggleShuffle,
    setPlayingState,
    nextEpisode,
    previousEpisode,
  } = usePlayer();

  const episode = episodes[currentEpisodeIndex];

  function setupProgressListener() {
    audioRef.current.currentTime = 0;

    audioRef.current.addEventListener("timeupdate", () => {
      setProgress(Math.floor(audioRef.current.currentTime));
    });
  }

  function handleSliderChange(newValue) {
    audioRef.current.currentTime = newValue;
    setProgress(newValue);
  }

  function handleEpisodeEnd() {
    nextEpisode();
    setProgress(0);
  }

  useEffect(() => {
    if (!audioRef.current) {
      return;
    }

    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  return (
    <div className={styles.playerContainer}>
      <header>
        <img src="/playing.svg" alt="Tocando agora" />
        <strong>Tocando agora</strong>
      </header>

      {episode ? (
        <div className={styles.currentEpisode}>
          <Image
            width={592}
            height={592}
            src={episode.thumbnail}
            objectFit="cover"
          />
          <strong>{episode.title}</strong>
          <span>{episode.members}</span>
        </div>
      ) : (
        <div className={styles.emptyPlayer}>
          <strong>Selecione um podcast para ouvir</strong>
        </div>
      )}

      <footer className={styles.empty}>
        <div className={styles.progress}>
          <span>{convertDurationToTimeString(progress)}</span>

          {episode ? (
            <Slider
              max={episode.duration}
              value={progress}
              trackStyle={{ backgroundColor: "#04d361" }}
              railStyle={{ backgroundColor: "#9f75ff" }}
              handleStyle={{ borderBlockColor: "#04d361", borderWidth: 4 }}
              onChange={handleSliderChange}
            />
          ) : (
            <div className={styles.emptySlider} />
          )}

          <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
        </div>

        {episode && (
          <audio
            src={episode.url}
            autoPlay
            ref={audioRef}
            loop={isLooping}
            onPlay={() => setPlayingState(true)}
            onPause={() => setPlayingState(false)}
            onLoadedMetadata={setupProgressListener}
            onEnded={handleEpisodeEnd}
          />
        )}

        <div className={styles.buttons}>
          <button
            type="button"
            disabled={!episode || episodes.length === 1}
            onClick={toggleShuffle}
            className={isShuffling ? styles.isActive : ""}
          >
            <img src="/shuffle.svg" alt="Embaralhar" />
          </button>

          <button
            type="button"
            disabled={!episode || !hasPrevious}
            onClick={previousEpisode}
          >
            <img src="/play-previous.svg" alt="Tocar anterior" />
          </button>

          <button
            type="button"
            className={styles.playButton}
            disabled={!episode}
            onClick={togglePlay}
          >
            {isPlaying ? (
              <img src="/pause.svg" alt="Pausar" />
            ) : (
              <img src="/play.svg" alt="Tocar" />
            )}
          </button>

          <button
            type="button"
            disabled={!episode || !hasNext}
            onClick={nextEpisode}
          >
            <img src="/play-next.svg" alt="Tocar próxima" />
          </button>

          <button
            type="button"
            disabled={!episode}
            onClick={toggleLoop}
            className={isLooping ? styles.isActive : ""}
          >
            <img src="/repeat.svg" alt="Repetir" />
          </button>
        </div>
      </footer>
    </div>
  );
}
