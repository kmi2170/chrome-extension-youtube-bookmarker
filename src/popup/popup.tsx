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

  const handlePlay = (t: number) => {
    chrome.tabs.sendMessage(activeTabId as number, {
      type: 'PLAY',
      value: t,
    });
  };

  const handleDelete = (t: number) => {
    const newVideoBookmarks = currentVideoBookmarks.filter(
      ({ time }) => time !== t
    );
    setCurrentVideoBookmarks(newVideoBookmarks);
    chrome.tabs.sendMessage(activeTabId as number, {
      type: 'DELETE',
      value: t,
    });
  };

  if (!isYoutubePage) {
    return (
      <div className="flex justify-center m-8">
        <p className="text-2xl text-red-600 ">This is not a Youtube page.</p>
      </div>
    );
  }
  console.log(isYoutubeWatchPage);
  console.log(currentVideoBookmarks);

  return (
    <div className="flex flex-col justify-center p-8">
      <h1 className="text-3xl font-bold text-indigo-500 mb-4">
        Youtube Timestamp Bookmarker
      </h1>

      {isYoutubeWatchPage ? (
        <h2 className="mt-2 p-1 pl-3 pr-3 font-bold text-2xl  rounde-md">
          <VideoBookmarkItem
            id={currentVideoId as string}
            title={currentVideoTitle}
            url={currentVideoUrl}
          />
          <TimeStamps
            videoBookmarks={currentVideoBookmarks}
            videoId={currentVideoId}
          />
        </h2>
      ) : (
        <div className="">
          {currentVideoBookmarks.map(({ id, title, url }) => (
            <VideoBookmarkItem id={id} title={title} url={url} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Popup;
