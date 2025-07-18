// context/VideoPlaybackContext.js
import React, { createContext, useContext, useRef, useState } from 'react';

const VideoPlaybackContext = createContext();

export const useVideoPlayback = () => useContext(VideoPlaybackContext);

export const VideoPlaybackProvider = ({ children }) => {
  const videoRefs = useRef(new Map());
  const [currentVideoId, setCurrentVideoId] = useState(null);

  const registerVideo = (id, ref) => {
    if (id && ref?.current) {
      videoRefs.current.set(id, ref);
    }
  };

  const unregisterVideo = (id) => {
    videoRefs.current.delete(id);
    if (currentVideoId === id) {
      setCurrentVideoId(null);
    }
  };

  const playVideo = async (id) => {
    if (!id || !videoRefs.current.has(id)) return;

    if (currentVideoId && currentVideoId !== id) {
      const currentRef = videoRefs.current.get(currentVideoId);
      try {
        await currentRef?.current?.pauseAsync?.();
      } catch (e) {
        console.warn('Failed to pause previous video:', e);
      }
    }

    const newRef = videoRefs.current.get(id);
    try {
      await newRef?.current?.playAsync?.();
      setCurrentVideoId(id);
    } catch (e) {
      console.warn('Failed to play video:', e);
    }
  };

  const pauseVideo = async (id) => {
    const ref = videoRefs.current.get(id);
    try {
      await ref?.current?.pauseAsync?.();
      if (currentVideoId === id) {
        setCurrentVideoId(null);
      }
    } catch (e) {
      console.warn('Failed to pause video:', e);
    }
  };

  const pauseAllVideos = async () => {
    try {
      for (const ref of videoRefs.current.values()) {
        await ref?.current?.pauseAsync?.();
      }
      setCurrentVideoId(null);
    } catch (e) {
      console.warn('Failed to pause all videos:', e);
    }
  };

  const isVideoPlaying = (id) => currentVideoId === id;

  return (
    <VideoPlaybackContext.Provider
      value={{
        registerVideo,
        unregisterVideo,
        playVideo,
        pauseVideo,
        pauseAllVideos,
        isVideoPlaying,
        currentVideoId,
      }}
    >
      {children}
    </VideoPlaybackContext.Provider>
  );
};
