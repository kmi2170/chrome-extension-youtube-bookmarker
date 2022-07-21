import { useEffect, useState } from 'react';

import { getActiveTabURL } from './getActiveTabURL';
import { VideoBookmark } from './types';

const useChromeApi = () => {
  const key_ytbookmark = 'yt-bookmarks';
  const [activeTabId, setActiveTabId] = useState<number | null>(null);
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);
  const [currentVideoTitle, setCurrentVideoTitle] = useState('');
  const [currentVideoUrl, setCurrentVideoUrl] = useState('');

  const [currentVideoBookmarks, setCurrentVideoBookmarks] = useState<
    VideoBookmark[]
  >([]);

  const [isYoutubePage, setIsYoutubePage] = useState(false);
  const [isYoutubeWatchPage, setIsYoutubeWatchPage] = useState(false);

  const getCurrentVideoInfo = async () => {
    const activeTab = await getActiveTabURL();

    if (!activeTab.url?.includes('youtube.com')) {
      setIsYoutubePage(false);
      return;
    }
    setIsYoutubePage(true);

    chrome.storage.sync.get([key_ytbookmark], (data) => {
      const videoBookmarks = data[key_ytbookmark]
        ? JSON.parse(data[key_ytbookmark])
        : [];

      setCurrentVideoBookmarks(videoBookmarks);
    });

    if (activeTab.url?.includes('youtube.com/watch')) {
      const queryParameters = activeTab.url?.split('?')[1];
      const urlParameters = new URLSearchParams(queryParameters);
      const videoId = urlParameters.get('v');

      setIsYoutubeWatchPage(true);
      setCurrentVideoId(videoId);
      setActiveTabId(activeTab.id as number);
      setCurrentVideoTitle(activeTab.title as string);
      setCurrentVideoUrl(activeTab.url as string);
      return;
    }

    setIsYoutubeWatchPage(false);
  };

  useEffect(() => {
    getCurrentVideoInfo();
  }, []);

  return {
    activeTabId,
    currentVideoId,
    currentVideoTitle,
    currentVideoUrl,
    currentVideoBookmarks,
    isYoutubePage,
    isYoutubeWatchPage,
    setCurrentVideoBookmarks,
  };
};

export default useChromeApi;
