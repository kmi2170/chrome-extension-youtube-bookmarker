import React, { useEffect, useState } from 'react';
import ReactTooltip from 'react-tooltip';

import { getActiveTabURL } from '../chrome-tabs';
import './popup.css';

type Bookmark = { time: number; desc: string };

const Popup = () => {
  const [activeTabId, setActiveTabId] = useState<number | null>(null);
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);
  const [currentVideoTitle, setCurrentVideoTitle] = useState('');
  const [currentVideoBookmarks, setCurrentVideoBookmarks] = useState<
    Bookmark[]
  >([]);
  const [isYoutubePage, setIsYoutubePage] = useState(false);

  const handlePlay = () => {
    console.log('play');
  };
  console.log(activeTabId);

  const handleDelete = (t: number) => {
    console.log('delete', t);
    const newVideoBookmarks = currentVideoBookmarks.filter(
      ({ time }) => time !== t
    );

    setCurrentVideoBookmarks(newVideoBookmarks);

    chrome.tabs.sendMessage(activeTabId as number, {
      type: 'DELETE',
      value: t,
    });
  };

  const getCurrentVideoInfo = async () => {
    const activeTab = await getActiveTabURL();

    if (!activeTab.url?.includes('youtube.com/watch')) {
      setIsYoutubePage(false);
      return;
    }

    const queryParameters = activeTab.url?.split('?')[1];
    const urlParameters = new URLSearchParams(queryParameters);
    const videoId = urlParameters.get('v');

    if (videoId) {
      setActiveTabId(activeTab.id as number);
      setCurrentVideoTitle(activeTab.title as string);
      setCurrentVideoId(videoId);
      chrome.storage.sync.get([videoId], (data) => {
        const videoBookmarks = data[videoId] ? JSON.parse(data[videoId]) : [];
        setCurrentVideoBookmarks(videoBookmarks);
      });
    }

    setIsYoutubePage(true);
  };

  // const messageListener = (obj, sende, response) => {
  //   console.log(obj);
  //   const { type, value, videoId } = obj;
  //   setState(videoId);
  // };

  useEffect(() => {
    getCurrentVideoInfo();
    // chrome.storage.onChanged.addListener(function (changes, namespace) {
    //   for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    //     console.log(
    //       `Storage key "${key}" in namespace "${namespace}" changed.`,
    //       `Old value was "${oldValue}", new value is "${newValue}".`
    //     );
    //   }
    // });
    // chrome.runtime.onMessage.addListener(messageListener);
    // return () => {
    //   chrome.runtime.onMessage.removeListener(messageListener);
    // };
  }, []);
  console.log({ currentVideoId });
  console.log({ currentVideoBookmarks });

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
                  onClick={handlePlay}
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
