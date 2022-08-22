import React, { useEffect, useState } from 'react';

import useChromeApi from '../chrome-api/hook';
import NotYoutubePage from './components/notYoutube';
import CurrentVideo from './components/currentVideo';
import VideosList from './components/videosList';
import './popup.css';
import { fetchOptions } from '../chrome-api/storage/options';

const key = 'yt-bookmarks-options';

const Popup = () => {
  const [isAllPages, setIsAllPages] = useState(false);

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

  useEffect(() => {
    fetchOptions(key)
      .then((data) => setIsAllPages(data))
      .catch((error) => console.error(error));
  }, []);

  if (!isYoutubePage && !isAllPages) {
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
        videoBookmarks={currentVideoBookmarks}
        setVideoBookmarks={setCurrentVideoBookmarks}
        excludeVideoId={isYoutubePage ? (currentVideoId as string) : undefined}
      />
    </div>
  );
};

export default Popup;
