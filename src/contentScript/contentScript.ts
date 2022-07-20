import { getTime, css } from '../utils';
import { VideoBookmark } from '../chrome-api/types';

const bookmarkBtnStyle = {
  height: '100%',
  width: 'auto',
};

(() => {
  let youtubeLeftControls: Element, youtubePlayer: HTMLVideoElement;
  let currentVideoId = '';
  let currentVideoTitle = '';
  let currentVideoUrl = '';
  let currentVideoBookmarks: VideoBookmark[] | [] = [];

  const fetchBookmarks: () => Promise<VideoBookmark[]> = () => {
    return new Promise((resolve) => {
      chrome.storage.sync.get('yt-tstamp-bkmarker', (obj) => {
        resolve(
          obj['yt-tstamp-bkmarker'] ? JSON.parse(obj['yt-tstamp-bkmarker']) : []
        );
        // chrome.storage.sync.get([currentVideoId], (obj) => {
        // resolve(obj[currentVideoId] ? JSON.parse(obj[currentVideoId]) : []);
      });
    });
  };

  const newVideoLoaded = async () => {
    const bookmarkBtnExists =
      document.getElementsByClassName('bookmark-btn')[0];
    currentVideoBookmarks = await fetchBookmarks();
    console.log({ currentVideoBookmarks });

    if (!bookmarkBtnExists) {
      const bookmarkBtn = document.createElement('img');

      bookmarkBtn.src = chrome.runtime.getURL(
        'assets/icon-add-bookmark-96.png'
      );
      bookmarkBtn.className = 'ytp-button ' + 'bookmark-btn';
      bookmarkBtn.title = 'Click to save current timestamp';
      css(bookmarkBtn, bookmarkBtnStyle);

      youtubeLeftControls =
        document.getElementsByClassName('ytp-left-controls')[0];
      youtubePlayer = document.getElementsByClassName(
        'video-stream'
      )[0] as HTMLVideoElement;

      youtubeLeftControls.append(bookmarkBtn);
      bookmarkBtn.addEventListener('click', addNewBookmarkEventHandler);
    }
  };

  const clearStorage = () => {
    chrome.storage.sync.clear(() => console.log('clear storage'));
  };

  const addNewBookmarkEventHandler = async () => {
    const currentTime = youtubePlayer.currentTime;
    const currentVideoBookmarks = await fetchBookmarks();

    const isCurrentVideoExists =
      currentVideoBookmarks.filter((bookmark) => bookmark.id == currentVideoId)
        .length > 0;
    console.log({ isCurrentVideoExists });

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
        title: currentVideoTitle,
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
    console.log({ newVideoBookmarks });

    chrome.storage.sync.set({
      'yt-tstamp-bkmarker': JSON.stringify(
        newVideoBookmarks.sort((a, b) => +a.createdAt - +b.createdAt)
      ),
    });
  };

  chrome.runtime.onMessage.addListener((obj, sender, response) => {
    const { type, value, videoId, videoTitle, videoUrl } = obj;

    // clearStorage();
    chrome.storage.sync.get(null, function (all) {
      console.log(all);
    });

    if (type === 'NEW') {
      currentVideoId = videoId;
      currentVideoTitle = videoTitle;
      currentVideoUrl = videoUrl;
      console.log(currentVideoId);

      newVideoLoaded();
    } else if (type === 'PLAY') {
      youtubePlayer.currentTime = value;
    } else if (type === 'DELETE') {
      currentVideoBookmarks = currentVideoBookmarks.filter(
        (b) => b.time != value
      );
      chrome.storage.sync.set({
        [currentVideoId]: JSON.stringify(currentVideoBookmarks),
      });

      response(currentVideoBookmarks);
    }
  });

  newVideoLoaded();
})();
