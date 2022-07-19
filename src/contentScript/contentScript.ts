const { getTime, css } = require('../utils');

type VideoBookmark = {
  time: number;
  desc: string;
};

const bookmarkBtnStyle = {
  height: '100%',
  width: 'auto',
};

(() => {
  let youtubeLeftControls: Element, youtubePlayer: HTMLVideoElement;
  let currentVideoId = '';
  let currentVideoTitle = '';
  let currentVideoBookmarks: VideoBookmark[] | [] = [];

  const fetchBookmarks: () => Promise<VideoBookmark[]> = () => {
    return new Promise((resolve) => {
      chrome.storage.sync.get([currentVideoId], (obj) => {
        resolve(obj[currentVideoId] ? JSON.parse(obj[currentVideoId]) : []);
      });
    });
  };

  const newVideoLoaded = async () => {
    const bookmarkBtnExists =
      document.getElementsByClassName('bookmark-btn')[0];
    currentVideoBookmarks = await fetchBookmarks();

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
    const newBookmark = {
      title: currentVideoTitle,
      time: currentTime,
      desc: 'Bookmark at ' + getTime(currentTime),
    };
    console.log({ newBookmark });
    const currentVideoBookmarks = await fetchBookmarks();
    chrome.storage.sync.set({
      [currentVideoId]: JSON.stringify(
        [...currentVideoBookmarks, newBookmark].sort((a, b) => a.time - b.time)
      ),
    });
  };

  chrome.runtime.onMessage.addListener((obj, sender, response) => {
    const { type, value, videoId, videoTitle } = obj;

    // clearStorage();
    if (type === 'NEW') {
      currentVideoId = videoId;
      currentVideoTitle = videoTitle;
      // console.log('videoId', videoId, 'vidoeTitle', videoTitle);
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
