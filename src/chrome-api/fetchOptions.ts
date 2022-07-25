export const fetchOptions = (key: string): Promise<boolean> => {
  return new Promise((resolve) => {
    chrome.storage.sync.get([key], (obj) => {
      resolve(
        obj[key] ? (obj[key] as { isAllPages: boolean }).isAllPages : false
      );
    });
  });
};
