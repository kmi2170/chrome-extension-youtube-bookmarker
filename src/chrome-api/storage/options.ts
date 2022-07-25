export const fetchOptions = (key: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get([key], (obj) => {
      chrome.runtime.lastError
        ? reject(Error(chrome.runtime.lastError.message))
        : resolve(
            obj[key] ? (obj[key] as { isAllPages: boolean }).isAllPages : false
          );
    });
  });
};

export const storeOptoins = (key: string, value: boolean): Promise<string> => {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.set({ [key]: { isAllPages: value } }, () => {
      chrome.runtime.lastError
        ? reject(Error(chrome.runtime.lastError.message))
        : resolve('options are saved');
    });
  });
};
