import { useEffect, useState } from 'react';

import { getActiveTabURL } from './getActiveTabURL';
import { Bookmark } from './types';

const useChromeApi = () => {
  const [activeTabId, setActiveTabId] = useState<number | null>(null);
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);
  const [currentVideoTitle, setCurrentVideoTitle] = useState('');
  const [currentVideoBookmarks, setCurrentVideoBookmarks] = useState<
    Bookmark[]
  >([]);
  const [isYoutubePage, setIsYoutubePage] = useState(false);
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

  useEffect(() => {
    getCurrentVideoInfo();
  }, []);

  return {
    activeTabId,
    currentVideoId,
    currentVideoTitle,
    currentVideoBookmarks,
    isYoutubePage,
    setCurrentVideoBookmarks,
  };
};

export default useChromeApi;
