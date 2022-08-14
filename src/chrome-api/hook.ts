import { useEffect, useState } from 'react';

import { removeCharsFromString } from '../utils';
import { getActiveTabURL } from './getActiveTabURL';
import { fetchBookmarks } from './storage/bookmarks';
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
    setActiveTabId(activeTab.id as number);

    if (activeTab.url?.includes('youtube.com')) {
      setIsYoutubePage(true);
    } else {
      setIsYoutubePage(false);
    }

    fetchBookmarks(key_ytbookmark)
      .then((data) => setCurrentVideoBookmarks(data))
      .catch((error) => console.error(error));

    if (activeTab.url?.includes('youtube.com/watch')) {
      const queryParameters = activeTab.url?.split('?')[1];
      const urlParameters = new URLSearchParams(queryParameters);
      const videoId = urlParameters.get('v');

      setIsYoutubeWatchPage(true);
      setCurrentVideoId(videoId);
      setCurrentVideoTitle(
        removeCharsFromString(activeTab.title as string, '- YouTube')
      );
      setCurrentVideoUrl(activeTab.url);
      return;
    }

    setIsYoutubeWatchPage(false);
  };

  useEffect(() => {
    getCurrentVideoInfo().catch((error) => console.error(error));
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
