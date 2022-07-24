export const sendMessage = (
  tabId: number,
  type: string,
  value: string | number
) => {
  chrome.tabs.sendMessage(tabId, { type, value });
};
