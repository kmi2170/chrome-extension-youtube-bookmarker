import React from 'react';

import useChromeApi from '../../chrome-api/hook';
// import VideoBookmarkItem from './popup-parts/videoBookmarkItem';
// import TimeStamps from './popup-parts/timeStamps';
import NotYoutubePage from './popup-components/notYoutube';
import './popup.css';
import YoutubePage from './popup-components/youtubePage';
import YoutubeWatchPage from './popup-components/youtubeWatchPage';

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
    <div className="flex flex-col justify-center p-8">
      <h1 className="text-3xl font-bold text-indigo-500 mb-4">
        Youtube Timestamp Bookmarker
      </h1>

      {isYoutubeWatchPage && (
        <div className="mt-2 p-1 pl-3 pr-3 font-bold text-2xl  rounde-md">
          <YoutubeWatchPage
            tabId={activeTabId as number}
            isVideoBookmarked={isCurrentVideoBookmarked}
            videoId={currentVideoId as string}
            videoTitle={currentVideoTitle}
            videoUrl={currentVideoUrl}
            videoBookmarks={currentVideoBookmarks}
            setVideoBookmarks={setCurrentVideoBookmarks}
          />
        </div>
      )}
      <YoutubePage
        videoBookmarks={currentVideoBookmarks}
        setVideoBookmarks={setCurrentVideoBookmarks}
        excludeVideoId={isYoutubePage && (currentVideoId as string)}
        isVideoListAcive={!isYoutubeWatchPage}
      />
    </div>
  );
};

export default Popup;
