import { VideoBookmark } from '../../chrome-api/types';

export const clearAllStorage = () => {
  chrome.storage.sync.clear(() => console.log('clear all storage'));
};

export const showAllStorage = () => {
  chrome.storage.sync.get(null, (all) => console.log(all));
};

export const storeVideoBookmarks = (key: string, bookmarks: VideoBookmark[]) =>
  chrome.storage.sync.set({
    [key]: JSON.stringify(bookmarks),
  });

export const fetchBookmarks: (key: string) => Promise<VideoBookmark[]> = (
  key
) => {
  return new Promise((resolve) => {
    chrome.storage.sync.get([key], (obj) => {
      resolve(obj[key] ? (JSON.parse(obj[key]) as VideoBookmark[]) : []);
    });
  });
};

export const deleteTimestampHandler = (
  t: number,
  videoId: string,
  videoBookmarks: VideoBookmark[]
) => {
  const newVideoBookmarks = videoBookmarks.map((bookmark) => {
    if (bookmark.id === videoId) {
      const newTimestamp = bookmark.timestamp.filter(({ time }) => time !== t);
      return { ...bookmark, timestamp: newTimestamp };
    }
    return bookmark;
  });

  console.log(`delete timestamp ${t} from video: ${videoId}`);
  return newVideoBookmarks;
};

export const deleteVideoHandler = (
  videoId: string,
  videoBookmarks: VideoBookmark[]
) => {
  const newVideoBookmarks = videoBookmarks.filter(({ id }) => id !== videoId);
  console.log('delete video', videoId);
  return newVideoBookmarks;
};
