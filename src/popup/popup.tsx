import React from 'react';

import useChromeApi from '../chrome-api/hook';
import VideoBookmarkItem from './popup-parts/videoBookmarkItem';
import TimeStamps from './popup-parts/timeStamps';
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
    return (
      <div className="flex justify-center m-8">
        <p className="text-2xl text-red-600 ">This is not a Youtube page.</p>
      </div>
    );
  }

  const isCurrentVideoBookmarked =
    currentVideoBookmarks.filter(({ id }) => id === currentVideoId).length ===
    1;

  return (
    <div className="flex flex-col justify-center p-8">
      <h1 className="text-3xl font-bold text-indigo-500 mb-4">
        Youtube Timestamp Bookmarker
      </h1>

      {isYoutubeWatchPage ? (
        <div className="mt-2 p-1 pl-3 pr-3 font-bold text-2xl  rounde-md">
          {isCurrentVideoBookmarked ? (
            <>
              <VideoBookmarkItem
                videoId={currentVideoId as string}
                videoTitle={currentVideoTitle}
                videoUrl={currentVideoUrl}
                videoBookmarks={currentVideoBookmarks}
                setVideoBookmarks={setCurrentVideoBookmarks}
                active
              />
              <TimeStamps
                tabId={activeTabId}
                videoId={currentVideoId}
                videoBookmarks={currentVideoBookmarks}
                setVideoBookmarks={setCurrentVideoBookmarks}
              />
            </>
          ) : (
            <div className="flex justify-center ">
              <h2 className="text-2xl mt-2 mb-3">
                Current Page is not Bookmarked
              </h2>
            </div>
          )}
          {currentVideoBookmarks.map(({ id, title, url }) => {
            if (id !== currentVideoId) {
              return (
                <VideoBookmarkItem
                  key={id}
                  videoId={id}
                  videoTitle={title}
                  videoUrl={url}
                  videoBookmarks={currentVideoBookmarks}
                  setVideoBookmarks={setCurrentVideoBookmarks}
                />
              );
            }
          })}
        </div>
      ) : (
        <div className="">
          {currentVideoBookmarks.length > 0 ? (
            currentVideoBookmarks.map(({ id, title, url }) => (
              <VideoBookmarkItem
                key={id}
                videoId={id}
                videoTitle={title}
                videoUrl={url}
                videoBookmarks={currentVideoBookmarks}
                setVideoBookmarks={setCurrentVideoBookmarks}
                active
              />
            ))
          ) : (
            <div className="flex justify-center ">
              <h2 className="text-2xl mt-2 mb-3">No bookmarks to show</h2>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Popup;
