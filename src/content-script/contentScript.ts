import { getTime, removeCharsFromString } from '../utils';
import { VideoBookmark } from '../chrome-api/types';
import {
  storeVideoBookmarks,
  fetchBookmarks,
} from '../chrome-api/storage/bookmarks';
import { key_ytbookmark } from '../assets';

(() => {
  let youtubeLeftControls: Element;
  let youtubePlayer: HTMLVideoElement;
  let currentVideoId = '';
  let currentVideoTitle = '';
  let currentVideoUrl = '';
  let bookmarkBtn: HTMLImageElement;

  const addNewBookmarkEventHandler = () => {
    // use IIFE to avoid @typescript-eslint/no-misused-promises rule
    (async () => {
      bookmarkBtn.style.scale = '80%';
      setTimeout(() => {
        bookmarkBtn.style.scale = '100%';
      }, 200);

      const currentVideoBookmarks: VideoBookmark[] = await fetchBookmarks(
        key_ytbookmark
      );

      const currentTime = Math.round(youtubePlayer.currentTime);
      const isCurrentVideoExists =
        currentVideoBookmarks.filter(
          (bookmark) => bookmark.id === currentVideoId
        ).length > 0;

      let newVideoBookmarks: VideoBookmark[] = [];
      if (isCurrentVideoExists) {
        newVideoBookmarks = currentVideoBookmarks.map((bookmark) => {
          if (bookmark.id === currentVideoId) {
            const isTimestampExists =
              bookmark.timestamps.filter(({ time }) => time === currentTime)
                .length > 0;
            if (isTimestampExists) return bookmark;

            const newTimestamps = [
              ...bookmark.timestamps,
              {
                time: currentTime,
                desc: 'Bookmark at ' + getTime(currentTime),
              },
            ];

            return {
              ...bookmark,
              timestamps: newTimestamps.sort((a, b) => a.time - b.time),
            };
          }

          return bookmark;
        });
      } else {
        const newVideoBookmark: VideoBookmark = {
          id: currentVideoId,
          title: removeCharsFromString(currentVideoTitle, '- YouTube'),
          url: currentVideoUrl,
          createdAt: new Date().toISOString(),
          timestamps: [
            {
              time: currentTime,
              desc: 'Bookmark at ' + getTime(currentTime),
            },
          ],
        };

        newVideoBookmarks = [...currentVideoBookmarks, newVideoBookmark];
      }

      await storeVideoBookmarks(
        key_ytbookmark,
        newVideoBookmarks.sort((a, b) => +a.createdAt - +b.createdAt)
      );
    })().catch((error) => console.error(error));
  };

  const newVideoLoaded = () => {
    const bookmarkBtnExists =
      document.getElementsByClassName('bookmark-btn')[0];

    if (!bookmarkBtnExists) {
      bookmarkBtn = document.createElement('img');
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

  chrome.runtime.onMessage.addListener((obj) => {
    // chrome.runtime.onMessage.addListener((obj, sender, response) => {
    const { type, value, videoId, videoTitle, videoUrl } = obj as MessageObj;

    if (type === 'NEW') {
      currentVideoId = videoId;
      currentVideoTitle = videoTitle;
      currentVideoUrl = videoUrl;

      newVideoLoaded();
    } else if (type === 'PLAY') {
      youtubePlayer.currentTime = value as number;
    }
  });
})();
