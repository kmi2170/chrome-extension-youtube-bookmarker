const { getTime, css } = require('../utils');

type VideoBookmark = {
  time: number;
  desc: string;
};

const bookmarkBtnStyle = {
  width: 'auto',
  height: '100%',
};

(() => {
  let youtubeLeftControls: Element, youtubePlayer: HTMLVideoElement;
  let currentVideo = '';
  let currentVideoBookmarks: VideoBookmark[] | [] = [];

  const fetchBookmarks: () => Promise<VideoBookmark[]> = () => {
    return new Promise((resolve) => {
      console.log({ currentVideo });
      if (currentVideo)
        chrome.storage.sync.get([currentVideo], (obj) => {
          console.log('fetchBookmarks');
          resolve(obj[currentVideo] ? JSON.parse(obj[currentVideo]) : []);
        });
    });
  };

  const newVideoLoaded = async () => {
    console.log('newVideoLoaded');
    const bookmarkBtnExists =
      document.getElementsByClassName('bookmark-btn')[0];
    const currentVideoBookmarks = await fetchBookmarks();
    console.log(currentVideoBookmarks);
    console.log(bookmarkBtnExists);

    if (!bookmarkBtnExists) {
      const bookmarkBtn = document.createElement('img');

      bookmarkBtn.src = chrome.runtime.getURL(
        'assets/icon-add-bookmark-144.png'
      );
      bookmarkBtn.className = 'ytp-button ' + 'bookmark-btn';
      bookmarkBtn.title = 'Click to bookmark current timestamp';

      console.log(youtubeLeftControls);
      youtubeLeftControls =
        document.getElementsByClassName('ytp-left-controls')[0];
      youtubePlayer = document.getElementsByClassName(
        'video-stream'
      )[0] as HTMLVideoElement;

      youtubeLeftControls.append(bookmarkBtn);
      console.log(youtubeLeftControls);
      bookmarkBtn.addEventListener('click', addNewBookmarkEventHandler);
    }
  };

  const addNewBookmarkEventHandler = async () => {
    const currentTime = youtubePlayer.currentTime;
    const newBookmark = {
      time: currentTime,
      desc: 'Bookmark at ' + getTime(currentTime),
    };
    console.log(newBookmark);
    const currentVideoBookmarks = await fetchBookmarks();
    chrome.storage.sync.set({
      [currentVideo]: JSON.stringify(
        [...currentVideoBookmarks, newBookmark].sort((a, b) => a.time - b.time)
      ),
    });
  };

  chrome.runtime.onMessage.addListener((obj, sender, response) => {
    const { type, value, videoId } = obj;

    if (type === 'NEW') {
      currentVideo = videoId;
      console.log('videoId', videoId);
      newVideoLoaded();
    } else if (type === 'PLAY') {
      youtubePlayer.currentTime = value;
    } else if (type === 'DELETE') {
      console.log(currentVideoBookmarks);
      currentVideoBookmarks = currentVideoBookmarks.filter(
        (b) => b.time != value
      );
      console.log(currentVideoBookmarks);
      chrome.storage.sync.set({
        [currentVideo]: JSON.stringify(currentVideoBookmarks),
      });

      response(currentVideoBookmarks);
    }
  });

  newVideoLoaded();
})();
