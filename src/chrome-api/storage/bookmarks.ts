import { VideoBookmark } from '../../chrome-api/types';

export const clearStorage = () => {
  chrome.storage.sync.clear(() => console.log('clear all storage'));
};

export const removeItem = (key: string) => {
  chrome.storage.sync.remove([key], () => console.log('remove', key));
};

export const showStorage = () => {
  chrome.storage.sync.get(null, (all) => console.log(all));
};

export const storeVideoBookmarks: (
  key: string,
  bookmarks: VideoBookmark[]
) => Promise<void> = (key, bookmarks) => {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.set({ [key]: JSON.stringify(bookmarks) }, () => {
      chrome.runtime.lastError
        ? reject(Error(chrome.runtime.lastError.message))
        : resolve();
    });
  });
};

export const fetchBookmarks: (key: string) => Promise<VideoBookmark[]> = (
  key
) => {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get([key], (obj) => {
      chrome.runtime.lastError
        ? reject(Error(chrome.runtime.lastError.message))
        : resolve(
            obj[key] ? (JSON.parse(obj[key] as string) as VideoBookmark[]) : []
          );
    });
  });
};
