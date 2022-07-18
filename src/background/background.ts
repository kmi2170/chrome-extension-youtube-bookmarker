chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (
    changeInfo.status === 'complete' &&
    tab.url &&
    tab.url.includes('youtube.com/watch')
  ) {
    const queryParameters = tab.url.split('?')[1];
    const urlParameters = new URLSearchParams(queryParameters);
    const obj = {
      type: 'NEW',
      videoId: urlParameters.get('v'),
    };

    chrome.tabs.sendMessage(tabId, obj, () => console.log('send Message', obj));
  }
});
