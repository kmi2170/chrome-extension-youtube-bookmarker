import React from 'react';
import ReactTooltip from 'react-tooltip';

import useChromeApi from '../chrome-api/hook';
import { Bookmark } from '../chrome-api/types';
import './popup.css';

const Popup = () => {
  const {
    activeTabId,
    currentVideoId,
    currentVideoTitle,
    currentVideoBookmarks,
    isYoutubePage,
    setCurrentVideoBookmarks,
  } = useChromeApi();

  const handlePlay = (t: number) => {
    console.log('play', t, activeTabId);
    chrome.tabs.sendMessage(activeTabId as number, {
      type: 'PLAY',
      value: t,
    });
  };

  const handleDelete = (t: number) => {
    console.log('delete', t, activeTabId);
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
      <div className="flex justify-center mt-8">
        <p className="text-2xl text-red-900 ">This is not a Youtube page.</p>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-3xl text-green-500">Youtube Timestamp Bookmarker</h1>
      <h3>{currentVideoTitle}</h3>
      <h4>{currentVideoId}</h4>

      {currentVideoBookmarks?.length > 0 ? (
        currentVideoBookmarks.map(({ time, desc }: Bookmark, i) => {
          return (
            <div key={i} className="flex justify-center items-center">
              <a data-tip="Play" data-for="play">
                <img
                  src="assets/icon-play.png"
                  alt="play"
                  width="30px"
                  height="30px"
                  className="mr-2 hover:cursor-pointer"
                  onClick={() => handlePlay(time)}
                />
              </a>
              <ReactTooltip id="play" place="top" type="dark" effect="float" />

              <div className="text-2xl">{desc}</div>

              <a data-tip="Delete" data-for="delete">
                <img
                  src="assets/icon-delete.png"
                  alt="delete"
                  width="20px"
                  height="20px"
                  className="ml-2 hover:cursor-pointer"
                  onClick={() => handleDelete(time)}
                />
              </a>
              <ReactTooltip
                id="delete"
                place="top"
                type="dark"
                effect="float"
              />
            </div>
          );
        })
      ) : (
        <i className="text-2xl">No Bookmarks to Show</i>
      )}
    </>
  );
};

export default Popup;
