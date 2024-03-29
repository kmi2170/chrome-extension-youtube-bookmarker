chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  let obj = {};
  if (
    changeInfo.status === 'complete' &&
    tab.url &&
    tab.url.includes('youtube.com/watch')
  ) {
    const queryParameters = tab.url.split('?')[1];
    const urlParameters = new URLSearchParams(queryParameters);
    const videoId = urlParameters.get('v');
    const videoTitle = tab.title;
    const videoUrl = tab.url;

    obj = {
      type: 'NEW',
      videoId,
      videoTitle,
      videoUrl,
    };

    // chrome.tabs.sendMessage(tabId, obj);
    chrome.tabs.sendMessage(tabId, obj, () =>
      console.log('send Message', tabId, obj)
    );
  }
});
