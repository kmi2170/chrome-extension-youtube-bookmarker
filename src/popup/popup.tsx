import React from 'react';

import useChromeApi from '../chrome-api/hook';
import NotYoutubePage from './popup-components/notYoutube';
import CurrentVideo from './popup-components/currentVideo';
import VideosList from './popup-components/videosList';
import './popup.css';

const Popup = () => {
  const {
    activeTabId,
    currentVideoId,
    currentVideoTitle,
    currentVideoUrl,
    currentVideoBookmarks,
    isYoutubePage,
    isYoutubeWatchPage,
    setCurrentVideoBookmarks,
  } = useChromeApi();
  console.log(currentVideoBookmarks);

  if (!isYoutubePage) {
    return <NotYoutubePage />;
  }

  const isCurrentVideoBookmarked =
    currentVideoBookmarks.filter(({ id }) => id === currentVideoId).length ===
    1;

  return (
    <div className="flex flex-col justify-center p-8 w-full">
      <h1 className="text-3xl font-bold text-indigo-500 mb-4">
        Youtube Timestamp Bookmarker
      </h1>

      {isYoutubeWatchPage && (
        <CurrentVideo
          tabId={activeTabId as number}
          isVideoBookmarked={isCurrentVideoBookmarked}
          videoId={currentVideoId as string}
          videoTitle={currentVideoTitle}
          videoUrl={currentVideoUrl}
          videoBookmarks={currentVideoBookmarks}
          setVideoBookmarks={setCurrentVideoBookmarks}
        />
      )}

      <VideosList
        tabId={activeTabId as number}
        videoBookmarks={currentVideoBookmarks}
        setVideoBookmarks={setCurrentVideoBookmarks}
        excludeVideoId={isYoutubePage && (currentVideoId as string)}
      />
    </div>
  );
};

export default Popup;
