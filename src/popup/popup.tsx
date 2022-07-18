import React, { useEffect, useState } from 'react';
import { getActiveTabURL } from '../chrome-tabs';
import './popup.css';

const Popup = () => {
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);
  const [currentVideoTitle, setCurrentVideoTitle] = useState('');
  const [currentVideoBookmarks, setCurrentVideoBookmarks] = useState<string[]>(
    []
  );
  const [isYoutubePage, setIsYoutubePage] = useState(false);

  const getCurrentVideoInfo = async () => {
    const activeTab = await getActiveTabURL();

    if (!activeTab.url?.includes('youtube.com/watch')) {
      setIsYoutubePage(false);
      return;
    }

    console.log(activeTab);
    const queryParameters = activeTab.url?.split('?')[1];
    const urlParameters = new URLSearchParams(queryParameters);
    const videoId = urlParameters.get('v');

    if (videoId) {
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
    // chrome.runtime.onMessage.addListener(messageListener);
    // return () => {
    //   chrome.runtime.onMessage.removeListener(messageListener);
    // };
  }, []);

  if (!isYoutubePage) {
    return (
      <div className="flex justify-center mt-8">
        <p className="text-3xl text-red-900 ">This is not a Youtube page.</p>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-3xl text-green-500">Youtube Timestamp Bookmarker</h1>
      <h3>{currentVideoTitle}</h3>
      <h4>{currentVideoId}</h4>
      {currentVideoBookmarks?.length > 0 ? (
        currentVideoBookmarks.map((bookmark) => {
          <div>{bookmark}</div>;
        })
      ) : (
        <i>No Bookmarks to Show</i>
      )}
    </>
  );
};

export default Popup;
