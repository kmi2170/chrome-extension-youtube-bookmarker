import { getTime, removeCharsFromString } from '../utils';
import { VideoBookmark } from '../chrome-api/types';
import {
  storeVideoBookmarks,
  fetchBookmarks,
  deleteVideoHandler,
  deleteTimestampHandler,
  // showAllStorage,
  // clearAllStorage,
} from './contentScript-utils';

(() => {
  const key_ytbookmark = 'yt-bookmarks';

  let youtubeLeftControls: Element, youtubePlayer: HTMLVideoElement;
  let currentVideoId = '';
  let currentVideoTitle = '';
  let currentVideoUrl = '';
  let currentVideoBookmarks: VideoBookmark[] | [] = [];

  const addNewBookmarkEventHandler = () => {
    fetchBookmarks(key_ytbookmark)
      .then((data) => (currentVideoBookmarks = data))
      .catch((error) => console.error(error));

    const currentTime = Math.round(youtubePlayer.currentTime);
    const isCurrentVideoExists =
      currentVideoBookmarks.filter((bookmark) => bookmark.id == currentVideoId)
        .length > 0;

    let newVideoBookmarks = [];
    if (isCurrentVideoExists) {
      newVideoBookmarks = currentVideoBookmarks.map((bookmark) => {
        if (bookmark.id === currentVideoId) {
          const isTimestampExists =
            bookmark.timestamp.filter(({ time }) => time == currentTime)
              .length > 0;
          if (isTimestampExists) return bookmark;

          const newTimestamp = [
            ...bookmark.timestamp,
            {
              time: currentTime,
              desc: 'Bookmark at ' + getTime(currentTime),
            },
          ];

          return {
            ...bookmark,
            timestamp: newTimestamp.sort((a, b) => a.time - b.time),
          };
        }

        return bookmark;
      });
    } else {
      const newBookmark: VideoBookmark = {
        id: currentVideoId,
        title: removeCharsFromString(currentVideoTitle, '- YouTube'),
        url: currentVideoUrl,
        createdAt: new Date().toISOString(),
        timestamp: [
          {
            time: currentTime,
            desc: 'Bookmark at ' + getTime(currentTime),
          },
        ],
      };

      newVideoBookmarks = [...currentVideoBookmarks, newBookmark];
    }

    storeVideoBookmarks(
      key_ytbookmark,
      newVideoBookmarks.sort((a, b) => +a.createdAt - +b.createdAt)
    ).catch((error) => console.error(error));
  };

  const newVideoLoaded = async () => {
    try {
      currentVideoBookmarks = await fetchBookmarks(key_ytbookmark);
    } catch (error) {
      console.error(error);
    }
    console.log('fetch curretVideoBookmarks', currentVideoBookmarks);

    const bookmarkBtnExists =
      document.getElementsByClassName('bookmark-btn')[0];
    if (!bookmarkBtnExists) {
      const bookmarkBtn = document.createElement('img');
      bookmarkBtn.title = 'Click to save current timestamp';
      bookmarkBtn.className = 'ytp-button ' + 'bookmark-btn';
      bookmarkBtn.src = chrome.runtime.getURL(
        'assets/icon-add-bookmark-96.png'
      );
      bookmarkBtn.style.height = '100%';
      bookmarkBtn.style.width = 'auto';

      youtubePlayer = document.getElementsByClassName(
        'video-stream'
      )[0] as HTMLVideoElement;
      youtubeLeftControls =
        document.getElementsByClassName('ytp-left-controls')[0];

      youtubeLeftControls.append(bookmarkBtn);
      bookmarkBtn.addEventListener('click', addNewBookmarkEventHandler);
    }
  };

  type MessageObj = {
    type: string;
    value: string | number;
    videoId: string;
    videoTitle: string;
    videoUrl: string;
  };

  chrome.runtime.onMessage.addListener((obj, sender, response) => {
    const { type, value, videoId, videoTitle, videoUrl } = obj as MessageObj;

    // clearAllStorage();
    // showAllStorage();

    if (type === 'NEW') {
      currentVideoId = videoId;
      currentVideoTitle = videoTitle;
      currentVideoUrl = videoUrl;
    } else if (type === 'PLAY') {
      youtubePlayer.currentTime = value as number;
    } else if (type === 'DELETE_TIMESTAMP') {
      currentVideoBookmarks = deleteTimestampHandler(
        value as number,
        currentVideoId,
        currentVideoBookmarks
      );
      storeVideoBookmarks(key_ytbookmark, currentVideoBookmarks).catch(
        (error) => console.error(error)
      );
      response(currentVideoBookmarks);
    } else if (type === 'DELETE_VIDEO') {
      currentVideoBookmarks = deleteVideoHandler(
        value as string,
        currentVideoBookmarks
      );
      // storeVideoBookmarks(key_ytbookmark, currentVideoBookmarks);
      storeVideoBookmarks(key_ytbookmark, currentVideoBookmarks).catch(
        (error) => console.error(error)
      );
      response(currentVideoBookmarks);
    }
  });

  newVideoLoaded().catch((error) => console.error(error));
})();
