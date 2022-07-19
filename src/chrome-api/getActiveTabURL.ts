export const getActiveTabURL = async () => {
  const [tabs] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
    // lastFocusedWindow: true,
  });

  return tabs;
};
